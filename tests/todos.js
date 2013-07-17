//tests/todos.js
var assert = require('assert');

suite('Todos', function() {
  test('in the server', function(done, server) {
    server.eval(function() {
      Todos.insert({name: 'try out Meteor!'});
      var docs = Todos.find().fetch();
      emit('docs', docs);
    });

    server.once('docs', function(docs) {
      assert.equal(docs.length, 1);
      done();
    });
  });

  test('using both client and the server', function(done, server, client) {
    server.eval(function() {
      Todos.find().observe({
        added: addedNewTodo
      });

      function addedNewTodo(todo) {
        emit('todo', todo);
      }
    }).once('todo', function(todo) {
      assert.equal(todo.name, 'try out Meteor!');
      done();
    });

    client.eval(function() {
      Todos.insert({name: 'get groceries'});
    });
  });

  test('using two client', function(done, server, c1, c2) {
    c1.eval(function() {
      Todos.find().observe({
        added: addedNewTodo
      });

      function addedNewTodo(todo) {
        emit('todo', todo);
      }
      emit('done');
    }).once('todo', function(todo) {
      assert.equal(todo.name, 'from c2');
      done();
    }).once('done', function() {
      c2.eval(insertTodo);
    });

    function insertTodo() {
      Todos.insert({name: 'from c2'});
    }
  });

});
