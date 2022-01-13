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

function isEventSupported(event) {
  return [
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
  ].includes(event)
}

export function passiveSupport(custom) {
  const options = {
    debug: false,
    events: [],
    listeners: [],
    ...custom
  }

  if (options.debug) {
    console.info('[Passive Events Support] Initialized With', options)

    options.events = options.events.filter((event) => {
      const supported = isEventSupported(event)
      if (!supported) console.warn(`[Passive Events Support] Unsupported Event: ${event}`)
      return supported
    })

    options.listeners = options.listeners.filter((listener) => {
      const supported = isEventSupported(listener.event)
      if (!supported) console.warn(`[Passive Events Support] Unsupported Listener:`, listener)
      return supported
    })
  }

  const { debug, events, listeners } = options
  const originalFn = EventTarget.prototype.addEventListener

  EventTarget.prototype.addEventListener = function(...args) {
    const self = this
    const oldArguments = args[2];
    const isEventFromList = events.includes(args[0])
    const isListenerFromList = listeners.find(({ element, event }) => self.matches(element) && event === args[0])
    const noPassiveOption = (!args[2] || args[2].passive === undefined)

    if ((isEventFromList || isListenerFromList) && noPassiveOption) {
      const fn = args[1].toString()
      const [fnDeclaration, ...fnContents] = fn.split('{')
      const fnName = fnDeclaration.replace(/(function|=>)/, '').trim()
      const fnContent = fnContents.join('{')
      const fnArgument = (fnName.match(/\(([^)]+)\)/) || [`(${fnName})`])[0].replace(/[()]/g, '')
      const fnPrevented = fnContent.includes('preventDefault') || (isListenerFromList && isListenerFromList.prevented)

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