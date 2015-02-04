

// vPaneHeader directive
angular.module('vAccordion.directives')
  .directive('vPaneHeader', vPaneHeaderDirective);


function vPaneHeaderDirective () {
  return {
    restrict: 'E',
    require: '^vPane',
    transclude: true,
    template: '<v-pane-header-inner ng-transclude></v-pane-header-inner>',
    scope: {},
    link: function (scope, iElement, iAttrs, paneCtrl) {
      iElement.on('click', function () {
        scope.$apply(function () {
          paneCtrl.toggle();
        });
      });
    }
  };
}

