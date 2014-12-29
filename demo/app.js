(function (angular) {
  'use strict';

  angular
    .module('myApp', [ 'vAccordion' ])

    // You can override the default class names
    .config(function (accordionConfig) {

      accordionConfig.classes = {
        accordion: 'Accordion Accordion--dafault',
        pane: 'Accordion-pane',
        paneHeader: 'Accordion-paneHeader',
        paneContent: 'Accordion-paneContent',

        expandedState: 'is-expanded'
      };

    })

    .controller('MainController', function ($scope) {

      $scope.firstAccordionControl = {
        onExpand: function (expandedPaneIndex) {
          console.log('expanded:', expandedPaneIndex);
        },
        onCollapse: function (collapsedPaneIndex) {
          console.log('collapsed:', collapsedPaneIndex);
        }
      };

      $scope.panes = [
        {
          header: 'Pane 1',
          content: 'Curabitur et ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum adipiscing wisi.'
        },
        {
          header: 'Pane 2',
          content: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies.'
        },
        {
          header: 'Pane 3',
          content: 'Aliquam erat ac ipsum. Integer aliquam purus. Quisque lorem tortor fringilla sed, vestibulum id, eleifend justo vel bibendum sapien massa ac turpis faucibus orci luctus non.',

          subpanes: [
            {
              header: 'Subpane 1',
              content: 'Lorem ipsum dolor sit amet enim.'
            },
            {
              header: 'Subpane 2',
              content: 'Curabitur et ligula. Ut molestie a, ultricies porta urna. Quisque lorem tortor fringilla sed, vestibulum id.'
            }
          ]
        }
      ];
      
    });

})(angular);