(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b ||= {})
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/middleware.ts
  var middleware_exports = {};
  __export(middleware_exports, {
    Lifecycle: () => Lifecycle,
    Prop: () => Prop,
    Refresh: () => Refresh,
    State: () => State
  });

  // src/core/middleware.ts
  function Prop(sel) {
    return (ctx) => () => sel(ctx.props());
  }
  function Refresh() {
    return (ctx) => () => ctx.refresh();
  }
  function Lifecycle() {
    return (ctx) => ctx.on;
  }
  function State(init) {
    return (ctx) => {
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

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    _: () => _,
    attr: () => attr,
    c: () => c,
    e: () => e,
    each: () => each,
    f: () => f,
    on: () => on,
    t: () => t,
    when: () => when
  });

  // src/core/index.ts
  function t(text2) {
    return (render2) => render2.text(text2);
  }
  function _(text2) {
    return (render2) => render2.dynamic(text2);
  }
  function e(el, attrs = [], children = []) {
    return (render2) => render2.element(el, attrs, children);
  }
  function attr(name, value) {
    return (attr2) => attr2.attr(name, value);
  }
  function on(name, value) {
    return (attr2) => attr2.on(name, value);
  }
  function c(comp, props) {
    return (render2) => render2.component(comp, props);
  }
  function f(children = []) {
    return (render2) => render2.fragment(children);
  }
  function when(cond, then, alt = f()) {
    return (ctx) => ctx.when(cond, then, alt);
  }
  function each({ items, trackBy = () => (_2, idx) => idx }, renderItems) {
    return (ctx) => ctx.each(items, trackBy, renderItems);
  }

  // src/client/manipulation.ts
  function text(id, node) {
    return (i) => i.text(id, node);
  }
  function element(id, name, node) {
    return (i) => i.element(id, name, node);
  }
  function areSameNodes(i, v) {
    return i({
      text(a) {
        return v({
          text(b) {
            return a == b;
          },
          element() {
            return false;
          }
        });
      },
      element(a, a_name) {
        return v({
          text() {
            return false;
          },
          element(b, b_name) {
            return a == b && a_name == b_name;
          }
        });
      }
    });
  }
  function diffAttrs(node, current, target) {
    const currentKeys = Object.keys(current), targetKeys = Object.keys(target);
    const unionKeys = [...currentKeys, ...targetKeys.filter((k) => !currentKeys.includes(k))];
    for (const k of unionKeys) {
      if (!targetKeys.includes(k)) {
        node.setAttribute(k, "");
        node.removeAttribute(k);
      } else if (!currentKeys.includes(k))
        node.setAttribute(k, target[k]);
      else if (target[k] != current[k])
        node.setAttribute(k, target[k]);
    }
  }
  function diffEvents(node, current, target) {
    const currentKeys = Object.keys(current), targetKeys = Object.keys(target);
    const unionKeys = [...currentKeys, ...targetKeys.filter((k) => !currentKeys.includes(k))];
    for (const k of unionKeys) {
      if (!targetKeys.includes(k))
        node.removeEventListener(k, current[k]);
      else if (!currentKeys.includes(k))
        node.addEventListener(k, target[k]);
      else if (target[k] != current[k]) {
        node.removeEventListener(k, current[k]);
        node.addEventListener(k, target[k]);
      }
    }
  }
  function setChildren(node, currentChildren, newChildren) {
    let discard = [];
    for (const item of currentChildren) {
      if (newChildren.length == 0) {
        discard = [...discard, ...currentChildren];
        break;
      } else if (!areSameNodes(item, newChildren[0])) {
        discard = [...discard, item];
      } else {
        newChildren = newChildren.slice(1);
      }
    }
    for (const item of newChildren) {
      if (discard.some((discarded) => areSameNodes(discarded, item))) {
        const idx = discard.findIndex((discarded) => areSameNodes(discarded, item));
        discard[idx]({
          text(_2, txt) {
            node.removeChild(txt);
            node.appendChild(txt);
          },
          element(_2, __, el) {
            node.removeChild(el);
            node.appendChild(el);
          }
        });
        discard = discard.filter((_2, i) => i != idx);
      } else {
        item({
          text(_2, txt) {
            node.appendChild(txt);
          },
          element(_2, __, el) {
            node.appendChild(el);
          }
        });
      }
    }
    discard.forEach((discarded) => discarded({
      text(_2, txt) {
        node.removeChild(txt);
      },
      element(_2, __, el) {
        node.removeChild(el);
      }
    }));
  }
  var VText = class {
    constructor(textContent, ID) {
      this.textContent = textContent;
      this.ID = ID;
      this.txt = document.createTextNode(this.textContent);
    }
    getChildren() {
      return this.textContent ? [text(this.ID, this.txt)] : [];
    }
    setText(txt) {
      if (txt == this.textContent)
        return;
      this.textContent = txt;
      this.txt.textContent = txt;
    }
  };
  var VElement = class {
    constructor(name, ID) {
      this.name = name;
      this.ID = ID;
      this.el = document.createElement(this.name);
      this.children = [];
      this.attrs = {};
      this.events = {};
    }
    getChildren() {
      return [element(this.ID, this.name, this.el)];
    }
    setChildren(childNodes) {
      const children = childNodes.reduce((nodes, vNode) => [...nodes, ...vNode.getChildren()], []);
      setChildren(this.el, this.children, children);
      this.children = children;
    }
    setAttributes(attrs) {
      diffAttrs(this.el, this.attrs, attrs);
      this.attrs = attrs;
    }
    setEventListeners(events) {
      diffEvents(this.el, this.events, events);
      this.events = events;
    }
  };
  var VFragment = class {
    constructor() {
      this.children = [];
    }
    getChildren() {
      return this.children;
    }
    setChildren(childNodes) {
      this.children = childNodes.reduce((nodes, vNode) => [...nodes, ...vNode.getChildren()], []);
    }
  };

  // src/shared/utils.ts
  function noop() {
  }

  // src/client/render.ts
  function render(template, ids, requestUpdate) {
    return template({
      text(t2) {
        return {
          node: new VText(t2, ids.join("_")),
          render: noop,
          unmount: noop
        };
      },
      dynamic(t2) {
        const txt = new VText(`${t2()}`, ids.join("_"));
        return {
          node: txt,
          render() {
            txt.setText(`${t2()}`);
          },
          unmount: noop
        };
      },
      element(name, attrs, children) {
        const el = new VElement(name, ids.join("_")), childRenderers = children.map((c2, i) => render(c2, [`${i}`], requestUpdate));
        return {
          node: el,
          render() {
            let a = {}, e2 = {};
            attrs.forEach((attr2) => attr2({
              attr(name2, value) {
                const v = value();
                if (v == true)
                  a = __spreadProps(__spreadValues({}, a), { [name2]: name2 });
                else if (v)
                  a = __spreadProps(__spreadValues({}, a), { [name2]: `${v}` });
              },
              on(name2, listener) {
                const l = listener();
                if (l)
                  e2 = __spreadProps(__spreadValues({}, e2), { [name2]: l });
              }
            }));
            el.setAttributes(a);
            el.setEventListeners(e2);
            el.setChildren(childRenderers.map((c2) => {
              c2.render();
              return c2.node;
            }));
          },
          unmount() {
            for (const c2 of childRenderers) {
              c2.unmount();
            }
          }
        };
      },
      component(comp, props) {
        const updateSubs = [], mountedSubs = [];
        function mounted() {
          const unmountedSubs = mountedSubs.map((m) => m() || (() => {
          }));
          return () => unmountedSubs.forEach((u) => u());
        }
        function updated() {
          updateSubs.forEach((u) => u());
        }
        let currentProps = props(), update = () => {
        };
        const ctx = {
          props: () => currentProps,
          refresh: () => update(),
          on: {
            mounted(cb) {
              mountedSubs.push(cb);
            },
            update(cb) {
              updateSubs.push(cb);
            }
          },
          use: (m) => m(ctx)
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
            update = () => {
            };
            rendered.unmount();
          }
        };
      },
      fragment(children) {
        const childRenderers = children.map((c2, i) => render(c2, [...ids, `${i}`], requestUpdate)), frag = new VFragment();
        return {
          node: frag,
          render() {
            frag.setChildren(childRenderers.map((c2) => {
              c2.render();
              return c2.node;
            }));
          },
          unmount() {
            for (const c2 of childRenderers) {
              c2.unmount();
            }
          }
        };
      },
      when(cond, then, alt) {
        const getCond = () => cond() ? true : false, renderThen = () => render(then, [...ids, "then"], requestUpdate), renderAlt = () => render(alt, [...ids, "else"], requestUpdate), frag = new VFragment();
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
          }
        };
      },
      each(items, trackBy, renderItems) {
        const getItems = () => {
          const tb = trackBy(), i = items();
          return i.map((item, index) => ({
            item,
            id: `${tb(item, index, i)}`
          }));
        }, frag = new VFragment();
        class Item {
          constructor(item, index, id) {
            this.item = item;
            this.index = index;
            this.id = id;
            this.render = render(
              renderItems(() => this.item, () => this.index, items),
              [...ids, `item:${this.id}`],
              requestUpdate
            );
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
              } else if (newItems[0].id != item.id) {
                discard = [...discard, item];
              } else {
                item.item = newItems[0].item;
                completed = [...completed, item];
                newItems = newItems.slice(1);
              }
            }
            for (const item of newItems) {
              if (discard.some((discarded) => discarded == item)) {
                const idx = discard.findIndex((discarded) => discarded.id == item.id);
                completed = [...completed, discard[idx]];
                discard = discard.filter((_2, i) => i != idx);
              } else {
                const i = new Item(item.item, completed.length - 1, item.id);
                completed = [...completed, i];
              }
            }
            discard.forEach((d) => d.render.unmount());
            currentItems = completed;
            frag.setChildren(currentItems.map((item, i) => {
              item.index = i;
              item.render.render();
              return item.render.node;
            }));
          },
          unmount() {
            currentItems.forEach((r) => r.render.unmount());
          }
        };
      }
    });
  }

  // src/client/index.ts
  function mount(template, root) {
    let rerender = () => {
    }, children = [];
    const rendered = render(template, [], () => rerender());
    rerender = () => {
      rendered.render();
      const newChildren = rendered.node.getChildren();
      setChildren(root, children, newChildren);
      children = newChildren;
    };
    rerender();
    return {
      update() {
        rerender();
      },
      unmount() {
        rerender = () => {
        };
        rendered.unmount();
        setChildren(root, children, []);
      }
    };
  }

  // src/browser.ts
  var NimbleUI = __spreadProps(__spreadValues({}, src_exports), {
    middleware: middleware_exports,
    mount
  });
  var browser_default = NimbleUI;
})();
