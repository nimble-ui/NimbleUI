import type { AttrObject, Renderer, Attrs, AttrMap, Component, EventMap } from './types'

import { text, mount as $mount, unmount, html, setChildren } from 'redom'

function noop() {}

export function t(str: string): Renderer {
    return () => {
        const txt = text(str)
        return {
            el: txt,
            unmount: noop,
            update: noop,
        }
    }
}

export function _(sel: () => any): Renderer {
    return () => {
        let prev = `${sel()}`
        const txt = text(prev)
        return {
            el: txt,
            unmount: noop,
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
    return () => {
        const childNodes = children.map(c => c())
        const e = html(el, ...childNodes.map(c => c.el))
        const currentAttrs: AttrMap = new Map()
        const currentEvents: EventMap = new Map()
        updateProps(e, currentAttrs, currentEvents)
        return {
            el: e,
            update() {
                updateProps(e, currentAttrs, currentEvents)
                childNodes.forEach(c => c.update())
            },
            unmount() {
                childNodes.forEach(c => c.unmount())
                setChildren(e, [])
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
    return () => {
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
        let rendered = instance.template(), unmount = mounted()
        update = () => rendered.update()
        return {
            el: rendered.el,
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

export function mount(renderer: Renderer, root: Node) {
    const rendered = renderer()
    $mount(root, rendered.el)
    return {
        update() {
            rendered.update()
        },
        unmount() {
            rendered.unmount()
            unmount(root, rendered.el)
        }
    }
}

export * from './types'