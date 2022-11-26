export type Accessor<Value = any> = () => Value

export type Attrs = Record<string, any>

export type LifecycleHooks = {
    update(cb: () => void): void,
    mounted(cb: () => (() => void) | void): void,
}

export type MiddlewareContext<Props extends Attrs> = {
    props(): Props,
    refresh(): void
    on: LifecycleHooks,
    use<T>(m: Middleware<Props, T>): T,
}

export type Middleware<Props extends Attrs, T> = (ctx: MiddlewareContext<Props>) => T

export type Component<Props extends Attrs> = (use: <T>(m: Middleware<Props, T>) => T) => Render

export type ComponentFactory<Props extends Attrs> = <Ctx extends any[]>(props?: Accessor<Partial<Props>>[]) => Render

export type Render = <T>(render: {
    text(text: string): T,
    dynamic(text: Accessor): T,
    element(el: string, attrs: Accessor<Attrs>[], children: Render[]): T,
    component<Props extends Attrs>(
        comp: Component<Props>,
        props: Accessor<Partial<Props>>[]
    ): T,
    fragment(children: Render[]): T,
    when(cond: Accessor, then: Render, alt: Render): T,
    each<TItem>(
        items: Accessor<TItem[]>,
        trackBy: Accessor<(item: TItem, index: number, array: TItem[]) => any>,
        renderItem: (item: Accessor<TItem>, index: Accessor<number>, array: Accessor<TItem[]>) => Render
    ): T,
}) => T
