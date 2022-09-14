window.addEventListener('load', function () {
    const { e, t, mount } = UI
    mount(e('h1', () => ({'class': 'title', style: 'color:green;'}), t('Hello, NimbleUI!')), 'body')
})