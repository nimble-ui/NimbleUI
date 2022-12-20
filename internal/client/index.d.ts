import type { Render } from '../shared/types';
/**
 * Mounts the application
 * @param template the template to render to `root`
 * @param root the root element to render `template` to
 * @returns an object to update and shut down the view.
 */
export declare function mount(template: Render, root: HTMLElement): {
    update(): void;
    unmount(): void;
};
