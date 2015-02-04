

// vPaneContent directive
angular.module('vAccordion.directives')
  .directive('vPaneContent', vPaneContentDirective);


function vPaneContentDirective () {
  return {
    restrict: 'E',
    require: '^vPane',
    transclude: true,
    template: '<v-pane-content-inner ng-transclude></v-pane-content-inner>',
    scope: {},
    link: function () {}
  };
}

