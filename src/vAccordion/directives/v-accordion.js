

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
