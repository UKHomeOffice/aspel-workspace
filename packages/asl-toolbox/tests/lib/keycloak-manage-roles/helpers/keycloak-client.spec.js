import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

const panic = jest.fn(message => {
  throw new Error(message);
});

const issuedExpiries = [];
const constructedClients = [];

function issueToken(exp) {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  return `${header}.${payload}.signature`;
}

const KeycloakAdminClient = jest.fn().mockImplementation(config => {
  const client = {
    accessToken: undefined,
    auth: jest.fn(async () => {
      const nextExpiry = issuedExpiries.shift();
      client.accessToken = nextExpiry ? issueToken(nextExpiry) : undefined;
    }),
    config,
    getAccessToken: jest.fn(async () => {
      if (client.tokenProvider) {
        return client.tokenProvider.getAccessToken();
      }

      return client.accessToken;
    }),
    registerTokenProvider: jest.fn(provider => {
      client.tokenProvider = provider;
    }),
    setAccessToken: jest.fn(token => {
      client.accessToken = token;
    })
  };

  constructedClients.push(client);
  return client;
});

jest.unstable_mockModule('@keycloak/keycloak-admin-client', () => ({
  default: KeycloakAdminClient
}));

jest.unstable_mockModule('../../../../dist/scripts/keycloak-manage-roles.js', () => ({
  panic
}));

const { buildClient } = await import('../../../../dist/scripts/lib/keycloak-manage-roles/helpers/keycloak-client.js');

const originalEnv = { ...process.env };

describe('keycloak-manage-roles keycloak client helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-22T12:00:00Z'));
    issuedExpiries.length = 0;
    constructedClients.length = 0;
    process.env = {
      ...originalEnv,
      KEYCLOAK_BASE_URL: 'https://keycloak.example.com',
      KEYCLOAK_REALM: 'asl-test',
      KEYCLOAK_CLIENT_ID: 'test-client',
      KEYCLOAK_CLIENT_SECRET: 'top-secret'
    };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.useRealTimers();
  });

  it('builds a client and authenticates it with client credentials', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
    const nowSeconds = Math.floor(Date.now() / 1000);
    issuedExpiries.push(nowSeconds + 300);

    const client = await buildClient();

    expect(KeycloakAdminClient).toHaveBeenCalledTimes(2);
    expect(constructedClients[0].registerTokenProvider).toHaveBeenCalledTimes(1);
    expect(constructedClients[1].auth).toHaveBeenCalledWith({
      clientId: 'test-client',
      clientSecret: 'top-secret',
      grantType: 'client_credentials'
    });
    expect(constructedClients[0].setAccessToken).toHaveBeenCalledWith(expect.any(String));
    expect(client).toBe(constructedClients[0]);
    expect(consoleMock).toHaveBeenCalledWith('Authenticated with keycloak using client credentials.');
  });

  it('reuses a cached token until it is close to expiry and then re-authenticates', async () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    issuedExpiries.push(nowSeconds + 120, nowSeconds + 600);

    const client = await buildClient();
    const firstToken = await client.getAccessToken();

    expect(KeycloakAdminClient).toHaveBeenCalledTimes(2);

    jest.setSystemTime(new Date(Date.now() + 20_000));
    const secondToken = await client.getAccessToken();

    expect(secondToken).toEqual(firstToken);
    expect(KeycloakAdminClient).toHaveBeenCalledTimes(2);

    jest.setSystemTime(new Date(Date.now() + 80_000));
    const refreshedToken = await client.getAccessToken();

    expect(refreshedToken).not.toEqual(firstToken);
    expect(KeycloakAdminClient).toHaveBeenCalledTimes(3);
  });

  it('fails when required environment variables are missing', async () => {
    delete process.env.KEYCLOAK_CLIENT_SECRET;

    await expect(buildClient()).rejects.toThrow('KEYCLOAK_CLIENT_SECRET must be provided as an environment variable');
    expect(panic).toHaveBeenCalledWith('KEYCLOAK_CLIENT_SECRET must be provided as an environment variable');
  });

  it('fails when authentication does not return an access token', async () => {
    issuedExpiries.push(undefined);

    await expect(buildClient()).rejects.toThrow('Keycloak did not return an access token');
  });
});
