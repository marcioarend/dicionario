/**
 * Created by marcio on 10.04.17.
 */
(function (angular){
    "use strict";

     function filterUpperCase(){
         return function(input){
             return input.toUpperCase();
         }
     }


    angular.module('arend.commons').filter('testUpper',filterUpperCase);

})(angular);

/**
 * Created by marcio on 12.04.17.
 */
(function(angular){
    "use strict";
    function filter(){
      return function(str){
        var temp = '';
        var i = str.length;

        while (i > 0) {
          temp += str.substring(i - 1, i);
          i--;
        }


        return temp;
      }
    };

    angular.module('arend.commons').filter('arendReverse', filter);


  }
)(angular);
