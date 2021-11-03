const { merge } = require('lodash');
const globalProfile = require('@asl/pages/pages/global-profile/content');

module.exports = merge({}, globalProfile, {
  asru: {
    add: 'Add user to ASRU',
    remove: 'Remove user from ASRU',
    notice: 'Adding a user to ASRU gives them full access to all information from all establishments within the system.',
    roles: {
      summary: 'All registered ASRU users - including those without a role - can view information including establishment, licence, performance and fee data and submit amendment requests for establishment or personal licences.',
      title: {
        list: 'Assigned roles',
        assign: 'Assign roles'
      },
      manage: 'Edit',
      save: 'Assign roles',
      cancel: 'Cancel',
      asruAdmin: {
        label: 'Admin',
        hint: {
          summary: 'Show admin permissions',
          details: `Admins can:
           - register new ASRU users in ASPeL
           - assign roles to other ASRU users
           - re-open accidentally rejected or discarded tasks
           - discard tasks started in error`
        }
      },
      asruSupport: {
        label: 'Business support',
        hint: {
          summary: 'Show business support permissions',
          details: `Business support can:
           - mark personal licences as non-billable
           - approve exemptions for missed statutory deadlines`
        }
      },
      asruLicensing: {
        label: 'Licensing officer',
        hint: {
          summary: 'Show licensing officer permissions',
          details: `Licensing officers can:
           - process category A, B, C, D and F personal licences`
        }
      },
      asruInspector: {
        label: 'Inspector',
        hint: {
          summary: 'Show inspector permissions',
          details: `Inspectors can:
           - process category E personal licences
           - process category A, B, C, D and F referrals from licensing
           - process project licences
           - request amendments to project licences
           - extend statutory deadlines
           - convert stub project licences to full licences in ASPeL
           - create and submit returns of procedures (ROPs) on behalf of licence holders
           - return ROPs that contain errors`
        }
      },
      asruRops: {
        label: 'Returns analyst',
        hint: {
          summary: 'Show returns analyst permissions',
          details: `Returns analysts can:
           - see consolidated returns of procedures (ROPs) data
           - edit and resubmit ROPs on behalf of licence holders
           - return ROPs that contain errors`
        }
      }
    }
  },
  breadcrumbs: {
    globalProfile: {
      read: '{{profile.firstName}} {{profile.lastName}}',
      pils: 'Personal licences'
    }
  },
  dedupe: 'Merge profile'
});
