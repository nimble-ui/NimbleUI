import type { Middleware, LifecycleHooks, Accessor } from '../shared/types'

export function Prop<Props extends Record<string, any>, Value>(sel: (props: Props) => Value): Middleware<Props, Accessor<Value>> {
    return ctx => () => sel(ctx.props())
}

export function Refresh<Props extends Record<string, any>>(): Middleware<Props, () => void> {
    return ctx => () => ctx.refresh()
}

export function Lifecycle<Props extends Record<string, any>>(): Middleware<Props, LifecycleHooks> {
    return ctx => ctx.on
}

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