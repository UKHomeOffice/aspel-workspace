module.exports = {
  pageTitle: 'Search projects',
  fields: {
    title: {
      label: ''
    },
    licenceHolder: {
      label: 'Licence holder'
    },
    establishment: {
      label: 'Establishment'
    },
    status: {
      label: 'Status'
    },
    expiryDate: {
      label: 'Expiry date'
    },
    revocationDate: {
      label: 'Revocation date'
    }
  },
  status: {
    inactive: 'Draft',
    active: 'Active',
    expired: 'Expired',
    revoked: 'Revoked',
    transferred: 'Transferred'
  },
  filters: {
    title: 'Filters',
    species: {
      title: 'Animal type'
    },
    fields: {
      title: 'Document type',
      options: {
        granted: 'Licences',
        all: 'Applications',
        nts: 'NTSs and RAs'
      }
    },
    status: {
      title: 'Project status',
      options: {
        active: 'Active projects',
        revoked: 'Revoked projects',
        expired: 'Expired projects',
        inactive: 'Draft projects'
      }
    },
    purposes: {
      title: 'Permissible purpose',
      options: {
        a: 'a) Basic research',
        b: 'b) Translational or applied research for:',
        b1: '(i) prevention and treatment of disease',
        b2: '(ii) assessment of physiological conditions',
        b3: '(iii) improvement of animal welfare',
        c: 'c) Manufacture or testing of drugs, food and feed',
        d: 'd) Protection of natural environment',
        e: 'e) Preservation of species',
        f: 'f) Higher education or training',
        g: 'g) Forensic enquiries'
      }
    },
    extra: {
      title: 'Continuation and RA',
      options: {
        ra: 'Projects requiring RAs',
        continuation: 'Project continuations'
      }
    }
  },
  sections: {
    introduction: 'Introductory details',
    aims: 'Aims',
    benefits: 'Benefits',
    'project-harms': 'Project harms',
    'fate-of-animals': 'Fate of animals',
    replacement: 'Replacement',
    reduction: 'Reduction',
    refinement: 'Refinement',
    experience: 'Experience',
    funding: 'Funding',
    establishments: 'Establishments',
    'transfer-of-animals': 'Transfer of animals',
    poles: 'Places other than a licensed establishment (POLEs)',
    'scientific-background': 'Scientific background',
    'training-background': 'Scientific background',
    'action-plan': 'Action plan',
    'general-principles': 'General principles',
    protocols: 'Protocol - {{protocol}}',
    domestic: 'Cats, dogs, and equidae',
    nhps: 'Non-human primates',
    'purpose-bred-animals': 'Purpose bred animals',
    'endangered-animals': 'Endangered animals',
    'animals-taken-from-the-wild': 'Animals taken from the wild',
    'feral-animals': 'Feral animals',
    nmbas: 'Neuromuscular blocking agents (NMBAs)',
    'reusing-animals': 'Re-using animals',
    'commercial-slaughter': 'Comercial slaughter',
    'comtaining-human-material': 'Animals containing human material',
    'keeping-alive': 'Keeping animals alive',
    'setting-free': 'Setting animals free',
    rehoming: 'Rehoming animals',
    // legacy sections
    resources: 'Resources',
    background: 'Background',
    references: 'References',
    purpose: 'Purpose',
    plan: 'Project plan',
    origin: 'Origin',
    endangered: 'Endangered animals',
    wild: 'Animals taken from the wild',
    marmosets: 'Marmosets',
    summary: 'Project summary',
    'nts-replacement': 'Replacement',
    'nts-reduction': 'Reduction',
    'nts-refinement': 'Refinement'
  }
};
