'use strict';

describe('Service: bla', function () {

  // load the service's module
  beforeEach(module('dicionarioApp'));

  // instantiate service
  var bla;
  beforeEach(inject(function (_bla_) {
    bla = _bla_;
  }));

  it('should do something', function () {
    expect(!!bla).toBe(true);
  });

});
