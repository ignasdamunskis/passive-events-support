import { passiveSupported, passiveSupport } from './utils'

window.passiveSupported = passiveSupported()
passiveSupport(window.passiveEvents)