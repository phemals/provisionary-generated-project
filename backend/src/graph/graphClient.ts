import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

let _client: Client | null = null;

export function getGraphClient(): Client {
  if (_client) return _client;

  const tenantId = process.env.AZURE_TENANT_ID || '005f7837-0d29-4d25-983d-4eb8674e2714';
  const clientId = process.env.AZURE_CLIENT_ID || 'dd3bcdf6-5593-4e0b-9c25-94e8d874aac0';
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  if (!clientSecret) {
    throw new Error(
      'AZURE_CLIENT_SECRET is not set. Add it to backend/.env — get it from Azure Portal → App registrations → dd3bcdf6-5593-4e0b-9c25-94e8d874aac0 → Certificates & secrets.'
    );
  }

  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
  });

  _client = Client.initWithMiddleware({ authProvider });
  return _client;
}
