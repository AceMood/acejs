try {
  require('bogus');
  mytest.print('FAIL require throws error when module missing', 'fail');
} catch (exception) {
  mytest.print('PASS require throws error when module missing', 'pass');
}

mytest.print('DONE', 'info');
