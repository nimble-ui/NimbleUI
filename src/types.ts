export type Renderer = (root: Node)=>{
    update(): void,
    unmount(): void
}

export type AttrObject = {[key:string]: any}

export type Attrs<A extends AttrObject> = () => A

export type Component<P extends AttrObject> = (props: P, update: () => void) => {
    template: Renderer,
    mounted?: () => (() => void) | undefined
}

export type AttrMap = Map<string, string>

export type EventHandler = (ev: Event) => void

export type EventMap = Map<string, EventHandler>