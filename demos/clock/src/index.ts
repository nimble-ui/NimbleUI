import { e, c, _, each } from '../../../src/index'
import mount from '../../../src/client/index'
import { Component } from '../../../src/types'
import { Prop, State, Lifecycle } from '../../../src/middleware'

const Clock: Component<{format: (d: Date) => string[]}> = use => {
    const format = use(Prop(props => props.format))
    const date = use(State(new Date))
    use(Lifecycle()).mounted(() => {
        const tmr = setInterval(() => {
            date.value = new Date
        }, 1000)
        return () => clearInterval(tmr)
    })
    return e('p', [], [
        each({items: () => format()(date.value)}, text => _(text))
    ])
}

const app = c(Clock, () => ({
    format: date => ['It is ', `${date.getHours()}`, date.getMinutes() ? `:${date.getMinutes()}` : " o'clock", '.']
}))

window.addEventListener('load', function () {
    mount(app, this.document.body)
})