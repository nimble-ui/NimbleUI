export type Attrs = Record<string, string>
export type Events = Record<string, <E extends Event>(e: E) => void>

export type INode = <T>(i: {
    text(id: string, node: Text): T,
    element(id: string, name: string, node: Element): T
}) => T

function text(id: string, node: Text): INode {
    return i => i.text(id, node)
}

function element(id: string, name: string, node: Element): INode {
    return i => i.element(id, name, node)
}

function areSameNodes(i: INode, v: INode): boolean {
    return i({
        text(a) {
            return v({
                text(b) {
                    return a == b
                },
                element() {
                    return false
                },
            })
        },
        element(a, a_name) {
            return v({
                text() {
                    return false
                },
                element(b, b_name) {
                    return a == b && a_name == b_name
                },
            })
        },
    })
}

export function diffAttrs(node: Element, current: Attrs, target: Attrs) {
    const currentKeys = Object.keys(current), targetKeys = Object.keys(target)
    const unionKeys = [...currentKeys, ...targetKeys.filter(k => !currentKeys.includes(k))]
    for (const k of unionKeys) {
        if (!targetKeys.includes(k)) {
            node.setAttribute(k, '')
            node.removeAttribute(k)
        }
        else if (!currentKeys.includes(k)) node.setAttribute(k, target[k])
        else if (target[k] != current[k]) node.setAttribute(k, target[k])
    }
}

export function diffEvents(node: Element, current: Events, target: Events) {
    const currentKeys = Object.keys(current), targetKeys = Object.keys(target)
    const unionKeys = [...currentKeys, ...targetKeys.filter(k => !currentKeys.includes(k))]
    for (const k of unionKeys) {
        if (!targetKeys.includes(k)) node.removeEventListener(k, current[k])
        else if (!currentKeys.includes(k)) node.addEventListener(k, target[k])
        else if (target[k] != current[k]) {
            node.removeEventListener(k, current[k])
            node.addEventListener(k, target[k])
        }
    }
}

export function setChildren(node: Element, currentChildren: INode[], newChildren: INode[]) {
    let discard: INode[] = []
    for (const item of currentChildren) {
        if (newChildren.length == 0) {
            discard = [...discard, ...currentChildren]
            break
        } else if (!areSameNodes(item, newChildren[0])) {
            discard = [...discard, item]
        } else {
            newChildren = newChildren.slice(1)
        }
    }
    for (const item of newChildren) {
        if (discard.some(discarded => areSameNodes(discarded, item))) {
            const idx = discard.findIndex(discarded => areSameNodes(discarded, item))
            discard[idx]<void>({
                text(_, txt) {
                    node.removeChild(txt)
                    node.appendChild(txt)
                },
                element(_, __, el) {
                    node.removeChild(el)
                    node.appendChild(el)
                },
            })
            discard = discard.filter((_, i) => i != idx)
        } else {
            item<void>({
                text(_, txt) {
                    node.appendChild(txt)
                },
                element(_, __, el) {
                    node.appendChild(el)
                },
            })
        }
    }
    discard.forEach(discarded => discarded<void>({
        text(_, txt) {
            node.removeChild(txt)
        },
        element(_, __, el) {
            node.removeChild(el)
        },
    }))
}

export interface VNode {
    getChildren(): INode[]
}

export class VText implements VNode {
    private txt = document.createTextNode(this.textContent)
    constructor(
        private textContent: string,
        private ID: string
    ) {}
    public getChildren(): INode[] {
        return this.textContent ? [text(this.ID, this.txt)] : []
    }
    public setText(txt: string) {
        if (txt == this.textContent) return
        this.textContent = txt
        this.txt.textContent = txt
    }
}

export class VElement implements VNode {
    private el = document.createElement(this.name)
    private children: INode[] = []
    private attrs: Attrs = {}
    private events: Events = {}
    constructor(
        private name: string,
        private ID: string
    ) {}
    public getChildren(): INode[] {
        return [element(this.ID, this.name, this.el)]
    }
    public setChildren(childNodes: VNode[]) {
        const children = childNodes.reduce((nodes, vNode) => [...nodes, ...vNode.getChildren()], [] as INode[])
        setChildren(this.el, this.children, children)
        this.children = children
    }
    public setAttributes(attrs: Attrs) {
        diffAttrs(this.el, this.attrs, attrs)
        this.attrs = attrs
    }
    public setEventListeners(events: Events) {
        diffEvents(this.el, this.events, events)
        this.events = events
    }
}

export class VFragment implements VNode {
    private children: INode[] = []
    public getChildren(): INode[] {
        return this.children
    }
    public setChildren(childNodes: VNode[]) {
        this.children = childNodes.reduce((nodes, vNode) => [...nodes, ...vNode.getChildren()], [] as INode[])
    }
}
