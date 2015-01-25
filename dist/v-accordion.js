/**
 * vAccordion - AngularJS multi-level accordion component
 * @version v0.2.6
 * @link http://lukaszwatroba.github.io/v-accordion
 * @author Łukasz Wątroba <l@lukaszwatroba.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function (angular) {
'use strict';


// Config
angular.module('vAccordion.config', [])
  .constant('accordionConfig', {
    classes: {
      accordion: 'Accordion Accordion--dafault',
      pane: 'Accordion-pane',
      paneHeader: 'Accordion-paneHeader',
      paneContent: 'Accordion-paneContent',

      expandedState: 'is-expanded'
    }
  });


// Modules
angular.module('vAccordion.directives', [ 'ngAnimate' ]);
angular.module('vAccordion', 
  [
    'vAccordion.config',
    'vAccordion.directives'
  ]);




// vAccordion directive
angular.module('vAccordion.directives')
  .directive('vAccordion', vAccordionDirective);


function vAccordionDirective (accordionConfig) {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: {
      control: '=?',
      allowMultiple: '=?'
    },
    controllerAs: 'accordionCtrl',
    controller: AccordionDirectiveController,
    compile: function (tElement) {
      tElement.addClass(accordionConfig.classes.accordion);

      return function postLink (scope, iElement, iAttrs) {
        if (!angular.isDefined(scope.allowMultiple)) {
          scope.allowMultiple = angular.isDefined(iAttrs.allowMultiple);
        }

        var protectedApiMethods = ['toggle', 'expand', 'collapse', 'expandAll', 'collapseAll'];

        function checkCustomControlAPIMethods () {
          angular.forEach(protectedApiMethods, function (iteratedMethodName) {
            if (scope.control[iteratedMethodName]) {
              throw new Error('The `' + iteratedMethodName + '` method can not be overwritten');
            }
          });
        }

        function checkCustomControlCallbacks () {
          if (!angular.isFunction( scope.control.onExpand )) {
            throw new Error('The `onExpand` callback must be a function');
          }

          if (!angular.isFunction( scope.control.onCollapse )) {
            throw new Error('The `onCollapse` callback must be a function');
          }
        }

        scope.$watch('control', function () {
          if (scope.control && scope.control !== scope.internalControl) {
            checkCustomControlAPIMethods();

            var mergedControl = angular.extend({}, scope.internalControl, scope.control);
            scope.control = scope.internalControl = mergedControl;

            checkCustomControlCallbacks();
          } 
          else if (!angular.isDefined(scope.control)) {
            scope.control = scope.internalControl;
          }
        });
        
      };
    }
  };
}
vAccordionDirective.$inject = ['accordionConfig'];


// vAccordion directive controller
function AccordionDirectiveController ($scope) {
  var ctrl = this;
  
  $scope.isDisabled = false;
  $scope.panes = [];

  var hasExpandedPane = function () {
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

  var getPaneByIndex = function (index) {
    return $scope.panes[index];
  };

  var getPaneIndex = function (pane) {
    return $scope.panes.indexOf(pane);
  };

  ctrl.disable = function () {
    $scope.isDisabled = true;
  };

  ctrl.enable = function () {
    $scope.isDisabled = false;
  };

  ctrl.addPane = function (pane) {
    if (!$scope.allowMultiple) {
      if (hasExpandedPane() && pane.isExpanded) {
        throw new Error('The `allow-multiple` attribute is not set');
      } 
    }

    $scope.panes.push(pane);

    if (pane.isExpanded) {
      $scope.internalControl.onExpand( getPaneIndex(pane) );
    }
  };

  ctrl.toggle = function (paneToToggle) {
    if ($scope.isDisabled || !paneToToggle) { return; }

    if (!$scope.allowMultiple) {
      ctrl.collapseAll(paneToToggle);
    }

    paneToToggle.isExpanded = !paneToToggle.isExpanded;

    if (paneToToggle.isExpanded) {
      $scope.internalControl.onExpand( getPaneIndex(paneToToggle) );
    } else {
      $scope.internalControl.onCollapse( getPaneIndex(paneToToggle) );
    }
  };

  ctrl.expand = function (paneToExpand) {
    if ($scope.isDisabled || !paneToExpand) { return; }

    if (!$scope.allowMultiple) {
      ctrl.collapseAll(paneToExpand);
    }

    if (!paneToExpand.isExpanded) {
      paneToExpand.isExpanded = true;

      $scope.internalControl.onExpand( getPaneIndex(paneToExpand) );
    }
  };

  ctrl.collapse = function (paneToCollapse) {
    if ($scope.isDisabled || !paneToCollapse) { return; }
    
    if (paneToCollapse.isExpanded) {
      paneToCollapse.isExpanded = false;

      $scope.internalControl.onCollapse( getPaneIndex(paneToCollapse) );
    }
  };

  ctrl.expandAll = function () {
    if ($scope.isDisabled) { return; }

    if ($scope.allowMultiple) {
      angular.forEach($scope.panes, function (iteratedPane) {
        ctrl.expand(iteratedPane);
      });
    } else {
      throw new Error('The `allow-multiple` attribute can\'t be found');
    }
  };

  ctrl.collapseAll = function (exceptionalPane) {
    if ($scope.isDisabled) { return; }

    angular.forEach($scope.panes, function (iteratedPane) {
      if (iteratedPane !== exceptionalPane) {
        ctrl.collapse(iteratedPane);
      }
    });
  };

  // API
  $scope.internalControl = {
    // Methods
    toggle: function (paneIndex) {
      ctrl.toggle( getPaneByIndex(paneIndex) );
    },
    expand: function (paneIndex) {
      ctrl.expand( getPaneByIndex(paneIndex) );
    },
    collapse: function (paneIndex) {
      ctrl.collapse( getPaneByIndex(paneIndex) );
    },
    expandAll: ctrl.expandAll,
    collapseAll: ctrl.collapseAll,

    // Callbacks
    onExpand: function () {},
    onCollapse: function () {}
  };
}
AccordionDirectiveController.$inject = ['$scope'];




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
          throw new Error('The `v-pane-header` directive can\'t be found');
        }

        if (!paneContentNative) {
          throw new Error('The `v-pane-content` directive can\'t be found');
        }

        var paneInnerNative = paneContentNative.querySelector('div');

        var paneHeaderElement = angular.element(paneHeaderNative),
            paneContentElement = angular.element(paneContentNative);

        var expandedStateClass = accordionConfig.classes.expandedState;

        accordionCtrl.addPane(scope);
        scope.accordionCtrl = accordionCtrl;

        paneContentNative.style.maxHeight = '0px';

        function expand () {
          accordionCtrl.disable();

          var paneInnerHeight = paneInnerNative.offsetHeight;
          paneContentNative.style.maxHeight = '0px';

          $timeout(function () {
            $animate.addClass(paneContentElement, expandedStateClass)
              .then(function () {
                accordionCtrl.enable();
                paneContentNative.style.maxHeight = 'none';
              });

            setTimeout(function () {
              paneContentNative.style.maxHeight = paneInnerHeight + 'px';
            }, 0);
          }, 0);

          iElement.addClass(expandedStateClass);
          paneHeaderElement.addClass(expandedStateClass);
        }

        function collapse () {
          accordionCtrl.disable();

          var paneInnerHeight = paneInnerNative.offsetHeight;

          paneContentNative.style.maxHeight = paneInnerHeight + 'px';

          $timeout(function () {
            $animate.removeClass(paneContentElement, expandedStateClass)
              .then(function () {
                accordionCtrl.enable();
              });

            setTimeout(function () {
              paneContentNative.style.maxHeight = '0px';
            }, 0);
          }, 0);

          iElement.removeClass(expandedStateClass);
          paneHeaderElement.removeClass(expandedStateClass);
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


})(angular);