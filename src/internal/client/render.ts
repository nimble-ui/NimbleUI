import { noop } from '../shared/utils'
import { setChildren, diffAttrs, diffEvents, Attrs, Events, INode, text, element } from './manipulation'
import type { Render, Component, Accessor, MiddlewareContext } from '../shared/types'

type Renderer = {
    render(): INode[],
    unmount(): void,
}

export function render(
    template: Render,
    ids: string[],
    requestUpdate: () => void,
): Renderer {
    return template({
        text(t) {
            const txt = document.createTextNode(t)
            return {
                render() {
                    return t ? [text(ids.join('_'), txt)]: []
                },
                unmount: noop,
            }
        },
        dynamic(t) {
            let content = `${t()}`
            const txt = document.createTextNode(`${t()}`), id = ids.join('_')
            return {
                render() {
                    const newContent = `${t()}`
                    if (newContent != content) {
                        content = txt.textContent = newContent
                    }
                    return content ? [text(id, txt)] : []
                },
                unmount: noop,
            }
        },
        element(name, attrs, children) {
            let currentAttrs: Attrs = {}, currentEvents: Events = {}, currentChildren: INode[] = []
            const el = document.createElement(name), id = ids.join('_'), childRenderers = children.map((c, i) => render(c, [`${i}`], requestUpdate))
            return {
                render() {
                    let a: Attrs = {}, e: Events = {}, newChildren = childRenderers.reduce((children, c) => {
                        return [...children, ...c.render()]
                    }, [] as INode[])
                    attrs.forEach(attr => attr({
                        attr(name, value) {
                            const v = value()
                            if (v == true) a = {...a, [name]: name}
                            else if (v) a = {...a, [name]: `${v}`}
                        },
                        on(name, listener) {
                            const l = listener()
                            if (l) e = {...e, [name]: l}
                        },
                    }))
                    diffAttrs(el, name, currentAttrs, a)
                    diffEvents(el, currentEvents, e)
                    setChildren(el, currentChildren, newChildren)
                    currentAttrs = a
                    currentEvents = e
                    currentChildren = newChildren
                    return [element(id, name, el)]
                },
                unmount() {
                    for (const c of childRenderers) {
                        c.unmount()
                    }
                },
            }
        },
        component<Props extends Record<string, any>>(
            comp: Component<Props>,
            props: Accessor<Props>
        ) {
            const updateSubs: (() => void)[] = [], mountedSubs: (() => (() => void) | void)[] = []
            function mounted() {
                const unmountedSubs = mountedSubs.map(m => m() || (() => {}))
                return () => unmountedSubs.forEach(u => u())
            }
            function updated() {
                updateSubs.forEach(u => u())
            }
            let currentProps = props(), update = () => {}
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
                    currentProps = props()
                    const content = rendered.render()
                    updated()
                    return content
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
                    return childRenderers.reduce((children, c) => {
                        return [...children, ...c.render()]
                    }, [] as INode[])
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
                    return currentRenderer.render()
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
                    return currentItems.reduce((children, c, i) => {
                        c.index = i
                        return [...children, ...c.render.render()]
                    }, [] as INode[])
                },
                unmount() {
                    currentItems.forEach(r => r.render.unmount())
                },
            }
        }
    })
}
