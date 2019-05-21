import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import sortBy from 'lodash/sortBy';
import { Header, PanelList, Link, ExpandingPanel, Snippet } from '@asl/components';

import dateFormatter from 'date-fns/format';
import { dateFormat } from '@asl/pages/constants';

import Profile from '@asl/pages/pages/profile/read/views/profile';
import ASRUAdmin from '../components/asru-admin';

class Index extends React.Component {

  renderAsruAssociation (establishments) {
    return (<ul className="panel-list">
      {establishments.map(establishment => {
        return (
          <li key={establishment.id}>
            <Link page="establishment.dashboard" establishmentId={establishment.id} label={establishment.name} />
          </li>
        );
      })}
    </ul>);

  }

  render () {

    const model = this.props.model;
    const hasEstablishments = !!model.establishments.length;

    return <Fragment>
      <Header title={`${model.firstName} ${model.lastName}`} />
      <dl>
        <dt>Email:</dt>
        <dd><a href={`mailto:${model.email}`}>{ model.email }</a></dd>
        {
          model.telephone && <Fragment>
            <dt>Telephone:</dt>
            <dd>{ model.telephone }</dd>
          </Fragment>
        }
        {
          model.dob && <Fragment>
            <dt>Date of birth:</dt>
            <dd>{ dateFormatter(model.dob, dateFormat.medium) }</dd>
          </Fragment>
        }
      </dl>
      <ExpandingPanel title={<Snippet>pil.training.title</Snippet>}>
        {
          model.certificates && model.certificates.length > 0
            ? model.certificates.map((certificate, index) => (
              <div key={index}>
                <p><Snippet>pil.training.certificate.number</Snippet><span>:</span> {certificate.certificateNumber}</p>
                <p><Snippet>pil.training.certificate.awarded</Snippet><span>:</span> {dateFormatter(certificate.passDate)}</p>
                <p><Snippet>pil.training.certificate.body</Snippet><span>:</span> {certificate.accreditingBody}</p>
                <p><Snippet>pil.training.certificate.modules</Snippet></p>
                <p><ul>
                  { certificate.modules.map((module, index) => (
                    <Fragment key={index}>
                      <li>{module.module}</li>
                      {
                        module.species && !!module.species.length && (
                          <ul>
                            {
                              module.species.map((s, index) =>
                                <li key={index}>{s}</li>
                              )
                            }
                          </ul>
                        )
                      }
                    </Fragment>
                  )) }
                </ul></p>
              </div>
            ))
            : <p><em><Snippet>pil.training.none</Snippet></em></p>
        }
      </ExpandingPanel>
      <ASRUAdmin />

      {
        hasEstablishments && <Fragment>
          <h3>Establishments</h3>
          <PanelList panels={sortBy(model.establishments, 'name').map(establishment => {
            return (
              <ExpandingPanel key={establishment.id} title={establishment.name}>
                <p>
                  <Link page="establishment.dashboard" establishmentId={establishment.id} label={<Snippet>establishment.link</Snippet>} />
                </p>
                <Profile establishment={establishment} profile={model} allowedActions={this.props.allowedActions} />
              </ExpandingPanel>
            );
          })} />
        </Fragment>
      }
      {
        model.asruInspector && model.asru && !!model.asru.length && <Fragment>
          <h3>Inspector for:</h3>
          { this.renderAsruAssociation(model.asru) }
        </Fragment>
      }
      {
        model.asruLicensing && model.asru && !!model.asru.length && <Fragment>
          <h3>Single Point of Contact (SPoC) for:</h3>
          { this.renderAsruAssociation(model.asru) }
        </Fragment>
      }
    </Fragment>;
  }

}

const mapStateToProps = ({ model, static: { allowedActions } }) => ({ model, allowedActions });

export default connect(mapStateToProps)(Index);
