const value = `
The project licence below has been revoked.

Licence number: {{licenceNumber}}
Revocation date: {{revocationDate}}

All work authorised under this licence must stop immediately. You are reminded that it is illegal to perform regulated procedures without a licence.

If you are the licence holder you must now:

1. Attend to animals that are suffering - or are likely to suffer - as a result of regulated procedures by either quickly and humanely killing them in line with section 15 of the Animals (Scientific Procedures) Act 1986, or transferring them to a new project licence.
1. [Submit a return of procedures]({{licenceUrl}}#reporting) by {{ropsDate}}.
{{#raDate}}1. [Submit a retrospective assessment]({{licenceUrl}}#reporting) by {{raDate}}.{{/raDate}}
1. Submit a list of any publications your work has been published in by {{publicationsDate}}. This should be emailed to aspa.london@homeoffice.gov.uk.

These requirements are conditions of your licence. Failure to fulfil any of them constitutes a breach of your licence terms.

If you wish to continue your programme of work, or start a new one, you can apply online for a new licence by [logging into your account]({{loginUrl}}). If helpful you can also [download your original application]({{licenceUrl}}#downloads).

Should you have any queries, please email our licensing team at aspa.london@homeoffice.gov.uk.`;

module.exports = {
  requires: ['licenceNumber', 'revocationDate', 'ropsDate', 'publicationsDate', 'licenceUrl', 'loginUrl'],
  value
};
