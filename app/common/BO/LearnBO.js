/**
 * Created by marcio on 22.04.17.
 */

function LearnBO(){
  var self = this;
  self.level = 0;
  // Reference to the word
  self.wordBO = {};
  // Times the one tried to answere
  self.numberTrys = 0;
  // Times the word  would chouse right
  self.numberRights = 0;
  // Times the word  would chouse wrong
  self.numberWrongs = 0;
  // Date this word would add in the list
  self.created = new Data().getTime();
  // Last Time this word show up
  self.lastTime = new Data().getTime();
  // Number of times this word shows, one can skipe
  self.frequence = 0;

  //Lanaguage that you are learning Ex: German
  self.idLanguage = 0;
  self.objStore = {
    objectStore: 'learn',
    key: {keyPath:'id'},
    indexKeys:[
      {indexName:"level"  ,keypath:"level"  , config:{unique:false,multiEntry:true}},
      {indexName:"idLingua",keypath:"idLingua",config: {unique:false,multiEntry:true}},
      {indexName:"idWord",keypath:"idWord",config: {unique:true}},
      {indexName:"trys",keypath:"trys",config: {unique:false,multiEntry:true}},
      {indexName:"rights",keypath:"rights",config: {unique:false,multiEntry:true}},
      {indexName:"wrongs",keypath:"wrongs",config: {unique:false,multiEntry:true}},
      {indexName:"created",keypath:"created",config: {unique:false,multiEntry:true}},
      {indexName:"lasttime",keypath:"lasttime",config: {unique:false,multiEntry:true}},
      {indexName:"frequence",keypath:"frequence",config: {unique:false,multiEntry:true}}
    ]
  };
}
