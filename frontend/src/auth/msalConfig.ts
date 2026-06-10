// Azure AD app registration — values pre-filled from your app registration
export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || 'dd3bcdf6-5593-4e0b-9c25-94e8d874aac0',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || '005f7837-0d29-4d25-983d-4eb8674e2714'}`,
    redirectUri: import.meta.env.VITE_REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8080'),
  },
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'email'],
};
