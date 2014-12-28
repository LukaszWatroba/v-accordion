# AngularJS multi-level accordion
  
  - Allows for a nested structure
  - Works with (or without) ng-repeat
  - Allows multiple sections open at once
  - Optimized for mobile devices


### Demo
Watch the vAccordion component in action on the [demo page](http://lukaszwatroba.github.io/v-accordion).


### Requirements
  - AngularJS
  - ngAnimate


### Usage
  - If you use [bower](http://bower.io/), just `bower install v-accordion`. If not, download files [from the github repo](./dist)

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

  - Put the following markup in your code:
  ```html
  <!-- add allow-multiple attribute to allow multiple sections open at once -->
  <v-accordion allow-multiple>
    
    <!-- add expanded attribute to open first section -->
    <v-pane expanded>
      <v-pane-header>
        <h5>Pane header #1</h5>
      </v-pane-header>

      <v-pane-content>
        <p>Pane content #1</p>
      </v-pane-content>
    </v-pane>

    <v-pane>
      <v-pane-header>
        <h5>Pane header #2</h5>
      </v-pane-header>

      <v-pane-content>
        <p>Pane content #2</p>
      </v-pane-content>
    </v-pane>

    <v-pane>
      <v-pane-header>
        <h5>Pane header #3</h5>
      </v-pane-header>

      <v-pane-content>
        <p>Pane content #3</p>
      </v-pane-content>
    </v-pane>

  </v-accordion>
  ```

  - You can also use v-accordion with ng-repeat
  ```html
  <v-accordion>

    <v-pane ng-repeat="pane in panes" expanded="$first">
      <v-pane-header>
        <h5>{{ pane.header }}</h5>
      </v-pane-header>

      <v-pane-content>
        <p>{{ pane.content }}</p>
        
        <!-- accordions can be nested :) -->
        <v-accordion ng-if="pane.subpanes">
          <v-pane ng-repeat="subpane in pane.subpanes">
            <v-pane-header>
              <h5>{{ subpane.header }}</h5>
            </v-pane-header>
            <v-pane-content>
              <p>{{ subpane.content }}</p>
            </v-pane-content>
          </v-pane>
        </v-accordion>
      </v-pane-content>
    </v-pane>

  </v-accordion>
  ```


### API

