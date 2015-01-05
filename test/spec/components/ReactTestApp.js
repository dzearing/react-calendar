'use strict';

describe('Main', function () {
  var ReactTestApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    ReactTestApp = require('../../../src/scripts/components/ReactTestApp.jsx');
    component = ReactTestApp();
  });

  it('should create a new instance of ReactTestApp', function () {
    expect(component).toBeDefined();
  });
});
