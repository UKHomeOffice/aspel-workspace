import React from 'react';
import { useSelector } from 'react-redux';
import { Header, Panel, Snippet, Link } from '@ukhomeoffice/asl-components';
import EstablishmentHeader from '../../common/components/establishment-header';
import { has } from 'lodash';

const Index = ({ onwardLink }) => {
  const establishment = useSelector(state => state.static.establishment);
  const taskId = useSelector(state => state.static.taskId);
  const isAsruUser = useSelector(state => state.static.isAsruUser);
  const additionalInfo = useSelector(state => state.static.additionalInfo);
  const projectId = useSelector(state => state.static.projectId);
  const modelType = useSelector(state => state.static.modelType);
  const action = useSelector(state => state.static.action);
  const content = useSelector(state => state.static.content);
  return (
    <div className="govuk-grid-row success">
      <div className="govuk-grid-column-two-thirds">
        <Header
          title={<Snippet>success.header.title</Snippet>}
          subtitle={has(content, 'success.header.subtitle') ? <Snippet>success.header.subtitle</Snippet> : <EstablishmentHeader establishment={establishment}/>}
        />
        {
          additionalInfo && <h2 className="additional-info">
            {
              projectId ? <Link page="project.read" establishmentId={establishment.id} projectId={projectId} label={additionalInfo}></Link>
                : additionalInfo
            }
          </h2>
        }

        <Panel title={<Snippet>success.panel.title</Snippet>} className="green-bg success" />

        <div className="what-next">
          <h2><Snippet>success.whatNext.title</Snippet></h2>
          {
            ['suspend', 'reinstate'].includes(action)
              ? <p><Snippet optional>{`success.whatNext.body.${modelType}`}</Snippet></p>
              : <p><Snippet optional>success.whatNext.body</Snippet></p>
          }
          <p><Snippet optional>{`success.whatNext.${isAsruUser ? 'internal' : 'external'}`}</Snippet></p>

          <p><Snippet>success.taskLink.before</Snippet> <Link page="task.read" label={<Snippet>success.taskLink.linkText</Snippet>} taskId={taskId} /></p>
        </div>

        {
          onwardLink || <Link page="dashboard" label={<Snippet>breadcrumbs.dashboard</Snippet>} />
        }
      </div>
    </div>
  );
};

export default Index;
