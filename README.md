# Passive Events Support

## Introduction

How many times have you yourself forgotten to make an event listener as `passive`, or installed a library such as **Bootstrap**, **jQuery** or **Materialize** and suddenly in the **Google Chrome** console you're prompted a warning:

> **[Violation]** Added non-passive event listener to a scroll-blocking `'touchstart'` event. Consider marking event handler as `passive` to make the page more responsive.

Or when running **Lighthouse** you get a lower score with a message:

> Does not use passive listeners to improve scrolling performance
>
> Consider marking your `touch` and `wheel` event listeners as `passive` to improve your page's scroll performance.

Making event listeners as `passive` manually could be a repetetive and time consuming experience. Also if caused by a 3rd party, modifying its' source code should never be an option!

Here comes the **Passive Events Support**! This is the package that will help you debug the source, solve the issue, but also improve the performance. It is flexible and highly configurable package!

## How it works

When event listener does not have a `passive` option, it will be added and its value will depend on whether `preventDefault()` is being called in the handler or not.

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
element.addEventListener('touchstart', handler) // { passive: true }
element.addEventListener('touchstart', handler, { passive: false }) // { passive: false }
element.addEventListener('touchstart', handler, { capture: true) // { capture: true, passive: true }
element.addEventListener('touchstart', handler, { capture: false, passive: false }) // { capture: false, passive: false }
```

## Installation

```bash
yarn add passive-events-support
```

## Usage

This package must be imported before any package or code that is causing an issue or Lighthouse warning.

```js
// With JS
import 'passive-events-support'
// or
require 'passive-events-support'
```

```html
<!-- With HTML -->
<script type="text/javascript" src="node_modules/passive-events-support/dist/main.js"></script>
```

By default, importing this package will automatically make all the event listeners, for the events listed below, as passive.

| Type | Events |
| --- | --- |
| Scroll | `scroll`, `wheel` |
| Touch | `touchstart`, `touchmove`, `touchenter`, `touchend`, `touchleave` |
| Mouse | `mouseout`, `mouseleave`, `mouseup`, `mousedown`, `mousemove`, `mouseenter`, `mousewheel`, `mouseover` |

While on small projects with no dependencies the default import might work like a charm, on a project with loaded 3rd parties, like **jQuery**, it might not work and cause some of the event listeners break. See the exact issues and how to fix it in the sections below.

## Know Issues

This package with its' default behaviour will check if `preventDefault()` is being called by the handler itself and make listener as passive if not. But what happens if the handler calls another method and only that method calls the `preventDefault()`? This event listener will break prompting an error message:

> Unable to preventDefault inside passive event listener invocation.

But don't worry! This can be debugged and easilly fixed by just configuring the package! See the **Customization** section below...

## Customization

It is highly recommended to customize and only pass the custom list of events, that seems to trigger the warning, and custom list of prevented event listeners, that should not be marked as passive.

But, how do I know which event listeners should I make as passive?

### 1. Debugging

If you want to debug which event listeners are being updated, pass `true` as the second argument after the event list:

```js
// With JS
import { passiveSupport } from 'passive-events-support/src/utils'
passiveSupport({ debug: true })
```

```html
<!-- With HTML -->
<script>
  window.passiveDebug = true // will console log updated event listeners
</script>
<script type="text/javascript" src="node_modules/passive-events-support/dist/main.js"></script>
```

### 2. Custom events

**Real life scenario:**
when using **Materialize**, even tho it works fine with the default event list, just `touchstart` and `touchmove` events are being used by **Materialize** to define non-passive event listeners.

The solution would be to manually pass a custom event list:

```js
// With JS
import { passiveSupport } from 'passive-events-support/src/utils'
passiveSupport({ events: ['touchstart', 'touchmove'] })
```

```html
<!-- With HTML -->
<script>
  window.passiveEvents = ['touchstart', 'touchmove']
</script>
<script type="text/javascript" src="node_modules/passive-events-support/dist/main.js"></script>
```

### 3. Prevented event listeners

**Real life scenario:**
when using **jQuery** and **Select2** just `touchstart`, `touchmove` and `mousewheel` are being used to define non-passive event listeners. The `touchstart` event by **Select2** is used to define an event listener that actually does `preventDefault()`, but is not caught by default configuration, so the event listener is incorrectly being marked as passive causing the select element to break...

To fix this issue we can manually pass the list of event listeners that should never be marked as passive:

```js
// With JS
import { passiveSupport } from 'passive-events-support/src/utils'
passiveSupport({
  events: ['touchstart', 'touchmove', 'mousewheel'],
  preventedListeners: [{
    element: '.select-choice',
    event: 'touchstart'
  }]
})
```

```html
<!-- With HTML -->
<script>
  window.passiveEvents = ['touchstart', 'touchmove', 'mousewheel']
  window.passivePreventedListeners = [{
    element: '.select-choice',
    event: 'touchstart'
  }]
</script>
```

### 4. Manually marking certain event listeners as passive

In case you want to add `passive` option manually to a certain event listener, use `passiveSupported($debug = false)` helper to find out if `passive` option is even supported by your browser:

```js
// With JS
import { passiveSupported } from 'passive-events-support/src/utils'
element.addEventListener('touchstart', handler, passiveSupported() ? { passive: true } : false)
```

```html
<!-- With HTML -->
<script type="text/javascript" src="node_modules/passive-events-support/dist/main.js"></script>
<script>
  element.addEventListener('touchstart', handler, window.passiveSupported ? { passive: true } : false)
</script>
```