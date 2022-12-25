export type Attrs = Record<string, string>;
export type Events = Record<string, <E extends Event>(e: E) => void>;
export type INode = <T>(i: {
    text(id: string, node: Text): T;
    element(id: string, name: string, node: Element): T;
}) => T;
export declare function text(id: string, node: Text): INode;
export declare function element(id: string, name: string, node: Element): INode;
export declare function diffAttrs(node: Element, type: string, current: Attrs, target: Attrs): void;
export declare function diffEvents(node: Element, current: Events, target: Events): void;
export declare function setChildren(node: Element, currentChildren: INode[], newChildren: INode[]): void;
