var mytest = window.mytest = {
  print: window.print,
  assert: function (guard, message) {
    if (guard) {
      mytest.print('PASS ' + message, 'pass');
    } else {
      mytest.print('FAIL ' + message, 'fail');
    }
  }
};