import { Header, Snippet } from '@ukhomeoffice/asl-components';
import EstablishmentHeader from '../../../common/components/establishment-header';
import React from 'react';
import { useSelector } from 'react-redux';

export default function CoursesList() {
  const { establishment } = useSelector(state => state.static);

  return <>
    <Header
      title={<Snippet>pages.course.list</Snippet>}
      subtitle={<EstablishmentHeader establishment={establishment}/>}
    />
  </>;
}
