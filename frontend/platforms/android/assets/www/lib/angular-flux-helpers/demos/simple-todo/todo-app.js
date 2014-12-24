var app = angular.module('todoApp', ['ngFlux', 'contenteditable']).
  factory('TodoActions', TodoActions).
  factory('TodoConstants', TodoConstants).
  factory('TodoDispatcher', TodoDispatcher).
  factory('TodoStore', TodoStore).
  directive('todoList', todoList).
  directive('todoListItem', todoListItem).
  directive('rawTodoData', rawTodoData).
  directive('markTodosCompleteButton', markTodosCompleteButton).
  directive('clearCompletedButton', clearCompletedButton);


function TodoConstants(FluxUtil) {
  return FluxUtil.defineConstants([
    'ADD_TODO', 'REMOVE_TODO', 'COMPLETE_TODO', 'INCOMPLETE_TODO',
    'UPDATE_TITLE', 'MARK_TODOS_COMPLETE', 'CLEAR_COMPLETED'
  ]);
}

// ** Boilerplate! The only value we get here is being able to specify
// how the 'payload' is structured. **
//
function TodoActions(TodoConstants, TodoDispatcher) {
  return {
    addTodo: function(item) {
      TodoDispatcher.handleViewAction({
        actionType: TodoConstants.ADD_TODO,
        item: item
      });
    },

    removeTodo: function(item) {
      TodoDispatcher.handleViewAction({
        actionType: TodoConstants.REMOVE_TODO,
        item: item
      });
    },

    completeTodo: function(item) {
      TodoDispatcher.handleViewAction({
        actionType: TodoConstants.COMPLETE_TODO,
        item: item
      });
    },

    incompleteTodo: function(item) {
      TodoDispatcher.handleViewAction({
        actionType: TodoConstants.INCOMPLETE_TODO,
        item: item
      });
    },

    updateTitle: function(item, title) {
      TodoDispatcher.handleViewAction({
        actionType: TodoConstants.UPDATE_TITLE,
        item: item,
        title: title
      });
    },

    markTodosComplete: function() {
      TodoDispatcher.handleViewAction({
        actionType: TodoConstants.MARK_TODOS_COMPLETE
      });
    },

    clearCompleted: function() {
      TodoDispatcher.handleViewAction({
        actionType: TodoConstants.CLEAR_COMPLETED
      });
    }
  }
}

function TodoDispatcher(FluxUtil) {
  return FluxUtil.createDispatcher();
}

function TodoStore(TodoDispatcher, TodoConstants, FluxUtil) {
  var _todos = [],
      _id = 0;

  function _addItem(item) {
    _id++;
    item.id = _id;
    _todos.push(item);
  }

  function _findItem(item) {
    var result = null;

    angular.forEach(_todos, function(current) {
      if (item.id == current.id) {
        result = current;
      }
    });

    return result;
  }

  function _findItemIndex(item) {
    return _todos.indexOf(_findItem(item));
  }

  function _removeItem(item) {
    var index = _findItemIndex(item);
    _todos.splice(index, 1);
  }

  function _completeItem(item) {
    var index = _findItemIndex(item);
    _todos[index].complete = true;
  }

  function _incompleteItem(item) {
    var index = _findItemIndex(item);
    _todos[index].complete = false;
  }

  function _updateTitle(item, title) {
    var index = _findItemIndex(item);
    _todos[index].title = title;
  }

  function _markTodosComplete() {
    angular.forEach(_todos, function(todo) {
      todo.complete = true;
    });
  }

  function _clearCompleted() {
    angular.forEach(_getCompleted(), function(todo) {
      _removeItem(todo);
    });
  }

  function _getCompleted() {
    var result = [];
    angular.forEach(_todos, function(todo) {
      if (todo.complete == true) {
        result.push(todo)
      }
    });

    return result;
  }

  var store = FluxUtil.createStore({
    getTodos: function() {
      return _todos;
    },

    getCompletedTodos: function() {
      return _getCompleted();
    },

    // ** Boilerplate! This is just linking up the constants with
    // the appropriate function on the store **
    //
    dispatcherIndex: TodoDispatcher.register(function(payload) {
      var action = payload.action;

      switch(action.actionType) {
        case TodoConstants.ADD_TODO:
          _addItem(action.item);
          break;

        case TodoConstants.REMOVE_TODO:
          _removeItem(action.item);
          break;

        case TodoConstants.COMPLETE_TODO:
          _completeItem(action.item);
          break;

        case TodoConstants.INCOMPLETE_TODO:
          _incompleteItem(action.item);
          break;

        case TodoConstants.UPDATE_TITLE:
          _updateTitle(action.item, action.title);
          break;

        case TodoConstants.MARK_TODOS_COMPLETE:
          _markTodosComplete();
          break;

        case TodoConstants.CLEAR_COMPLETED:
          _clearCompleted();
          break;
      }

      store.emitChange(action);

      return true;
    })
  });

  return store;
}

function todoList(TodoActions, TodoStore) {
  return {
    restrict: 'E',
    templateUrl: "todo-list.html",
    controller: function($scope) {
      $scope.newTodo = {};

      $scope.createTodo = function() {
        TodoActions.addTodo(angular.copy($scope.newTodo));
        $scope.newTodo = {};
      };

      TodoStore.bindState($scope, function updateTodosFromStore() {
        $scope.todos = TodoStore.getTodos();
      });
    }
  }
}

function todoListItem(TodoActions) {
  return {
    restrict: 'E',
    templateUrl: "todo-list-item.html",
    controller: function($scope) {
      $scope.removeTodo = function() {
        TodoActions.removeTodo($scope.todo);
      }

      $scope.toggleComplete = function() {
        if ($scope.todo.complete) {
          TodoActions.incompleteTodo($scope.todo);
        } else {
          TodoActions.completeTodo($scope.todo);
        }
      }

      $scope.titleChanged = function() {
        TodoActions.updateTitle($scope.todo, $scope.todo.title);
      }
    }
  }
}

function rawTodoData(TodoStore) {
  return {
    restrict: 'E',
    templateUrl: "raw-todo-data.html",
    controller: function($scope) {
      TodoStore.bindState($scope, function updateTodosFromStore() {
        $scope.todos = TodoStore.getTodos();
      });
    }
  }
}

function markTodosCompleteButton(TodoActions, TodoStore) {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    templateUrl: 'mark-todos-complete-button.html',
    controller: function($scope) {
      $scope.isVisible = function() {
        return TodoStore.getTodos().length > 0;
      }

      $scope.perform = function() {
        TodoActions.markTodosComplete();
      }
    }
  }
}

function clearCompletedButton(TodoActions, TodoStore) {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    templateUrl: 'clear-completed-button.html',
    controller: function($scope) {
      $scope.isVisible = function() {
        return TodoStore.getCompletedTodos().length > 0;
      }

      $scope.perform = function() {
        TodoActions.clearCompleted();
      }
    }
  }
}
