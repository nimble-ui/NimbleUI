import { setChildren, INode } from './manipulation'
import { render } from './render'
import type { Render } from '../shared/types'

export default function mount(template: Render, root: HTMLElement) {
    let rerender = () => {}, children: INode[] = []
    const rendered = render(template, [], () => rerender())
    rerender = () => {
        rendered.render()
        const newChildren = rendered.node.getChildren()
        setChildren(root, children, newChildren)
        children = newChildren
    }
    rerender()
    return {
        update() {
            rerender()
        },
        unmount() {
            rerender = () => {}
            rendered.unmount()
            setChildren(root, children, [])
        },
    }
}