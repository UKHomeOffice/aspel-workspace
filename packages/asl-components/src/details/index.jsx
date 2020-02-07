import React, { useState } from 'react';

export default function Details({ summary, children, className }) {
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen(!open);
  }
  return (
    <details className={className}>
      <summary onClick={toggle}>{ summary }</summary>
      {
        open && children
      }
    </details>
  );
}
