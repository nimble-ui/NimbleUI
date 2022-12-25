import { noop } from '../shared/utils';
import { setChildren, diffAttrs, diffEvents, text, element } from './manipulation';
export function render(template, ids, requestUpdate) {
    return template({
        text(t) {
            const txt = document.createTextNode(t);
            return {
                render() {
                    return t ? [text(ids.join('_'), txt)] : [];
                },
                unmount: noop,
            };
        },
        dynamic(t) {
            let content = `${t()}`;
            const txt = document.createTextNode(`${t()}`), id = ids.join('_');
            return {
                render() {
                    const newContent = `${t()}`;
                    if (newContent != content) {
                        content = txt.textContent = newContent;
                    }
                    return content ? [text(id, txt)] : [];
                },
                unmount: noop,
            };
        },
        element(name, attrs, children) {
            let currentAttrs = {}, currentEvents = {}, currentChildren = [];
            const el = document.createElement(name), id = ids.join('_'), childRenderers = children.map((c, i) => render(c, [`${i}`], requestUpdate));
            return {
                render() {
                    let a = {}, e = {}, newChildren = childRenderers.reduce((children, c) => {
                        return [...children, ...c.render()];
                    }, []);
                    attrs.forEach(attr => attr({
                        attr(name, value) {
                            const v = value();
                            if (v == true)
                                a = Object.assign(Object.assign({}, a), { [name]: name });
                            else if (v)
                                a = Object.assign(Object.assign({}, a), { [name]: `${v}` });
                        },
                        on(name, listener) {
                            const l = listener();
                            if (l)
                                e = Object.assign(Object.assign({}, e), { [name]: l });
                        },
                    }));
                    diffAttrs(el, name, currentAttrs, a);
                    diffEvents(el, currentEvents, e);
                    setChildren(el, currentChildren, newChildren);
                    currentAttrs = a;
                    currentEvents = e;
                    currentChildren = newChildren;
                    return [element(id, name, el)];
                },
                unmount() {
                    for (const c of childRenderers) {
                        c.unmount();
                    }
                },
            };
        },
        component(comp, props) {
            const updateSubs = [], mountedSubs = [];
            function mounted() {
                const unmountedSubs = mountedSubs.map(m => m() || (() => { }));
                return () => unmountedSubs.forEach(u => u());
            }
            function updated() {
                updateSubs.forEach(u => u());
            }
            let currentProps = props(), update = () => { };
            const ctx = {
                props: () => currentProps,
                refresh: () => update(),
                on: {
                    mounted(cb) {
                        mountedSubs.push(cb);
                    },
                    update(cb) {
                        updateSubs.push(cb);
                    },
                },
                use: m => m(ctx),
            };
            const instance = comp(ctx.use);
            const rendered = render(instance, ids, requestUpdate), unmount = mounted();
            update = requestUpdate;
            return {
                render() {
                    currentProps = props();
                    const content = rendered.render();
                    updated();
                    return content;
                },
                unmount() {
                    unmount();
                    update = () => { };
                    rendered.unmount();
                },
            };
        },
        fragment(children) {
            const childRenderers = children.map((c, i) => render(c, [...ids, `${i}`], requestUpdate));
            return {
                render() {
                    return childRenderers.reduce((children, c) => {
                        return [...children, ...c.render()];
                    }, []);
                },
                unmount() {
                    for (const c of childRenderers) {
                        c.unmount();
                    }
                },
            };
        },
        when(cond, then, alt) {
            const getCond = () => cond() ? true : false, renderThen = () => render(then, [...ids, 'then'], requestUpdate), renderAlt = () => render(alt, [...ids, 'else'], requestUpdate);
            let currentCond = getCond(), currentRenderer = currentCond ? renderThen() : renderAlt();
            return {
                render() {
                    const newCond = getCond();
                    if (currentCond != newCond) {
                        currentRenderer.unmount();
                        currentCond = newCond;
                        currentRenderer = currentCond ? renderThen() : renderAlt();
                    }
                    return currentRenderer.render();
                },
                unmount() {
                    currentRenderer.unmount();
                },
            };
        },
        each(items, trackBy, renderItems) {
            const getItems = () => {
                const tb = trackBy(), i = items();
                return i.map((item, index) => ({
                    item,
                    id: `${tb(item, index, i)}`,
                }));
            };
            class Item {
                constructor(item, index, id) {
                    this.item = item;
                    this.index = index;
                    this.id = id;
                    this.render = render(renderItems(() => this.item, () => this.index, items), [...ids, `item:${this.id}`], requestUpdate);
                }
            }
            let currentItems = [];
            return {
                render() {
                    let newItems = getItems(), discard = [], completed = [];
                    for (const item of currentItems) {
                        if (newItems.length == 0) {
                            discard = [...discard, ...currentItems];
                            break;
                        }
                        else if (newItems[0].id != item.id) {
                            discard = [...discard, item];
                        }
                        else {
                            item.item = newItems[0].item;
                            completed = [...completed, item];
                            newItems = newItems.slice(1);
                        }
                    }
                    for (const item of newItems) {
                        if (discard.some(discarded => discarded == item)) {
                            const idx = discard.findIndex(discarded => discarded.id == item.id);
                            completed = [...completed, discard[idx]];
                            discard = discard.filter((_, i) => i != idx);
                        }
                        else {
                            const i = new Item(item.item, completed.length - 1, item.id);
                            completed = [...completed, i];
                        }
                    }
                    discard.forEach(d => d.render.unmount());
                    currentItems = completed;
                    return currentItems.reduce((children, c, i) => {
                        c.index = i;
                        return [...children, ...c.render.render()];
                    }, []);
                },
                unmount() {
                    currentItems.forEach(r => r.render.unmount());
                },
            };
        }
    });
}
