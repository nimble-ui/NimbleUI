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
        directive(blocks) {
            class BlockInstance {
                constructor(id, template, context) {
                    this.id = id;
                    this.template = template;
                    this.context = context;
                    this.render = render(this.template(() => this.context), [...ids, this.id], requestUpdate);
                }
            }
            const id = (b) => b(id => id);
            let currentBlocks = [];
            return {
                render() {
                    let newBlocks = blocks(), discard = [], completed = [];
                    for (const block of currentBlocks) {
                        if (newBlocks.length == 0) {
                            discard = [...discard, ...currentBlocks];
                            break;
                        }
                        else if (id(newBlocks[0]) != block.id) {
                            discard = [...discard, block];
                        }
                        else {
                            block.context = newBlocks[0]((_, __, ctx) => ctx);
                            completed = [...completed, block];
                            newBlocks = newBlocks.slice(1);
                        }
                    }
                    for (const block of newBlocks) {
                        if (discard.some(discarded => discarded.id == id(block))) {
                            const idx = discard.findIndex(discarded => discarded.id == id(block));
                            completed = [...completed, discard[idx]];
                            discard = discard.filter((_, i) => i != idx);
                        }
                        else {
                            const i = block((id, template, context) => new BlockInstance(id, template, context));
                            completed = [...completed, i];
                        }
                    }
                    discard.forEach(d => d.render.unmount());
                    currentBlocks = completed;
                    return currentBlocks.reduce((children, c) => [...children, ...c.render.render()], []);
                },
                unmount() {
                    currentBlocks.forEach(r => r.render.unmount());
                },
            };
        }
    });
}
