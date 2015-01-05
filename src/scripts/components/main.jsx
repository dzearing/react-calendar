/** @jsx React.DOM */

var ReactTestApp = require('./ReactTestApp');
var React = require('react');
var {DefaultRoute, Route, Routes} = require('react-router');

React.renderComponent((
  <Routes location="history">
    <Route path="/" handler={ReactTestApp}>
    </Route>
  </Routes>
), document.getElementById('content'));
