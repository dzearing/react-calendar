/** @jsx React.DOM */

var React = require('react');
var ReactTestApp = require('./ReactTestApp');

React.renderComponent((
  <ReactTestApp /> 
), document.getElementById('content'));
