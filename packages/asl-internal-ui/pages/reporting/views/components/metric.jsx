import React from 'react';
import Number from './number';
import { Link } from '@asl/components';

export default function Metric({ number, label, link, className }) {
  return (
    <div className={`metric ${className}`}>
      <p><Number number={number} /></p>
      <label>{ link ? <Link page={link} label={label} /> : label }</label>
    </div>
  );
}
