import { readEnv } from "./env";

/**
 * The GitHub half of the sign-in flow.
 *
 * Only two calls are needed: swap the `code` for an access token, then read the
 * account behind it. No scopes beyond the profile are requested, and the token is
 * discarded immediately - it is never stored.
 */

/** Short-lived cookie carrying the OAuth state between /start and /callback. */
export const STATE_COOKIE = "sifu_oauth_state";

export type GithubIdentity = {
  /** Numeric account id: stable across renames. */
  id: number;
  /** Current handle; what ADMIN_GITHUB_ALLOW usually lists. */
  login: string;
};

/** Logins are case-insensitive; a numeric id survives a rename. */
export function isAllowed(identity: GithubIdentity, allowed: string[]): boolean {
  return allowed.includes(identity.login.toLowerCase()) || allowed.includes(String(identity.id));
}

export type ExchangeInput = {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

/**
 * Returns the GitHub account, or null when GitHub rejected the exchange.
 * Throws only on a transport failure, which the caller reports separately so a
 * GitHub outage is not mistaken for a wrong account.
 */
export async function exchangeCode({
  code,
  clientId,
  clientSecret,
  redirectUri,
}: ExchangeInput): Promise<GithubIdentity | null> {
  const [oauthBase, apiBase] = await Promise.all([
    readEnv("GITHUB_OAUTH_BASE"),
    readEnv("GITHUB_API_BASE"),
  ]);

  // The base overrides exist so the flow can be tested against a local stand-in
  // for GitHub. Production leaves them unset.
  const tokenUrl = `${(oauthBase || "https://github.com").replace(/\/+$/, "")}/login/oauth/access_token`;
  const userUrl = `${(apiBase || "https://api.github.com").replace(/\/+$/, "")}/user`;

  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": "sifu-inbox",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }).toString(),
  });
  if (!tokenResponse.ok) return null;

  const token = (await tokenResponse.json()) as { access_token?: string };
  if (!token.access_token) return null;

  const userResponse = await fetch(userUrl, {
    headers: {
      authorization: `Bearer ${token.access_token}`,
      accept: "application/vnd.github+json",
      "user-agent": "sifu-inbox",
    },
  });
  if (!userResponse.ok) return null;

  const user = (await userResponse.json()) as { id?: number; login?: string };
  if (typeof user.id !== "number" || typeof user.login !== "string") return null;
  return { id: user.id, login: user.login };
}
