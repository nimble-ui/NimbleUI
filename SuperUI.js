const UI = (() => {
    /**
     * @template {{}} T
     * @typedef {(root: Node, data: () => T)=>{update(): void, unmount(): void}} Renderer
     */
    function noop() {}
    /**
     * @param {string} str
     * @returns {Renderer<{}>}
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
     * @template {{}} T
     * @param {(data: T) => any} sel
     * @returns {Renderer<T>}
     */
    function _(sel) {
        return (root, data) => {
            let prev = `${sel(data())}`
            const txt = document.createTextNode(prev)
            root.appendChild(txt)
            return {
                unmount() {
                    root.removeChild(txt)
                },
                update() {
                    const current = `${sel(data())}`
                    if (current != prev) txt.textContent = prev = current
                },
            }
        }
    }

    /**
     * @typedef {{'this': (el: Node) => void, 'class': string[], style: {[key: string]: any}, [key: string]: any}} Attr_
     */
    /**
     * @template {{}} T
     * @typedef {(data: T) => Attr_} Attr
     */
    /**
     * @param {string[]} names
     */
    function genAttrs(names) {
        return names.map(name =>({
            /**
             * @param {any} value
             * @returns {Attr<{}>}
             */
            is(value) {
                return () => ({[name]: value})
            },
            /**
             * @template {{}} T
             * @param {(data: T) => any} sel
             * @returns {Attr<T>}
             */
            bind(sel = data => data[name]) {
                return data => ({[name]: sel(data)})
            }
        }))
    }

    /**
     * @template {{}} T
     * @param {string} el
     * @param {Attr<T>[]} attrs 
     * @param {...Renderer<T>} children 
     * @returns {Renderer<T>}
     */
    function $(el, attrs = [], ...children) {
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
         * @param {T} data
         * @param {Element} el
         * @param {Map<string, string>} currentAttrs
         * @param {Map<string, (ev: any) => void>} currentEvents
         */
        function updateProps(data, el, currentAttrs, currentEvents) {
            const a = attrs.reduce((a, attr) => ({...a, ...attr(data)}), {})
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
        return (root, data) => {
            const e = document.createElement(el)
            /**
             * @type {Map<string, string>}
             */
            const currentAttrs = new Map()
             /**
             * @type {Map<string, (ev: any) => void>}
             */
            const currentEvents = new Map()
            updateProps(data(), e, currentAttrs, currentEvents)
            const childNodes = children.map(c => c(e, data))
            root.appendChild(e)
            return {
                update() {
                    updateProps(data(), e, currentAttrs, currentEvents)
                    childNodes.forEach(c => c.update())
                },
                unmount() {
                    root.removeChild(e)
                    childNodes.forEach(c => c.unmount())
                },
            }
        }
    }

    /**
     * @param {Renderer<{}>} renderer
     * @param {string} target
     * @returns a function to unmount from `target`
     */
    function mount(renderer, target) {
        const r = renderer(document.querySelector(target), () => ({}))
        return () => r.unmount()
    }

    return {
        $,
        _,
        t,
        mount,
        genAttrs,
    }
})()