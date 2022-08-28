window.addEventListener('load', function () {
    const { $, t, mount, genAttrs } = UI, [onClick] = genAttrs(['onclick'])
    mount($('button',[onClick.is(() => alert('Hello, NimbleUI!'))],t('Click here')), 'body')
})