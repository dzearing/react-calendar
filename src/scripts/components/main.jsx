/** @jsx React.DOM */

var React = require('react');
var ReactTestApp = require('./ReactTestApp');

React.initializeTouchEvents(true);

React.renderComponent((
  <ReactTestApp /> 
), document.getElementById('content'));
