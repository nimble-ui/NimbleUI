import { e, t, attr } from '../../../src/index'
import mount from '../../../src/client/index'

const app = e('h1', [
    attr('class', () => 'title'),
    attr('style', () => 'color:green;'),
], [t('Hello, NimbleUI!')])

window.addEventListener('load', function () {
    mount(app, this.document.body)
})