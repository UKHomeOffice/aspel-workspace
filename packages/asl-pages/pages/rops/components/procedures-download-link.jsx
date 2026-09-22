import React from 'react';
import dayJs from '@ukhomeoffice/asl-components/dayjs';
import { useSelector } from 'react-redux';
import { Link } from '@ukhomeoffice/asl-components';

const { format } = dayJs;

export default function ProceduresDownloadLink({ className }) {
  const year = useSelector(state => state.static.year);
  const project = useSelector(state => state.model.project);

  const now = format(new Date(), 'dd-MM-yyyy');
  const filename = `procedures-added-to-rop-for-${project.licenceNumber}-in-${year}-downloaded-${now}.csv`;

  return <Link
    page="rops.procedures.list"
    query={{csv: { filename }}}
    label="Download table of procedures (CSV)"
    className={className}
  />;
}
