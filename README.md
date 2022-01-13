# Passive Events Support

## Introduction

How many times have you yourself forgotten to make an event listener as `passive`, or installed a library such as **Bootstrap**, **jQuery** or **Materialize** and suddenly in the **Google Chrome** you see:

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
import 'passive-events-support' // or require
```

```html
<!-- With HTML -->
<script type="text/javascript" src="node_modules/passive-events-support/dist/main.js"></script>
```

By default, importing this package will automatically add the `passive` options to all the event listeners defined after the import.

### Default event list:

| Type | Events |
| --- | --- |
| Scroll | `scroll`, `wheel` |
| Touch | `touchstart`, `touchmove`, `touchenter`, `touchend`, `touchleave` |
| Mouse | `mouseout`, `mouseleave`, `mouseup`, `mousedown`, `mousemove`, `mouseenter`, `mousewheel`, `mouseover` |

While on small projects with no dependencies the default import might work like a charm, on a project with loaded 3rd parties, like **jQuery**, it might cause some of the event listeners break. See the exact issue and how to fix it in the sections below.

## Known Issue

This package with its' default behaviour will check if `preventDefault()` is being called by the handler itself and make listener as passive if not. The issue appear when `preventDefault()` is not being called from the handler itself, but rather from methods called by the handler. This will cause the event listener to break prompting an error message:

> Unable to preventDefault inside passive event listener invocation.

**Don't worry!**
This can be easilly fixed by just customizing the package! See the **Customization** section below.

## Customization

It is highly recommended to customize and only pass the custom list of events, that seem to trigger the warning, and custom list of prevented event listeners, that should not be marked as passive.
To do that, you just need to pass the object eith custom configurations:

```js
// With JS
import { passiveSupport } from 'passive-events-support/src/utils'
passiveSupport({
  debug: false,
  events: [/*...*/],
  preventedListeners: []
})
```

```html
<!-- With HTML -->
<script>
  window.passiveSupport = {
    debug: false,
    events: [/*...*/],
    preventedListeners: []
  }
</script>
<script type="text/javascript" src="node_modules/passive-events-support/dist/main.js"></script>
```

| Option | Type | Default |
| --- | --- | --- |
| `debug` | `boolean` | `false` |
| `events` | `array` | See the **Usage** section above |
| `preventedListeners` | `array` | `[]` |

### debug

This will log the event listeners updated by this package.

### events - the solution

The list of events whose listeners will have a `passive` option assigned.

### preventedListeners - the trouble fixer

The list of prevented event listeners without `passive` option. Here `passive: false` will be applied.

## An Example

```js
// With JS
import { passiveSupport } from 'passive-events-support/src/utils'
passiveSupport({
  events: ['touchstart', 'touchmove'],
  preventedListeners: [{
    element: '.select-choice',
    event: 'touchstart'
  }]
})
```

```html
<!-- With HTML -->
<script>
  window.passiveSupport = {
    events: ['touchstart', 'touchmove'],
    preventedListeners: [{
      element: '.select-choice',
      event: 'touchstart'
    }]
  }
</script>
<script type="text/javascript" src="node_modules/passive-events-support/dist/main.js"></script>
```

### This code will automatically add the `passive` option with the value of

`false` - for the `touchstart` event listener on `.select-choice` element and

`true` or `false` - for the rest of `touchstart` and `touchmove` event listeners depending on `preventDefault()` call.

### Output

```js
// The .select-choice element
const selectChoice = document.querySelector('.select-choice')
selectChoice.addEventListener('touchmove', handler) // { passive: true }
selectChoice.addEventListener('touchstart', handler) // { passive: false }
selectChoice.addEventListener('touchstart', handler, { passive: true }) // { passive: true }

// Any other element
const anyOtherElement = document.querySelector('.any-other-element')
anyOtherElement.addEventListener('touchmove', handler) // { passive: true }
anyOtherElement.addEventListener('touchstart', handler) // { passive: true }
anyOtherElement.addEventListener('touchstart', handler, { passive: false }) // { passive: false }
anyOtherElement.addEventListener('touchstart', (e) => { e.preventDefault() }) // { passive: false }
```

## Doing it manually

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
