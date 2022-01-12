import { passiveSupported, passiveSupport } from './utils'

window.passiveSupported = passiveSupported(window.passiveDebug)
passiveSupport({
  events: window.passiveEvents,
  preventedListeners: window.passivePreventedListeners,
  debug: window.passiveDebug
})