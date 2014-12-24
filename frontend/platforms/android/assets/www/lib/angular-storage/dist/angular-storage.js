/*! angular-storage v0.5.0 | (c) 2014 Aspera, Inc. | MIT License */
/**
 * @ngdoc overview
 * @name angular-storage
 *
 * @description
 * AngularJS web storage service supporting localStorage, sessionStorage and cookies
 *
 */
(function(window) {
var angular = window.angular;

angular.module('angular-storage', []).service('aiStorage', [
  '$rootScope',
  '$window',
  function ($rootScope, $window) {
    var clearStore, determineService, getStore, localStorage, removeStore, sessionStorage, setStore, validKey;
    localStorage = $window.localStorage != null;
    sessionStorage = $window.sessionStorage != null;
    determineService = function (service) {
      if (service == null) {
        service = 'local';
      }
      if (service === 'local' && localStorage) {
        return 'local';
      }
      if (service === 'session' && sessionStorage) {
        return 'session';
      }
      return 'cookie';
    };
    setStore = {
      local: function (key, value) {
        return $window.localStorage.setItem(key, value);
      },
      session: function (key, value) {
        return $window.sessionStorage.setItem(key, value);
      },
      cookie: function (key, value, cookieOptions) {
        var domain, expire, path, secure;
        value = escape(value);
        if (key) {
          value = '' + key + '=' + value;
        }
        expire = cookieOptions.expire;
        path = cookieOptions.path;
        domain = cookieOptions.domain;
        secure = cookieOptions.secure;
        if (expire) {
          switch (expire.constructor) {
          case Number:
            if (expire === Infinity) {
              expire = '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
            } else {
              expire = '; max-age=' + expire;
            }
            break;
          case String:
            expire = '; expires=' + expire;
            break;
          case Date:
            expire = '; expires=' + expire.toUTCString();
          }
          value += expire;
        }
        if (domain) {
          value += '; domain=' + domain;
        }
        if (path) {
          value += '; path=' + path;
        }
        if (secure) {
          value += '; secure';
        }
        $window.document.cookie = value;
        return value;
      }
    };
    getStore = {
      local: function (key) {
        return $window.localStorage.getItem(key);
      },
      session: function (key) {
        return $window.sessionStorage.getItem(key);
      },
      cookie: function (key) {
        var regexp, result, _ref;
        if (key) {
          regexp = new RegExp('(?:^' + key + '|;\\s*' + key + ')=(.*?)(?:;|$)', 'g');
          result = regexp.exec($window.document.cookie);
          result = result[1] === 'undefined' ? 'null' : result[1];
        } else {
          result = (_ref = $window.document.cookie.split(';')[0]) != null ? _ref : 'null';
        }
        return unescape(result);
      }
    };
    removeStore = {
      local: function (key) {
        return $window.localStorage.removeItem(key);
      },
      session: function (key) {
        return $window.sessionStorage.removeItem(key);
      },
      cookie: function (key, path, domain) {
        if (getStore.cookie(key) !== 'null') {
          return setStore.cookie(key, '', { expire: 'Thu, 01 Jan 1970 00:00:00 GMT' });
        }
      }
    };
    clearStore = {
      local: function () {
        return $window.localStorage.clear();
      },
      session: function () {
        return $window.sessionStorage.clear();
      },
      cookie: function () {
        var cookie, cookies, _i, _len, _results;
        cookies = $window.document.cookie.split(';');
        _results = [];
        for (_i = 0, _len = cookies.length; _i < _len; _i++) {
          cookie = cookies[_i];
          if (cookie.indexOf('=') === -1) {
            removeStore.cookie();
            continue;
          }
          _results.push(removeStore.cookie(cookie.split('=')[0].trim()));
        }
        return _results;
      }
    };
    validKey = function (key, service) {
      if (service === 'cookie' || key && typeof key === 'string') {
        return true;
      }
    };
    return {
      set: function (key, value, service, cookieOptions) {
        var error;
        if (cookieOptions == null) {
          cookieOptions = {};
        }
        if (!validKey(key, service)) {
          return false;
        }
        if (value == null) {
          value = 'null';
        }
        if (typeof value === 'object') {
          value = angular.toJson(value);
        }
        value = value + '';
        try {
          return setStore[service = determineService(service)](key, value, cookieOptions);
        } catch (_error) {
          error = _error;
          $rootScope.$emit('asStorage', {
            type: 'set-error',
            key: key,
            service: service,
            value: value,
            error: error
          });
          return false;
        }
      },
      get: function (key, service) {
        var error, value, _ref, _ref1;
        if (!validKey(key, service)) {
          return false;
        }
        try {
          value = getStore[service = determineService(service)](key);
        } catch (_error) {
          error = _error;
          $rootScope.$emit('asStorage', {
            type: 'get-error',
            key: key,
            service: service,
            error: error
          });
          return false;
        }
        if (value && ((_ref = value.charAt(0)) === '{' || _ref === '[') && ((_ref1 = value.substr(-1)) === '}' || _ref1 === ']')) {
          return angular.fromJson(value);
        } else {
          return value;
        }
      },
      remove: function (key, service) {
        var error;
        if (!validKey(key, service)) {
          return false;
        }
        try {
          return removeStore[service = determineService(service)](key);
        } catch (_error) {
          error = _error;
          $rootScope.$emit('asStorage', {
            type: 'remove-error',
            key: key,
            service: service,
            error: error
          });
          return false;
        }
      },
      clear: function (service) {
        var error;
        try {
          return clearStore[service = determineService(service)]();
        } catch (_error) {
          error = _error;
          $rootScope.$emit('asStorage', {
            type: 'clear-error',
            service: service,
            error: error
          });
          return false;
        }
      }
    };
  }
]);
})(window);
