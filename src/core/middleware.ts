import type { Middleware, LifecycleHooks, Attrs } from '../shared/types'

export function Prop<Props extends Attrs, Value>(sel: (props: Props) => Value): Middleware<Props, Value> {
    return ctx => sel(ctx.props())
}

export function Refresh<Props extends Attrs>(): Middleware<Props, () => void> {
    return ctx => () => ctx.refresh()
}

export function Lifecycle<Props extends Attrs>(): Middleware<Props, LifecycleHooks> {
    return ctx => ctx.on
}

export function State<Props extends Attrs, Value>(init: Value): Middleware<Props, {value: Value}> {
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