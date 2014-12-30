

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

