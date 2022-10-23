import type { AttrObject, Renderer, Attrs } from './types'
import { elementOpenStart, elementOpenEnd, elementClose, attr } from 'incremental-dom'

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