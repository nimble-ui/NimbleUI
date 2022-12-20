import type { Render, Accessor, Attrs, Component } from '../shared/types';
/**
 * Renders a static text node to the document.
 * @param text a value for the DOM to display
 */
export declare function t(text: string): Render;
/**
 * Renders a dynamic text node to the document.
 * @param text An accessor that contains a value for the DOM to display
 */
export declare function _(text: Accessor): Render;
/**
 * Renders an HTML element to the document.
 * @param el the type of element to render
 * @param attrs the element's attributes and event listeners
 * @param children the element's child text and elements
 */
export declare function e(el: string, attrs?: Attrs[], children?: Render[]): Render;
/**
 * Adds an attribute to the consuming element
 * @param name the name of the attribute
 * @param value an accessor containing the attribute's value
 */
export declare function attr(name: string, value: Accessor): Attrs;
/**
 * Adds an event listener to the consuming element
 * @param name the type of event for the event listener to listen for
 * @param value an accessor containing the callback to call when the event fires
 */
export declare function on(name: string, value: Accessor<(<E extends Event>(e: E) => void) | void | null | undefined>): Attrs;
/**
 * Renders a component.
 * @param comp the component to instantiate
 * @param props an accessor containing the component's props
 */
export declare function c<Props extends Record<string, any>>(comp: Component<Props>, props: Accessor<Props>): Render;
/**
 * Renders a fragment, or a group of child nodes, to the document.
 * @param children
 */
export declare function f(children?: Render[]): Render;
/**
 * Conditionally renders content
 * @param cond an accessor containing the condition to test
 * @param then child nodes to render if the condition is truthy
 * @param alt child nodes to render if the condition is falsey
 */
export declare function when(cond: Accessor, then: Render, alt?: Render): Render;
/**
 * Renders a list of items to the document.
 * @param ... has two properties: `items` contains the items to iterate over, and `trackBy` contains a function to track each item
 * @param renderItems a function that returns a render instruction for each item
 */
export declare function each<TItem>({ items, trackBy }: {
    items: Accessor<TItem[]>;
    trackBy?: Accessor<(item: TItem, index: number, array: TItem[]) => any>;
}, renderItems: (item: Accessor<TItem>, index: Accessor<number>, array: Accessor<TItem[]>) => Render): Render;
