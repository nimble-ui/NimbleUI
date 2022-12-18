export type Accessor<Value = any> = () => Value;
export type Attrs = <A>(a: {
    attr(name: string, value: Accessor): A;
    on(name: string, listener: Accessor<(<E extends Event>(e: E) => void) | void | null | undefined>): A;
}) => A;
export type LifecycleHooks = {
    update(cb: () => void): void;
    mounted(cb: () => (() => void) | void): void;
};
export type MiddlewareContext<Props extends Record<string, any>> = {
    props(): Props;
    refresh(): void;
    on: LifecycleHooks;
    use<T>(m: Middleware<Props, T>): T;
};
export type Middleware<Props extends Record<string, any>, T> = (ctx: MiddlewareContext<Props>) => T;
export type Component<Props extends Record<string, any>> = (use: <T>(m: Middleware<Props, T>) => T) => Render;
export type Render = <T>(render: {
    text(text: string): T;
    dynamic(text: Accessor): T;
    element(el: string, attrs: Attrs[], children: Render[]): T;
    component<Props extends Record<string, any>>(comp: Component<Props>, props: Accessor<Props>): T;
    fragment(children: Render[]): T;
    when(cond: Accessor, then: Render, alt: Render): T;
    each<TItem>(items: Accessor<TItem[]>, trackBy: Accessor<(item: TItem, index: number, array: TItem[]) => any>, renderItem: (item: Accessor<TItem>, index: Accessor<number>, array: Accessor<TItem[]>) => Render): T;
}) => T;
