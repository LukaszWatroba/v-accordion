/**
 * vAccordion - AngularJS multi-level accordion component
 * @version v0.0.3
 * @link http://lukaszwatroba.github.io/v-accordion
 * @author Łukasz Wątroba <l@lukaszwatroba.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function(angular) {

'use strict';

// Module
angular
  .module('vAccordion', 
    [
      'ngAnimate',

      'vAccordion.config',
      'vAccordion.controllers',
      'vAccordion.directives'
    ]);


// Config
angular
  .module('vAccordion.config', [])

  .constant('accordionConfig', {
    classes: {
      accordion: 'Accordion Accordion--dafault',
      pane: 'Accordion-pane',
      paneHeader: 'Accordion-paneHeader',
      paneContent: 'Accordion-paneContent',

      expandedState: 'is-expanded'
    }
  });


// Controllers
angular
  .module('vAccordion.controllers', [])

  .controller('vAccordionController', vAccordionController)
  .controller('vPaneController', vPaneController);

function vAccordionController ($scope) {
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

  ctrl.addPane = function (pane) {
    if (!$scope.allowMultiple) {
      if (hasExpandedPane() && pane.isExpanded) {
        throw new Error('The allow-multiple attribute is not set');
      } 
    }

    $scope.panes.push(pane);
  };

  ctrl.disable = function () {
    $scope.isDisabled = true;
  };

  ctrl.enable = function () {
    $scope.isDisabled = false;
  };

  ctrl.expandAll = function () {
    if ($scope.isDisabled) { return; }

    if ($scope.allowMultiple) {
      angular.forEach($scope.panes, function (iteratedPane) {
        iteratedPane.isExpanded = true;
      });
    } else {
      throw new Error('The attribute allow-multiple is not set');
    }
  };

  ctrl.collapseAll = function (exceptionalPane) {
    if ($scope.isDisabled) { return; }

    angular.forEach($scope.panes, function (iteratedPane) {
      if (iteratedPane !== exceptionalPane) {
        iteratedPane.isExpanded = false;
      }
    });
  };

  ctrl.toggle = function (paneToToggle) {
    if ($scope.isDisabled || !paneToToggle) { return; }

    if (!$scope.allowMultiple) {
      ctrl.collapseAll(paneToToggle);
    }

    paneToToggle.isExpanded = !paneToToggle.isExpanded;
  };

  ctrl.expand = function (paneToExpand) {
    if ($scope.isDisabled || !paneToExpand) { return; }

    if (!$scope.allowMultiple) {
      ctrl.collapseAll(paneToExpand);
    }

    paneToExpand.isExpanded = true;
  };

  ctrl.collapse = function (paneToCollapse) {
    if ($scope.isDisabled || !paneToCollapse) { return; }
    
    paneToCollapse.isExpanded = false;
  };

  $scope.internalControl = {
    toggle: function (paneIndex) {
      var paneToToggle = $scope.panes[paneIndex];
      ctrl.toggle(paneToToggle);
    },
    expand: function (paneIndex) {
      var paneToExpand = $scope.panes[paneIndex];
      ctrl.expand(paneToExpand);
    },
    collapse: function (paneIndex) {
      var paneToCollapse = $scope.panes[paneIndex];
      ctrl.collapse(paneToCollapse);
    },
    expandAll: ctrl.expandAll,
    collapseAll: ctrl.collapseAll
  };
}
vAccordionController.$inject = ['$scope'];


function vPaneController ($scope) {
  var ctrl = this;

  ctrl.toggle = function () {
    if (!$scope.isAnimating) {
      $scope.accordionCtrl.toggle($scope);
    }
  };
}
vPaneController.$inject = ['$scope'];


// Directives
angular
  .module('vAccordion.directives', [])

  .directive('vAccordion', vAccordionDirective)
  .directive('vPane', vPaneDirective)
  .directive('vPaneHeader', vPaneHeaderDirective)
  .directive('vPaneContent', vPaneContentDirective);

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
    controller: 'vAccordionController',
    compile: function (tElement) {
      tElement.addClass(accordionConfig.classes.accordion);

      return function postLink (scope, iElement, iAttrs) {
        if (!angular.isDefined(scope.allowMultiple)) {
          scope.allowMultiple = angular.isDefined(iAttrs.allowMultiple);
        }

        scope.control = scope.internalControl;
      };
    }
  };
}
vAccordionDirective.$inject = ['accordionConfig'];


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
    controller: 'vPaneController',
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

}(angular));