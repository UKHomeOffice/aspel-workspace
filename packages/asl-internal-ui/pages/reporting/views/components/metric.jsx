import React from 'react';
import { Link } from '@asl/components';

export default function Metric({ number, label, link, className }) {
  if (number !== Math.floor(number)) {
    try {
      number = number.toFixed(2);
    } catch (e) {
      number = '-';
    }
  }
  return (
    <div className={`metric ${className}`}>
      <label>{ link ? <Link page={link} label={label} /> : label }</label>
      <p>{ number }</p>
    </div>
  );
}
