window.addEventListener('load', function () {
    const { e, t, mount } = UI
    mount(e('button',() => ({ onclick: () => alert('Hello, NimbleUI!') }),t('Click here')), 'body')
})