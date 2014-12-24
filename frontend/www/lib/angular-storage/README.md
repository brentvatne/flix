# Angular Storage

### Status
| Branch        | Status         |
| ------------- |:-------------:|
| master        | [![Build Status](https://travis-ci.org/Aspera/angular-storage.png?branch=master)](https://travis-ci.org/Aspera/angular-storage) |

A service to handle storing data in the browser. It supports:

* Cookies
* HTML5 localStorage
* HTML5 webStorage

Supported browsers:

* Chrome
* Firefox
* Safari
* IE 7+ (7 only supports cookies)

## Installation

The best way is to use bower to manage the process:

```bash
bower install --save angular-storage
```

## Usage

Reference the file in your index.html (or where you include angular.js) after you include angular.js

```html
<script src="path/to/angular.js"></script>
<script src="path/to/bower_components/angular-storage/angular-storage.js"></script>
```

Include the module as a dependency in your `angular.module`

```javascript
angular.module('yourApp', ['angular-storage']);
```

Finally, start using it:

```javascript
angular.module('yourApp').controller('YourCtrl', function( asStorage, $scope ) {
  asStorage.set('key', 'value');
  $scope.data = asStorage.get('key');
});
```


## Future Plans

* Max-age support needs to be added.
* Path: Support for this woud depend on window.location.pathname being mocked out as well.
* Domain: Similiar to path but with window.location.{host|hostname|origin}
* Secure: Similiar to path but with window.location.protocol
* Http-only: Not sure how to mock this out since JS wouldn't have access to the cookie. That could probably be the test
