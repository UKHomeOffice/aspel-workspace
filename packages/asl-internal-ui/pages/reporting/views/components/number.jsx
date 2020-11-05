import React, { Fragment } from 'react';

const format = number => {
  if (typeof number !== 'number' || isNaN(number)) {
    return '-';
  }
  if (number !== Math.floor(number) && number < 1000) {
    number = number.toFixed(2);
  }
  return Math.floor(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default function Number({ number }) {
  return <Fragment>{ format(number) }</Fragment>;
}
