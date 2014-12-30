

// vPaneHeader directive
angular.module('vAccordion.directives')
  .directive('vPaneHeader', vPaneHeaderDirective);


function vPaneHeaderDirective (accordionConfig) {
  return {
    restrict: 'EA',
    require: '^vPane',
    transclude: true,
    replace: true,
    template: '<div ng-click="paneCtrl.toggle()"><div ng-transclude></div></div>',
    scope: {},
    compile: function (tElement) {
      tElement.addClass(accordionConfig.classes.paneHeader);

      return function postLink (scope, iElement, iAttrs, paneCtrl) {
        scope.paneCtrl = paneCtrl;
      };
    }
  };
}
vPaneHeaderDirective.$inject = ['accordionConfig'];

