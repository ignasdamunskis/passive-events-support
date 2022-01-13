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
import { passiveSupport } from 'passive-events-support/src/utils'
passiveSupport({/*...*/})
```

```html
<!-- With HTML -->
<script>
  window.passiveSupport = {/*...*/}
</script>
<script type="text/javascript" src="node_modules/passive-events-support/dist/main.js"></script>
```

By default, importing this package will not update non-passive event listeners. For this package to act, you must specify which event listeners should be made as passive. See the section below...

## Configuration

It is highly recommended to configure and only pass the custom list of event listeners, that trigger the console or Lighthouse warning.

### Configurable Options

| Option | Type | Default |
| --- | --- | --- |
| `debug` | `boolean` | `false` |
| `events` | `array` | `[]` |
| `listeners` | `array` | `[]` |

### Option: `debug`

When enabled, the event listeners updated by this package will be logged in the console.

```js
{
  debug: true
}
```

Console output

```js
{
  element: div.some-element
  event: 'touchstart'
  handler:
    fn: ƒ (e)
    fnArgument: 'e'
    fnContent: 'console.log(e)'
    fnPrevented: false
  oldArguments: false
  updatedArguments: { passive: true }
}
```

### Option: `events`

The list of events whose event listeners will have a `passive` option assigned with the value of `true` or `false` decided by the package.

Supported Events:

| Type | Events |
| --- | --- |
| Scroll | `scroll`, `wheel` |
| Touch | `touchstart`, `touchmove`, `touchenter`, `touchend`, `touchleave` |
| Mouse | `mouseout`, `mouseleave`, `mouseup`, `mousedown`, `mousemove`, `mouseenter`, `mousewheel`, `mouseover` |]

```js
{
  events: ['touchstart', 'touchmove']
}
```

Events that are not supported will be ignored.

Known `events` option issue:

While this option enables the package to assign the correct `passive` option value to all the event listeners for the listed events it also might break certain event listeners. The issue appear when `preventDefault()` is not being called from the handler itself, but rather from the another method called by the handler. In this case this package loses the track of `preventDefault()` and it marks the event listener as passive. This causes the event listener to break prompting an error message:

> Unable to preventDefault inside passive event listener invocation.

Luckilly, this can easilly be debugged in `debug` mode and fixed by the next `listeners` configuration option!

### Option: `listeners` (Recommended)

With this option, instead of certain events, you target certain event listeners.

When working altogether with `events` option, this option could be used to fix the event listeners broken by `events` option.

```js
{
  listeners: [
    {
      element: '.select-choice',
      event: 'touchstart',
      prevented: true // (optional) will force { passive: false }
    },
    {
      element: '.select-choice',
      event: 'touchmove'
    }
  ]
}
```

When `prevented` option is not presented, the package will calculate the `passive` value automatically as it is documented in the **How It Works** section.

Events that are not supported will be ignored.