import { e, t } from '../../../src/index'

const app = e('button', () => ({ onclick: () => alert('Hello, NimbleUI!') }), t('Click here'))

window.addEventListener('load', function() {
    app(this.document.body)
})