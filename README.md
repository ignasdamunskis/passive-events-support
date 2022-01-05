# passive-events-support

### How it works

#### When event listener does not have a passive option
It will be automatically added depending if event listener is prevented or not
###### When event listener is not prevented
element.addEventListener(event, (e) => {})
element.addEventListener(event, (e) => {}, { passive: true })

###### When event listener is prevented
element.addEventListener(event, (e) => { e.preventDefault() })
element.addEventListener(event, (e) => { e.preventDefault() }, { passive: false })

###### When other options are passed, they will not be modified or removed
element.addEventListener(event, (e) => {}, { capture: true })
element.addEventListener(event, (e) => {}, { capture: true, passive: true })

###### When passive option is passed, it will not be modified
element.addEventListener(event, (e) => {}, { passive: false })
element.addEventListener(event, (e) => {}, { passive: false })