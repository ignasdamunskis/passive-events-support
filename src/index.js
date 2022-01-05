import { supportPassive } from './utils'

const options = {
  vanilla: true,
  jquery: false,
  ...(window.passiveSupportOptions || {})
}

supportPassive(options)