export function passiveSupported(debug = false) {
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

  if (debug) {
    const message = `[Passive Events Support] "passive" option is ${!passiveSupported ? 'not ' : ''}supported by your browser.`
    if (passiveSupported) console.info(message)
    else console.warn(message)
  }

  return passiveSupported
}

export function passiveSupport(custom) {
  const options = {
    events: [
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
    ],
    preventedListeners: [],
    debug: false,
    ...custom
  }

  if (options.debug) {
    console.info('[Passive Events Support] Initialized', options)
  }

  const { events, preventedListeners, debug } = options
  const originalFn = EventTarget.prototype.addEventListener

  EventTarget.prototype.addEventListener = function(...args) {
    const oldArguments = args[2];

    if (events.includes(args[0]) && (!args[2] || args[2].passive === undefined)) {
      const fn = args[1].toString()
      const [fnDeclaration, ...fnContents] = fn.split('{')
      const fnName = fnDeclaration.replace(/(function|=>)/, '').trim()
      const fnContent = fnContents.join('{')
      const fnArgument = (fnName.match(/\(([^)]+)\)/) || [`(${fnName})`])[0].replace(/[()]/g, '')
      const fnPrevented = !!(preventedListeners.find(({ element, event }) => this.matches(element) && event === args[0]) || fnContent.includes('preventDefault'))

      args[2] = {
        ...(args[2] || {}),
        ...(passiveSupported() && { passive: !fnPrevented })
      }

      if (debug) {
        console.info('[Passive Events Support] Updated Event Listeners', {
          element: this,
          event: args[0],
          handler: {
            fn: args[1],
            fnArgument,
            fnContent,
            fnPrevented
          },
          oldArguments,
          updatedArguments: args[2]
        })
      }
    }

    originalFn.call(this, ...args)
  }
}