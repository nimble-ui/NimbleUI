export type Renderer = (ids: string[], requestUpdate: () => void) => {
    render(): void,
    unmount(): void,
}

export type AttrObject = {[key:string]: any}

export type Attrs<A extends AttrObject> = () => A

export type Component<P extends AttrObject> = (ctx: {props: <T>(cb: (props: P) => T) => () => T, update: () => void}) => {
    template: Renderer,
    mounted?: () => (() => void) | undefined,
    updated?: () => void
}