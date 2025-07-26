export interface CreateLocalAuthUserRequestDTO {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName?: string | null;
  avatar?: string | null;
  country: string;
}


export interface CreateOAuthUserRequestDTO {
  username: string;
  email: string;
  oAuthId: string;
  firstName: string;
  lastName?: string | null;
  avatar?: string | null;
  country: string;
}

export interface CreateAdminUserRequestDTO extends CreateLocalAuthUserRequestDTO {}