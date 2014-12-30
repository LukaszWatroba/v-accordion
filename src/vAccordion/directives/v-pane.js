

// vPane directive
angular.module('vAccordion.directives')
  .directive('vPane', vPaneDirective);


function vPaneDirective ($timeout, $animate, accordionConfig) {
  return {
    restrict: 'EA',
    require: '^vAccordion',
    transclude: true,
    replace: true,
    template: '<div ng-transclude></div>',
    scope: {
      isExpanded: '=?expanded'
    },
    controllerAs: 'paneCtrl',
    controller: PaneDirectiveController,
    compile: function (tElement) {
      tElement.addClass(accordionConfig.classes.pane);

      return function postLink (scope, iElement, iAttrs, accordionCtrl) {
        if (!angular.isDefined(scope.isExpanded)) {
          scope.isExpanded = angular.isDefined(iAttrs.expanded);
        }

        var paneHeaderNative = iElement[0].querySelector('.' + accordionConfig.classes.paneHeader),
            paneContentNative = iElement[0].querySelector('.' + accordionConfig.classes.paneContent);

        if (!paneHeaderNative) {
          throw new Error('v-pane-header not found');
        }

        if (!paneContentNative) {
          throw new Error('v-pane-content not found');
        }

        var paneInnerNative = paneContentNative.querySelector('div');

        var paneHeaderElement = angular.element(paneHeaderNative),
            paneContentElement = angular.element(paneContentNative);

        accordionCtrl.addPane(scope);
        scope.accordionCtrl = accordionCtrl;

        paneContentNative.style.maxHeight = '0px';

        function expand () {
          accordionCtrl.disable();

          var paneInnerHeight = paneInnerNative.offsetHeight;
          paneContentNative.style.maxHeight = '0px';

          $animate.addClass(paneContentElement, accordionConfig.classes.expandedState)
            .then(function () {
              accordionCtrl.enable();
              paneContentNative.style.maxHeight = 'none';
            });

          setTimeout(function () {
            paneContentNative.style.maxHeight = paneInnerHeight + 'px';
          }, 0);

          iElement.addClass(accordionConfig.classes.expandedState);
          paneHeaderElement.addClass(accordionConfig.classes.expandedState);
        }

        function collapse () {
          accordionCtrl.disable();

          var paneInnerHeight = paneInnerNative.offsetHeight;

          paneContentNative.style.maxHeight = paneInnerHeight + 'px';

          $animate.removeClass(paneContentElement, accordionConfig.classes.expandedState)
            .then(function () {
              accordionCtrl.enable();
            });

          setTimeout(function () {
            paneContentNative.style.maxHeight = '0px';
          }, 0);

          iElement.removeClass(accordionConfig.classes.expandedState);
          paneHeaderElement.removeClass(accordionConfig.classes.expandedState);
        }

        $timeout(function () {
          if (scope.isExpanded) {
            expand();
          }
        }, 100);

        scope.$watch('isExpanded', function (newValue, oldValue) {
          if (newValue === oldValue) { return true; }

          if (newValue) {
            expand();
          } else {
            collapse();
          }            
        });

      };
    }
  };
}
vPaneDirective.$inject = ['$timeout', '$animate', 'accordionConfig'];


// vPane directive controller
function PaneDirectiveController ($scope) {
  var ctrl = this;

  ctrl.toggle = function () {
    if (!$scope.isAnimating) {
      $scope.accordionCtrl.toggle($scope);
    }
  };
}
PaneDirectiveController.$inject = ['$scope'];

