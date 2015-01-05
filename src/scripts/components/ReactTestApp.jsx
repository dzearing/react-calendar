/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;
var Calendar = require('./Calendar');

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');

var ReactTestApp = React.createClass({
    render: function() {
        return (
            <div className='main'>
                <div className="ReactTestApp-selectedDate">{ this.formatDate(this.state.selectedDate) }</div>
                <Calendar onDateChanged={ this.onDateChanged } />
      </div>
    );
  },

  getInitialState: function() {
    return {
        selectedDate: new Date()
    }
  },

  formatDate: function(date) {
    return 'The selected date is ' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  },

  onDateChanged: function(date) {
  	this.setState({
        selectedDate: date
    });
  }

});

module.exports = ReactTestApp;
