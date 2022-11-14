import type { Render, Accessor, Attrs, Component, ComponentFactory } from '../shared/types'

export function t(text: string): Render {
    return render => render.text(text)
}

export function _(text: Accessor): Render {
    return render => render.dynamic(text)
}

export function e(el: string, attrs: Accessor<Attrs>[] = [], children: Render[] = []): Render {
    return render => render.element(el, attrs, children)
}

export function c<Props extends Attrs>(
    comp: Component<Props>,
    props: Accessor<Partial<Props>>[]
): Render {
    return render => render.component(comp, props)
}

export function f(children: Render[] = []): Render {
    return render => render.fragment(children)
}

export function when(cond: Accessor, then: Render, alt: Render = f()): Render {
    return ctx => ctx.when(cond, then, alt)
}
