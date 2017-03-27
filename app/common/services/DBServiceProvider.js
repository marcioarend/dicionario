/**
 * Created by marcio on 05.03.17.
 */
(function (angular) {
  'use strict';
  angular.module('dicionarioApp').provider('DBServiceProvider', ['$windowProvider',
    function($windowProvider) {

      var self = this;
      var _dbName = "Dicionario";
      var _dbVersion = 1;
      var $window = $windowProvider.$get();

      self.setDBName = function (name) {
        _dbName = name || _dbName;
      };

      self.setDbVersion = function (version) {
        _dbVersion = version || _dbVersion;
      };


      self.$get = function () {
        function createDB() {
          return $window.indexedDB.open(_dbName, _dbVersion);
        }

        function openDB(){
          var dbConnection = $window.indexedDB.open(_dbName);
        }

        return {
          createDB: createDB
        }
      }

    }]);


})(angular);
