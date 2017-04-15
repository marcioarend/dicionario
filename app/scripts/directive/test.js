/**
 * Created by marcio on 12.04.17.
 */
(function (angular) {
  "use strict";

  function myDirective(){
      var ddo = {
          scope: {
            name: '@',
            adresse: '@'
          },
          controller: myDirectiveController,
          controllerAs: 'ctrl',
          bindToController: true,
          templateUrl: 'scripts/directive/test.html'
      };
      return ddo;
  }

  function myDirectiveController () {
    console.log(this.name);
  }

  angular.module('arend.commons').directive('test',myDirective);


})(angular);
