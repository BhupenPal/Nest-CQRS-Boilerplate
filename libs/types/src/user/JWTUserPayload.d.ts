export interface JWTUserPayload {
  id: any;
  userName: string;
  givenName: string;
  familyName: string;
  avatar: string | null;
  role: string | null;

  /* PAYLOAD METADATA */
  iat?: string;
  iss?: string;
  exp?: string;
  aud?: string;
}
