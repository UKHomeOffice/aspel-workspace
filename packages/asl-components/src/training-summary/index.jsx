import React from 'react';
import { useSelector } from 'react-redux';
import sortBy from 'lodash/sortBy';
import format from 'date-fns/format';
import { ApplyChanges, Snippet, Link } from '../';
import { getUrl } from '../link';

const dateFormat = 'DD MMMM YYYY';

function List({ items }) {
    if (!items || !items.length) {
        return '-';
    }
    return (
        <ul>
            {
                items.map((item, index) => <li key={index}>{item}</li>)
            }
        </ul>
    );
}

function Row({ certificate, actions, basePage }) {

    const isPdf = useSelector(state => state.static.isPdf);

    const deleteLink = !isPdf && getUrl({
        page: `${basePage}.remove`,
        certificateId: certificate.id
    });

    function confirmRemove(e) {
        if (window.confirm(`Are you sure you want to delete this ${certificate.isExemption ? 'exemption' : 'training certificate'}?`)) {
            return true;
        }
        e.preventDefault();
    }

    return (
        <tr>
            <td>{certificate.isExemption ? 'Exemption' : 'Training certificate'}</td>
            <td><List items={(certificate.modules || []).map(module => <Snippet key={module}>{ `trainingModules.${module}` }</Snippet>)} /></td>
            <td><List items={certificate.species} /></td>
            <td>
                {
                    certificate.isExemption
                        ? <p className="preserve-whitespace">{certificate.exemptionReason}</p>
                        : (
                            <p>
                                <span>Certificate number: </span><span>{certificate.certificateNumber}</span><br />
                                <span>Awarded on: </span><span>{certificate.passDate ? format(certificate.passDate, dateFormat) : '-'}</span><br />
                                <span>Awarded by: </span><span>{certificate.accreditingBody === 'Other' ? certificate.otherAccreditingBody : certificate.accreditingBody}</span>
                            </p>
                        )
                }
            </td>
            {
                actions && !isPdf && (
                    <td>
                        <Link page={`${basePage}.${certificate.isExemption ? 'modules' : 'certificate'}`} certificateId={certificate.id} label="Edit" />
                        <ApplyChanges
                            type="form"
                            method="POST"
                            action={deleteLink}
                        >
                            <button className="link" onClick={confirmRemove}>
                                <span><Snippet>actions.remove</Snippet></span>
                            </button>
                        </ApplyChanges>
                    </td>
                )
            }
        </tr>
    );
}

export default function SummaryTable({ certificates, actions, emptyLabel = 'No training record', basePage = 'training' }) {
    if (!certificates || !certificates.length) {
        return <p>{emptyLabel}</p>;
    }
    certificates = sortBy(certificates, ['isExemption', 'createdAt']);
    return (
        <table className="govuk-table training">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Modules</th>
                    <th>Animal types</th>
                    <th>Details</th>
                    {
                        actions && <th>Actions</th>
                    }
                </tr>
            </thead>
            <tbody>
                {
                    certificates.map(certificate => <Row key={certificate.id} certificate={certificate} actions={actions} basePage={basePage} />)
                }
            </tbody>
        </table>
    );
}
