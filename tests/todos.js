//tests/todos.js
var assert = require('assert');

suite('Todos', function() {
  test('Metor server side', function(done, server) {
    server.eval(function() {
      Todos.insert({name: 'try out Meteor!'});
      var docs = Todos.find().fetch();
      emit('docs', docs);
    });

    server.once('docs', function(docs) {
      assert.equal(docs.length, 1);
      assert.equal(docs[0].name, 'try out Meteor!');
      done();
    });
  });
});
