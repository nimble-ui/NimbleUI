import type { Middleware, LifecycleHooks, Accessor } from '../shared/types';
export declare function Prop<Props extends Record<string, any>, Value>(sel: (props: Props) => Value): Middleware<Props, Accessor<Value>>;
export declare function Refresh<Props extends Record<string, any>>(): Middleware<Props, () => void>;
export declare function Lifecycle<Props extends Record<string, any>>(): Middleware<Props, LifecycleHooks>;
export declare function State<Props extends Record<string, any>, Value>(init: Value): Middleware<Props, {
    value: Value;
}>;
