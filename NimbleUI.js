/**
 * @namespace UI
 */
const UI = (() => {
    /**
     * @memberof UI
     * @typedef {(root: Node)=>{update(): void, unmount(): void}} Renderer
     */
    function noop() {}
    /**
     * @param {string} str
     * @returns {Renderer}
     */
    function t(str) {
        return root => {
            const txt = document.createTextNode(str)
            root.appendChild(txt)
            return {
                unmount() {
                    root.removeChild(txt)
                },
                update: noop,
            }
        }
    }

    /**
     * @param {() => any} sel
     * @returns {Renderer}
     */
    function _(sel) {
        return (root) => {
            let prev = `${sel()}`
            const txt = document.createTextNode(prev)
            root.appendChild(txt)
            return {
                unmount() {
                    root.removeChild(txt)
                },
                update() {
                    const current = `${sel()}`
                    if (current != prev) txt.textContent = prev = current
                },
            }
        }
    }

    /**
     * @typedef {{[key:String]: any}} AttrObject
     */
    /**
     * @template {AttrObject} A
     * @typedef {() => A} Attrs
     */
    /**
     * @template {AttrObject} P
     * @typedef {(props: P, update: () => void) => {template: Renderer, mounted?: () => (() => void) | undefined}} Component
     */

    /**
     * @param {string} el
     * @param {Attrs<AttrObject>} attrs 
     * @param {...Renderer} children 
     * @returns {Renderer}
     */
    function e(el, attrs, ...children) {
        /**
         * @param {Element} el
         * @param {Map<string, string>} current
         * @param {Map<string, string>} $new
         */
        function updateAttrs(el, current, $new) {
            for (const k of current.keys()) {
                if ($new.has(k)) {
                    const v = $new.get(k)
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
                    const v = $new.get(k)
                    el.setAttribute(k, v)
                    current.set(k, v)
                }
            }
        }
        /**
         * @param {Element} el
         * @param {Map<string, (ev: any) => void>} current
         * @param {Map<string, (ev: any) => void>} $new
         */
        function updateEvents(el, current, $new) {
            for (const k of current.keys()) {
                if ($new.has(k)) {
                    const v = $new.get(k)
                    if (current.get(k) != v) {
                        el.removeEventListener(k, current.get(k))
                        el.addEventListener(k, v)
                        current.set(k, v)
                    }
                } else {
                    el.removeEventListener(k, current.get(k))
                    current.delete(k)
                }
            }
            for (const k of $new.keys()) {
                if (!current.has(k)) {
                    const v = $new.get(k)
                    el.addEventListener(k, v)
                    current.set(k, v)
                }
            }
        }
        /**
         * @param {Element} el
         * @param {Map<string, string>} currentAttrs
         * @param {Map<string, (ev: any) => void>} currentEvents
         */
        function updateProps(el, currentAttrs, currentEvents) {
            const a = attrs()
            /**
             * @type {Map<string, string>}
             */
            const newAttrs = new Map()
            /**
             * @type {Map<string, (ev: any) => void>}
             */
            const newEvents = new Map()
            for (const k of Object.keys(a)) if (a == 0 ? true : a) {
                const v = a[k]
                if (k.startsWith('on') && (typeof v) == 'function') {
                    newEvents.set(k.slice(2), v)
                } else {
                    newAttrs.set(k, v == true ? k : `${v}`)
                }
            }
            updateAttrs(el, currentAttrs, newAttrs)
            updateEvents(el, currentEvents, newEvents)
        }
        return (root) => {
            const e = document.createElement(el)
            /**
             * @type {Map<string, string>}
             */
            const currentAttrs = new Map()
             /**
             * @type {Map<string, (ev: any) => void>}
             */
            const currentEvents = new Map()
            updateProps(e, currentAttrs, currentEvents)
            const childNodes = children.map(c => c(e))
            root.appendChild(e)
            return {
                update() {
                    updateProps(e, currentAttrs, currentEvents)
                    childNodes.forEach(c => c.update())
                },
                unmount() {
                    root.removeChild(e)
                    childNodes.forEach(c => c.unmount())
                },
            }
        }
    }
    function safe_eq(x, y) {
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
    }
    /**
     * @template {AttrObject} Props
     * @param {Component<Props>} comp
     * @param {Attrs<Props>} attrs
     * @returns {Renderer}
     */
     function c(comp, attrs) {
        return (root) => {
            let update = () => {}, props = attrs()
            let instance = comp(props, () => update(),)
            function mounted() {
                const { mounted = () => () => {} } = instance
                const unmount = mounted()
                return unmount || (() => {})
            }
            let rendered = instance.template(root), unmount = mounted()
            update = () => rendered.update()
            return {
                unmount() {
                    unmount()
                    rendered.unmount()
                },
                update() {
                    const newProps = attrs()
                    if (!safe_eq(props, newProps)) {
                        props = newProps
                        unmount()
                        instance = comp(props, update)
                        rendered = comp.template(root)
                        unmount = mounted()
                    } else update()
                },
            }
        }
    }

    /**
     * @param {Renderer} renderer
     * @param {string} target
     * @returns a function to unmount from `target`
     */
    function mount(renderer, target) {
        const r = renderer(document.querySelector(target))
        return () => r.unmount()
    }

    return {
        e,
        c,
        _,
        t,
        mount,
        //genAttrs,
        //reactive,
    }
})()