import type { RedomElement } from 'redom'
export type Renderer = () => {
    el: RedomElement,
    update(): void,
    unmount(): void,
}

export type AttrObject = {[key:string]: any}

export type Attrs<A extends AttrObject> = () => A

export type Component<P extends AttrObject> = (ctx: {props: <T>(cb: (props: P) => T) => () => T, update: () => void}) => {
    template: Renderer,
    mounted?: () => (() => void) | undefined,
    updated?: () => void
}

export type AttrMap = Map<string, string>

export type EventHandler = (ev: Event) => void

export type EventMap = Map<string, EventHandler>