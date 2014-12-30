describe('v-accordion directive', function () {

  var $scope;
  var $compile;
  var acordionConfig;



  beforeEach(module('vAccordion'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _accordionConfig_) {
    $scope = _$rootScope_;
    $compile = _$compile_;
    accordionConfig = _accordionConfig_;
  }));

  afterEach(function () {
    $scope.$destroy();
  });



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


  it('should merge custom control object with internal control', function () {
    var template = '<v-accordion control="customControl"></v-accordion>';
    var $element = $compile(template)($scope);

    $scope.customControl = { someProperty: 'test' };
    $scope.$digest();

    expect($element.isolateScope().internalControl.someProperty).toBeDefined();
    expect($element.isolateScope().internalControl.someProperty).toBe('test');
  });


  it('should throw an error if api method is overriden in custom control object', function () {
    var template = '<v-accordion control="customControl"></v-accordion>';
    var $element = $compile(template)($scope);

    $scope.customControl = { toggle: function () {} };
    
    expect(function () { $scope.$digest(); }).toThrow();
  });


  it('should throw an error if callback is not a function', function () {
    var template = '<v-accordion control="customControl"></v-accordion>';
    var $element = $compile(template)($scope);

    $scope.customControl = { onExpand: 'not a function' };
    
    expect(function () { $scope.$digest(); }).toThrow();
  });

});