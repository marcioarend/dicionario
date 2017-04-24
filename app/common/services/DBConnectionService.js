/**
 * Created by marcio on 06.03.17.
 */
(function (angular) {
  'use strict';


  angular.module('dicionarioApp').service('DBConnnectionSerice', DBConnnection);
  DBConnnection.$inject = ['$window', '$q', '$log', '$timeout' ,'LoadBO' , 'md5'];

  function DBConnnection($window, $q, $log, $timeout,LoadBO, md5) {
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
          reject("Banco de dados ja foi criado");
        } else {
          self._DBOpenRequest = $window.indexedDB.open(self._dbName, self._dbVersion);

          self._DBOpenRequest.onsuccess = function (e) {
            self._db = e.target.result;
            resolve(self._db);
          };

          self._DBOpenRequest.onupgradeneeded = function (event) {
            var db = event.target.result;
            var objStores = LoadBO.load();

            objStores.forEach(function(value){
                db.deleteObjectStore(value.objStore.objectStore);
                var objStore = db.createObjectStore(value.objStore.objectStore, value.objStore.key);
                var keys = value.objStore.indexKeys;
                keys.forEach(function(valueKey){
                   objStore.createIndex(valueKey.indexName,valueKey.keypath,valueKey.config);
                });

            });

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
          request.onerror = function (e) {
            rej(obj);
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
            var store = crateObjStore(db,palavra.objStore.objectStore);
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

      return $q.all([save(palavraLS, palavraLS.objStore.objectStore, palavraLS.update),save(palavraMS, palavraLS.objStore.objectStore, palavraMS.update)])
          .then(function (result) {
            return result;
          }).catch(function (error){
            $log.error("Trespassos",error);
        });
    };


    self.updatePalavra = function(palavra){
        setDataAndID(palavra);
        return save(palavra, palavra.objStore.objectStore, palavra.update);
    };

    function isInlist(elementos, elemento) {
      return elementos.indexOf(elemento);
    }

    function setDataAndID(obj,pause) {
      var defer = $q.defer();
        var d,n;
        getMillisecons(pause).then(function(time){

          n = md5.createHash(time.mili + obj.word);
          console.log(n);
          d = time.date;
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
          defer.resolve(obj);
        });

        return defer.promise
    }

    function getMillisecons(pause) {
      return $timeout(function(){
        var d = new Date();
        var n = d.getTime();
        return {date:d, mili:n}
      },pause);
    }

    self.preparestatement = function (palavraMS, palavraLS) {
      var update = true;

      return $q.all([setDataAndID(palavraMS,50), setDataAndID(palavraLS,50)])
        .then(function (result) {
          return tresPassos(result[0], result[1]).then(function(data){
            return data;
          });
        })
        .catch(function (error) {
          $log.error(error);
        });
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
      var boWord = new BOWords();
      return self.getByIdLingua(boWord.objStore.objectStore,"idLingua",idLanguage).then(
        function(result){
          var list = [];
          result.forEach(function(element){
            self.getByDefaultId(boWord.objStore.objectStore,element.idsref[0]).then(function(res){
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


  }

})(angular);
