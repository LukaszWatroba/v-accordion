describe('v-accordion directive', function () {

  var $compile;
  var $rootScope;
  var acordionConfig;
  var scope;

  var generateTemplate = function (options) {
    var dafaults = {
      allowMultiple: false,
      customControl: false,
      transcludedContent: null
    };

    if (options) {
      angular.extend(dafaults, options);
    }

    var template = '<v-accordion';
    template += (dafaults.allowMultiple) ? ' allow-multiple' : '';
    template += (dafaults.customControl) ? ' control="customControl"' : '';
    template += '>\n';
    template += (dafaults.transcludedContent) ? dafaults.transcludedContent : '';
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



  it('should replace v-accordion with div element and add a class', function () {
    var template = generateTemplate();
    var accordion = $compile(template)(scope);

    expect(accordion.prop('tagName')).toBe('DIV');
    expect(accordion.hasClass(accordionConfig.classes.accordion)).toBe(true);
  });


  it('should transclude scope', function () {
    var message = 'Hello World!';

    var template = generateTemplate({ transcludedContent: '{{ message }}' });
    var accordion = $compile(template)(scope);

    scope.message = message;
    scope.$digest();

    expect(accordion.html()).toContain(message);
    expect(accordion.attr('ng-transclude')).toBeDefined();
  });


  it('should allow multiple selections even if allow-multiple attribute has no value', function () {
    var template = generateTemplate({ allowMultiple: true });
    var accordion = $compile(template)(scope);

    expect(accordion.isolateScope().allowMultiple).toBe(true);
  });


  it('should merge custom control object with internal control', function () {
    var template = generateTemplate({ customControl: true });
    var accordion = $compile(template)(scope);

    scope.customControl = { someProperty: 'test' };
    scope.$digest();

    expect(accordion.isolateScope().internalControl.someProperty).toBeDefined();
    expect(accordion.isolateScope().internalControl.someProperty).toBe('test');
  });


  it('should throw an error if api method is overriden in custom control object', function () {
    var template = generateTemplate({ customControl: true });
    var accordion = $compile(template)(scope);

    scope.customControl = { toggle: function () {} };
    
    expect(function () { scope.$digest(); }).toThrow();
  });


  it('should throw an error if callback is not a function', function () {
    var template = generateTemplate({ customControl: true });
    var accordion = $compile(template)(scope);

    scope.customControl = { onExpand: 'not a function' };
    
    expect(function () { scope.$digest(); }).toThrow();
  });



  describe('controller', function () {

    var accordion;
    var isolateScope;
    var controller;

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



    beforeEach(function () {
      var template = generateTemplate({ allowMultiple: true, customControl: true });
      accordion = $compile(template)(scope);
      $rootScope.$digest();

      isolateScope = accordion.isolateScope();
      controller = accordion.controller('vAccordion');
    });



    it('should add pane to array', function () {
      var samplePane = generatePanes(1)[0];

      expect(isolateScope.panes.length).toBe(0);

      controller.addPane(samplePane);

      expect(isolateScope.panes.length).toBeGreaterThan(0);
    });


    it('should expand pane and call onExpand callback', function () {
      var samplePanes = generatePanes(5);
      var paneToExpandIndex = 0;
      var paneToExpand = samplePanes[paneToExpandIndex];

      for (var i = 0; i < samplePanes.length; i++) {
        controller.addPane(samplePanes[i]);
      };

      spyOn(isolateScope.internalControl, 'onExpand');

      expect(isolateScope.panes[paneToExpandIndex].isExpanded).toBeFalsy();

      controller.expand(paneToExpand);

      expect(isolateScope.panes[paneToExpandIndex].isExpanded).toBeTruthy();

    });

  });

});