

// vPaneContent directive
angular.module('vAccordion.directives')
  .directive('vPaneContent', vPaneContentDirective);


function vPaneContentDirective (accordionConfig) {
  return {
    restrict: 'EA',
    require: '^vPane',
    transclude: true,
    replace: true,
    template: '<div><div ng-transclude></div></div>',
    scope: {},
    compile: function (tElement) {
      tElement.addClass(accordionConfig.classes.paneContent);

      return function postLink (scope, iElement, iAttrs, paneCtrl) {
        scope.paneCtrl = paneCtrl;
      };
    }
  };
}
vPaneContentDirective.$inject = ['accordionConfig'];

