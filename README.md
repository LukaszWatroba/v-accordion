
# AngularJS multi-level accordion
  
  - Allows for a nested structure
  - Works with (or without) `ng-repeat`
  - Allows multiple sections to be open at once
  - Optimized for mobile devices


## Demos

  - [GitHub](http://lukaszwatroba.github.io/v-accordion)
  - [CodePen](http://codepen.io/LukaszWatroba/pen/pvEOBZ)


## Usage

  - If you use [bower](http://bower.io/), just `bower install v-accordion`. If not, download files [from the github repo](./dist).

  - Include `angular.js`, `angular-animate.js`, `v-accordion.js`, and `v-accordion.css`:
  ```html
  <link href="v-accordion.css" rel="stylesheet" />

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
  <!-- add `multiple` attribute to allow multiple sections to open at once -->
  <v-accordion class="vAccordion--dafault" multiple>
    
    <!-- add expanded attribute to open the section -->
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
  <v-accordion class="vAccordion--dafault">

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

Use API methods to control accordion component:

```html
<v-accordion multiple control="accordion">

  <v-pane ng-repeat="pane in panes">
    <v-pane-header>
      {{ pane.header }}
    </v-pane-header>

    <v-pane-content>
      {{ pane.content }}
    </v-pane-content>
  </v-pane>
  
</v-accordion>

<button ng-click="accordion.toggle(0)">Toggle first pane</button>
<button ng-click="accordion.expandAll()">Expand all</button>
<button ng-click="accordion.collapseAll()">Collapse all</button>
```

#### Methods

  - `toggle(paneIndex)`
  - `expand(paneIndex)`
  - `collapse(paneIndex)`
  - `expandAll()`
  - `collapseAll()`


#### Events

  - `vAccordion:onExpand`
  - `vAccordion:onExpandAnimationEnd`
  - `vAccordion:onCollapse`
  - `vAccordion:onCollapseAnimationEnd`


## Callbacks

Use these callbacks to get expanded/collapsed pane index:


```html
<v-accordion onexpand="expandCallback(index)" oncollapse="collapseCallback(index)">

  <v-pane ng-repeat="pane in panes">
    <v-pane-header>
      {{ pane.header }}
    </v-pane-header>

    <v-pane-content>
      {{ pane.content }}
    </v-pane-content>
  </v-pane>

</v-accordion>
```


```js
$scope.expandCallback = function (index) {
  console.log('expanded pane index:', index);
};

$scope.collapseCallback = function (index) {
  console.log('collapsed pane index:', index);
};
```

## Accessibility
vAccordion manages keyboard focus and adds some common aria-* attributes. BUT you should additionally place the `aria-controls` and `aria-labelledby` as follows:

```html
<v-accordion>

  <v-pane ng-repeat="pane in panes">
    <v-pane-header id="pane{{$index}}-header" aria-controls="pane{{$index}}-content">
      {{ pane.header }}
    </v-pane-header>

    <v-pane-content id="pane{{$index}}-content" aria-labelledby="pane{{$index}}-header">
      {{ pane.content }}
    </v-pane-content>
  </v-pane>

</v-accordion>
```


