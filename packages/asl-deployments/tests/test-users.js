const testUsers = {
  'unverified': process.env.KEYCLOAK_PASSWORD,
  'additionalavailability': process.env.KEYCLOAK_PASSWORD,
  'newuser': process.env.KEYCLOAK_PASSWORD,
  'holc': process.env.KEYCLOAK_PASSWORD,
  'spareholc': process.env.KEYCLOAK_PASSWORD,
  'ntco': process.env.KEYCLOAK_PASSWORD,
  'basicntco': process.env.KEYCLOAK_PASSWORD,
  'read': process.env.KEYCLOAK_PASSWORD,
  'basic': process.env.KEYCLOAK_PASSWORD,
  'basic2': process.env.KEYCLOAK_PASSWORD,
  'basic3': process.env.KEYCLOAK_PASSWORD,
  'blocked': process.env.KEYCLOAK_PASSWORD,
  'piltransfer': process.env.KEYCLOAK_PASSWORD,
  'pharmaadmin': process.env.KEYCLOAK_PASSWORD,
  'marvellntco': process.env.KEYCLOAK_PASSWORD,
  'trainingadmin': process.env.KEYCLOAK_PASSWORD,
  'trainingntco': process.env.KEYCLOAK_PASSWORD,
  'collabedit': process.env.KEYCLOAK_PASSWORD,
  'collabread': process.env.KEYCLOAK_PASSWORD,
  'email-change-before@example.com': process.env.KEYCLOAK_PASSWORD,
  'email-change-after@example.com': process.env.KEYCLOAK_PASSWORD,
  'password-change@example.com': process.env.KEYCLOAK_PASSWORD,
  'due-pil-review@example.com': process.env.KEYCLOAK_PASSWORD,
  'overdue-pil-review@example.com': process.env.KEYCLOAK_PASSWORD,
  'asrusuper': process.env.KEYCLOAK_PASSWORD,
  'asruadmin': process.env.KEYCLOAK_PASSWORD,
  'asrusupport': process.env.KEYCLOAK_PASSWORD,
  'asruropper': process.env.KEYCLOAK_PASSWORD,
  'licensing': process.env.KEYCLOAK_PASSWORD,
  'inspector': process.env.KEYCLOAK_PASSWORD,
  'inspector2': process.env.KEYCLOAK_PASSWORD,
  'inspector-rops': process.env.KEYCLOAK_PASSWORD,
  'autoproject': process.env.KEYCLOAK_PASSWORD
};

export default testUsers;