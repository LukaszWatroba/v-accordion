'use strict';

describe('An vAccordion module', function () {

  var accordionConfig;

  var getSamplePanes = function (length) {
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

  beforeEach(inject(function (_accordionConfig_) {
    accordionConfig = _accordionConfig_;
  }));


  it('should load all dependencies', function () {
    var dependencies = angular.module('vAccordion').requires;

    expect(dependencies).toContain('ngAnimate');
    expect(dependencies).toContain('vAccordion.config');
    expect(dependencies).toContain('vAccordion.controllers');
    expect(dependencies).toContain('vAccordion.directives');
  });


  describe('directives:', function () {
    var $scope, $compile;


    beforeEach(inject(function (_$rootScope_, _$compile_) {
      $scope = _$rootScope_;
      $compile = _$compile_;
    }));

    afterEach(function () {
      $scope.$destroy();
    });


    describe('v-accordion', function () {

      it('should replace v-accordion with div element and add a class', function () {
        var template = '<v-accordion></v-accordion>';

        var $element = $compile(template)($scope);

        expect($element.prop('tagName')).toBe('DIV');
        expect($element.hasClass(accordionConfig.classes.accordion)).toBe(true);
      });

      it('should transclude scope', function () {
        var message = 'Hello World!';

        var template = '<v-accordion>{{ message }}</v-accordion>';

        var $element = $compile(template)($scope);

        $scope.message = message;
        $scope.$digest();

        expect($element.html()).toContain(message);
        expect($element.attr('ng-transclude')).toBeDefined();
      });

      it('should allow multiple selections even if allow-multiple attribute has no value', function () {
        var template = '<v-accordion allow-multiple></v-accordion>';
        var $element = $compile(template)($scope);

        expect($element.isolateScope().allowMultiple).toBe(true);
      });

    }); // end of: describe (v-accordion)


    describe('v-pane', function () {

      it('should throw an error if is used outside v-accordion directive', function () {
        var template = '<v-pane></v-pane>';

        expect(function () { $compile(template)($scope); }).toThrow();
      });

      it('should throw an error if v-pane-header is not found', function () {
        var template =  '<v-accordion>\n' +
                        '  <v-pane></v-pane>\n' +
                        '</v-accordion>';

        expect(function () { $compile(template)($scope); }).toThrow(new Error('v-pane-header not found'));
      });

      it('should throw an error if v-pane-content is not found', function () {
        var template =  '<v-accordion>\n' +
                        '  <v-pane>\n' +
                        '    <v-pane-header></v-pane-header>\n' +
                        '  </v-pane>\n' +
                        '</v-accordion>';

        expect(function () { $compile(template)($scope); }).toThrow(new Error('v-pane-content not found'));
      });

      it('should replace v-pane with div element and add a class', function () {
        var template =  '<v-accordion>\n' +
                        '  <v-pane>\n' +
                        '    <v-pane-header></v-pane-header>\n' +
                        '    <v-pane-content></v-pane-content>\n' +
                        '  </v-pane>\n' +
                        '</v-accordion>';

        var $element = $compile(template)($scope);
        var $pane = $element.find('.' + accordionConfig.classes.pane);

        expect($pane[0]).toBeDefined();
        expect($pane.prop('tagName')).toBe('DIV');
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

        var $element = $compile(template)($scope);
        var $pane = $element.find('.' + accordionConfig.classes.pane);

        $scope.message = message;
        $scope.$digest();

        expect($pane.html()).toContain(message);
      });

      it('should set isExpanded flag to true if expanded attribute is added and has no value', function () {
        var template =  '<v-accordion>\n' +
                        '  <v-pane expanded>\n' +
                        '    <v-pane-header></v-pane-header>\n' +
                        '    <v-pane-content></v-pane-content>\n' +
                        '  </v-pane>\n' +
                        '</v-accordion>';

        var $element = $compile(template)($scope);
        var $pane = $element.find('.' + accordionConfig.classes.pane);

        expect($pane.isolateScope().isExpanded).toBe(true);
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

        expect(function () { $compile(template)($scope); }).toThrow();
      });

      it('should works with ng-repeat', function () {
        var length = 3;
       
        var template =  '<v-accordion>\n' +
                        '  <v-pane ng-repeat="pane in panes">\n' +
                        '    <v-pane-header>{{ pane.header }}</v-pane-header>\n' +
                        '    <v-pane-content>{{ pane.content }}</v-pane-content>\n' +
                        '  </v-pane>\n' +
                        '</v-accordion>';

        var $element = $compile(template)($scope);

        $scope.panes = getSamplePanes(length);
        $scope.$digest();
        
        expect($element.find('.' + accordionConfig.classes.pane).length).toEqual(length);
      });

      it('should watch the isExpanded value and add expanded state classes when it is changed to true', function () {
        var expandedStateClass = accordionConfig.classes.expandedState;

        var template =  '<v-accordion>\n' +
                        '  <v-pane>\n' +
                        '    <v-pane-header></v-pane-header>\n' +
                        '    <v-pane-content></v-pane-content>\n' +
                        '  </v-pane>\n' +
                        '</v-accordion>';

        var $element = $compile(template)($scope);

        var $pane = $element.find('.' + accordionConfig.classes.pane);
        var $paneContent = $element.find('.' + accordionConfig.classes.paneContent);
        var $paneHeader = $element.find('.' + accordionConfig.classes.paneHeader);

        var paneIsolateScope = $pane.isolateScope();
            paneIsolateScope.$digest();

        expect($pane.hasClass(expandedStateClass) &&
               $paneContent.hasClass(expandedStateClass) &&
               $paneHeader.hasClass(expandedStateClass)).toBe(false);

        paneIsolateScope.isExpanded = true;
        paneIsolateScope.$digest();

        expect($pane.hasClass(expandedStateClass) &&
               $paneContent.hasClass(expandedStateClass) &&
               $paneHeader.hasClass(expandedStateClass)).toBe(true);
      });

    }); // end of: describe (v-pane)


    describe('v-pane-header', function () {

      it('should throw an error if is used outside v-pane directive', function () {
        var template = '<v-pane-header></v-pane-header>';

        expect(function () { $compile(template)($scope); }).toThrow();
      });

      it('should replace v-pane-header with div element and add a class', function () {
        var template =  '<v-accordion>\n' +
                        '  <v-pane>\n' +
                        '    <v-pane-header></v-pane-header>\n' +
                        '    <v-pane-content></v-pane-content>\n' +
                        '  </v-pane>\n' +
                        '</v-accordion>';

        var $element = $compile(template)($scope);
        var $paneHeader = $element.find('.' + accordionConfig.classes.paneHeader);

        expect($paneHeader[0]).toBeDefined();
        expect($paneHeader.prop('tagName')).toBe('DIV');
      });

      it('should transclude scope and create inner div wrapper', function () {
        var message = 'Hello World!';

        var template =  '<v-accordion>\n' +
                        '  <v-pane>\n' +
                        '    <v-pane-header>{{ message }}</v-pane-header>\n' +
                        '    <v-pane-content></v-pane-content>\n' +
                        '  </v-pane>\n' +
                        '</v-accordion>';

        var $element = $compile(template)($scope);
        var $paneHeader = $element.find('.' + accordionConfig.classes.paneHeader);

        $scope.message = message;
        $scope.$digest();

        expect($paneHeader.html()).toContain(message);
        expect($paneHeader.html()).toContain('<div ng-transclude="">');
      });

      it('should toggle the pane on click', function () {
        var template =  '<v-accordion>\n' +
                        '  <v-pane>\n' +
                        '    <v-pane-header></v-pane-header>\n' +
                        '    <v-pane-content></v-pane-content>\n' +
                        '  </v-pane>\n' +
                        '</v-accordion>';

        var $element = $compile(template)($scope);
        var $pane = $element.find('.' + accordionConfig.classes.pane);
        var $paneHeader = $element.find('.' + accordionConfig.classes.paneHeader);

        var paneIsolateScope = $pane.isolateScope();

        expect(paneIsolateScope.isExpanded).toBe(false);
        $paneHeader.click();
        expect(paneIsolateScope.isExpanded).toBe(true);
        $paneHeader.click();
        expect(paneIsolateScope.isExpanded).toBe(false);
      });

    }); // end of: describe (v-pane-header)

    
    describe('v-pane-content', function () {

      it('should throw an error if is used outside v-pane directive', function () {
        var template = '<v-pane-content></v-pane-content>';

        expect(function () { $compile(template)($scope); }).toThrow();
      });

      it('should replace v-pane-content with div element and add a class', function () {
        var template =  '<v-accordion>\n' +
                        '  <v-pane>\n' +
                        '    <v-pane-header></v-pane-header>\n' +
                        '    <v-pane-content></v-pane-content>\n' +
                        '  </v-pane>\n' +
                        '</v-accordion>';

        var $element = $compile(template)($scope);
        var $paneContent = $element.find('.' + accordionConfig.classes.paneContent);

        expect($paneContent[0]).toBeDefined();
        expect($paneContent.prop('tagName')).toBe('DIV');
      });

      it('should transclude scope and create inner div wrapper', function () {
        var message = 'Hello World!';

        var template =  '<v-accordion>\n' +
                        '  <v-pane>\n' +
                        '    <v-pane-header></v-pane-header>\n' +
                        '    <v-pane-content>{{ message }}</v-pane-content>\n' +
                        '  </v-pane>\n' +
                        '</v-accordion>';

        var $element = $compile(template)($scope);
        var $paneContent = $element.find('.' + accordionConfig.classes.paneContent);

        $scope.message = message;
        $scope.$digest();

        expect($paneContent.html()).toContain(message);
        expect($paneContent.html()).toContain('<div ng-transclude="">');
      });

    }); // end of: describe (v-pane-content)


  }); // end of: describe (directives)


});