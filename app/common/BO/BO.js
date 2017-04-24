/**
 * Created by marcio on 21.04.17.
 */
(function(angular){

  function load(){
    var boList = [];


    this.load = function(){
      boList.push(new BOWords());
      boList.push(new LearnBO());
      return boList;
    };

  };

  angular.module('BO.module',[]).service('LoadBO',load);

})(angular);
