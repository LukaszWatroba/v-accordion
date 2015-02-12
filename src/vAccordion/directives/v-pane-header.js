

// vPaneHeader directive
angular.module('vAccordion.directives')
  .directive('vPaneHeader', vPaneHeaderDirective);


function vPaneHeaderDirective () {
  return {
    restrict: 'E',
    require: '^vPane',
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: {},
    link: function (scope, iElement, iAttrs, paneCtrl) {
      iAttrs.$set('role', 'tab');

      iElement.on('click', function () {
        scope.$apply(function () {
          paneCtrl.toggle();
        });
      });
    }
  };
}

