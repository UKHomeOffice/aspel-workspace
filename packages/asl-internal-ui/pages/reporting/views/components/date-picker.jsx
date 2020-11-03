import React, { useState, Fragment } from 'react';
import DatePicker from 'backpack-transpiled/bpk-component-datepicker';

import format from 'date-fns/format';

const formatDate = date => format(date, 'Do MMMM YYYY');
const formatDateFull = date => format(date, 'Do MMMM YYYY');
const formatMonth = date => format(date, 'MMMM YYYY');

const daysOfWeek = [
  {
    name: 'Monday',
    nameAbbr: 'Mon',
    index: 0,
    isWeekend: false,
  },
  {
    name: 'Tuesday',
    nameAbbr: 'Tue',
    index: 1,
    isWeekend: false,
  },
  {
    name: 'Wednesday',
    nameAbbr: 'Wed',
    index: 2,
    isWeekend: false,
  },
  {
    name: 'Thursday',
    nameAbbr: 'Thu',
    index: 3,
    isWeekend: false,
  },
  {
    name: 'Friday',
    nameAbbr: 'Fri',
    index: 4,
    isWeekend: false,
  },
  {
    name: 'Saturday',
    nameAbbr: 'Sat',
    index: 5,
    isWeekend: true,
  },
  {
    name: 'Sunday',
    nameAbbr: 'Sun',
    index: 6,
    isWeekend: true,
  }
];

export default (props) => {

  const [date, setDate] = useState(new Date(props.date));

  return <Fragment>
    <DatePicker
      {...props}
      id={props.name}
      getApplicationElement={() => document.getElementById('page-component')}
      changeMonthLabel="Change month"
      closeButtonText="Close"
      weekStartsOn={0}
      daysOfWeek={daysOfWeek}
      formatDate={formatDate}
      formatMonth={formatMonth}
      onDateSelect={setDate}
      formatDateFull={formatDateFull}
      date={date}
    />
    <input type="hidden" name={props.name} value={format(date, 'YYYY-MM-DD')} />
  </Fragment>;
}
