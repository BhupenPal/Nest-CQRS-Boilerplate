export interface JwtUserPayload {
  sub: any;
  userName: string;
  fullName: string;
  avatar: string | null;
  role: string | null;

  /* PAYLOAD METADATA */
  iat?: string;
  iss?: string;
  exp?: string;
  aud?: string;
}
