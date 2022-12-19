import type { Middleware, LifecycleHooks, Accessor } from '../shared/types'

/**
 * Gives access to the component's properties
 * @param sel a function to select a component prop
 */
export function Prop<Props extends Record<string, any>, Value>(sel: (props: Props) => Value): Middleware<Props, Accessor<Value>> {
    return ctx => () => sel(ctx.props())
}

/**
 * Allows a function to manually refresh the component.
 */
export function Refresh<Props extends Record<string, any>>(): Middleware<Props, () => void> {
    return ctx => () => ctx.refresh()
}

/**
 * Allows the component to access its lifecycle hooks
 */
export function Lifecycle<Props extends Record<string, any>>(): Middleware<Props, LifecycleHooks> {
    return ctx => ctx.on
}

/**
 * Allows the component to manage its own state.
 * @param init the initial state
 * @returns an object with a single property, `value`, so the component can read from and write to its internal state
 */
export function State<Props extends Record<string, any>, Value>(init: Value): Middleware<Props, {value: Value}> {
    return ctx => {
        let value = init
        return {
            get value() {
                return value
            },
            set value(v: Value) {
                value = v
                ctx.refresh()
            }
            
        }
    }
}