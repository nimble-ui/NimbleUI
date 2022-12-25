import { INode } from './manipulation';
import type { Render } from '../shared/types';
type Renderer = {
    render(): INode[];
    unmount(): void;
};
export declare function render(template: Render, ids: string[], requestUpdate: () => void): Renderer;
export {};
