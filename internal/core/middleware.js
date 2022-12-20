/**
 * Gives access to the component's properties
 * @param sel a function to select a component prop
 */
export function Prop(sel) {
    return ctx => () => sel(ctx.props());
}
/**
 * Allows a function to manually refresh the component.
 */
export function Refresh() {
    return ctx => () => ctx.refresh();
}
/**
 * Allows the component to access its lifecycle hooks
 */
export function Lifecycle() {
    return ctx => ctx.on;
}
/**
 * Allows the component to manage its own state.
 * @param init the initial state
 * @returns an object with a single property, `value`, so the component can read from and write to its internal state
 */
export function State(init) {
    return ctx => {
        let value = init;
        return {
            get value() {
                return value;
            },
            set value(v) {
                value = v;
                ctx.refresh();
            }
        };
    };
}
