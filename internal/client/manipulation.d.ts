export type Attrs = Record<string, string>;
export type Events = Record<string, <E extends Event>(e: E) => void>;
export type INode = <T>(i: {
    text(id: string, node: Text): T;
    element(id: string, name: string, node: Element): T;
}) => T;
export declare function diffAttrs(node: Element, type: string, current: Attrs, target: Attrs): void;
export declare function diffEvents(node: Element, current: Events, target: Events): void;
export declare function setChildren(node: Element, currentChildren: INode[], newChildren: INode[]): void;
export interface VNode {
    getChildren(): INode[];
}
export declare class VText implements VNode {
    private textContent;
    private ID;
    private txt;
    constructor(textContent: string, ID: string);
    getChildren(): INode[];
    setText(txt: string): void;
}
export declare class VElement implements VNode {
    private name;
    private ID;
    private el;
    private children;
    private attrs;
    private events;
    constructor(name: string, ID: string);
    getChildren(): INode[];
    setChildren(childNodes: VNode[]): void;
    setAttributes(attrs: Attrs): void;
    setEventListeners(events: Events): void;
}
export declare class VFragment implements VNode {
    private children;
    getChildren(): INode[];
    setChildren(childNodes: VNode[]): void;
}
