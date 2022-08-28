window.addEventListener('load', function () {
    const { $, t, mount, genAttrs } = UI, [cls, style] = genAttrs(['class', 'style'])
    mount($('h1',[cls.is('title'), style.is('color: green;')],t('Hello, NimbleUI!')), 'body')
})