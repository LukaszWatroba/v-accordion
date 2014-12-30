

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
              throw new Error(iteratedMethodName + ' method can not be overwritten');
            }
          });
        }

        function checkCustomControlCallbacks () {
          if (!angular.isFunction( scope.control.onExpand )) {
            throw new Error('onExpand callback must be a function');
          }

          if (!angular.isFunction( scope.control.onCollapse )) {
            throw new Error('onCollapse callback must be a function');
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
AccordionDirectiveController.$inject = ['$scope'];

