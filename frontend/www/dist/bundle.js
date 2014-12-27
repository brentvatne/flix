(function(ionic) {

  // Get transform origin poly
  var d = document.createElement('div');
  var transformKeys = ['webkitTransformOrigin', 'transform-origin', '-webkit-transform-origin', 'webkit-transform-origin',
              '-moz-transform-origin', 'moz-transform-origin', 'MozTransformOrigin', 'mozTransformOrigin'];

  var TRANSFORM_ORIGIN = 'webkitTransformOrigin';
  for(var i = 0; i < transformKeys.length; i++) {
    if(d.style[transformKeys[i]] !== undefined) {
      TRANSFORM_ORIGIN = transformKeys[i];
      break;
    }
  }

  var transitionKeys = ['webkitTransition', 'transition', '-webkit-transition', 'webkit-transition',
              '-moz-transition', 'moz-transition', 'MozTransition', 'mozTransition'];
  var TRANSITION = 'webkitTransition';
  for(var i = 0; i < transitionKeys.length; i++) {
    if(d.style[transitionKeys[i]] !== undefined) {
      TRANSITION = transitionKeys[i];
      break;
    }
  }

  var SwipeableCardView = ionic.views.View.inherit({
    /**
     * Initialize a card with the given options.
     */
    initialize: function(opts) {
      opts = ionic.extend({
      }, opts);

      ionic.extend(this, opts);

      this.el = opts.el;

      this.parentWidth = this.el.parentNode.offsetWidth;
      this.width = this.el.offsetWidth;

      this.startX = this.startY = this.x = this.y = 0;

      this.bindEvents();
    },

    /**
     * Set the X position of the card.
     */
    setX: function(x) {
      this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + x + 'px,' + this.y + 'px, 0)';
      this.x = x;
      this.startX = x;
    },

    /**
     * Set the Y position of the card.
     */
    setY: function(y) {
      this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + this.x + 'px,' + y + 'px, 0)';
      this.y = y;
      this.startY = y;
    },

    /**
     * Set the Z-Index of the card
     */
    setZIndex: function(index) {
      this.el.style.zIndex = index;
    },

    /**
     * Set the width of the card
     */
    setWidth: function(width) {
      this.el.style.width = width + 'px';
    },

    /**
     * Set the height of the card
     */
    setHeight: function(height) {
      this.el.style.height = height + 'px';
    },

    /**
     * Set the duration to run the pop-in animation
     */
    setPopInDuration: function(duration) {
      this.cardPopInDuration = duration;
    },

    /**
     * Transition in the card with the given animation class
     */
    transitionIn: function(animationClass) {
      var self = this;

      this.el.classList.add(animationClass + '-start');
      this.el.classList.add(animationClass);
      this.el.style.display = 'block';
      setTimeout(function() {
        self.el.classList.remove(animationClass + '-start');
      }, 100);
    },

    /**
     * Disable transitions on the card (for when dragging)
     */
    disableTransition: function(animationClass) {
      this.el.classList.remove(animationClass);
    },

    /**
     * Swipe a card out programtically
     */
    swipe: function() {
      this.transitionOut();
    },

    isUnderThreshold: function() {
      //return true;
      return Math.abs(this.thresholdAmount) < 0.4;
    },
    /**
     * Fly the card out or animate back into resting position.
     */
    transitionOut: function(e) {
      var self = this;

      if(this.isUnderThreshold()) {
        self.onSnapBack(this.x, this.y, this.rotationAngle);
        return;
      }

      var angle = Math.atan(e.gesture.deltaX / e.gesture.deltaY);

      var dir = this.thresholdAmount < 0 ? -1 : 1;
      var targetX;
      if(this.x > 0) {
        targetX = (this.parentWidth / 2) + (this.width);
      } else {
        targetX = - (this.parentWidth + this.width);
      }

      // Target Y is just the "opposite" side of the triangle of targetX as the adjacent edge (sohcahtoa yo)
      var targetY = targetX / Math.tan(angle);

      // Fly out
      var rotateTo = this.rotationAngle;//(this.rotationAngle this.rotationDirection * 0.2));// || (Math.random() * 0.4);

      var duration = 0.3 - Math.min(Math.max(Math.abs(e.gesture.velocityX)/10, 0.05), 0.2);

      ionic.requestAnimationFrame(function() {
        self.el.style.transform = self.el.style.webkitTransform = 'translate3d(' + targetX + 'px, ' + targetY + 'px,0) rotate(' + self.rotationAngle + 'rad)';
        self.el.style.transition = self.el.style.webkitTransition = 'all ' + duration + 's ease-in-out';
      });

      //this.onSwipe && this.onSwipe();

      if (dir > 0 && self.myOnSwipeRight) {
        self.myOnSwipeRight();
      } else if (dir < 0 && self.myOnSwipeLeft) {
        self.myOnSwipeLeft();
      }


      // Trigger destroy after card has swiped out
      setTimeout(function() {
        self.onDestroy && self.onDestroy();
      }, duration * 1000);
    },

    /**
     * Bind drag events on the card.
     */
    bindEvents: function() {
      var self = this;
      ionic.onGesture('dragstart', function(e) {
        /*
        var cx = window.innerWidth / 2;
        if(e.gesture.touches[0].pageX < cx) {
          self._transformOriginRight();
        } else {
          self._transformOriginLeft();
        }
        */
        ionic.requestAnimationFrame(function() { self._doDragStart(e) });
      }, this.el);

      ionic.onGesture('drag', function(e) {
        ionic.requestAnimationFrame(function() { self._doDrag(e) });
      }, this.el);

      ionic.onGesture('dragend', function(e) {
        ionic.requestAnimationFrame(function() { self._doDragEnd(e) });
      }, this.el);
    },

    // Rotate anchored to the left of the screen
    _transformOriginLeft: function() {
      this.el.style[TRANSFORM_ORIGIN] = 'left center';
      this.rotationDirection = 1;
    },

    _transformOriginRight: function() {
      this.el.style[TRANSFORM_ORIGIN] = 'right center';
      this.rotationDirection = -1;
    },

    _doDragStart: function(e) {
      e.preventDefault();
      var width = this.el.offsetWidth;
      var point = window.innerWidth / 2 + this.rotationDirection * (width / 2)
      var distance = Math.abs(point - e.gesture.touches[0].pageX);// - window.innerWidth/2);

      this.touchDistance = distance * 10;
    },

    _doDrag: function(e) {
      e.preventDefault();

      var o = e.gesture.deltaX / -1000;

      this.rotationAngle = Math.atan(o);

      this.x = this.startX + (e.gesture.deltaX * 0.8);
      this.y = this.startY + (e.gesture.deltaY * 0.8);

      this.el.style.transform = this.el.style.webkitTransform = 'translate3d(' + this.x + 'px, ' + this.y  + 'px, 0) rotate(' + (this.rotationAngle || 0) + 'rad)';


      this.thresholdAmount = (this.x / (this.parentWidth/2));

      var self = this;
      setTimeout(function() {
        self.onPartialSwipe(self.thresholdAmount);
      });
    },
    _doDragEnd: function(e) {
      this.transitionOut(e);
    }
  });


  angular.module('ionic.contrib.ui.tinderCards', ['ionic'])

  .directive('tdCard', ['$timeout', function($timeout) {
    return {
      restrict: 'E',
      template: '<div class="swipe-card" ng-transclude></div>',
      require: '^tdCards',
      transclude: true,
      scope: {
        myOnSwipeLeft: '&',
        myOnSwipeRight: '&',
        onPartialSwipe: '&',
        onSnapBack: '&',
        onDestroy: '&'
      },
      compile: function(element, attr) {
        return function($scope, $element, $attr, swipeCards) {
          var el = $element[0];

          // Instantiate our card view
          var swipeableCard = new SwipeableCardView({
            el: el,
            onPartialSwipe: function(amt) {
              swipeCards.partial(amt);
              $timeout(function() {
                $scope.leftTextOpacity = {
                  'opacity': amt > 0 ? amt : 0
                };
                $scope.rightTextOpacity = {
                  'opacity': amt < 0 ? Math.abs(amt) : 0
                };

                $scope.onPartialSwipe({amt: amt});
              });
            },
            myOnSwipeRight: function() {
              $timeout(function() {
                $scope.myOnSwipeRight();
              });
            },
            myOnSwipeLeft: function() {
              $timeout(function() {
                $scope.myOnSwipeLeft();
              });
            },
            onDestroy: function() {
              $timeout(function() {
                $scope.onDestroy();
              });
            },
            onSnapBack: function(startX, startY, startRotation) {
              var leftText = el.querySelector('.yes-text');
              var rightText = el.querySelector('.no-text');

              var animation = collide.animation({
                // 'linear|ease|ease-in|ease-out|ease-in-out|cubic-bezer(x1,y1,x2,y2)',
                // or function(t, duration),
                // or a dynamics configuration (see below)
                duration: 500,
                percent: 0,
                reverse: false
              })

              .easing({
                type: 'spring',
                frequency: 15,
                friction: 250,
                initialForce: false
              })

              .on('step', function(v) {
                //Have the element spring over 400px
                el.style.transform = el.style.webkitTransform = 'translate3d(' + (startX - startX*v) + 'px, ' + (startY - startY*v) + 'px, 0) rotate(' + (startRotation - startRotation*v) + 'rad)';
                if (rightText != null) {
                  rightText.style.opacity = Math.max(rightText.style.opacity - rightText.style.opacity * v, 0);
                }
                if (leftText != null) {
                  leftText.style.opacity = Math.max(leftText.style.opacity - leftText.style.opacity * v, 0);
                }
              })
              .start();
              /*
              animateSpringViaCss(el, 0, 0.5, 50, 700, 10, function (x) {
                return el.style.transform = el.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
              });
              */
            },
          });
          $scope.$parent.swipeCard = swipeableCard;
        }
      }
    }
  }])

  .directive('tdCards', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    return {
      restrict: 'E',
      template: '<div class="td-cards" ng-transclude></div>',
      transclude: true,
      scope: {},
      controller: function($scope, $element) {
        var cards;
        var firstCard, secondCard, thirdCard;

        var existingCards, card;

        var i, j;

        var sortCards = function() {
          existingCards = $element[0].querySelectorAll('td-card');

          for(i = 0; i < existingCards.length; i++) {
            card = existingCards[i];
            if(!card) continue;
            if(i > 0) {
              card.style.transform = card.style.webkitTransform = 'translate3d(0, ' + (i * 4) + 'px, 0)';
            }
            card.style.zIndex = (existingCards.length - i);
          }
        };

        $timeout(function() {
          sortCards();
        });

        var bringCardUp = function(card, amt, max) {
          var position, top, newTop;
          position = card.style.transform || card.style.webkitTransform;
          top = parseInt(position && position.split(',')[1] || 0);
          newTop = Math.max(0, Math.min(max, max - (max * Math.abs(amt))));
          card.style.transform = card.style.webkitTransform = 'translate3d(0, ' + newTop + 'px, 0)';
        };

        this.partial = function(amt) {
          cards = $element[0].querySelectorAll('td-card');
          firstCard = cards[0];
          secondCard = cards[1];
          thirdCard = cards[2];
          if(!secondCard) { return; }

          bringCardUp(secondCard, amt, 4);
          bringCardUp(thirdCard, amt, 8);
        };
      }
    }
  }])

  .factory('TDCardDelegate', ['$rootScope', function($rootScope) {
    return {
      popCard: function($scope, isAnimated) {
        $rootScope.$emit('tdCard.pop', isAnimated);
      },
      getSwipebleCard: function($scope) {
        return $scope.$parent.swipeCard;
      }
    }
  }]);

})(window.ionic);

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

(function() {
  var app = angular.module('app',
    ['ionic',
     'ngCordova',
     'ngStorage',
     'ngFlux',
     'ionic.contrib.ui.tinderCards',
     'auth0',
     'angular-jwt'])

  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

  app.config(function($httpProvider) {
    $httpProvider.interceptors.push('regionHttpInterceptor')
  });

  app.filter('unsafe', function($sce) { return $sce.trustAsHtml; });
})();

(function() {
  var Actions = function(FlixApi, Store, Dispatcher, ApiConstants, AppConstants, auth) {
    return {
      logIn: function(profile, token, accessToken, state, refreshToken) {
        payload = {
          actionType: AppConstants.SET_CURRENT_USER,
          data: {
            profile: profile,
            token: token,
            accessToken: accessToken,
            refreshToken: refreshToken,
            state: state
          }
        }

        Dispatcher.handleServerAction(payload);
      },

      logOut: function() {
        payload = {
          actionType: AppConstants.LOG_OUT
        }

        Dispatcher.handleViewAction(payload);
        auth.signout();
      },

      updateAuthToken: function(newToken) {
        payload = {
          actionType: AppConstants.UPDATE_AUTH_TOKEN,
          data: {
            token: newToken
          }
        }

        Dispatcher.handleServerAction(payload);
      },

      resetPreferences: function() {
        payload = {
          actionType: AppConstants.RESET_PREFS
        }

        Dispatcher.handleViewAction(payload);
      },

      updatePrefs: function(prefs) {
        payload = {
          actionType: AppConstants.UPDATE_PREFS,
          newPrefs: prefs
        }

        Dispatcher.handleViewAction(payload);
      },

      fetchShows: function() {
        var userEmail = (Store.getCurrentUser() || {}).email,
            prefs = Store.getPrefs();

        FlixApi.fetchShows(prefs, userEmail);
      },

      fetchLikedShows: function() {
        var userEmail = (Store.getCurrentUser() || {}).email;

        FlixApi.fetchLikedShows(userEmail);
      },

      likeShow: function(showId) {
        var userEmail = (Store.getCurrentUser() || {}).email;
        FlixApi.likeShow(showId, userEmail);
      },

      dislikeShow: function(showId) {
        var userEmail = (Store.getCurrentUser() || {}).email;
        FlixApi.dislikeShow(showId, userEmail);
      }
    }
  }

  angular.module('app').factory('Actions', Actions)
})();

(function() {
  var app = angular.module('app')

  // Config the auth provider
  //
  app.config(function($stateProvider, $urlRouterProvider, authProvider, $httpProvider, jwtInterceptorProvider, AUTH0_CLIENT_ID, AUTH0_DOMAIN) {
    authProvider.init({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      callbackURL: location.href,
      loginState: 'login'
    });
  })

  app.run(function(auth) {
    auth.hookEvents();
  })

  // Add an interceptor with the token
  //
  app.config(function (authProvider, $httpProvider, jwtInterceptorProvider) {
    jwtInterceptorProvider.tokenGetter = function(Store, Actions, jwtHelper, auth) {
      var currentUser = Store.getCurrentUser(),
          token = currentUser && currentUser.token,
          refreshToken = currentUser && currentUser.refreshToken;

      if ((!currentUser || currentUser == {}) || !token || !refreshToken) {
        return null;
      } else {
        if (jwtHelper.isTokenExpired(token)) {
          return auth.refreshIdToken(refreshToken).then(function(token) {
            Actions.updateAuthToken(token);
            return token;
          });
        } else {
          return token;
        }
      }
    }

    $httpProvider.interceptors.push('jwtInterceptor');
  });

  app.run(function($rootScope, auth, Store, jwtHelper, $location, Actions) {
    // This events gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function() {
      if (!auth.isAuthenticated) {
        var currentUser = Store.getCurrentUser(),
            token = currentUser && currentUser.token,
            profile = currentUser && currentUser.profile;

        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            auth.authenticate(profile, token);
            $rootScope.currentUser = currentUser;
          } else {
            auth.refreshIdToken(refreshToken).then(function(newToken) {
              Actions.updateAuthToken(newToken);
              auth.authenticate(profile, newToken);
              $rootScope.currentUser = currentUser;
              return newToken;
            });
          }
        }
      }
    });
  });
})();


(function() {
  var AppConstants = function(FluxUtil) {
    return FluxUtil.defineConstants([
      'SET_CURRENT_USER', 'UPDATE_AUTH_TOKEN',
      'UPDATE_PREFS', 'RESET_PREFS', 'FETCH_SHOWS',
      'FETCH_LIKED_SHOWS', 'LIKE_SHOW',
      'DISLIKE_SHOW', 'SET_REGION'
    ]);
  };

  var ApiConstants = function(FluxUtil) {
    return FluxUtil.defineConstants([
      'PENDING', 'ERROR'
    ]);
  };

  angular.module('app')
    .factory('AppConstants', AppConstants)
    .factory('ApiConstants', ApiConstants)
})();

(function() {
  angular.module('app').
    constant('AUTH0_CLIENT_ID', "Gv4gAd3AEMdvxjnGRccza7IyHydXoUb2").
    constant('AUTH0_DOMAIN', "brentvatne.auth0.com");
})();

(function() {
  var DEFAULT_PREFS = {
    genre: {
      thrillers: true,
      tv: true,
      specialInterest: true,
      scifi: true,
      romantic: true,
      music: true,
      independent: true,
      horror: true,
      children: true,
      gay: true,
      foreign: true,
      faith: true,
      dramas: true,
      documentary: true,
      comedy: true,
      classic: true,
      canadian: true,
      anime: true,
      action: true,
    },
    minReleaseYear: 1970,
    minImdbRating: 7.0,
  }

  angular.module('app').
    value('DEFAULT_PREFS', DEFAULT_PREFS);
})();

(function() {
  var Dispatcher = function(FluxUtil) {
    return FluxUtil.createDispatcher();
  }

  angular.module('app')
    .factory('Dispatcher', Dispatcher)
})();

(function() {
  var Routes = function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('start', {
        url: '/start',
        template: '',
        controller: function($scope, $state) {
          // Just go to the main one if authenticated
          $state.go('main');
        },
        data: {
          requiresLogin: true
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('main', {
        url: '/main',
        templateUrl: 'templates/main.html',
        data: {
          requiresLogin: true
        }
      });

    $urlRouterProvider.otherwise('/start');
  }

  angular.module('app')
    .config(Routes);
})();

(function() {
  var Store = function(FluxUtil, Dispatcher, ApiConstants, AppConstants, $localStorage, DEFAULT_PREFS) {
    /* Private */
    var _repo = $localStorage;

    var _shows = [],
        _likedShows = [];

    var _updateAuthToken = function(token) {
      _repo.currentUser.token = token;
    }

    var _resetPrefs = function() {
      _repo.prefs = angular.copy(DEFAULT_PREFS);
    }

    var _setPrefs = function(newPrefs) {
      _repo.prefs = angular.copy(newPrefs);
    }

    var _setRegion = function(region) {
      _repo.region = region;
    }

    var _logIn = function(userData) {
      _repo.currentUser = angular.copy(userData);
      _repo.currentUser.picture = _repo.currentUser.profile.picture;
    }

    var _logOut = function() {
      _repo.$reset();
      _resetPrefs();
    }

    // Initialize them if this is the first time
    //
    if (!_repo.prefs) { _resetPrefs(); _setRegion('canada'); }

    /* Public Api */
    var store = FluxUtil.createStore({
      getCurrentUser: function() {
        return _repo.currentUser;
      },

      getShows: function() {
        return _shows;
      },

      getLikedShows: function() {
        return _likedShows;
      },

      setPrefs: function(newPrefs) {
        return _setPrefs(newPrefs);
      },

      getPrefs: function() {
        return _repo.prefs;
      },

      getRegion: function() {
        if (typeof(region) == 'undefined' || region == null) {
          _setRegion('canada');
        }
        return _repo.region;
      },

      dispatcherIndex: Dispatcher.register(function(payload) {
        var action = payload.action;

        if (action.response != ApiConstants.PENDING) {
          switch(action.actionType) {
            case AppConstants.SET_CURRENT_USER:
              _logIn(action.data);
              store.emitChange(action);
              break;
            case AppConstants.UPDATE_PREFS:
              _setPrefs(action.newPrefs);
              store.emitChange(action);
              break;
            case AppConstants.FETCH_SHOWS:
              _shows = action.response;
              store.emitChange(action);
              break;
            case AppConstants.FETCH_LIKED_SHOWS:
              _likedShows = action.response;
              store.emitChange(action);
              break;
            case AppConstants.LOG_OUT:
              _logOut();
              store.emitChange(action);
              break;
            case AppConstants.RESET_PREFS:
              _resetPrefs();
              store.emitChange(action);
              break;
            case AppConstants.UPDATE_AUTH_TOKEN:
              _updateAuthToken(action.token);
              store.emitChange(action);
              break;
            case AppConstants.SET_REGION:
              _setRegion(action.region);
              store.emitChange(action);
              break;
            case AppConstants.LIKE_SHOW:
              break;
            case AppConstants.DISLIKE_SHOW:
              break;
          }

          return true;
        }
      })
    });

  return store;
}

  angular.module('app')
    .factory('Store', Store)
})();

if (!window.cordova) {
  // Disable overscroll
  document.addEventListener("DOMContentLoaded", function(event) {
    document.body.addEventListener('touchmove',function(e) {
      if (e.target && e.target.type == "range") {
      } else {
        e.preventDefault();
      }
    });
  });

  function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
  }

  loadScript('http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js', function() {
    WebFont.load({
      google: {
         families: ['Roboto']
       }
     });
  });

  // Google Analytics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-10128745-10', 'auto');
  ga('send', 'pageview');
}

(function() {
  var FlixApi = function($http, Dispatcher, AppConstants, ApiConstants) {
    var BASE_URL = 'http://flix-api.brentvatne.ca';
    // var BASE_URL = 'http://localhost:3000';

    /* Private Methods */
    var handleResponse = function(key, params) {
      return function(response) {
        if (response.data.error) {
          dispatch(key, ApiConstants.ERROR, params);
        } else {
          dispatch(key, response.data, params);
        }
      }
    }

    var dispatch = function(key, response, params) {
      payload = {
        actionType: key,
        response: response,
        queryParams: params
      }

      Dispatcher.handleServerAction(payload);
    }

    /* Public Interface */
    return {
      fetchShows: function(preferences, userEmail) {
        key = AppConstants.FETCH_SHOWS
        params = {preferences: preferences, email: userEmail}
        dispatch(key, ApiConstants.PENDING, params);
        $http.get(BASE_URL + '/shows', {params: params}).
          then(handleResponse(key, params));
      },

      fetchLikedShows: function(userEmail) {
        key = AppConstants.FETCH_LIKED_SHOWS
        params = {email: userEmail}
        dispatch(key, ApiConstants.PENDING, params);
        $http.get(BASE_URL + '/shows/liked', {params: params}).
          then(handleResponse(key, params));
      },

      likeShow: function(showId, userEmail) {
        key = AppConstants.LIKE_SHOW
        params = {showId: showId, email: userEmail}
        dispatch(key, ApiConstants.PENDING, params);
        $http.post(BASE_URL + '/shows/' + showId + '/like', {email: userEmail}).
          then(handleResponse(key, params));
      },

      dislikeShow: function(showId, userEmail) {
        key = AppConstants.DISLIKE_SHOW
        params = {showId: showId, userEmail: userEmail}
        dispatch(key, ApiConstants.PENDING, params);
        $http.post(BASE_URL + '/shows/' + showId + '/dislike', {email: userEmail}).
          then(handleResponse(key, params));
      }
    }
  }

  angular.module('app').
    factory('FlixApi', FlixApi)
})();

(function() {
  var CardsCtrl = function($scope, Store, PosterPreloader, Actions, $ionicSideMenuDelegate) {
    $scope.sideMenuIsOpen = function() {
      return $ionicSideMenuDelegate.isOpenLeft();
    }

    /* Card callbacks from swiping */
    $scope.destroyShow = function(index) {
      $scope.shows.splice(index, 1);
      if ($scope.shows.length < 3) {
        Actions.fetchShows();
      }
    }

    $scope.dislikedShow = function(index) {
      Actions.dislikeShow($scope.shows[index].id);
    }

    $scope.likedShow = function(index) {
      Actions.likeShow($scope.shows[index].id);
    }

    $scope.partialSwipeShow = function(index) { }
    $scope.snapBackShow = function(index) { }

    /* Initialize the state */
    Store.bindState($scope, function() { $scope.shows = Store.getShows(); });
    Actions.fetchShows();
  };

  angular.module('app').
    controller('CardsCtrl', CardsCtrl);
})();

(function() {
  var LikedShowsCtrl = function($scope, Store, Actions) {
    Store.bindState($scope, function() { $scope.shows = Store.getLikedShows(); });

    $scope.isFirstShow = function(i) {
      if (i == 0) {
        return true;
      }
    }

    $scope.isLastShow = function(i) {
      if (i == $scope.shows.length - 1) {
        return true;
      }
    }

    $scope.rowHeight = function(i) {
      return $scope.isLastShow(i) ? '160px' : '90px'
    }
  }

  angular.module('app').
    controller('LikedShowsCtrl', LikedShowsCtrl);
})();

(function() {
  var LoginCtrl = function($scope, $rootScope, $state, auth, Store, Actions, AppConstants) {
    auth.signin({
      authParams: {
        scope: 'openid offline_access',
        device: 'Mobile'
      },
      standalone: true
    }, Actions.logIn, handleLoginError);

    Store.bindState($scope, function(action) {
      if (auth.isAuthenticated && action && action.actionType == AppConstants.SET_CURRENT_USER) {
        $rootScope.currentUser = Store.getCurrentUser();
        $state.go('main');
      }
    });

    function handleLoginError() {
      // Do something
    }
  }

  angular.module('app')
    .controller('LoginCtrl', LoginCtrl)
})();

(function() {
  var NavCtrl = function($scope, $window, $timeout, Store, Actions, $ionicModal, $ionicSideMenuDelegate, $ionicPopover) {
    Store.bindState($scope, function(action) {
      $scope.region = Store.getRegion();
    });

    $scope.regionalFlagUrl = function() {
      if ($scope.region == null) {
        return null;
      }
      return 'images/' + $scope.region + '.png'
    }

    $scope.logOut = function() {
      Actions.logOut();
      $timeout(function() { $window.location.reload(true) }, 500);
      if ($scope.moreOptionsPopoverIsOpen) {
        $scope.closePopover();
      }
    }

    $scope.resetPreferences = function() {
      Actions.resetPreferences();
      Actions.fetchShows();
      if ($scope.moreOptionsPopoverIsOpen) {
        $scope.closePopover();
      }
    }

    /* Side Menu Delegate Setup */
    $ionicSideMenuDelegate.edgeDragThreshold(25);

    $scope.sideMenuIsOpen = function() {
      return $ionicSideMenuDelegate.isOpenLeft();
    }

    $scope.$watch($scope.sideMenuIsOpen, function(isOpen) {
      if (isOpen) {
        $scope.sideMenuWasOpen = true;
      } else {
        if ($scope.sideMenuWasOpen) {
          Actions.fetchShows();
          $scope.sideMenuWasOpen = true;
        }
      }
    });

    /* Liked Shows Modal */
    $ionicModal.fromTemplateUrl('templates/liked.html', {
      scope: $scope,
      animation: 'fade-in',
      hideDelay: 0
    }).then(function(modal) {
      $scope.likedShowsModal = modal;
    });

    $scope.openLikedShowsModal = function() {
      Actions.fetchLikedShows();
      $scope.likedShowsModal.show();
      $scope.likedShowsModalIsOpen = true;
    };

    $scope.closeModal = function() {
      $scope.likedShowsModal.hide();
      $scope.likedShowsModalIsOpen = false;
    };

    $scope.$on('$destroy', function() {
      $scope.likedShowsModal.remove();
      $scope.likedShowsModalIsOpen = false;
    });

    $scope.$on('modal.hidden', function() {
      $scope.likedShowsModalIsOpen = false;
    });

    $scope.$on('modal.removed', function() {
      $scope.likedShowsModalIsOpen = false;
    });

    /* More options popover */
    $ionicPopover.fromTemplateUrl('templates/more_options_menu.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
      $scope.popover.show($event);
      $scope.moreOptionsPopoverIsOpen = true;
    };

    $scope.closePopover = function() {
      $scope.popover.hide();
      $scope.moreOptionsPopoverIsOpen = false;
    };

    $scope.$on('$destroy', function() {
      $scope.popover.remove();
      $scope.moreOptionsPopoverIsOpen = false;
    });

    $scope.$on('popover.hidden', function() {
      $scope.moreOptionsPopoverIsOpen = false;
    });

    $scope.$on('popover.removed', function() {
      $scope.moreOptionsPopoverIsOpen = false;
    });
  }

  angular.module('app').
    controller('NavCtrl', NavCtrl);
})();

(function() {
  var PreferencesCtrl = function($scope, Store, Actions, AppConstants) {
    $scope.prefs = Store.getPrefs();

    // Update the state of local prefs when reset occurs
    Store.bindState($scope, function(action) {
      if (action && action.actionType == AppConstants.RESET_PREFS) {
        $scope.prefs = Store.getPrefs();
      }
    });

    // Update the state of prefs in the store when changed in the interface
    $scope.update = function() { Actions.updatePrefs($scope.prefs); };
  };

  angular.module('app').
    controller('PreferencesCtrl', PreferencesCtrl);
})();

(function() {
  var showCard = function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/show_card.html',
      replace: true
    }
  }

  angular.module('app').
    directive('showCard', showCard);
})();

(function() {
  var PosterPreloader = function(Store, AppConstants, ApiConstants, $timeout) {
    var _isActive = false;

    var _preloadImages = function(action) {
      if (action.actionType == AppConstants.FETCH_SHOWS && action.response != ApiConstants.PENDING) {
        angular.forEach(Store.getShows(), function(show, i) {
          $timeout(function() {
            var image = new Image;
            image.src = show.imageUrl;
          }, i * 150);
        });
      }
    }

    var _start = function() {
      if (_isActive === false) {
        Store.addChangeListener(_preloadImages);
        _isActive = true;
      }
    }

    var _stop = function() {
      if (isActive === true) {
        Store.removeChangeListener(_preloadImages);
      }
    }

    // Let's start this automatically
    _start();

    return {
      start: function() {
        _start();
      },

      stop: function() {
        _stop();
      },

      isActive: function() {
        return isActive;
      }
    }
  }

  angular.module('app').
    factory('PosterPreloader', PosterPreloader);
})();

(function() {
  var regionHttpInterceptor = function(Store) {
    return {
      request: function(request) {
        request.headers['Region'] = Store.getRegion();
        return request;
      }
    }
  }

  angular.module('app').
    factory('regionHttpInterceptor', regionHttpInterceptor);
})();
