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
        throw new Error('allow-multiple attribute is not set');
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
      throw new Error('allow-multiple attribute is not set');
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

        if (!scope.control) {
          scope.control = scope.internalControl();
          return;
        }

        var protectedApiMethods = ['toggle', 'expand', 'collapse', 'expandAll', 'collapseAll'];

        angular.forEach(protectedApiMethods, function (iteratedMethodName) {
          if (scope.control[iteratedMethodName]) {
            throw new Error(iteratedMethodName + ' method can not be overwritten');
          }
        });

        var mergedControl = angular.extend({}, scope.internalControl, scope.control);
        scope.control = scope.internalControl = mergedControl;

        if (!angular.isFunction( scope.control.onExpand )) {
          throw new Error('onExpand callback must be a function');
        }

        if (!angular.isFunction( scope.control.onCollapse )) {
          throw new Error('onCollapse callback must be a function');
        }
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
