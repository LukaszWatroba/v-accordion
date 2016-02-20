describe('v-pane directive', function () {

  var $compile;
  var $rootScope;
  var accordionConfig;
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

  var generateTemplate = function (options) {
    var dafaults = {
      transcludedContent: '',
      paneId: false,
      accordionId: false,
      paneAttribute: false,
      accordionAttribute: false
    };

    if (options) {
      angular.extend(dafaults, options);
    }

    var template = '<v-accordion';
        template += (dafaults.accordionId) ? ' id="' + dafaults.accordionId + '"' : '';
        template += '>\n';
        template += '<v-pane';
        template += (dafaults.paneId) ? ' id="' + dafaults.paneId + '"' : '';
        template += (dafaults.paneAttribute) ? ' ' + dafaults.paneAttribute : '';
        template += '>\n';
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



  it('should throw an error if `v-accordion` directive controller can\'t be found', function () {
    var template = '<v-pane></v-pane>';

    expect(function () { $compile(template)(scope); }).toThrow();
  });


  it('should throw an error if `v-pane-header` can\'t be found found', function () {
    var template =  '<v-accordion>\n' +
                    '  <v-pane></v-pane>\n' +
                    '</v-accordion>';

    expect(function () { $compile(template)(scope); }).toThrow();
  });


  it('should throw an error if `v-pane-content` can\'t be found found', function () {
    var template =  '<v-accordion>\n' +
                    '  <v-pane>\n' +
                    '    <v-pane-header></v-pane-header>\n' +
                    '  </v-pane>\n' +
                    '</v-accordion>';

    expect(function () { $compile(template)(scope); }).toThrow();
  });


  it('should transclude scope', function () {
    var message = 'Hello World!';
    var options = { transcludedContent: '{{ message }}' };

    var template = generateTemplate(options);

    var accordion = $compile(template)(scope);
    var paneContent = accordion.find('v-pane-content');

    scope.message = message;
    scope.$digest();

    expect(paneContent.html()).toContain(message);
  });


  it('should set pane `internalControl` as `$pane` property on transcluded scope', function () {
    var options = { paneId: 'testPane' };

    var template = generateTemplate(options);

    var accordion = $compile(template)(scope);
    var transcludedScope = accordion.find('v-pane-content').scope();

    expect(scope.$pane).not.toBeDefined();
    expect(transcludedScope.$pane).toBeDefined();
    expect(transcludedScope.$pane.id).toEqual(options.paneId);
    expect(transcludedScope.$pane.toggle).toBeDefined();
    expect(transcludedScope.$pane.expand).toBeDefined();
    expect(transcludedScope.$pane.collapse).toBeDefined();
    expect(transcludedScope.$pane.isExpanded).toBeDefined();
  });


  it('should throw an error if multiple panes has `expanded` attribute, but the `multiple` is not set', function () {
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

    expect(function () {
      $compile(template)(scope);
      scope.$digest();
    }).toThrow();
  });


  it('should set `isExpanded` flag to `true` if expanded attribute is added and has no value', function () {
    var options = { paneAttribute: 'expanded' };
    var template = generateTemplate(options);

    var accordion = $compile(template)(scope);
    var pane = accordion.find('v-pane');

    expect(pane.isolateScope().isExpanded).toBe(true);
  });


  it('should watch the `isExpanded` value and add `is-expanded` class when it is changed to `true`', function () {
    var template = generateTemplate();

    var accordion = $compile(template)(scope);
    var pane = accordion.find('v-pane');

    var paneIsolateScope = pane.isolateScope();
        paneIsolateScope.$digest();

    expect(pane.hasClass('is-expanded')).toBe(false);

    paneIsolateScope.isExpanded = true;
    paneIsolateScope.$digest();

    expect(pane.hasClass('is-expanded')).toBe(true);
  });


  it('should set `isDisabled` flag to `true` if disabled attribute is added and has no value', function () {
    var options = { paneAttribute: 'disabled' };
    var template = generateTemplate(options);

    var accordion = $compile(template)(scope);
    var pane = accordion.find('v-pane');
    var paneHeader = accordion.find('v-pane-header');

    var paneIsolateScope = pane.isolateScope();

    paneHeader.click();

    expect(paneIsolateScope.isDisabled).toBe(true);
    expect(paneIsolateScope.isExpanded).toBe(false);
  });


  it('should works with `ng-repeat` directive', function () {
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

    expect(accordion.find('v-pane').length).toEqual(length);
  });


  it('should emit `onExpand` and `onCollapse` events', function () {
    var options = { accordionId: 'testAccordion' };
    var template = generateTemplate(options);

    var accordion = $compile(template)(scope);
    var pane = accordion.find('v-pane');

    var paneIsolateScope = pane.isolateScope();
        paneIsolateScope.$digest();

    spyOn(paneIsolateScope, '$emit');

    paneIsolateScope.isExpanded = true;
    paneIsolateScope.$digest();

    expect(paneIsolateScope.$emit).toHaveBeenCalledWith(options.accordionId + ':onExpand');

    paneIsolateScope.isExpanded = false;
    paneIsolateScope.$digest();

    expect(paneIsolateScope.$emit).toHaveBeenCalledWith(options.accordionId + ':onCollapse');
  });

});
