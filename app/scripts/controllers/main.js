'use strict';

angular.module('dicionarioApp').controller('MainCtrl', function (DBConnnectionSerice, testUpperFilter,$parse ) {

  var self = this;
  self.objSave = {MS:{value:''},LS:{value:''}};

  console.log( testUpperFilter("marcio"));
  /*
   DBConnnectionSerice.createDB("dicionario",4).then(function(resolve){
   console.log(resolve);
   },function(reject){
   console.log(reject);
   });
*/

  function loadAll(){
    DBConnnectionSerice.getAllByLanguage(1).then(function(result){
      self.lista = result;
    },function (error) {});
    self.objSave = {MS:{value:''},LS:{value:''}};
  }



    self.save = function () {

      var MS = $parse("id")(self.objSave.MS);
      var LS = $parse("id")(self.objSave.LS);
      if (LS && MS) {
         DBConnnectionSerice.updatePalavra(self.objSave.MS).then(function (data) {
            DBConnnectionSerice.updatePalavra (self.objSave.LS).then(function(data2){
              loadAll();
             });
         });
      } else {
        MS = DBConnnectionSerice.createPalavra(self.objSave.MS.value, 1);
        LS = DBConnnectionSerice.createPalavra(self.objSave.LS.value, 2);
        DBConnnectionSerice.preparestatement(MS,LS,'Palavras2').then(function(result){
          loadAll();
        });
      }

      loadAll();

    };

    self.edit = function(data){
      self.objSave.MS = data.MS;
      self.objSave.LS = data.LS;
    };

    self.delete = function(data){
      self.objSave.MS = data.MS;
      self.objSave.LS = data.LS;

      DBConnnectionSerice.delete(self.objSave.MS).then(function(data){
        DBConnnectionSerice.delete(self.objSave.LS).then(function(res){
          loadAll();
        })
      })
    };

    loadAll()

});

