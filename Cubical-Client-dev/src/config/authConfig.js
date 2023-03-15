import * as msal from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
    clientId: process.env.REACT_APP_CLIENT_ID,
    redirectUri: process.env.REACT_APP_REDIRECT_URL
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  }
};

export const GRAPH_SCOPES = {
  OPENID: "openid",
  PROFILE: "profile",
  USER_READ: "User.Read"
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: [GRAPH_SCOPES.OPENID, GRAPH_SCOPES.PROFILE, GRAPH_SCOPES.USER_READ]

};

export const GRAPH_ENDPOINTS = {
  ME: "https://graph.microsoft.com/v1.0/me"
};

export const fetchMsGraph = async (url, accessToken) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.json();
};

export const getProfile = async accessToken => {
  const graphProfile = await fetchMsGraph(
    GRAPH_ENDPOINTS.ME,
    accessToken
  ).catch(() => {
    console.log("Unable to fetch Graph profile.");
  });

  if (graphProfile) {
    return await graphProfile;
  }

  return null;
};

// Msal public client object
export const publicClient = new msal.PublicClientApplication(msalConfig);

// Acquire token silently or redirect
export const getMsalProps = async () => {
  const accounts = publicClient.getAllAccounts();

  if (accounts?.length > 0) {
    try {
      return await publicClient.acquireTokenSilent({
        account: publicClient.getAllAccounts()[0]
      });
    } catch (error) {
      console.error(error);
      await publicClient.acquireTokenRedirect();
    }
  }

  return null;
};