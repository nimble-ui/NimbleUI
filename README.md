# NimbleUI
Declarative DOM Manipulation

## Why Another DOM Library?
NimbleUI is a new kind of library out there. It is declarative like React, but it does not use virtual DOM.
Under the hood, NimbleUI actually manipulates real DOM nodes, and it updates those nodes as needed like a neurosurgin removing cancer tumors from a patient's brain.
It is really like a group of neurosurgins were removing cancer tumors from a patient's brain that were assigned to each individual surgin.

## Benefits of NimbleUI
1. NimbleUI is built to be fast and efficient because there is no virtual DOM diffing needed.
2. NimbleUI is simple - there are only six functions that are used. ***six***.
3. NimbleUI has zero dependencies - everything is home-grown.

## How NimbleUI Works
NimbleUI has a basic concept: the renderer. A renderer is a function that takes a DOM node as a parameter and returns a set of lifecycle hooks. That's it.
```js
(root) => {
    // Step 1: Create the child node and mount it to `root`.
    //...
    return {
        update() {
            // Step 2: Update the child node as needed.
        },
        unmount() {
            // Step 2: Clean up and remove the child node from `root`.
        }
    }
}
```
That's how NimbleUI Works.
