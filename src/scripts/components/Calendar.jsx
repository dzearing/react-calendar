/** @jsx React.DOM */

var React = require('react');
var ReactTransitionGroup = React.addons.TransitionGroup;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

require('../../styles/Calendar.less');

var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_UP = 38;
var KEY_DOWN = 40;

var Strings = {
    titleFormat: '{month} {year}',

    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],

    days: [
        'Su',
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa'
    ],

    today: 'Today'
};

var Calendar = React.createClass({
    displayName: 'Calendar',
    lastDateRendered: null,
    _canWheel: true,

    render: function() {
        var _this = this;
        var title = _this.getTitleText();
        
        var dayHeaders = Strings.days.map(function(day) {
            return <div key={ day } className="Calendar-daysCell">{ day }</div>;
        });

        var weekRows = _this.getWeeks().map(function(week, weekIndex) {
            return <div key={ weekIndex } className="Calendar-weekRow">{
                week.map(function(day) {
                    var dayClickedHandler = _this.onDayClicked.bind(_this, day);

                    return <div key={ day.key } className={ _this.getCellClassName(day) } onMouseDown={ dayClickedHandler } onTouchStart={ dayClickedHandler }>{ day.date }</div>
                })
            }</div>
        });

        return (
            <div className={ "Calendar " + _this.getMonthDirection() } tabIndex="0" onKeyDown={ _this.onKeyDown }>
                <div className="Calendar-monthHeader">
                    <button className="Calendar-button round lastMonth" onClick={ _this.onPreviousMonth }><i className="fa fa-angle-left"/></button>
                    <ReactCSSTransitionGroup transitionName="title">
                        <div key={ title } className="Calendar-monthTitle">{ title }</div>
                    </ReactCSSTransitionGroup>
                    <button className="Calendar-button round nextMonth" onClick={ _this.onNextMonth }><i className="fa fa-angle-right"/></button>
                </div>
                <div className="Calendar-daysRow">{ dayHeaders }</div>
                <div className="Calendar-calendar" onWheel={ _this.onWheel }>
                    <ReactCSSTransitionGroup transitionName="calendar">
                        <div key={ title } className="Calendar-weekRows">{ weekRows }</div>
                    </ReactCSSTransitionGroup>
                </div>
                <div className="Calendar-footer">
                    <button className="Calendar-button today" onClick={ _this.onToday }>{ Strings.today }</button>
                </div>
            </div>
        );
    },

    getDefaultProps: function() {
        var date = new Date();

        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    },

    getInitialState: function() {
        return {
            date: new Date(this.props.year, this.props.month - 1, this.props.day)
        };
    },

    getTitleText: function() {
        return Strings.titleFormat.replace('{month}', Strings.months[this.state.date.getMonth()]).replace('{year}', this.state.date.getFullYear());
    },

    getMonthDirection: function() {
        var currentMonth = new Date(this.state.date.getFullYear(), this.state.date.getMonth());

        if (Number(this.lastMonthRendered) != Number(currentMonth)) {
            if (this.lastMonthRendered) {
                if (this.lastMonthRendered < currentMonth) {
                    this.lastDirection = 'forward';
                }
                else if (this.lastMonthRendered > currentMonth) {
                    this.lastDirection = 'backward';
                }
            }

            this.lastMonthRendered = currentMonth;
        }

        return this.lastDirection || '';
    },

    getCellClassName: function(day) {
        return 'Calendar-weekCell' + 
            (day.isInMonth ? ' isInMonth' : '') +
            (day.isToday ? ' isToday' : '') +
            (day.isSelected ? ' isSelected' : '');
    },

    onDayClicked: function(day) {
        this.setDate(day.originalDate);
    },

    onKeyDown: function(ev) {
        var date = this.state.date;

        switch (ev.which) {
            case KEY_LEFT:
                date.setDate(date.getDate() - 1);
                break;

            case KEY_RIGHT:
                date.setDate(date.getDate() + 1);
                break;

            case KEY_DOWN:
                date.setDate(date.getDate() + 7);
                break;

            case KEY_UP:
                date.setDate(date.getDate() - 7);
                break;
        }
    
        this.setDate(date);
    },

    onWheel: function(ev) {
        var _this = this;

        if (_this._canWheel) {
            _this._canWheel = false;
            setTimeout(function() {
                _this._canWheel = true;
            }, 500);

            if (ev.deltaY < 0) {
                _this.onPreviousMonth();
            } else if (ev.deltaY > 0) {
                _this.onNextMonth();
            }
        }
        
        ev.preventDefault();
        ev.stopPropagation();
    },

    onPreviousMonth: function() {
        var date = this.state.date;

        this.setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    },

    onToday: function() {
        this.setDate(new Date());
    },

    onNextMonth: function() {
        var date = this.state.date;

        this.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    },

    setDate: function(date) {
        this.setState({ date: date });

        if (this.props.onDateChanged) {
            this.props.onDateChanged(date);
        }
    },

    getWeeks: function() {
        var selectedDate = this.state.date;
        var date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        var today = new Date();
        var weeks = [];
        var week;
       
        // Cycle the date backwards to get to Sunday (the first day of the week.)
        while (date.getDay() > 0) {
            date.setDate(date.getDate() - 1);
        }

        for (var weekIndex = 0; weekIndex < 6; weekIndex++) {
            week = [];

            for (var dayIndex = 0; dayIndex < 7; dayIndex++) {
                week.push({
                    key: date.toString(),
                    date: date.getDate(),
                    originalDate: new Date(date.toString()),
                    isInMonth: date.getMonth() === selectedDate.getMonth(),
                    isToday: this.compareDates(today, date),
                    isSelected: this.compareDates(selectedDate, date)
                });

                date.setDate(date.getDate() + 1);
            }

            weeks.push(week);
        }

        return weeks;
    },

    compareDates: function(date1, date2) {
        return (date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate());
    }
});

module.exports = Calendar;
