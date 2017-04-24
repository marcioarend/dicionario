/**
 * Created by marcio on 21.04.17.
 */

  function BOWords(){
    var self = this;
    self.id = '', self.word = '', self.idsref = [], self.idLingua = '';
    self.updateDate = '';
    self.created = '';
    self.sync = '';
    self.update = '';
    self. objStore = {
    objectStore: 'words',
    key: {keyPath:'id'},
    indexKeys:[
      {indexName:"idsref"  ,keypath:"idsref"  , config:{unique:false,multiEntry:true}},
      {indexName:"idLingua",keypath:"idLingua",config: {unique:false,multiEntry:true}}]
    };

  }

