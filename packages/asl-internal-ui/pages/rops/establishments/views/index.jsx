import React from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/header';
import Tabs from '../../components/tabs';
import { Datatable, Link, Search } from '@asl/components';

export default function Index() {
  const { year } = useSelector(state => state.static);

  const formatters = {
    name: {
      format: (name, establishment) => {
        return <Link
          page="establishment.rops.overview"
          label={name}
          establishmentId={establishment.id}
          year={year}
        />;
      }
    }
  };

  return (
    <div className="rops-establishments">
      <Header />
      <Tabs active={1} />
      <Search />
      <Datatable formatters={formatters} />
    </div>
  );
}
