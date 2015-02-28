

// vPane directive
angular.module('vAccordion.directives')
  .directive('vPane', vPaneDirective);


function vPaneDirective ($timeout, $animate, accordionConfig) {
  return {
    restrict: 'E',
    require: '^vAccordion',
    transclude: true,
    controller: PaneDirectiveController,
    scope: {
      isExpanded: '=?expanded'
    },
    link: function (scope, iElement, iAttrs, accordionCtrl, transclude) {
      transclude(scope.$parent, function (clone) {
        iElement.append(clone);
      });

      if (!angular.isDefined(scope.isExpanded)) {
        scope.isExpanded = angular.isDefined(iAttrs.expanded);
      }

      var states = accordionConfig.states;

      var paneHeader = iElement.find('v-pane-header'),
          paneContent = iElement.find('v-pane-content'),
          paneInner = paneContent.find('div');

      if (!paneHeader[0]) {
        throw new Error('The `v-pane-header` directive can\'t be found');
      }

      if (!paneContent[0]) {
        throw new Error('The `v-pane-content` directive can\'t be found');
      }

      accordionCtrl.addPane(scope);

      scope.paneElement = iElement;
      scope.paneContentElement = paneContent;
      scope.paneInnerElement = paneInner;
      
      scope.accordionCtrl = accordionCtrl;

      function expand () {
        accordionCtrl.disable();

        paneContent[0].style.maxHeight = '0px';
        paneHeader.attr({
          'aria-selected': 'true',
          'tabindex': '0'
        });

        scope.$emit('vAccordion:onExpand');

        $timeout(function () {
          $animate.addClass(iElement, states.expanded)
            .then(function () {
              accordionCtrl.enable();
              paneContent[0].style.maxHeight = 'none';
              scope.$emit('vAccordion:onExpandAnimationEnd');
            });

          setTimeout(function () {
            paneContent[0].style.maxHeight = paneInner[0].offsetHeight + 'px';
          }, 0);
        }, 0);
      }

      function collapse () {
        accordionCtrl.disable();

        paneContent[0].style.maxHeight = paneInner[0].offsetHeight + 'px';
        paneHeader.attr({
          'aria-selected': 'false',
          'tabindex': '-1'
        });

        scope.$emit('vAccordion:onCollapse');

        $timeout(function () {
          $animate.removeClass(iElement, states.expanded)
            .then(function () {
              accordionCtrl.enable();
              scope.$emit('vAccordion:onCollapseAnimationEnd');
            });

          setTimeout(function () {
            paneContent[0].style.maxHeight = '0px';
          }, 0);
        }, 0);
      }

      if (scope.isExpanded) {
        iElement.addClass(states.expanded);
        paneContent[0].style.maxHeight = 'none';

        paneHeader.attr({
          'aria-selected': 'true',
          'tabindex': '0'
        });
      } else {
        paneContent[0].style.maxHeight = '0px';

        paneHeader.attr({
          'aria-selected': 'false',
          'tabindex': '-1'
        });
      }

      scope.$watch('isExpanded', function (newValue, oldValue) {
        if (newValue === oldValue) { return true; }
        if (newValue) { expand(); }
        else { collapse(); }            
      });
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

  ctrl.focusPane = function () {
    $scope.isFocused = true;
  };

  ctrl.blurPane = function () {
    $scope.isFocused = false;
  };
}
PaneDirectiveController.$inject = ['$scope'];

