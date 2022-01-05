# passive-events-support

# If event listener is not prevented
element.addEventListener(event, (e) => {})
element.addEventListener(event, (e) => {}, { passive: true })

# If event listener is prevented
element.addEventListener(event, (e) => { e.preventDefault() })
element.addEventListener(event, (e) => { e.preventDefault() }, { passive: false })

# It does not modify or remove other listener options 
element.addEventListener(event, (e) => {}, { capture: true })
element.addEventListener(event, (e) => {}, { capture: true, passive: true })