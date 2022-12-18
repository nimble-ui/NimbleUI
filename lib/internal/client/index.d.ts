import type { Render } from '../shared/types';
export default function mount(template: Render, root: HTMLElement): {
    update(): void;
    unmount(): void;
};
