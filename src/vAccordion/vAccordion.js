

// Config
angular.module('vAccordion.config', [])
  .constant('accordionConfig', {
    states: {
      expanded: 'is-expanded',
      disabled: 'is-disabled'
    }
  });


// Modules
angular.module('vAccordion.directives', []);
angular.module('vAccordion',
  [
    'vAccordion.config',
    'vAccordion.directives'
  ]);
