# AngularJS multi-level accordion
  
  - Allows for a nested structure
  - Works with (or without) `ng-repeat`
  - Allows multiple sections open at once
  - Optimized for mobile devices


## Demo
Watch the vAccordion component in action on the [demo page](http://lukaszwatroba.github.io/v-accordion).


## Requirements
  - AngularJS
  - ngAnimate


## Usage
  - If you use [bower](http://bower.io/), just `bower install v-accordion`. If not, download files [from the github repo](./dist).

  - Include `angular.js`, `angular-animate.js`, `v-accoridon.js`, and `v-accoridon.css`:
  ```html
  <link href="v-accoridon.css" rel="stylesheet" />

  <script src="angular.js"></script>
  <script src="angular-animate.js"></script>

  <script src="v-accordion.js"></script>
  ```

  - Add `vAccordion` as a dependency to your application module:
  ```js
  angular.module('myApp', ['vAccordion']);
  ```

  - Put the following markup in your template:
  ```html
  <!-- add allow-multiple attribute to allow multiple sections open at once -->
  <v-accordion allow-multiple>
    
    <!-- add expanded attribute to open first section -->
    <v-pane expanded>
      <v-pane-header>
        Pane header #1
      </v-pane-header>

      <v-pane-content>
        Pane content #1
      </v-pane-content>
    </v-pane>

    <v-pane>
      <v-pane-header>
        Pane header #2
      </v-pane-header>

      <v-pane-content>
        Pane content #2
      </v-pane-content>
    </v-pane>

  </v-accordion>
  ```

  - You can also use `v-accordion` with `ng-repeat`:
  ```html
  <v-accordion>

    <v-pane ng-repeat="pane in panes" expanded="$first">
      <v-pane-header>
        {{ pane.header }}
      </v-pane-header>

      <v-pane-content>
        {{ pane.content }}
        
        <!-- accordions can be nested :) -->
        <v-accordion ng-if="pane.subpanes">
          <v-pane ng-repeat="subpane in pane.subpanes">
            <v-pane-header>
              {{ subpane.header }}
            </v-pane-header>
            <v-pane-content>
              {{ subpane.content }}
            </v-pane-content>
          </v-pane>
        </v-accordion>
      </v-pane-content>
    </v-pane>

  </v-accordion>
  ```


## API

To use API methods add `control` attribute, like so:
```html
<v-accordion allow-multiple control="accordionControl">
  <v-pane ng-repeat="pane in panes" expanded="$first">
    <v-pane-header>
      {{ pane.header }}
    </v-pane-header>

    <v-pane-content>
      {{ pane.content }}
    </v-pane-content>
  </v-pane>
</v-accordion>

<button ng-click="accordionControl.toggle(0)">Toggle first pane</button>
<button ng-click="accordionControl.expandAll()">Expand all</button>
<button ng-click="accordionControl.collapseAll()">Collapse all</button>
```

Use these callbacks to get expanded/collapsed pane index:
```js
$scope.accordionControl = {
  onExpand: function (expandedPaneIndex) {
    console.log('expanded:', expandedPaneIndex);
  },
  onCollapse: function (collapsedPaneIndex) {
    console.log('collapsed:', collapsedPaneIndex);
  }
};
```

#### Methods
  - `toggle(paneIndex)`
  - `expand(paneIndex)`
  - `collapse(paneIndex)`
  - `expandAll()`
  - `collapseAll()`

#### Callbacks
  - `onExpand(paneIndex)`
  - `onCollapse(paneIndex)`


## Config
You can override the default class names:

```js
angular
  .module('myApp', [ 'vAccordion' ])

  .config(function (accordionConfig) {
    
    accordionConfig.classes.accordion = 'MyAccordion';
    accordionConfig.classes.pane = 'MyAccordion-pane';
    accordionConfig.classes.paneHeader = 'MyAccordion-paneHeader';
    accordionConfig.classes.paneContent = 'MyAccordion-paneContent';

    accordionConfig.classes.expandedState = 'active';

  })
```

## Todo
  - More tests!

