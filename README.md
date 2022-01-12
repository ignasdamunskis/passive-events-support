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

By default, importing this package will automatically resolve the issue. The `passive` option will be assigned to all the listeners of these events:

| Type | Events |
| --- | --- |
| Scroll | `scroll`, `wheel` |
| Touch | `touchstart`, `touchmove`, `touchenter`, `touchend`, `touchleave` |
| Mouse | `mouseout`, `mouseleave`, `mouseup`, `mousedown`, `mousemove`, `mouseenter`, `mousewheel`, `mouseover` |

> **Warning!** It is highly recommended to pass only the elements and events that cause the issue to decrease the possibility of incompatibility. See the section below...

## Customization

It is recommended to customize and only pass the elements and events that seems to trigger the warning. Sometimes the default installation might cause an issue for listeners that call `preventDefault()` way too deep in the handler. i.e. handler calls another method where `preventDefault()` is called... Some real life scenarios:

- For **Materialize CSS** just `touchstart`, `touchmove` and `touchend` were needed. It worked fine with all the default events tho.
- For **jQuery** just `touchstart`, `touchmove` and `mousewheel` were needed. Depends on **jQuery** plugins in use (i.e. **Select2**).
- For **Select2** just `touchstart` and `touchmove` were needed. It worked fine with all the default events except `touchstart`. See the **Debugging** section at the end to see how to find out which event is breaking for which element.

### 1. Fixing certain events

To customize the event list, you will need to pass an array of events manually:

```js
import { passiveSupport } from 'passive-events-support/src/utils'

passiveSupport(['touchmove', 'mousewheel'])
```

```html
<script>
  window.passiveEvents = ['touchmove', 'mousewheel']
</script>
<script type="text/javascript" src="node_modules/passive-events-support/dist/main.js"></script>
```

### 2. Ignoring certain elements

### 3. Fixing certain event listeners

In case you want to add `passive` option manually to a certain event listener, use `passiveSupported($debug = false)` helper to find out if `passive` option is even supported by your browser:

```js
import { passiveSupported } from 'passive-events-support/src/utils'

element.addEventListener('touchstart', handler, passiveSupported() ? { passive: true } : false)
```

```html
<script type="text/javascript" src="node_modules/passive-events-support/dist/main.js"></script>
<script>
  element.addEventListener('touchstart', handler, window.passiveSupported ? { passive: true } : false)
</script>
```

### 4. Debugging

If you want to debug which event listeners are being updated, pass `true` as the second argument after the event list:

```js
import { passiveSupport } from 'passive-events-support/src/utils'

$events = null // will use default list when null passed
$debug = true // will console log updated event listeners
passiveSupport($events, $debug)
```

```html
<script>
  window.passiveDebug = true // will console log updated event listeners
</script>
<script type="text/javascript" src="node_modules/passive-events-support/dist/main.js"></script>
```

If this package breaks any component upon interaction, or you get such error like:

> Unable to preventDefault inside passive event listener invocation.

Enable debugging as shown in the **Customization** section above and find out which event is failing so you could remove it from the event list provided to `passiveSupport()`.