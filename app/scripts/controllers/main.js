'use strict';

angular.module('dicionarioApp').controller('MainCtrl', function (DBConnnectionSerice, testUpperFilter,$parse,$timeout) {

  var self = this;
  self.objSave = {MS:new BOWords(),LS:new BOWords()};

/*
   DBConnnectionSerice.createDB("dicionario",8).then(function(resolve){
   console.log(resolve);
   },function(reject){
   console.log(reject);
   });
*/

  function loadAll(){
    DBConnnectionSerice.getAllByLanguage(1).then(function(result){
      self.lista = result;
    },function (error) {});
    self.objSave = {MS:new BOWords(),LS:new BOWords()};
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
        self.objSave.MS.idLingua = 1;
        self.objSave.LS.idLingua = 2;
        DBConnnectionSerice.preparestatement(self.objSave.MS,self.objSave.LS).then(function(result){
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

    loadAll();



  function createfakeData(){
    var pt = ["Casa","Carro","Comida","Aluno","Metro","Trem","Casa","Carro","Comida","Aluno","Metro","Trem","Casa","Carro","Comida","Aluno","Metro","Trem","Casa","Carro","Comida","Aluno","Metro","Trem"];
    var de = ["Haus","Auto","Essen", "Schuler","Uban","Zug","Haus","Auto","Essen", "Schuler","Uban","Zug","Haus","Auto","Essen", "Schuler","Uban","Zug","Haus","Auto","Essen", "Schuler","Uban","Zug"];

    pt.forEach(function(data,index){
      var MS = new BOWords();
      var LS = new BOWords();
      MS.idLingua = 1;
      MS.word = data;
      LS.idLingua = 2;
      LS.word = de[index];
      DBConnnectionSerice.preparestatement(MS,LS).then(function(result){
        console.log(result[0]);
        console.log(result[1]);
      })});
    loadAll();

  }
  //createfakeData();
});

