window.addEventListener('load', function () {
    const { $, t, _, mount, Component } = UI
    const Clock = Component(({ update }) => {
        let clk = `${new Date}`
        return {
            template: $('p', [], t('Current Time: '), _(() => clk)),
            mounted() {
                console.log('Loaded')
                const c = setInterval(() => {
                    clk = `${new Date}`
                    update()
                })
                return () => clearInterval(c)
            },
        }
    })
    mount(Clock(), 'body')
})