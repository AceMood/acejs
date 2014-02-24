QUnit.test('require deps resolved', function (assert) {
  var fns = [
    function require1 () {
      var a = require('xxx');
    },
    function require2 () {
      var a =
        require('xxx');
    },
    function require3 () {
      var a=require('xxx');
    },
    function require4 () {
      a = require('xxx');
    },
    function require5 () {
      var a = require ('xxx');
    },
    function require6 () {
      var a = require     ('xxx');
    },
    function require7 () {
      require(  'xxx'  );
    },
    function require8 () {
      var a = b = require('xxx');
    },
    function require9 () {
      var a = require
        ('xxx');
    }
  ];

  var matches;

  for (var i = 0; i < fns.length; ++i) {
    var code = fns[i].toString();
    matches = code.match(requireRegExp);
    assert.equal(matches && RegExp.$2, 'xxx', 'pass ');
  }
});

QUnit.test('comments removed', function (assert) {
  var fns = [
    function () {
      var a = '';
      // todo
      // todo
      return a;
    },
    function () {
      var a = '';
      // todo
      /* todo */
      return a;
    },
    function () {
      var a = '';
      /* todo */
      /* todo */
      return a;
    },
    function () {
      var a = '';
      /*** todo **/
      return a;
    },
    function () {
      var a = '';
      // todo //
      return a;
    },
    function () {
      var a = '';
      /***
       *
       * todo
       ***/
      return a;
    }
  ];

  var matches;

  for (var i = 0; i < fns.length; ++i) {
    var code = fns[i].toString();
    matches = code.match(commentRegExp);
    var expects = [
      ["// todo","// todo"],
      ["// todo","/* todo */"],
      ["/* todo */","/* todo */"],
      ["/*** todo **/"],
      ["// todo //"],
      ["/***","*","* todo","***/"]
    ];
    assert.equal(matches && matches[0], expects[i].join('\n'), 'pass ');
  }
});
