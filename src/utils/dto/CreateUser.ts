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
  email: string;
  oAuthId: string;
  firstName: string;
  avatar?: string | null;
}

export interface CreateAdminUserRequestDTO extends CreateLocalAuthUserRequestDTO {}