# business-hours AngularJS directive

This is an angular module to add Google Business opening form to a model. The directive will convert opening hour to a JSON where you store days and relative opening hours.

### How to use it

If your model `item` has a field `hours` you can input opening hours with:

    <business-hours-input ng-model="item.hours"></business-hours-input>

