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
    })
}