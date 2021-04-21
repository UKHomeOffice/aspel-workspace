import React from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/header';
import Tabs from '../../components/tabs';
import { Datatable, Link } from '@asl/components';

export default function Index() {
  const { year } = useSelector(state => state.static);

  const formatters = {
    name: {
      format: (name, establishment) => <Link page="establishment.rops" label={name} establishmentId={establishment.id} year={year} />
    }
  };

  return (
    <div>
      <Header />
      <Tabs active={1} />
      <div className="rops-establishments">
        <Datatable formatters={formatters} />
      </div>
    </div>
  );
}
