import { panic } from '../../../keycloak-manage-roles.js';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    panic(`${name} must be provided as an environment variable`);
  }

  return value;
}

function getTokenExpiry(token: string): number {
  const [, payload = ''] = token.split('.');

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: number };
    return typeof parsed.exp === 'number' ? parsed.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

type ClientCredentials = {
  baseUrl: string;
  realmName: string;
  clientId: string;
  clientSecret: string;
};

function getClientCredentials(): ClientCredentials {
  return {
    baseUrl: getRequiredEnv('KEYCLOAK_BASE_URL'),
    realmName: getRequiredEnv('KEYCLOAK_REALM'),
    clientId: getRequiredEnv('KEYCLOAK_CLIENT_ID'),
    clientSecret: getRequiredEnv('KEYCLOAK_CLIENT_SECRET')
  };
}

function createClientCredentialsTokenProvider(credentials: ClientCredentials) {
  const expirySkewMs = 30_000;
  let accessToken: string | undefined;
  let accessTokenExpiresAt = 0;
  let inflightAuth: Promise<string> | undefined;

  const authenticate = async () => {
    const authClient = new KeycloakAdminClient(
      {
        baseUrl: credentials.baseUrl,
        realmName: credentials.realmName
      }
    );

    await authClient.auth({
                            clientId: credentials.clientId,
                            clientSecret: credentials.clientSecret,
                            grantType: 'client_credentials'
                          });

    if (!authClient.accessToken) {
      throw new Error('Keycloak did not return an access token');
    }

    accessToken = authClient.accessToken;
    accessTokenExpiresAt = getTokenExpiry(accessToken);

    return accessToken;
  };

  return {
    async getAccessToken(): Promise<string> {
      const now = Date.now();

      if (accessToken && (accessTokenExpiresAt === 0 || now < (accessTokenExpiresAt - expirySkewMs))) {
        return accessToken;
      }

      if (!inflightAuth) {
        inflightAuth = authenticate().finally(() => {
          inflightAuth = undefined;
        });
      }

      return inflightAuth;
    }
  };
}

export async function buildClient(): Promise<KeycloakAdminClient> {
  const credentials = getClientCredentials();

  const client = new KeycloakAdminClient(
    {
      baseUrl: credentials.baseUrl,
      realmName: credentials.realmName
    }
  );

  client.registerTokenProvider(createClientCredentialsTokenProvider(credentials));

  const accessToken = await client.getAccessToken();
  if (!accessToken) {
    throw new Error('Unable to authenticate with Keycloak');
  }

  client.setAccessToken(accessToken);

  console.log('Authenticated with keycloak using client credentials.');

  return client;
}
