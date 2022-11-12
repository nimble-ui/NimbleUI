import { patch } from 'incremental-dom'
import { render } from './render'
import type { Render } from '../shared/types'

export default function mount(template: Render, root: HTMLElement) {
    let rerender = () => {}
    const rendered = render(template, [], () => rerender())
    rerender = () => {
        patch(root, () => rendered.render())
    }
    rerender()
    return {
        update() {
            rerender()
        },
        unmount() {
            rerender = () => {}
            rendered.unmount()
        },
    }
}