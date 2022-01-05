# Passive Events Support

## Introduction

How many times have you installed a library such as **Bootstrap**, **jQuery**, **Materialize CSS** or other and suddenly in the **Google Chrome** console you're prompted with a warning:

> [Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event. Consider marking event handler as 'passive' to make the page more responsive.

Or when running **Lighthouse** you get a lower score with a message:

> **Does not use passive listeners to improve scrolling performance**
>
> Consider marking your touch and wheel event listeners as `passive` to improve your page's scroll performance.

With many bad practice advices online, it is frustrating to find a proper solution that does not only hide the warnings, but also improves scrolling performance.

Common suggestion is to modify 3rd party source code and assign `passive` option manually. Despite the fact that you should never modify 3rd party source code, searching event listeners and assigning certain `passive` value depending on `preventDefault()` usage is a time consuming experience.

Another suggestion is to apply `passive: false` to all the event listeners that cause the warning. The warning will be gone, but the performance will not be improved whatsoever. What's the point then? On the other side, blindly assigning `passive: true` to all the event listeners manually or with a package such as `default-passive-events` will lead you to nothing else but errors in case of `preventDefault()` usage.

Here comes **Passive Events Support**. This is the package that will not only solve the issue, but also improve the performance.

## How it works

When event listener does not have a `passive` option, it will be added and its value will depend on whether `preventDefault()` is called or not.

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

### JS

```js
require 'passive-events-support'
// or
import 'passive-events-support'
```

### HTML

```html
<script type="text/javascript" src="node_modules/passive-events-support/dist/main.js"></script>
```

With this code the default behaviour will be applied, `passive` option will be added automatically to all the listeners defined after the import.

## Default behaviour

By default, importing this package will automatically resolve the issue. The `passive` option will be assigned to these events:

| Type | Events |
| --- | --- |
| Scroll | `scroll`, `wheel` |
| Touch | `touchstart`, `touchmove`, `touchenter`, `touchend`, `touchleave` |
| Mouse | `mouseout`, `mouseleave`, `mouseup`, `mousedown`, `mousemove`, `mouseenter`, `mousewheel`, `mouseover` |

## Customization

In case you want to customize the event list, you will need to pass an array of events manually:

```js
import { passiveSupport } from 'passive-events-support/src/utils'

passiveSupport(['touchstart', 'touchmove'])
```

```html
<script>
  window.passiveEvents = ['touchstart', 'touchmove']
</script>
<script type="text/javascript" src="node_modules/passive-events-support/dist/main.js"></script>
```