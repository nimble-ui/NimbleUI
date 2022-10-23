import { text } from 'incremental-dom'
import { noop } from './utils'
import type { Renderer } from './types'

export function t(str: string): Renderer {
    return () => ({
        render() {
            text(str)
        },
        unmount: noop,
    })
}

export function _(sel: () => any): Renderer {
    return () => ({
        unmount: noop,
        render() {
            const v = sel()
            if (v || v == 0) text(`${v}`)
        },
    })
}
