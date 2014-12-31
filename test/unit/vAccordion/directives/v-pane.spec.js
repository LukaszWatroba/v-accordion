describe('v-pane directive', function () {
  
  var $compile;
  var $rootScope;
  var acordionConfig;
  var scope;

  var generatePanes = function (length) {
    var samplePanes = [];

    for (var i = 0; i < length; i++) {
      var samplePane = {
        header: 'Pane header #' + i,
        content: 'Pane content #' + i
      };

      samplePanes.push(samplePane);
    }

    return samplePanes;
  };



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



  it('should throw an error if is used outside v-accordion directive', function () {
    var template = '<v-pane></v-pane>';

    expect(function () { $compile(template)(scope); }).toThrow();
  });


  it('should throw an error if v-pane-header is not found', function () {
    var template =  '<v-accordion>\n' +
                    '  <v-pane></v-pane>\n' +
                    '</v-accordion>';

    expect(function () { $compile(template)(scope); }).toThrow(new Error('v-pane-header not found'));
  });


  it('should throw an error if v-pane-content is not found', function () {
    var template =  '<v-accordion>\n' +
                    '  <v-pane>\n' +
                    '    <v-pane-header></v-pane-header>\n' +
                    '  </v-pane>\n' +
                    '</v-accordion>';

    expect(function () { $compile(template)(scope); }).toThrow(new Error('v-pane-content not found'));
  });


  it('should replace v-pane with div element and add a class', function () {
    var template =  '<v-accordion>\n' +
                    '  <v-pane>\n' +
                    '    <v-pane-header></v-pane-header>\n' +
                    '    <v-pane-content></v-pane-content>\n' +
                    '  </v-pane>\n' +
                    '</v-accordion>';

    var accordion = $compile(template)(scope);
    var pane = accordion.find('.' + accordionConfig.classes.pane);

    expect(pane[0]).toBeDefined();
    expect(pane.prop('tagName')).toBe('DIV');
  });


  it('should transclude scope', function () {
    var message = 'Hello World!';

    var template =  '<v-accordion>\n' +
                    '  <v-pane>\n' +
                    '    <v-pane-header></v-pane-header>\n' +
                    '    <v-pane-content></v-pane-content>\n' +
                    '    {{ message }}\n' +
                    '  </v-pane>\n' +
                    '</v-accordion>';

    var accordion = $compile(template)(scope);
    var pane = accordion.find('.' + accordionConfig.classes.pane);

    scope.message = message;
    scope.$digest();

    expect(pane.html()).toContain(message);
  });


  it('should set isExpanded flag to true if expanded attribute is added and has no value', function () {
    var template =  '<v-accordion>\n' +
                    '  <v-pane expanded>\n' +
                    '    <v-pane-header></v-pane-header>\n' +
                    '    <v-pane-content></v-pane-content>\n' +
                    '  </v-pane>\n' +
                    '</v-accordion>';

    var accordion = $compile(template)(scope);
    var pane = accordion.find('.' + accordionConfig.classes.pane);

    expect(pane.isolateScope().isExpanded).toBe(true);
  });


  it('should throw an error if multiple panes has expanded attribute, but the allow-multiple is not set', function () {
    var template =  '<v-accordion>\n' +
                    '  <v-pane expanded>\n' +
                    '    <v-pane-header></v-pane-header>\n' +
                    '    <v-pane-content></v-pane-content>\n' +
                    '  </v-pane>\n' +
                    '  <v-pane expanded>\n' +
                    '    <v-pane-header></v-pane-header>\n' +
                    '    <v-pane-content></v-pane-content>\n' +
                    '  </v-pane>\n' +
                    '</v-accordion>';

    expect(function () { $compile(template)(scope); }).toThrow();
  });


  it('should works with ng-repeat', function () {
    var length = 3;
   
    var template =  '<v-accordion>\n' +
                    '  <v-pane ng-repeat="pane in panes">\n' +
                    '    <v-pane-header>{{ pane.header }}</v-pane-header>\n' +
                    '    <v-pane-content>{{ pane.content }}</v-pane-content>\n' +
                    '  </v-pane>\n' +
                    '</v-accordion>';

    var accordion = $compile(template)(scope);

    scope.panes = generatePanes(length);
    scope.$digest();
    
    expect(accordion.find('.' + accordionConfig.classes.pane).length).toEqual(length);
  });


  it('should watch the isExpanded value and add expanded state classes when it is changed to true', function () {
    var expandedStateClass = accordionConfig.classes.expandedState;

    var template =  '<v-accordion>\n' +
                    '  <v-pane>\n' +
                    '    <v-pane-header></v-pane-header>\n' +
                    '    <v-pane-content></v-pane-content>\n' +
                    '  </v-pane>\n' +
                    '</v-accordion>';

    var accordion = $compile(template)(scope);

    var pane = accordion.find('.' + accordionConfig.classes.pane);
    var paneContent = accordion.find('.' + accordionConfig.classes.paneContent);
    var paneHeader = accordion.find('.' + accordionConfig.classes.paneHeader);

    var paneIsolateScope = pane.isolateScope();
        paneIsolateScope.$digest();

    expect(pane.hasClass(expandedStateClass) &&
           paneContent.hasClass(expandedStateClass) &&
           paneHeader.hasClass(expandedStateClass)).toBe(false);

    paneIsolateScope.isExpanded = true;
    paneIsolateScope.$digest();

    expect(pane.hasClass(expandedStateClass) &&
           paneContent.hasClass(expandedStateClass) &&
           paneHeader.hasClass(expandedStateClass)).toBe(true);
  });

});