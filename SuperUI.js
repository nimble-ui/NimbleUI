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
     * @param {Renderer<{}>} renderer
     * @param {string} target
     * @returns a function to unmount from `target`
     */
    function mount(renderer, target) {
        const r = renderer(document.querySelector(target), () => ({}))
        return () => r.unmount()
    }

    return {
        _,
        t,
        mount,
    }
})()