
/**
 * A factory function that is used to access dynamic values.
 */
export type Accessor<Value = any> = () => Value

/**
 * An algebraic data type for declaring attributes.
 */
export type Attrs = <A>(a: {
    attr(name: string, value: Accessor): A,
    on(name: string, listener: Accessor<(<E extends Event>(e: E) => void)|void|null|undefined>): A,
}) => A

/**
 * A representation component lifecycle hooks
 */
export type LifecycleHooks = {
    update(cb: () => void): void,
    mounted(cb: () => (() => void) | void): void,
}

/**
 * A context for middleware to hook into components.
 */
export type MiddlewareContext<Props extends Record<string, any>> = {
    /**
     * Accesses a component's properties
     */
    props(): Props,
    /**
     * Tells a component to update.
     */
    refresh(): void,
    /**
     * Contains a component's lifecycle hooks.
     */
    on: LifecycleHooks,
    /**
     * Allows middleware to use other middleware.
     * @param m a middleware instance
     */
    use<T>(m: Middleware<Props, T>): T,
}

/**
 * A function to access a component's internal API.
 */
export type Middleware<Props extends Record<string, any>, T> = (ctx: MiddlewareContext<Props>) => T

export type Component<Props extends Record<string, any>> = (use: <T>(m: Middleware<Props, T>) => T) => Render

export type Block = <T>(block: <Context>(id: string, template: (context: Accessor<Context>) => Render, context: Context) => T) => T

/**
 * A render instruction used for CSR or SSR.
 */
export type Render = <T>(render: {
    text(text: string): T,
    dynamic(text: Accessor): T,
    element(el: string, attrs: Attrs[], children: Render[]): T,
    component<Props extends Record<string, any>>(
        comp: Component<Props>,
        props: Accessor<Props>
    ): T,
    fragment(children: Render[]): T,
    directive(blocks: Accessor<Block[]>): T,
}) => T
