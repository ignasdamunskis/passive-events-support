# passive-events-support

Make sure to import this script before any package or your code that is causing such warning.

### How it works
When event listener does not have a `passive` option, it will be added and its' value will depend on if event listener is calling preventDefault() or not.

#### When event listener is not calling `preventDefault()` and `passive` option is not passed, it will add a `{ passive: true }`
```js
element.addEventListener('touchstart', (e) => {}) // { passive: true }
```

#### When event listener is calling `preventDefault()` and `passive` option is not passed, it will add a `{ passive: false }`
```js
element.addEventListener('touchstart', (e) => { e.preventDefault() }) // { passive: false }
```

#### It will not modify or remove other event listener options
```js
element.addEventListener(event, (e) => {}, { capture: true }) // { capture: true, passive: true }
```

#### It will not modify passed 
```js
element.addEventListener(event, (e) => {}, { passive: false }) // { passive: false }
```