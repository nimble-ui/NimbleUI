import { e, t, on } from '../../../src/index'
import mount from '../../../src/client/index'

const app = e('button', [on('click', () => () => alert('Hello, NimbleUI!'))], [t('Click here')])

window.addEventListener('load', function() {
    mount(app, this.document.body)
})