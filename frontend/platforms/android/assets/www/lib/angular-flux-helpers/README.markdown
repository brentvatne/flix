## Angular with Flux Architecture

An attempt to try out the Flux architecture with Angular... check out
`demos/simple-todo/index.html` & `demos/simple-todo/todo-app.js` for to
see it in action.

`angular-flux.js` contains the pieces that you need to get going with
the Flux architecture in Angular. Just download it and include it in
your app with the module `ngFlux`. Install it through bower with
`bower install angular-flux-helpers --save`.

- `FluxUtil` packages a couple of functions to reduce boilerplate
- `FluxUtil.defineConstants` defines constants for you.
- `FluxUtil.createDispatcher` creates a dispatcher from Facebook's
  `dispatcher.js` prototype and adds a `handleViewAction` function to
   it.
- `FluxUtil.createStore` creates an object based the node.js
  `EventEmitter` prototype, with a few useful helpers tacked on, such as
  `bindState(scope, callback)` that will add a change listener to the
  store and execute the callback on change - it also safely removes this
  listener when the scope is destroyed.
- The `localize-state` directive creates a one way data binding, so
  changes propagate down but not up, allowing you to keep the data in
  sync with wider application changes while controlling when the local
  state triggers an action.

Just read
[todo-app.js](https://github.com/brentvatne/angular-flux/blob/master/demos/simple-todo/todo-app.js)
and it will make sense if you're already familiar with the Flux
architecture.

## TODO

- Implement the
  [flux-chat](https://github.com/facebook/flux/tree/master/examples/flux-chat)
  example app
