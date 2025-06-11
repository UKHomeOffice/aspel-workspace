import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Header, Panel, Snippet, Link } from '@ukhomeoffice/asl-components';

const Index = ({ onwardLink }) => {
  const {
    establishment,
    taskId,
    isAsruUser,
    modelType,
    action,
    profile,
    addRole
  } = useSelector(state => state.static, shallowEqual);

  return (
    <div className="govuk-grid-row success">
      <div className="govuk-grid-column-two-thirds">
        <span className="govuk-caption-l">{`${profile.firstName} ${profile.lastName}`}</span>

        <Header
          title={`${addRole.type.toUpperCase()} role application`}
        />

        <p className="subtitle">{establishment.name}</p>

        <Panel title={<Snippet>success.panel.title</Snippet>} className="green-bg success" />

        <div className="what-next">
          <h2><Snippet>success.whatNext.title</Snippet></h2>
          {
            ['suspend', 'reinstate'].includes(action)
              ? <p><Snippet optional>{`success.whatNext.body.${modelType}`}</Snippet></p>
              : <p><Snippet optional>success.whatNext.body</Snippet></p>
          }
          <p><Snippet optional>{`success.whatNext.${isAsruUser ? 'internal' : 'external'}`}</Snippet></p>

          <p><Link page="task.read" label={<Snippet>success.taskLink.linkText</Snippet>} taskId={taskId} /></p>
        </div>

        {
          onwardLink || <Link page="dashboard" label={<Snippet>breadcrumbs.dashboard</Snippet>} />
        }
      </div>
    </div>
  );
};

export default Index;
