import React from 'react';

import { Link, Snippet, Tabs } from '@asl/components';

export default function RopsTabs({ active = 0 }) {

  return (
    <Tabs active={active}>
      <Link page="ropsReporting.summary" label={<Snippet>tabs.summary</Snippet>} />
      <Link page="ropsReporting.summary" label={<Snippet>tabs.establishments</Snippet>} />
      <Link page="ropsReporting.download" label={<Snippet>tabs.download</Snippet>} />
    </Tabs>
  );
}
