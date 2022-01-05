export function passiveSupported() {
  let passiveSupported = false

  try {
    const options = Object.defineProperty({}, 'passive', {
      get: function() {
        passiveSupported = true
      }
    })

    window.addEventListener('testPassive', null, options)
    window.removeEventListener('testPassive', null, options)
  } catch (error) {}

  return passiveSupported
}

export function passiveSupport(customEvents = null) {
  const events = customEvents || [
    'scroll',
    'wheel',
    'touchstart',
    'touchmove',
    'touchenter',
    'touchend',
    'touchleave',
    'mouseout',
    'mouseleave',
    'mouseup',
    'mousedown',
    'mousemove',
    'mouseenter',
    'mousewheel',
    'mouseover'
  ]
  const originalFn = EventTarget.prototype.addEventListener

  EventTarget.prototype.addEventListener = function(...args) {
    if (events.includes(args[0]) && (!args[2] || args[2].passive === undefined)) {
      args[2] = {
        ...(args[2] || {}),
        ...(passiveSupported() && { passive: !args[1].toString().includes('preventDefault') })
      }
    }

    originalFn.call(this, ...args)
  }
}