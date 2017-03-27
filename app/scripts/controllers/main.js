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

  DBConnnectionSerice.preparestatement(palavraMS,palavraLS,'Palavras2');

 */
/*
  DBConnnectionSerice.getAll('Palavras2').then(
    function(result){
      self.lista = result;
    },
    function(error){

    });
*/

  DBConnnectionSerice.getByIdLingua('Palavras2','idLingua',1).then(
    function(result){
      self.lista = []
      result.forEach(function(element){

        DBConnnectionSerice.getByDefaultId('Palavras2',element.idsref[0]).then(function(res){
          var temp = {MS: element, LS:res};
            self.lista.push(temp);
          console.log(temp);

        },function(error){
          console.log(error);
        })

      });

    },
    function(error){

    });

    self.getById = function(id){

    }


});

