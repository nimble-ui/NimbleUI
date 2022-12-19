import { noop } from '../shared/utils';
import { VText, VElement, VFragment } from './manipulation';
export function render(template, ids, requestUpdate) {
    return template({
        text(t) {
            return {
                node: new VText(t, ids.join('_')),
                render: noop,
                unmount: noop,
            };
        },
        dynamic(t) {
            const txt = new VText(`${t()}`, ids.join('_'));
            return {
                node: txt,
                render() {
                    txt.setText(`${t()}`);
                },
                unmount: noop,
            };
        },
        element(name, attrs, children) {
            const el = new VElement(name, ids.join('_')), childRenderers = children.map((c, i) => render(c, [`${i}`], requestUpdate));
            return {
                node: el,
                render() {
                    let a = {}, e = {};
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
                    el.setAttributes(a);
                    el.setEventListeners(e);
                    el.setChildren(childRenderers.map(c => {
                        c.render();
                        return c.node;
                    }));
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
                node: rendered.node,
                render() {
                    currentProps = props();
                    rendered.render();
                    updated();
                },
                unmount() {
                    unmount();
                    update = () => { };
                    rendered.unmount();
                },
            };
        },
        fragment(children) {
            const childRenderers = children.map((c, i) => render(c, [...ids, `${i}`], requestUpdate)), frag = new VFragment;
            return {
                node: frag,
                render() {
                    frag.setChildren(childRenderers.map(c => {
                        c.render();
                        return c.node;
                    }));
                },
                unmount() {
                    for (const c of childRenderers) {
                        c.unmount();
                    }
                },
            };
        },
        when(cond, then, alt) {
            const getCond = () => cond() ? true : false, renderThen = () => render(then, [...ids, 'then'], requestUpdate), renderAlt = () => render(alt, [...ids, 'else'], requestUpdate), frag = new VFragment();
            let currentCond = getCond(), currentRenderer = currentCond ? renderThen() : renderAlt();
            return {
                node: frag,
                render() {
                    const newCond = getCond();
                    if (currentCond != newCond) {
                        currentRenderer.unmount();
                        currentCond = newCond;
                        currentRenderer = currentCond ? renderThen() : renderAlt();
                    }
                    currentRenderer.render();
                    frag.setChildren([currentRenderer.node]);
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
            }, frag = new VFragment();
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
                node: frag,
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
                    frag.setChildren(currentItems.map((item, i) => {
                        item.index = i;
                        item.render.render();
                        return item.render.node;
                    }));
                },
                unmount() {
                    currentItems.forEach(r => r.render.unmount());
                },
            };
        }
    });
}