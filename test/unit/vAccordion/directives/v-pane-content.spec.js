describe('v-pane-content directive', function () {
  
  var $compile;
  var $rootScope;
  var accordionConfig;
  var scope;

  var generateTemplate = function (options) {
    var dafaults = {
      transcludedContent: ''
    };

    if (options) {
      angular.extend(dafaults, options);
    }

    var template = '<v-accordion>\n';
        template += '<v-pane>\n';
        template += '<v-pane-header></v-pane-header>\n';
        template += '<v-pane-content>' + dafaults.transcludedContent + '</v-pane-content>\n';
        template += '</v-pane>\n';
        template += '</v-accordion>';

    return template;
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
  
  

  it('should throw an error if is used outside v-pane directive', function () {
    var template = '<v-pane-content></v-pane-content>';

    expect(function () { $compile(template)(scope); }).toThrow();
  });


  it('should replace v-pane-content with div element and add a class', function () {
    var template = generateTemplate();

    var accordion = $compile(template)(scope);
    var paneContent = accordion.find('.' + accordionConfig.classes.paneContent);

    expect(paneContent[0]).toBeDefined();
    expect(paneContent.prop('tagName')).toBe('DIV');
  });


  it('should transclude scope and create inner div wrapper', function () {
    var message = 'Hello World!';

    var template = generateTemplate({ transcludedContent: '{{ message }}' });

    var accordion = $compile(template)(scope);
    var paneContent = accordion.find('.' + accordionConfig.classes.paneContent);

    scope.message = message;
    scope.$digest();

    expect(paneContent.html()).toContain(message);
    expect(paneContent.html()).toContain('<div ng-transclude="">');
  });

});