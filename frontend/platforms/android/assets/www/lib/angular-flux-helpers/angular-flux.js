(function() {
  angular.module('ngFlux', []).
    factory('FluxUtil', FluxUtil).
    factory('FluxInvariant', FluxInvariant).
    factory('FluxDispatcher', FluxDispatcher).
    factory('FluxEventEmitter', FluxEventEmitter).
    factory('FluxStore', FluxStore).
    directive('localizeState', localizeState);

  function FluxUtil(FluxDispatcher, FluxStore) {
    var util = {
      defineConstants: function(constantNames) {
        var constants = {};
        angular.forEach(constantNames, (function(constantName) {
          constants[constantName] = constantName;
        }));

        return constants;
      },

      // Save the boilerplate of defining handleViewAction..
      //
      createDispatcher: function(options) {
        var dispatcher;

        // Default create a handleViewAction function
        options = options || {
          handleViewAction: function(action) {
            this.dispatch({
              source: 'VIEW_ACTION',
              action: action
            })
          },
          handleServerAction: function(action) {
            this.dispatch({
              source: 'SERVER_ACTION',
              action: action
            })
          }
        }

        dispatcher = angular.extend(FluxDispatcher.prototype, options);
        dispatcher.constructor();
        return dispatcher;
      },

      createStore: function(options) {
        return angular.extend(FluxStore, options);
      }
    }

    return util;
  }

  function FluxInvariant() {
    /**
     * Copyright (c) 2014, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @providesModule invariant
     */

    "use strict";

    /**
     * Use invariant() to assert state which your program assumes to be true.
     *
     * Provide sprintf-style format (only %s is supported) and arguments
     * to provide information about what broke and what you were
     * expecting.
     *
     * The invariant message will be stripped in production, but the invariant
     * will remain to ensure logic does not differ in production.
     */

    var invariant = function(condition, format, a, b, c, d, e, f) {
      if (false) {
        if (format === undefined) {
          throw new Error('invariant requires an error message argument');
        }
      }

      if (!condition) {
        var error;
        if (format === undefined) {
          error = new Error(
            'Minified exception occurred; use the non-minified dev environment ' +
            'for the full error message and additional helpful warnings.'
          );
        } else {
          var args = [a, b, c, d, e, f];
          var argIndex = 0;
          error = new Error(
            'Invariant Violation: ' +
            format.replace(/%s/g, function() { return args[argIndex++]; })
          );
        }

        error.framesToPop = 1; // we don't care about invariant's own frame
        throw error;
      }
    };

    return invariant;
  }


  function FluxDispatcher(FluxInvariant) {
    var invariant = FluxInvariant;
    var _lastID = 1;
    var _prefix = 'ID_';

    /**
     * Dispatcher is used to broadcast payloads to registered callbacks. This is
     * different from generic pub-sub systems in two ways:
     *
     *   1) Callbacks are not subscribed to particular events. Every payload is
     *      dispatched to every registered callback.
     *   2) Callbacks can be deferred in whole or part until other callbacks have
     *      been executed.
     *
     * For example, consider this hypothetical flight destination form, which
     * selects a default city when a country is selected:
     *
     *   var flightDispatcher = new Dispatcher();
     *
     *   // Keeps track of which country is selected
     *   var CountryStore = {country: null};
     *
     *   // Keeps track of which city is selected
     *   var CityStore = {city: null};
     *
     *   // Keeps track of the base flight price of the selected city
     *   var FlightPriceStore = {price: null}
     *
     * When a user changes the selected city, we dispatch the payload:
     *
     *   flightDispatcher.dispatch({
     *     actionType: 'city-update',
     *     selectedCity: 'paris'
     *   });
     *
     * This payload is digested by `CityStore`:
     *
     *   flightDispatcher.register(function(payload) {
     *     if (payload.actionType === 'city-update') {
     *       CityStore.city = payload.selectedCity;
     *     }
     *   });
     *
     * When the user selects a country, we dispatch the payload:
     *
     *   flightDispatcher.dispatch({
     *     actionType: 'country-update',
     *     selectedCountry: 'australia'
     *   });
     *
     * This payload is digested by both stores:
     *
     *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
     *     if (payload.actionType === 'country-update') {
     *       CountryStore.country = payload.selectedCountry;
     *     }
     *   });
     *
     * When the callback to update `CountryStore` is registered, we save a reference
     * to the returned token. Using this token with `waitFor()`, we can guarantee
     * that `CountryStore` is updated before the callback that updates `CityStore`
     * needs to query its data.
     *
     *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
     *     if (payload.actionType === 'country-update') {
     *       // `CountryStore.country` may not be updated.
     *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
     *       // `CountryStore.country` is now guaranteed to be updated.
     *
     *       // Select the default city for the new country
     *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
     *     }
     *   });
     *
     * The usage of `waitFor()` can be chained, for example:
     *
     *   FlightPriceStore.dispatchToken =
     *     flightDispatcher.register(function(payload) {
     *       switch (payload.actionType) {
     *         case 'country-update':
     *           flightDispatcher.waitFor([CityStore.dispatchToken]);
     *           FlightPriceStore.price =
     *             getFlightPriceStore(CountryStore.country, CityStore.city);
     *           break;
     *
     *         case 'city-update':
     *           FlightPriceStore.price =
     *             FlightPriceStore(CountryStore.country, CityStore.city);
     *           break;
     *     }
     *   });
     *
     * The `country-update` payload will be guaranteed to invoke the stores'
     * registered callbacks in order: `CountryStore`, `CityStore`, then
     * `FlightPriceStore`.
     */

      function Dispatcher() {
        this.$Dispatcher_callbacks = {};
        this.$Dispatcher_isPending = {};
        this.$Dispatcher_isHandled = {};
        this.$Dispatcher_isDispatching = false;
        this.$Dispatcher_pendingPayload = null;
      }

      /**
       * Registers a callback to be invoked with every dispatched payload. Returns
       * a token that can be used with `waitFor()`.
       *
       * @param {function} callback
       * @return {string}
       */
      Dispatcher.prototype.register=function(callback) {
        var id = _prefix + _lastID++;
        this.$Dispatcher_callbacks[id] = callback;
        return id;
      };

      /**
       * Removes a callback based on its token.
       *
       * @param {string} id
       */
      Dispatcher.prototype.unregister=function(id) {
        invariant(
          this.$Dispatcher_callbacks[id],
          'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
          id
        );
        delete this.$Dispatcher_callbacks[id];
      };

      /**
       * Waits for the callbacks specified to be invoked before continuing execution
       * of the current callback. This method should only be used by a callback in
       * response to a dispatched payload.
       *
       * @param {array<string>} ids
       */
      Dispatcher.prototype.waitFor=function(ids) {
        invariant(
          this.$Dispatcher_isDispatching,
          'Dispatcher.waitFor(...): Must be invoked while dispatching.'
        );
        for (var ii = 0; ii < ids.length; ii++) {
          var id = ids[ii];
          if (this.$Dispatcher_isPending[id]) {
            invariant(
              this.$Dispatcher_isHandled[id],
              'Dispatcher.waitFor(...): Circular dependency detected while ' +
              'waiting for `%s`.',
              id
            );
            continue;
          }
          invariant(
            this.$Dispatcher_callbacks[id],
            'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
            id
          );
          this.$Dispatcher_invokeCallback(id);
        }
      };

      /**
       * Dispatches a payload to all registered callbacks.
       *
       * @param {object} payload
       */
      Dispatcher.prototype.dispatch=function(payload) {
        invariant(
          !this.$Dispatcher_isDispatching,
          'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
        );
        this.$Dispatcher_startDispatching(payload);
        try {
          for (var id in this.$Dispatcher_callbacks) {
            if (this.$Dispatcher_isPending[id]) {
              continue;
            }
            this.$Dispatcher_invokeCallback(id);
          }
        } finally {
          this.$Dispatcher_stopDispatching();
        }
      };

      /**
       * Is this Dispatcher currently dispatching.
       *
       * @return {boolean}
       */
      Dispatcher.prototype.isDispatching=function() {
        return this.$Dispatcher_isDispatching;
      };

      /**
       * Call the callback stored with the given id. Also do some internal
       * bookkeeping.
       *
       * @param {string} id
       * @internal
       */
      Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
        this.$Dispatcher_isPending[id] = true;
        this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
        this.$Dispatcher_isHandled[id] = true;
      };

      /**
       * Set up bookkeeping needed when dispatching.
       *
       * @param {object} payload
       * @internal
       */
      Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
        for (var id in this.$Dispatcher_callbacks) {
          this.$Dispatcher_isPending[id] = false;
          this.$Dispatcher_isHandled[id] = false;
        }
        this.$Dispatcher_pendingPayload = payload;
        this.$Dispatcher_isDispatching = true;
      };

      /**
       * Clear bookkeeping used for dispatching.
       *
       * @internal
       */
      Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
        this.$Dispatcher_pendingPayload = null;
        this.$Dispatcher_isDispatching = false;
      };

      return Dispatcher;
  }

  function FluxEventEmitter() {
    /*!
     * EventEmitter v4.2.9 - git.io/ee
     * Oliver Caldwell
     * MIT license
     * @preserve
     */
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[key][i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    return EventEmitter;
  }

  function FluxStore(FluxEventEmitter) {
    return angular.extend(FluxEventEmitter.prototype, {
      bindToScope: function(scope, event, callback, options) {
        var self = this;

        self.on(event, callback);

        scope.$on('$destroy', function() {
          self.removeListener(event, callback)
        });
      },

      emitChange: function(data) {
        this.emit('change', data);
      },

      addChangeListener: function(callback) {
        this.on('change', callback)
      },

      removeChangeListener: function(callback) {
        this.removeListener('change', callback)
      },

      // A helper to add the change listener and remove it when the scope
      // is destroyed, so we don't go trying to update a scope that
      // doesn't exist anymore.
      //
      bindState: function(scope, callback, options) {
        var self = this;

        self.addChangeListener(callback);
        scope.$on('$destroy', function() { self.removeChangeListener(callback) });

        // Save the hassle of having to create a separate function, pass
        // it in to bindState, and then call it immediately on the scope
        // to sync - just do this by default. But can be disabled by
        // passing in {bindImmediately: false} as a third argument to
        // bindState.
        //
        options = options || { bindImmediately: true }
        if (options.bindImmediately === true) { callback(); }
      }
    });
  }

  // We want data to be able to propagate down onto the component, but we want
  // to control when any state changes from the component leave it, so we
  // create a copy of the object that we can edit locally and watch for changes
  // on the original, updating the copy when changes occur.
  //
  // <todo-list-item localize-state="{name: 'todo', value: todo}" ng-repeat="todo in todos">
  //
  // This creates $scope.todo that will update whenever the binding in the repeater updates,
  // but the changes that occur on $scope.todo from within the component do affect the repeater
  // binding directly.
  //
  function localizeState() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var syncLocalState = function() {
          scope[attrs.localizeState.name] = angular.copy(scope._localState);
        }

        scope._localState = attrs.localizeState.value;
        scope.$watch('_localState', syncLocalState, true);
        syncLocalState();
      }
    }
  }
})();
