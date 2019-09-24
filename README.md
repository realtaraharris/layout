# layout

## FAQ

### What is this?

A library that renders a component tree into a bitmap image

### What is this for?

Ultimately the goal is to provide an alternative view layer that runs equally well inside and outside the browser.

### What are the advantages of doing this?

1. Testing: unit testing of views is much faster and easier because you don't need to run them in a browser!
2. Customization: in the past, we've had to wait a decades for browsers to support things like flexbox and grid. In contrast, this system is extensible! You just write a new layout component (see `lib/components.js`) and call it a day!
3. App-centric: the legacy web was created for document authors. Obviously applications proved to be far more popular! This system doesn't try to get you to use cascading styles, event systems that don't fit the component model, etc. And vertical centering works out of the box, right from the very first commit.
4. Server-side rendering: Your app can be as slick as an iOS app if you render the initial state on the server and send that to the client first! (This removes a great deal of complexity on the client because the layout aspect doesn't have to deal with partially loaded "documents"!) To see this in action, just run the tests.

### What remains to be done?

1. ~~picking (we have everything required to resolve a click to a specific component)~~
2. demos (yes, there are tests, but tests aren't docs!)
3. accessibility
4. optimizations (there is plenty of room to do this!)
5. more layout components! (here's a demo I gave of a previous system: https://www.youtube.com/watch?v=RhTCbA8ic7o&t=1058s)
6. 100% stryker coverage. [blocked because stryker doesn't work well with tape. boo! ]
7. bug fixes
8. rewrite in Rust

### What about accessibility?

The plan is to render the tree into a form screen readers can use. There's an API for this: https://github.com/WICG/aom/blob/gh-pages/caniuse.md

If the AOM stuff isn't ready in time, one potential fallback is to render the tree into just enough HTML to drive a screen reader.
