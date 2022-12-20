import { setChildren } from './manipulation';
import { render } from './render';
/**
 * Mounts the application
 * @param template the template to render to `root`
 * @param root the root element to render `template` to
 * @returns an object to update and shut down the view.
 */
export function mount(template, root) {
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
