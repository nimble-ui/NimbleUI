export function Prop(sel) {
    return ctx => () => sel(ctx.props());
}
export function Refresh() {
    return ctx => () => ctx.refresh();
}
export function Lifecycle() {
    return ctx => ctx.on;
}
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
