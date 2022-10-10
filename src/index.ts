import type { AttrObject, Renderer, Attrs, AttrMap, Component, EventMap } from './types'

import { text, mount, unmount, html } from 'redom'

function noop() {}

export function t(str: string): Renderer {
    return root => {
        const txt = text(str)
        mount(root, txt)
        return {
            unmount() {
                unmount(root, txt)
            },
            update: noop,
        }
    }
}

export function _(sel: () => any): Renderer {
    return root => {
        let prev = `${sel()}`
        const txt = text(prev)
        mount(root, txt)
        return {
            unmount() {
                unmount(root, txt)
            },
            update() {
                const current = `${sel()}`
                if (current != prev) txt.textContent = prev = current
            },
        }
    }
}

export function e(el: string, attrs: Attrs<AttrObject>, ...children: Renderer[]): Renderer {
    function updateAttrs(el:Element, current:AttrMap, $new:AttrMap) {
        for (const k of current.keys()) {
            if ($new.has(k)) {
                const v = $new.get(k)!
                if (current.get(k) != v) {
                    el.setAttribute(k, v)
                    current.set(k, v)
                }
            } else {
                el.removeAttribute(k)
                current.delete(k)
            }
        }
        for (const k of $new.keys()) {
            if (!current.has(k)) {
                const v = $new.get(k)!
                el.setAttribute(k, v)
                current.set(k, v)
            }
        }
    }
    function updateEvents(el: Element, current: EventMap, $new: EventMap) {
        for (const k of current.keys()) {
            if ($new.has(k)) {
                const v = $new.get(k)!
                if (current.get(k) != v) {
                    el.removeEventListener(k, current.get(k)!)
                    el.addEventListener(k, v)
                    current.set(k, v)
                }
            } else {
                el.removeEventListener(k, current.get(k)!)
                current.delete(k)
            }
        }
        for (const k of $new.keys()) {
            if (!current.has(k)) {
                const v = $new.get(k)!
                el.addEventListener(k, v)
                current.set(k, v)
            }
        }
    }
    function updateProps(el:Element, currentAttrs: AttrMap, currentEvents: EventMap) {
        const a = attrs()
        const newAttrs: AttrMap = new Map()
        const newEvents: EventMap = new Map()
        for (const k of Object.keys(a)) if (a[k] == 0 ? true : a[k]) {
            const v = a[k]
            if (k.startsWith('on') && (typeof v) == 'function') {
                newEvents.set(k.slice(2), v)
            } else {
                newAttrs.set(k, `${v == true ? k : v}`)
            }
        }
        updateAttrs(el, currentAttrs, newAttrs)
        updateEvents(el, currentEvents, newEvents)
    }
    return (root) => {
        const e = html(el)
        const currentAttrs: AttrMap = new Map()
        const currentEvents: EventMap = new Map()
        updateProps(e, currentAttrs, currentEvents)
        const childNodes = children.map(c => c(e))
        mount(root, e)
        return {
            update() {
                updateProps(e, currentAttrs, currentEvents)
                childNodes.forEach(c => c.update())
            },
            unmount() {
                unmount(root, e)
                childNodes.forEach(c => c.unmount())
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
    return (root) => {
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
        let rendered = instance.template(root), unmount = mounted()
        update = () => rendered.update()
        return {
            unmount() {
                unmount()
                rendered.unmount()
            },
            update() {
                update()
                updated()
            },
        }
    }
}

export * from './types'