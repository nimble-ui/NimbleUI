import type { Render, Accessor, Attrs, Component } from '../shared/types'

export function t(text: string): Render {
    return render => render.text(text)
}

export function _(text: Accessor): Render {
    return render => render.dynamic(text)
}

export function e(el: string, attrs: Attrs[] = [], children: Render[] = []): Render {
    return render => render.element(el, attrs, children)
}

export function attr(name: string, value: Accessor): Attrs {
    return attr => attr.attr(name, value)
}

export function on(name: string, value: Accessor<(<E extends Event>(e: E) => void)|void|null|undefined>): Attrs {
    return attr => attr.on(name, value)
}

export function c<Props extends Record<string, any>>(
    comp: Component<Props>,
    props: Accessor<Props>
): Render {
    return render => render.component(comp, props)
}

export function f(children: Render[] = []): Render {
    return render => render.fragment(children)
}

export function when(cond: Accessor, then: Render, alt: Render = f()): Render {
    return ctx => ctx.when(cond, then, alt)
}

export function each<TItem>(
    {items, trackBy = () => (_, idx) => idx}: {
        items: Accessor<TItem[]>,
        trackBy?: Accessor<(item: TItem, index: number, array: TItem[]) => any>,
    },
    renderItems: (item: Accessor<TItem>, index: Accessor<number>, array: Accessor<TItem[]>) => Render
): Render {
    return ctx => ctx.each(items, trackBy, renderItems)
}