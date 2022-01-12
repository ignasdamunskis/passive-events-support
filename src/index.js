import { passiveSupported, passiveSupport } from './utils'

window.passiveSupport ||= {}
window.passiveSupported = passiveSupported(window.passiveSupport.debug)
passiveSupport(window.passiveSupport)