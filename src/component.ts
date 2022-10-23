import type { AttrObject, Renderer, Attrs, Component } from './types'

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
