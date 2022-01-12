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

export function passiveSupport(customEvents = null, debug = false) {
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
    const oldArguments = args[2];

    if (events.includes(args[0]) && (!args[2] || args[2].passive === undefined)) {
      const fn = args[1].toString()
      const [fnDeclaration, ...fnContents] = fn.split('{')
      const fnName = fnDeclaration.replace(/(function|=>)/, '').trim()
      const fnContent = fnContents.join('{')
      const fnArgument = (fnName.match(/\(([^)]+)\)/) || [`(${fnName})`])[0].replace(/[()]/g, '')
      const fnPrevented = !!(fnArgument && (
        // if event itself is preventing
        fnContent.includes('preventDefault') ||
        // if event is passed to other method
        fnContent.includes(`(${fnArgument})`) ||
        fnContent.includes(`(${fnArgument},`) ||
        fnContent.includes(`,${fnArgument})`) ||
        fnContent.includes(`, ${fnArgument})`) ||
        fnContent.includes(`,${fnArgument},`) ||
        fnContent.includes(`, ${fnArgument},`)
      ))

      args[2] = {
        ...(args[2] || {}),
        ...(passiveSupported() && { passive: !fnPrevented })
      }

      if (debug) {
        console.info('[Passive Events Support] Updated Event Listeners', {
          event: args[0],
          handler: { fnArgument, fnContent, fnPrevented },
          oldArguments,
          updatedArguments: args[2]
        })
      }
    }

    originalFn.call(this, ...args)
  }
}