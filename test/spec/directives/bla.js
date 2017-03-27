'use strict';

describe('Directive: bla', function () {

  // load the directive's module
  beforeEach(module('dicionarioApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bla></bla>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bla directive');
  }));
});
