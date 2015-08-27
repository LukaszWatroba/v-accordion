/**
 * vAccordion - AngularJS multi-level accordion component
 * @version v1.2.9
 * @link http://lukaszwatroba.github.io/v-accordion
 * @author Łukasz Wątroba <l@lukaszwatroba.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function (angular) {
'use strict';


// Config
angular.module('vAccordion.config', [])
  .constant('accordionConfig', {
    states: {
      expanded: 'is-expanded'
    }
  });


// Modules
angular.module('vAccordion.directives', []);
angular.module('vAccordion',
  [
    'vAccordion.config',
    'vAccordion.directives'
  ]);



// vAccordion directive
angular.module('vAccordion.directives')
  .directive('vAccordion', vAccordionDirective);


function vAccordionDirective () {
  return {
    restrict: 'E',
    transclude: true,
    controller: AccordionDirectiveController,
    scope: {
      control: '=?',
      allowMultiple: '=?multiple',
      expandCb: '&?onexpand',
      collapseCb: '&?oncollapse'
    },
    link: function (scope, iElement, iAttrs, ctrl, transclude) {
      transclude(scope.$parent, function(clone) {
        iElement.append(clone);
      });

      var protectedApiMethods = ['toggle', 'expand', 'collapse', 'expandAll', 'collapseAll'];

      function checkCustomControlAPIMethods () {
        angular.forEach(protectedApiMethods, function (iteratedMethodName) {
          if (scope.control[iteratedMethodName]) {
            throw new Error('The `' + iteratedMethodName + '` method can not be overwritten');
          }
        });
      }

      if (!angular.isDefined(scope.allowMultiple)) {
        scope.allowMultiple = angular.isDefined(iAttrs.multiple);
      }

      iAttrs.$set('role', 'tablist');

      if (scope.allowMultiple) {
        iAttrs.$set('aria-multiselectable', 'true');
      }

      if (angular.isDefined(scope.control)) {
        checkCustomControlAPIMethods();

        var mergedControl = angular.extend({}, scope.internalControl, scope.control);
        scope.control = scope.internalControl = mergedControl;
      }
      else {
        scope.control = scope.internalControl;
      }
    }
  };
}


// vAccordion directive controller
function AccordionDirectiveController ($scope) {
  var ctrl = this;
  var isDisabled = false;

  $scope.panes = [];

	$scope.expandCb = (angular.isFunction($scope.expandCb)) ? $scope.expandCb : angular.noop;
	$scope.collapseCb = (angular.isFunction($scope.collapseCb)) ? $scope.collapseCb : angular.noop;

  ctrl.hasExpandedPane = function () {
    var bool = false;

    for (var i = 0, length = $scope.panes.length; i < length; i++) {
      var iteratedPane = $scope.panes[i];

      if (iteratedPane.isExpanded) {
        bool = true;
        break;
      }
    }

    return bool;
  };

  ctrl.getPaneByIndex = function (index) {
    var thePane;

    angular.forEach($scope.panes, function (iteratedPane) {
      if (iteratedPane.$parent && angular.isDefined(iteratedPane.$parent.$index) && iteratedPane.$parent.$index === index) {
        thePane = iteratedPane;
      }
    });

    return (thePane) ? thePane : $scope.panes[index];
  };

  ctrl.getPaneIndex = function (pane) {
    var theIndex;

    angular.forEach($scope.panes, function (iteratedPane) {
      if (iteratedPane.$parent && angular.isDefined(iteratedPane.$parent.$index) && iteratedPane === pane) {
        theIndex = iteratedPane.$parent.$index;
      }
    });

    return (angular.isDefined(theIndex)) ? theIndex : $scope.panes.indexOf(pane);
  };


  ctrl.disable = function () {
    isDisabled = true;
  };

  ctrl.enable = function () {
    isDisabled = false;
  };

  ctrl.addPane = function (paneToAdd) {
    if (!$scope.allowMultiple) {
      if (ctrl.hasExpandedPane() && paneToAdd.isExpanded) {
        throw new Error('The `multiple` attribute can\'t be found');
      }
    }

    $scope.panes.push(paneToAdd);

    if (paneToAdd.isExpanded) {
      $scope.expandCb({ index: ctrl.getPaneIndex(paneToAdd), target: paneToAdd });
    }
  };

  ctrl.focusNext = function () {
    var length = $scope.panes.length;

    for (var i = 0; i < length; i++) {
      var iteratedPane = $scope.panes[i];

      if (iteratedPane.isFocused) {
        var paneToFocusIndex = i + 1;

        if (paneToFocusIndex > $scope.panes.length - 1) {
          paneToFocusIndex = 0;
        }

        var paneToFocus = $scope.panes[paneToFocusIndex];
            paneToFocus.paneElement.find('v-pane-header')[0].focus();

        break;
      }
    }
  };

  ctrl.focusPrevious = function () {
    var length = $scope.panes.length;

    for (var i = 0; i < length; i++) {
      var iteratedPane = $scope.panes[i];

      if (iteratedPane.isFocused) {
        var paneToFocusIndex = i - 1;

        if (paneToFocusIndex < 0) {
          paneToFocusIndex = $scope.panes.length - 1;
        }

        var paneToFocus = $scope.panes[paneToFocusIndex];
            paneToFocus.paneElement.find('v-pane-header')[0].focus();

        break;
      }
    }
  };

  ctrl.toggle = function (paneToToggle) {
    if (isDisabled || !paneToToggle) { return; }

    if (!$scope.allowMultiple) {
      ctrl.collapseAll(paneToToggle);
    }

    paneToToggle.isExpanded = !paneToToggle.isExpanded;

    if (paneToToggle.isExpanded) {
      $scope.expandCb({ index: ctrl.getPaneIndex(paneToToggle) });
    } else {
      $scope.collapseCb({ index: ctrl.getPaneIndex(paneToToggle) });
    }
  };

  ctrl.expand = function (paneToExpand) {
    if (isDisabled || !paneToExpand) { return; }

    if (!$scope.allowMultiple) {
      ctrl.collapseAll(paneToExpand);
    }

    if (!paneToExpand.isExpanded) {
      paneToExpand.isExpanded = true;
      $scope.expandCb({ index: ctrl.getPaneIndex(paneToExpand) });
    }
  };

  ctrl.collapse = function (paneToCollapse) {
    if (isDisabled || !paneToCollapse) { return; }

    if (paneToCollapse.isExpanded) {
      paneToCollapse.isExpanded = false;
      $scope.collapseCb({ index: ctrl.getPaneIndex(paneToCollapse) });
    }
  };

  ctrl.expandAll = function () {
    if (isDisabled) { return; }

    if ($scope.allowMultiple) {
      angular.forEach($scope.panes, function (iteratedPane) {
        ctrl.expand(iteratedPane);
      });
    } else {
      throw new Error('The `multiple` attribute can\'t be found');
    }
  };

  ctrl.collapseAll = function (exceptionalPane) {
    if (isDisabled) { return; }

    angular.forEach($scope.panes, function (iteratedPane) {
      if (iteratedPane !== exceptionalPane) {
        ctrl.collapse(iteratedPane);
      }
    });
  };

  // API
  $scope.internalControl = {
    toggle: function (index) {
      ctrl.toggle( ctrl.getPaneByIndex(index) );
    },
    expand: function (index) {
      ctrl.expand( ctrl.getPaneByIndex(index) );
    },
    collapse: function (index) {
      ctrl.collapse( ctrl.getPaneByIndex(index) );
    },
    expandAll: ctrl.expandAll,
    collapseAll: ctrl.collapseAll
  };
}
AccordionDirectiveController.$inject = ['$scope'];



// vPaneContent directive
angular.module('vAccordion.directives')
  .directive('vPaneContent', vPaneContentDirective);


function vPaneContentDirective () {
  return {
    restrict: 'E',
    require: '^vPane',
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: {},
    link: function (scope, iElement, iAttrs) {
      iAttrs.$set('role', 'tabpanel');
    }
  };
}




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
      isExpanded: '=?expanded',
      isDisabled: '=?ngDisabled'
    },
    link: function (scope, iElement, iAttrs, accordionCtrl, transclude) {
      transclude(scope.$parent, function (clone) {
        iElement.append(clone);
      });

      if (!angular.isDefined(scope.isExpanded)) {
        scope.isExpanded = angular.isDefined(iAttrs.expanded);
      }

      if (angular.isDefined(iAttrs.disabled)) {
        scope.isDisabled = true;
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

      scope.$evalAsync(function () {
        accordionCtrl.addPane(scope);
      });

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
    if (!$scope.isAnimating && !$scope.isDisabled) {
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

})(angular);