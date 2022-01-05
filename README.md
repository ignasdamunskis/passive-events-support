# passive-events-support

### How it works
#### When event listener does not have a passive option, it will be added depending on if event listener is calling preventDefault() or not
###### When event listener is not calling preventDefault():
```
element.addEventListener(event, (e) => {})
// Becomes
element.addEventListener(event, (e) => {}, { passive: true })
```

###### When event listener is calling preventDefault():
element.addEventListener(event, (e) => { e.preventDefault() })
element.addEventListener(event, (e) => { e.preventDefault() }, { passive: false })

###### When other options are passed, they will not be modified or removed
element.addEventListener(event, (e) => {}, { capture: true })
element.addEventListener(event, (e) => {}, { capture: true, passive: true })

###### When passive option is passed, it will not be modified
element.addEventListener(event, (e) => {}, { passive: false })
element.addEventListener(event, (e) => {}, { passive: false })