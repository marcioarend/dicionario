'use strict';

/**
 * @ngdoc function
 * @name dicionarioApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dicionarioApp
 */
angular.module('dicionarioApp').controller('MainCtrl', function (DBConnnectionSerice, $timeout) {

  var self = this;
  /*
   DBConnnectionSerice.createDB("dicionario",4).then(function(resolve){
   console.log(resolve);
   },function(reject){
   console.log(reject);
   });
*/
/*
  var palavraMS = {id: '', value: 'Carro', idsref: [], idLingua: 1},
        palavraLS = {id: '', value: 'Auto', idsref: [], idLingua: 2};



 */
/*
  DBConnnectionSerice.getAll('Palavras2').then(
    function(result){
      self.lista = result;
    },
    function(error){

    });
*/

  DBConnnectionSerice.getAllByLanguage(1).then(function(result){
    self.lista = result;
  },function (error) {});



    self.getById = function(id){

    };

    self.save = function () {
      var MS = DBConnnectionSerice.createPalavra(self.objSave.MS, 1);
      var LS = DBConnnectionSerice.createPalavra(self.objSave.LS, 2);

      DBConnnectionSerice.preparestatement(MS,LS,'Palavras2').then(function(result){
        console.log(result);
      });
    }

});

