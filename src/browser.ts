import * as middleware from './middleware'
import * as core from './index'
import mount from './client/index'

const NimbleUI = {
    ...core,
    middleware,
    mount,
}

export default NimbleUI
