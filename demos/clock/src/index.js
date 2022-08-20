window.addEventListener('load', function () {
    const { $, t, _, mount, genAttrs, Component } = UI, [cls, style] = genAttrs(['class', 'style'])
    const Clock = Component($('p', [], t('Current Time: '), _(data => data.clk)), ({ update }) => {
        let clk = `${new Date}`
        return {
            data() {
                return { clk }
            },
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