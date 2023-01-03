import { noop } from '../shared/utils'
import { setChildren, diffAttrs, diffEvents, Attrs, Events, INode, text, element } from './manipulation'
import type { Render, Component, Accessor, MiddlewareContext, Block } from '../shared/types'

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
        directive(blocks) {
            class BlockInstance<Context> {
                public render = render(
                    this.template(() => this.context),
                    [...ids, this.id],
                    requestUpdate,
                )
                constructor(
                    public id: string,
                    public template: (context: Accessor<Context>) => Render,
                    public context: Context,
                ) {}
            }
            const id = (b: Block) => b(id => id)
            let currentBlocks: BlockInstance<any>[] = []
            return {
                render() {
                    let newBlocks = blocks(), discard: BlockInstance<any>[] = [], completed: BlockInstance<any>[] = []
                    for (const block of currentBlocks) {
                        if (newBlocks.length == 0) {
                            discard = [...discard, ...currentBlocks]
                            break
                        } else if (id(newBlocks[0]) != block.id) {
                            discard = [...discard, block]
                        } else {
                            block.context = newBlocks[0]((_, __, ctx) => ctx)
                            completed = [...completed, block]
                            newBlocks = newBlocks.slice(1)
                        }
                    }
                    for (const block of newBlocks) {
                        if (discard.some(discarded => discarded.id == id(block))) {
                            const idx = discard.findIndex(discarded => discarded.id == id(block))
                            completed = [...completed, discard[idx]]
                            discard = discard.filter((_, i) => i != idx)
                        } else {
                            const i = block<BlockInstance<any>>((id, template, context) => new BlockInstance(id, template, context))
                            completed = [...completed, i]
                        }
                    }
                    discard.forEach(d => d.render.unmount())
                    currentBlocks = completed
                    return currentBlocks.reduce((children, c) => [...children, ...c.render.render()], [] as INode[])
                },
                unmount() {
                    currentBlocks.forEach(r => r.render.unmount())
                },
            }
        }
    })
}
