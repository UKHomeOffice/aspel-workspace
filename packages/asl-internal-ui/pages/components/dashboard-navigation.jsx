import React from 'react';
import { Tabs, Link } from '@asl/components';

export default function DashboardNavigation({ tab }) {
  return (
    <Tabs active={tab}>
      <Link page="dashboard" label="Tasks" />
      <Link page="search" searchType="establishments" label="Establishments" query={{ filters: { status: ['active'] } }} />
      <Link page="search" searchType="profiles" label="People" />
      <Link page="search" searchType="projects" label="Projects" />
    </Tabs>
  );
}
