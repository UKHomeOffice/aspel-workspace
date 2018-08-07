module.exports = {
  fields: {
    firstName: {
      label: 'First name'
    },
    lastName: {
      label: 'Last name'
    },
    email: {
      label: 'Email address'
    },
    role: {
      label: 'What permission level should this user have?',
      options: {
        admin: {
          label: 'Full',
          hint: 'View, apply, and amend rights for all related licence information. Create and amend rights for all related user accounts. Manage other users\' permissions.'
        },
        read: {
          label: 'Intermediate',
          hint: 'View, apply, and amend rights for their own persional and project licences. View and amend rights for their own user account and profile. View only rights for all related licence information.'
        },
        basic: {
          label: 'Basic',
          hint: 'View and amend rights for their own profile. View only rights for other establishment, project, and personal licences by invitation.'
        }
      }
    },
    name: {
      label: 'Name'
    },
    roles: {
      label: 'Roles'
    },
    pil: {
      label: 'PIL number'
    }
  },
  buttons: {
    submit: 'Send invitation'
  },
  errors: {
    firstName: {
      required: 'First name is required'
    },
    lastName: {
      required: 'Last name is required'
    },
    email: {
      required: 'Email address is required',
      match: 'Invalid email address'
    },
    role: {
      required: 'Select a permission level for the new user'
    }
  }
};
