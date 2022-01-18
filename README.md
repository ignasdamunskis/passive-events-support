# Passive Events Support

- [Introduction](#introduction)
  - [The Issue](#the-issue)
  - [What's a passive option?](#whats-a-passive-option)
  - [Why is it necessary?](#why-is-it-necessary)
  - [The solution](#the-solution)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Configurable Options](#configurable-options)
    - [Option: debug](#option-debug)
    - [Option: events](#option-events)
    - [Option: listeners (Recommended)](#option-listeners-recommended)
  - [Supported Events](#supported-events)
  - [Known Issue](#known-events-option-issue)
- [Browser Support](#browser-support)
  - [Debugging the browser support](#debugging-the-browser-support)
  - [Manually assigning the passive option](#manually-assigning-the-passive-option)

## Introduction

### The Issue

How many times have you yourself forgotten to make an event listener as `passive`, or installed a library such as **Bootstrap**, **jQuery** or **Materialize** and suddenly in the **Google Chrome** you see:

> **[Violation]** Added non-passive event listener to a scroll-blocking `'touchstart'` event. Consider marking event handler as `passive` to make the page more responsive.

Or when running **Lighthouse** you get a lower score with a message:

> Does not use passive listeners to improve scrolling performance
>
> Consider marking your `touch` and `wheel` event listeners as `passive` to improve your page's scroll performance.

### What's a `passive` option?

According to [Official Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#parameters) a `passive` option is:

> A boolean value that, if true, indicates that the function specified by listener will never call preventDefault(). If a passive listener does call preventDefault(), the user agent will do nothing other than generate a console warning.

### Why is it necessary?

It is well docummented that:

> According to the specification, the default value for the passive option is always false. However, this introduces the potential for event listeners handling certain touch events (among others) to block the browser's main thread while it is attempting to handle scrolling, resulting in possibly enormous reduction in performance during scroll handling.

See [Improving scrolling performance with passive listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners) to learn more.

### The solution

Making event listeners as `passive` manually could be a repetetive and time consuming experience. Also if caused by a 3rd party, modifying it's source code should never be an option!

Here comes the **Passive Events Support** package! This is the package that will help you debug the source, solve the issue, but also improve the performance. It is flexible and highly configurable package!

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

By default, importing this package will not update non-passive event listeners. For this package to act, you must specify which event listeners should be made as passive. See the [Configuration](#configuration) section below.

## Configuration

It is highly recommended to configure and only pass the custom list of event listeners, that trigger the console or Lighthouse warning.

### Configurable Options

| Option | Type | Default |
| --- | --- | --- |
| `debug` | `boolean` | `false` |
| `events` | `array` | `[]` |
| `listeners` | `array` | `[]` |

### Option: `debug`

When enabled, all the non-passive event listeners will be console logged.

```js
{
  debug: true
}
```

Console output

```js
[Passive Events Support] Non-passive Event Listener
  element: div.some-element
  event: 'touchstart'
  handler:
    fn: ƒ (e)
    fnArgument: 'e'
    fnContent: 'console.log(e)'
    fnPrevented: false
  arguments: false
  updatedArguments: { passive: true }
```

The `updatedArguments` parameter will be shown only if the event listener was updated by this package.

### Option: `events`

The list of events whose event listeners will have a `passive` option assigned with the value of `true` or `false` decided by the package as it is documented in the [How It Works](#how-it-works) section.

#### Supported Events:

| Type | Events |
| --- | --- |
| Touch | `touchstart`, `touchmove`, `touchenter`, `touchend`, `touchleave` |
| Wheel | `wheel`, `mousewheel` |

```js
{
  events: ['touchstart', 'touchmove']
}
```

Events that are not supported will be ignored.

#### Known `events` option issue:

While this option enables the package to assign the correct `passive` option value to all the event listeners for the listed events it also might break certain event listeners. The issue appear when `preventDefault()` is not being called from the handler itself, but rather from the another method called by the handler. In this case this package loses the track of `preventDefault()` and it marks the event listener as passive. This causes the event listener to break prompting an error message:

> Unable to preventDefault inside passive event listener invocation.

Luckilly, this can easilly be debugged in `debug` mode and fixed by the `listeners` configuration option!

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

When `prevented` option is not presented, the package will calculate the `passive` value automatically as it is documented in the [How It Works](#how-it-works) section.

Events that are not supported will be ignored. See [supported events](#supported-events) list.

## Browser Support

Even tho the `passive` option is not supported by all the browsers (see [Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#browser_compatibility)), this package, by default, checks the browser support for `passive` option before assigning it.

### Debugging the browser support

You can yourself access the variable indicating the support:

```js
// With JS
import { passiveSupported } from 'passive-events-support/src/utils'
console.log(passiveSupported())
```

```html
<!-- With HTML -->
<script type="text/javascript" src="node_modules/passive-events-support/dist/main.js"></script>
<script>
  console.log(window.passiveSupported)
</script>
```

### Manually assigning the passive option

You, just like this package, yourself can manually add the passive option:

```js
// use window.passiveSupported if imported with <script>
element.addEventListener('tocuhstart', handler, passiveSupported() ? { passive: true } : false)
```