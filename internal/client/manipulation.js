export function text(id, node) {
    return i => i.text(id, node);
}
export function element(id, name, node) {
    return i => i.element(id, name, node);
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
                },
            });
        },
        element(a, a_name) {
            return v({
                text() {
                    return false;
                },
                element(b, b_name) {
                    return a == b && a_name == b_name;
                },
            });
        },
    });
}
export function diffAttrs(node, type, current, target) {
    const currentKeys = Object.keys(current), targetKeys = Object.keys(target);
    const unionKeys = [...currentKeys, ...targetKeys.filter(k => !currentKeys.includes(k))];
    for (const k of unionKeys) {
        if (!targetKeys.includes(k)) {
            node.setAttribute(k, '');
            if (k == 'value' && type == 'input')
                node.value = '';
            node.removeAttribute(k);
        }
        else if (!currentKeys.includes(k))
            node.setAttribute(k, target[k]);
        else if (target[k] != current[k])
            node.setAttribute(k, target[k]);
    }
}
export function diffEvents(node, current, target) {
    const currentKeys = Object.keys(current), targetKeys = Object.keys(target);
    const unionKeys = [...currentKeys, ...targetKeys.filter(k => !currentKeys.includes(k))];
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
export function setChildren(node, currentChildren, newChildren) {
    let discard = [];
    for (const item of currentChildren) {
        if (newChildren.length == 0) {
            discard = [...discard, ...currentChildren];
            break;
        }
        else if (!areSameNodes(item, newChildren[0])) {
            discard = [...discard, item];
        }
        else {
            newChildren = newChildren.slice(1);
        }
    }
    for (const item of newChildren) {
        if (discard.some(discarded => areSameNodes(discarded, item))) {
            const idx = discard.findIndex(discarded => areSameNodes(discarded, item));
            discard[idx]({
                text(_, txt) {
                    node.removeChild(txt);
                    node.appendChild(txt);
                },
                element(_, __, el) {
                    node.removeChild(el);
                    node.appendChild(el);
                },
            });
            discard = discard.filter((_, i) => i != idx);
        }
        else {
            item({
                text(_, txt) {
                    node.appendChild(txt);
                },
                element(_, __, el) {
                    node.appendChild(el);
                },
            });
        }
    }
    discard.forEach(discarded => discarded({
        text(_, txt) {
            node.removeChild(txt);
        },
        element(_, __, el) {
            node.removeChild(el);
        },
    }));
}
