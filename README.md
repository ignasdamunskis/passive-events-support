# passive-events-support

Make sure to import this script before any package or your code that is causing such warning.

### How it works
#### When event listener does not have a passive option, it will be added depending on if event listener is calling preventDefault() or not

- When event listener is not calling `preventDefault()` and `passive` option is not passed, it will add a `passive: true`:
```
element.addEventListener('touchstart', (e) => {}) // { passive: true }
```

- When event listener is calling `preventDefault()` and `passive` option is not passed, it will add a `passive: false`:
```
element.addEventListener('touchstart', (e) => { e.preventDefault() }) // { passive: false }
```

- When other options are passed, they will not be modified or removed
```
element.addEventListener(event, (e) => {}, { capture: true }) // { capture: true, passive: true }
```

- When passive option is passed, it will not be modified
```
element.addEventListener(event, (e) => {}, { passive: false }) // { passive: false }
```