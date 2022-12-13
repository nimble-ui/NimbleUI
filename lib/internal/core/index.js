export function t(text) {
    return render => render.text(text);
}
export function _(text) {
    return render => render.dynamic(text);
}
export function e(el, attrs = [], children = []) {
    return render => render.element(el, attrs, children);
}
export function attr(name, value) {
    return attr => attr.attr(name, value);
}
export function on(name, value) {
    return attr => attr.on(name, value);
}
export function c(comp, props) {
    return render => render.component(comp, props);
}
export function f(children = []) {
    return render => render.fragment(children);
}
export function when(cond, then, alt = f()) {
    return ctx => ctx.when(cond, then, alt);
}
export function each({ items, trackBy = () => (_, idx) => idx }, renderItems) {
    return ctx => ctx.each(items, trackBy, renderItems);
}
