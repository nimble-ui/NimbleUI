import type { Middleware, LifecycleHooks, Accessor } from '../shared/types';
/**
 * Gives access to the component's properties
 * @param sel a function to select a component prop
 */
export declare function Prop<Props extends Record<string, any>, Value>(sel: (props: Props) => Value): Middleware<Props, Accessor<Value>>;
/**
 * Allows a function to manually refresh the component.
 */
export declare function Refresh<Props extends Record<string, any>>(): Middleware<Props, () => void>;
/**
 * Allows the component to access its lifecycle hooks
 */
export declare function Lifecycle<Props extends Record<string, any>>(): Middleware<Props, LifecycleHooks>;
/**
 * Allows the component to manage its own state.
 * @param init the initial state
 * @returns an object with a single property, `value`, so the component can read from and write to its internal state
 */
export declare function State<Props extends Record<string, any>, Value>(init: Value): Middleware<Props, {
    value: Value;
}>;
