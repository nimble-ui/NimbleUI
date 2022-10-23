import type { AttrObject, Renderer, Attrs, AttrMap, Component, EventMap } from './types'
import { text, elementOpenStart, elementOpenEnd, elementClose, attr, patch } from 'incremental-dom'

function noop() {}

export function t(str: string): Renderer {
    return () => ({
        render() {
            text(str)
        },
        unmount: noop,
    })
}

export function _(sel: () => any): Renderer {
    return () => ({
        unmount: noop,
        render() {
            const v = sel()
            if (v || v == 0) text(`${v}`)
        },
    })
}

export function e(el: string, attrs: Attrs<AttrObject>, ...children: Renderer[]): Renderer {
    return (ids, requestUpdate) => {
        const key = ids.join('_'), childRenderers = children.map((c, i) => c([`${i}`], requestUpdate))
        return {
            render() {
                const a = attrs()
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
    }
}


/*function safe_eq(x: any, y: any) {
    if (x === y) return true
    if (
        (typeof x == 'object' && x != null) &&
        (typeof y == 'object' && y != null)
    ) {
        if (Object.keys(x).length != Object.keys(y).length) return false
        for (const prop in x) {
            if (Object.hasOwnProperty.call(x, prop) && Object.hasOwnProperty.call(y, prop)) {
                if (!safe_eq(x[prop], y[prop])) return false
            } else return false
        }
        return true
    }
    return false
}*/

export function c<Props extends AttrObject>(comp: Component<Props>, attrs: Attrs<Props>): Renderer {
    function props<T>(cb: (props: Props) => T) {
        return () => cb(attrs())
    }
    return (ids, requestUpdate) => {
        let update = () => {}
        let instance = comp({props, update: () => update()})
        function mounted() {
            const { mounted = () => () => {} } = instance
            return mounted() || (() => {})
        }
        function updated() {
            const { updated = () => {} } = instance
            updated()
        }
        let rendered = instance.template(ids, requestUpdate), unmount = mounted()
        update = () => requestUpdate()
        return {
            unmount() {
                unmount()
                rendered.unmount()
            },
            render() {
                rendered.render()
                updated()
            },
        }
    }
}

export function mount(renderer: Renderer, root: HTMLElement) {
    let render = () => {}
    const rendered = renderer([], () => render())
    render = () => {
        patch(root, () => rendered.render())
    }
    render()
    return {
        update() {
            render()
        },
        unmount() {
            render = () => {}
            rendered.unmount()
        },
    }
}

export * from './types'