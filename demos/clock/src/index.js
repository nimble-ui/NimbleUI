window.addEventListener('load', function () {
    const { e, c, _, mount } = UI
    /**
     * @param {{fmt: (x: string) => string}} param0
     * @param {() => void} update
     */
    const Clock = ({fmt}, update) => {
        let clk = `${new Date}`
        return {
            template: e('h2',() => ({}),_(() => fmt(clk))),
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
    mount(c(Clock, () => ({fmt: x => `The current time is ${x}.`})), 'body')
})