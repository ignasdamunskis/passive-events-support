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

export function supportPassive(options) {
  if (options.vanilla) {
    console.log('vanilla')
  }

  if (options.jquery) {
    console.log('jquery')
  }
}