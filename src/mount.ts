import { patch } from 'incremental-dom'
import type { Renderer } from './types'

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
