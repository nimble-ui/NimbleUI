import type { Render, Accessor, Attrs, Component } from '../shared/types';
export declare function t(text: string): Render;
export declare function _(text: Accessor): Render;
export declare function e(el: string, attrs?: Attrs[], children?: Render[]): Render;
export declare function attr(name: string, value: Accessor): Attrs;
export declare function on(name: string, value: Accessor<(<E extends Event>(e: E) => void) | void | null | undefined>): Attrs;
export declare function c<Props extends Record<string, any>>(comp: Component<Props>, props: Accessor<Props>): Render;
export declare function f(children?: Render[]): Render;
export declare function when(cond: Accessor, then: Render, alt?: Render): Render;
export declare function each<TItem>({ items, trackBy }: {
    items: Accessor<TItem[]>;
    trackBy?: Accessor<(item: TItem, index: number, array: TItem[]) => any>;
}, renderItems: (item: Accessor<TItem>, index: Accessor<number>, array: Accessor<TItem[]>) => Render): Render;
