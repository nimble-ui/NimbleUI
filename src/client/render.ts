import { text, elementOpenStart, elementOpenEnd, elementClose, attr } from 'incremental-dom'
import { noop } from '../shared/utils'
import type { Render, Attrs, Component, Accessor, MiddlewareContext } from '../shared/types'

type Renderer = {
    render(): void,
    unmount(): void,
}

export function render(
    template: Render,
    ids: string[],
    requestUpdate: () => void,
): Renderer {
    return template({
        text(t) {
            return {
                render() {
                    text(t)
                },
                unmount: noop,
            }
        },
        dynamic(t) {
            return {
                render() {
                    const v = t()
                    if (v || v == 0) text(`${v}`)
                },
                unmount: noop,
            }
        },
        element(el, attrs, children) {
            const key = ids.join('_'), childRenderers = children.map((c, i) => render(c, [`${i}`], requestUpdate))
            return {
                render() {
                    const a = attrs.reduce((a, b) => ({...a, ...b()}), {} as Attrs)
                    elementOpenStart(el, key)
                    for (const name of Object.keys(a)) {
                        attr(name, a[name])
                    }
                    elementOpenEnd()
                    for (const c of childRenderers) {
                        c.render()
                    }
                    elementClose(el)
                },
                unmount() {
                    for (const c of childRenderers) {
                        c.unmount()
                    }
                },
            }
        },
        component<Props extends Attrs>(
            comp: Component<Props>,
            props: Accessor<Partial<Props>>[]
        ) {
            const updateSubs: (() => void)[] = [], mountedSubs: (() => (() => void) | void)[] = []
            function mounted() {
                const unmountedSubs = mountedSubs.map(m => m() || (() => {}))
                return () => unmountedSubs.forEach(u => u())
            }
            function updated() {
                updateSubs.forEach(u => u())
            }
            let currentProps = props.reduce((a, b) => ({...a, ...b()}), {} as Props), update = () => {}
            const ctx: MiddlewareContext<Props> = {
                props: () => currentProps,
                refresh: () => update(),
                on: {
                    mounted(cb) {
                        mountedSubs.push(cb)
                    },
                    update(cb) {
                        updateSubs.push(cb)
                    },
                },
                use: m => m(ctx),
            }
            const instance = comp(ctx.use)
            const rendered = render(instance, ids, requestUpdate), unmount = mounted()
            update = requestUpdate
            return {
                render() {
                    currentProps = props.reduce((a, b) => ({...a, ...b()}), {} as Props)
                    rendered.render()
                    updated()
                },
                unmount() {
                    unmount()
                    update = () => {}
                    rendered.unmount()
                },
            }
        },
        fragment(children) {
            const childRenderers = children.map((c, i) => render(c, [...ids, `${i}`], requestUpdate))
            return {
                render() {
                    for (const c of childRenderers) {
                        c.render()
                    }
                },
                unmount() {
                    for (const c of childRenderers) {
                        c.unmount()
                    }
                },
            }
        },
        when(cond, then, alt) {
            const getCond = () => cond() ? true : false,
            renderThen = () => render(then, [...ids, 'then'], requestUpdate),
            renderAlt = () => render(alt, [...ids, 'else'], requestUpdate)
            let currentCond = getCond(), currentRenderer = currentCond ? renderThen() : renderAlt()
            return {
                render() {
                    const newCond = getCond()
                    if (currentCond != newCond) {
                        currentRenderer.unmount()
                        currentCond = newCond
                        currentRenderer = currentCond ? renderThen() : renderAlt()
                    }
                },
                unmount() {
                    currentRenderer.unmount()
                },
            }
        },
        each<TItem>(
            items: Accessor<TItem[]>,
            trackBy: Accessor<(item: TItem, index: number, array: TItem[]) => any>,
            renderItems: (item: Accessor<TItem>, index: Accessor<number>, array: Accessor<TItem[]>) => Render
        ) {
            const getItems = () => {
                const tb = trackBy(), i = items()
                return i.map((item, index) => ({
                    item,
                    id: `${tb(item, index, i)}`,
                }))
            }
            class Item {
                public render = render(
                    renderItems(() => this.item, () => this.index, items),
                    [...ids, `item:${this.id}`],
                    requestUpdate
                )
                constructor(
                    public item: TItem,
                    public index: number,
                    public id: string
                ) {}
            }
            let currentItems: Item[] = []
            return {
                render() {
                    let newItems = getItems(), discard: Item[] = [], completed: Item[] = []
                    for (const item of currentItems) {
                        if (newItems.length == 0) {
                            discard = [...discard, ...currentItems]
                            break
                        } else if (newItems[0].id != item.id) {
                            discard = [...discard, item]
                        } else {
                            item.item = newItems[0].item
                            completed = [...completed, item]
                            newItems = newItems.slice(1)
                        }
                    }
                    for (const item of newItems) {
                        if (discard.some(discarded => discarded == item)) {
                            const idx = discard.findIndex(discarded => discarded.id == item.id)
                            completed = [...completed, discard[idx]]
                            discard = discard.filter((_, i) => i != idx)
                        } else {
                            const i = new Item(item.item, completed.length - 1, item.id)
                            completed = [...completed, i]
                        }
                    }
                    discard.forEach(d => d.render.unmount())
                    currentItems = completed
                    currentItems.forEach((item, i) => {
                        item.index = i
                        item.render.render()
                    })
                },
                unmount() {
                    currentItems.forEach(r => r.render.unmount())
                },
            }
        }
    })
}
