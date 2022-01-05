# passive-events-support

## Installation

```bash
yarn add passive-events-support
```

## Usage

This package must be imported before any package or code that is causing an issue or Lighthouse warning

### JS

```js
require 'passive-events-support'
// or
import 'passive-events-support'
```

### HTML

```html
<script type="text/javascript" src="node_modules/default-passive-events/dist/index.js"></script>
```

### How it works

When event listener does not have a `passive` option, it will be added and its' value will depend on whether `preventDefault()` is called or not.

When event listener is not calling `preventDefault()` and `passive` option is not passed, it will add a `{ passive: true }`

```js
element.addEventListener('touchstart', (e) => {}) // { passive: true }
```

When event listener is calling `preventDefault()` and `passive` option are not passed, it will add a `{ passive: false }`

```js
element.addEventListener('touchstart', (e) => { e.preventDefault() }) // { passive: false }
```

When `passive` or other option is passed, their values will not be overwritten
```js
element.addEventListener('touchstart', handler, { passive: false }) // { passive: false }
element.addEventListener('touchstart', handler, { capture: true) // { capture: true, passive: true }
element.addEventListener('touchstart', handler, { capture: false, passive: false }) // { capture: false, passive: false }
```

### Forcing a certain value

As mentioned above in the **How it works** section, you can force specific `passive` value and it will not be overwritten by this package
```js
element.addEventListener('touchstart', handler) // { passive: true }
element.addEventListener('touchstart', handler, { passive: false }) // { passive: false }
```