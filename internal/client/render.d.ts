import { VNode } from './manipulation';
import type { Render } from '../shared/types';
type Renderer = {
    node: VNode;
    render(): void;
    unmount(): void;
};
export declare function render(template: Render, ids: string[], requestUpdate: () => void): Renderer;
export {};
