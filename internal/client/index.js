import { setChildren } from './manipulation';
import { render } from './render';
export default function mount(template, root) {
    let rerender = () => { }, children = [];
    const rendered = render(template, [], () => rerender());
    rerender = () => {
        rendered.render();
        const newChildren = rendered.node.getChildren();
        setChildren(root, children, newChildren);
        children = newChildren;
    };
    rerender();
    return {
        update() {
            rerender();
        },
        unmount() {
            rerender = () => { };
            rendered.unmount();
            setChildren(root, children, []);
        },
    };
}
