describe('v-pane-header directive', function () {

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
    var template = '<v-pane-header></v-pane-header>';

    expect(function () { $compile(template)(scope); }).toThrow();
  });


  it('should replace v-pane-header with div accordion and add a class', function () {
    var template =  '<v-accordion>\n' +
                    '  <v-pane>\n' +
                    '    <v-pane-header></v-pane-header>\n' +
                    '    <v-pane-content></v-pane-content>\n' +
                    '  </v-pane>\n' +
                    '</v-accordion>';

    var accordion = $compile(template)(scope);
    var paneHeader = accordion.find('.' + accordionConfig.classes.paneHeader);

    expect(paneHeader[0]).toBeDefined();
    expect(paneHeader.prop('tagName')).toBe('DIV');
  });


  it('should transclude scope and create inner div wrapper', function () {
    var message = 'Hello World!';

    var template =  '<v-accordion>\n' +
                    '  <v-pane>\n' +
                    '    <v-pane-header>{{ message }}</v-pane-header>\n' +
                    '    <v-pane-content></v-pane-content>\n' +
                    '  </v-pane>\n' +
                    '</v-accordion>';

    var accordion = $compile(template)(scope);
    var paneHeader = accordion.find('.' + accordionConfig.classes.paneHeader);

    scope.message = message;
    scope.$digest();

    expect(paneHeader.html()).toContain(message);
    expect(paneHeader.html()).toContain('<div ng-transclude="">');
  });


  it('should toggle the pane on click', function () {
    var template =  '<v-accordion>\n' +
                    '  <v-pane>\n' +
                    '    <v-pane-header></v-pane-header>\n' +
                    '    <v-pane-content></v-pane-content>\n' +
                    '  </v-pane>\n' +
                    '</v-accordion>';

    var accordion = $compile(template)(scope);
    var pane = accordion.find('.' + accordionConfig.classes.pane);
    var paneHeader = accordion.find('.' + accordionConfig.classes.paneHeader);

    var paneIsolateScope = pane.isolateScope();

    expect(paneIsolateScope.isExpanded).toBe(false);
    paneHeader.click();
    expect(paneIsolateScope.isExpanded).toBe(true);
    paneHeader.click();
    expect(paneIsolateScope.isExpanded).toBe(false);
  });

});