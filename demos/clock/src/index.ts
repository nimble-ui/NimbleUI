import {Component, e, c, _} from '../../../src/index'

const Clock: Component<{fmt: (clk: string) => string}> = ({fmt}, update) => {
    let clk = `${new Date}`
    return {
        template: e('h2', () => ({}), _(() => fmt(clk))),
        mounted() {
            console.log('Loaded')
            const c = setInterval(() => {
                clk = `${new Date}`
                update()
            })
            return () => clearInterval(c)
        },
    }
}

const app = c(Clock, () => ({fmt: (clk) => `The current time is ${clk}`}))

window.addEventListener('load', function () {
    app(this.document.body)
})