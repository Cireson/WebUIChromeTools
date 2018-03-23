
angular.module('ctdInspectorApp',[])
.controller('ctdCtrl', function($scope, $timeout, $http) {
  function updateElementProperties() {
      chrome.devtools.inspectedWindow.eval("(" + page_getProperties.toString() + ")()", function(results){
        $http.get(results.apiRoot + "/GetAllMatchingWebTemplates?TemplateKey=" + results.selectedTemplate.key + "&Types=" + results.modelTypes.join(",") + ",any")
             .then(function(x){
                debugger;
                $scope.model = results;
                var matchedTemplates = x.data.value;
                $scope.model.validTemplates = matchedTemplates;
             })
      });
      //debugger;
  }
  updateElementProperties();
  chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
});


  // The function below is executed in the context of the inspected page.
  var page_getProperties = function() {
    var result = {ctdFound: false};
    if(!_ || !jQuery) return result;
    //debugger;
    ctd = $0.closest("ctd");
    if(!ctd) return result;
    
    var ngInc = ctd.firstElementChild;
    var selectedTemplate = _.get(ngInc.attributes["ctd-selected-template"], "value", "any|any").split("|");
    result.selectedTemplate = {
      key: selectedTemplate[0], 
      type: selectedTemplate[1]
    }
    result.attachedBehaviors = _.get(ngInc.attributes["ctd-attached-behaviors"], "value", "").split(",")
    result.modelTypes = JSON.parse(_.get(ngInc.attributes["ctd-model-type"],"value", "[]"));
    
    var clone = ctd.cloneNode();
    result.ctdDeclaration = clone.outerHTML;
    result.apiRoot = document.URL.split("/app/")[0] + "/api";
  


    result.ctdFound = true;
    return result;
  }
