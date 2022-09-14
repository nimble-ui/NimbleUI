import { e, t } from '../../../src/index'

const app = e('h1', () => ({'class': 'title', style: 'color:green;'}), t('Hello, NimbleUI!'))

window.addEventListener('load', function () {
    app(this.document.body)
})