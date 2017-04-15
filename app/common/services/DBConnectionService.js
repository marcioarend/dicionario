/**
 * Created by marcio on 06.03.17.
 */
(function (angular) {
  'use strict';


  angular.module('dicionarioApp').service('DBConnnectionSerice', DBConnnection);
  DBConnnection.$inject = ['$window', '$q', '$log', '$timeout'];

  function DBConnnection($window, $q, $log, $timeout) {
    var self = this;
    self._dbName = "dicionario";
    self._tables = ['Linguas', 'Palavras','Palavras2'];
    self._dbVersion = "";
    self._db = "";
    self._DBOpenRequest = {};


    self.createDB = function (dbName, dbVersion) {
      self._dbName = dbName;
      if (self._dbVersion !== dbVersion) {
        self._dbVersion = dbVersion;
        self._db = null;
      }

      return $q(function (resolve, reject) {

        if (self._db !== null) {
          reject("Bancdo de dados ja foi criado");
        } else {
          self._DBOpenRequest = $window.indexedDB.open(self._dbName, self._dbVersion);

          self._DBOpenRequest.onsuccess = function (e) {
            self._db = e.target.result;
            resolve(self._db);
          };

          self._DBOpenRequest.onupgradeneeded = function (event) {
            var db = event.target.result;


            //db.createObjectStore(self._tables[0], {keyPath: "id", autoIncrement: true});
            db.deleteObjectStore("Palavras2");
            var palavra = db.createObjectStore("Palavras2", {keyPath: "id"});

            palavra.createIndex("idsref","idsref", {unique:false,multiEntry:true});
            palavra.createIndex("idLingua","idLingua", {unique:false,multiEntry:true});

          };

          self._DBOpenRequest.onerror = function (e) {
            reject(e);
          };
        }

      });


    };

    self.open = function () {
      return $q(function (resolve, reject) {
        self._DBOpenRequest = $window.indexedDB.open(self._dbName);
        self._DBOpenRequest.onsuccess = function (e) {
          self._db = e.target.result;
          resolve(e.target.result);
        };

        self._DBOpenRequest.onerror = function (e) {
          reject("error by open");
        }
      });


    };

    function crateObjStore(db, tabela){
      var trans = self._db.transaction(tabela, "readwrite");
      var store = trans.objectStore(tabela);

      return store;
    }

    function save(obj, tabela, update) {
      return $q(function (res, rej) {
        self.open().then(function (db) {
          $log.info("salvando", obj);
          var store = crateObjStore(db, tabela);

          var request = {};

          if (update) {
            request = store.put(obj);
          } else {
            request = store.add(obj);
          }

          request.onsuccess = function (e) {
            res(e);
          };
          request.oncomplete = function (e) {
            res(e);
          };
          request.onerror = function (e) {
            rej(e);
          }

        }, function (error) {
          $log.error(error);
          rej(error);
        });
      });
    };


    self.delete = function (palavra) {
      return $q(function (res, rej) {
          self.open().then(function(db){
            $log.info("apagando", palavra);
            var store = crateObjStore(db,"Palavras2");

            var objectStoreRequest = store.delete(palavra.id);

            objectStoreRequest.onsuccess = function(event) {
              res(event);
            };

            objectStoreRequest.onerror = function(error){
              rej(error);
            }
          });
      });
    };

    function tresPassos(palavraMS, palavraLS) {
      if (isInlist(palavraMS.idsref, palavraLS.id)) {
        palavraMS.idsref.push(palavraLS.id);
      }
      if (isInlist(palavraLS.idsref, palavraMS.id)) {
        palavraLS.idsref.push(palavraMS.id);
      }

        save(palavraLS, 'Palavras2', palavraLS.update);
        save(palavraMS, 'Palavras2', palavraMS.update);

    };


    self.updatePalavra = function(palavra){
        setDataAndID(palavra);
        return save(palavra, 'Palavras2', palavra.update);
    };

    function isInlist(elementos, elemento) {
      return elementos.indexOf(elemento);
    }

    function setDataAndID(obj) {

      // O timeout foi montado aki pra evitar
      // que as duas palavras recebam o mesmo ID
      return $timeout(function () {
        var d = new Date();
        var n = d.getTime();
        if (obj.id === "") {
          obj.id = n;
          obj.updateDate = d;
          obj.created = d;
          obj.sync = false;
          obj.update = false;
        } else {
          obj.updateDate = d;
          obj.sync = false;
          obj.update = true;
        }
        return obj;
      }, 100);




    }

    self.preparestatement = function (palavraMS, palavraLS, tabela) {
      var update = true;

      if (tabela === self._tables[0]) {

      } else if (tabela === self._tables[2]) {

        return $q.all([setDataAndID(palavraMS),setDataAndID(palavraLS)])
          .then(function(result){

            return tresPassos(result[0], result[1]);
          })
          .catch(function(error){

          });

      }

    };

    self.getAll = function(tabela){
      return $q(function( res, rej){
          self.open().then(function(db){
            var store = crateObjStore(db, tabela);
            var request = store.getAll();

            request.onsuccess = function(event){
              res(event.target.result);
            };

            request.onerror = function(e){
              rej(e);
            };

          }, function(error){
            $log.error(error);
            rej(error);
          })
      });

    };

    self.getByIdLingua = function(tabela,storeIndex,id){
        return $q(function(res, rej){
            self.open().then(function(db){
              var store = crateObjStore(db, tabela);

              var myIndex = store.index(storeIndex);
              var keyRange = IDBKeyRange.only(id);
              var returnArray = [];

              myIndex.openCursor(keyRange).onsuccess = function (e){
                var cursor = event.target.result;
                if(cursor) {
                  returnArray.push(cursor.value);
                  cursor.continue();
                } else {
                  res(returnArray);
                }
              };

            })

      });

    };

    self.getByDefaultId = function(tabela,id){
      return $q(function(res, rej){
        self.open().then(function(db){
          var store = crateObjStore(db, tabela);

          var objStoreRequest = store.get(id);

          objStoreRequest.onsuccess  = function(response){
            res(response.target.result)
          };

          objStoreRequest.onerror = function (error){
            rej(error);
          }

        })

      });
    };

    self.getAllByLanguage = function(idLanguage){

      return self.getByIdLingua('Palavras2','idLingua',idLanguage).then(
        function(result){
          var list = [];
          result.forEach(function(element){
            self.getByDefaultId('Palavras2',element.idsref[0]).then(function(res){
              var temp = {MS: element, LS:res};
              list.push(temp);
            },function(error){

            })

          });
          return list;
        },
        function(error){

        });
    };

    self.createPalavra = function(palavra, idLingua){
      return {id: '', value: palavra, idsref: [], idLingua: idLingua };
    }
  }

})(angular);
