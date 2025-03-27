import React, { useState, Fragment } from 'react';
import DatePicker from 'backpack-transpiled/bpk-component-datepicker';
import { format } from 'date-fns';
import { dateFormat } from '@asl/pages/constants';

const formatDate = date => format(date, dateFormat.medium);
const formatDateFull = date => format(date, dateFormat.long);
const formatMonth = date => format(date, 'MMMM yyyy');

const daysOfWeek = [
  {
    name: 'Sunday',
    nameAbbr: 'Sun',
    index: 0,
    isWeekend: true
  },
  {
    name: 'Monday',
    nameAbbr: 'Mon',
    index: 1,
    isWeekend: false
  },
  {
    name: 'Tuesday',
    nameAbbr: 'Tue',
    index: 2,
    isWeekend: false
  },
  {
    name: 'Wednesday',
    nameAbbr: 'Wed',
    index: 3,
    isWeekend: false
  },
  {
    name: 'Thursday',
    nameAbbr: 'Thu',
    index: 4,
    isWeekend: false
  },
  {
    name: 'Friday',
    nameAbbr: 'Fri',
    index: 5,
    isWeekend: false
  },
  {
    name: 'Saturday',
    nameAbbr: 'Sat',
    index: 6,
    isWeekend: true
  }
];

export default (props) => {

  const existingState = props.onDateSelect !== undefined;
  let date;
  let setDate;

  if (!existingState) {
    [date, setDate] = useState(new Date(props.date));
  } else {
    setDate = props.onDateSelect;
    date = props.date;
  }
  return <Fragment>
    <DatePicker
      {...props}
      id={props.name}
      getApplicationElement={() => document.getElementById('page-component')}
      changeMonthLabel="Change month"
      closeButtonText="Close"
      weekStartsOn={1}
      daysOfWeek={daysOfWeek}
      formatDate={formatDate}
      formatMonth={formatMonth}
      onDateSelect={setDate}
      formatDateFull={formatDateFull}
      date={date}
    />
    <input type="hidden" name={props.name} value={format(date, 'yyyy-MM-dd')} />
  </Fragment>;
};
