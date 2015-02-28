

// vPaneHeader directive
angular.module('vAccordion.directives')
  .directive('vPaneHeader', vPaneHeaderDirective);


function vPaneHeaderDirective () {
  return {
    restrict: 'E',
    require: ['^vPane', '^vAccordion'],
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: {},
    link: function (scope, iElement, iAttrs, ctrls) {
      iAttrs.$set('role', 'tab');

      var paneCtrl = ctrls[0];
      var accordionCtrl = ctrls[1];

      iElement.on('click', function () {
        scope.$apply(function () {
          paneCtrl.toggle();
        });
      });

      iElement[0].onfocus = function () {
        paneCtrl.focusPane();
      };

      iElement[0].onblur = function () {
        paneCtrl.blurPane();
      };

      iElement.on('keydown', function (event) {
        if (event.keyCode === 32  || event.keyCode === 13) {
          scope.$apply(function () { paneCtrl.toggle(); });
          event.preventDefault();
        } else if (event.keyCode === 39) {
          scope.$apply(function () { accordionCtrl.focusNext(); });
          event.preventDefault();
        } else if (event.keyCode === 37) {
          scope.$apply(function () { accordionCtrl.focusPrevious(); });
          event.preventDefault();
        }
      });
    }
  };
}

