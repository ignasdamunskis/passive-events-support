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

const defaultOptions = {
  vanilla: true,
  jquery: false,
  events: [
    'scroll', 'wheel',
    'touchstart', 'touchmove', 'touchenter', 'touchend', 'touchleave',
    'mouseout', 'mouseleave', 'mouseup', 'mousedown', 'mousemove', 'mouseenter', 'mousewheel', 'mouseover'
  ]
}

export function passiveSupport(customOptions) {
  const options = { ...defaultOptions, ...customOptions }

  if (options.vanilla) {
    const originalFn = EventTarget.prototype.addEventListener

    EventTarget.prototype.addEventListener = function(...args) {
      if (options.events.includes(args[0]) && (!args[2] || args[2].passive === undefined)) {
        args[2] = {
          ...(args[2] || {}),
          ...(passiveSupported() && { passive: !args[1].toString().includes('preventDefault') })
        }
      }

      console.log('updated', args)

      originalFn.call(this, ...args)
    }
  }

  if (options.jquery) {
    if (typeof $ !== 'undefined' && $.event) {
      passiveSupportJQuery($, options.events)
    }

    if (typeof jQuery !== 'undefined' && jQuery.event) {
      passiveSupportJQuery(jQuery, options.events)
    }
  }
}

export function passiveSupportJQuery(instance, events = defaultOptions.events) {
  const getArgs = (ns) => passiveSupported() ? { passive: !ns.includes('noPreventDefault') } : false

  for (const event of events) {
    instance.event.special[event] = {
      setup: function(_, ns, handle) {
        this.addEventListener(event, handle, getArgs(ns))
      }
    }
  }
}