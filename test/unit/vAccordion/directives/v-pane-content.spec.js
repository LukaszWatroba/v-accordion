describe('v-pane-content directive', function () {
  
  var $compile;
  var $rootScope;
  var acordionConfig;
  var scope;



  beforeEach(module('vAccordion'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _accordionConfig_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $compile = _$compile_;
    accordionConfig = _accordionConfig_;
  }));

  afterEach(function () {
    scope.$destroy();
  });
  
  

  it('should throw an error if is used outside v-pane directive', function () {
    var template = '<v-pane-content></v-pane-content>';

    expect(function () { $compile(template)(scope); }).toThrow();
  });


  it('should replace v-pane-content with div element and add a class', function () {
    var template =  '<v-accordion>\n' +
                    '  <v-pane>\n' +
                    '    <v-pane-header></v-pane-header>\n' +
                    '    <v-pane-content></v-pane-content>\n' +
                    '  </v-pane>\n' +
                    '</v-accordion>';

    var accordion = $compile(template)(scope);
    var paneContent = accordion.find('.' + accordionConfig.classes.paneContent);

    expect(paneContent[0]).toBeDefined();
    expect(paneContent.prop('tagName')).toBe('DIV');
  });


  it('should transclude scope and create inner div wrapper', function () {
    var message = 'Hello World!';

    var template =  '<v-accordion>\n' +
                    '  <v-pane>\n' +
                    '    <v-pane-header></v-pane-header>\n' +
                    '    <v-pane-content>{{ message }}</v-pane-content>\n' +
                    '  </v-pane>\n' +
                    '</v-accordion>';

    var accordion = $compile(template)(scope);
    var paneContent = accordion.find('.' + accordionConfig.classes.paneContent);

    scope.message = message;
    scope.$digest();

    expect(paneContent.html()).toContain(message);
    expect(paneContent.html()).toContain('<div ng-transclude="">');
  });

});