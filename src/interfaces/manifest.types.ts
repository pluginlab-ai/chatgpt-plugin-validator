export type HttpAuthorizationType = 'bearer' | 'basic';

export type ManifestAuthType = 'none' | 'service_http' | 'user_http' | 'oauth';

export interface BaseManifestAuth {
  type: ManifestAuthType;
  instructions?: string;
}

export interface ManifestNoAuth extends BaseManifestAuth {
  type: 'none';
}

export interface ManifestServiceHttpAuth extends BaseManifestAuth {
  type: 'service_http';
  authorization_type: HttpAuthorizationType;
  verification_tokens: {
    [service: string]: string | undefined;
  };
}

export interface ManifestUserHttpAuth extends BaseManifestAuth {
  type: 'user_http';
  authorization_type: HttpAuthorizationType;
}

export interface ManifestOAuthAuth extends BaseManifestAuth {
  type: 'oauth';
  client_url: string;
  scope: string;
  authorization_url: string;
  authorization_content_type: string;
  verification_tokens: {
    [service: string]: string | undefined;
  };
}

export type ManifestAuth =
  | ManifestNoAuth
  | ManifestServiceHttpAuth
  | ManifestUserHttpAuth
  | ManifestOAuthAuth;

export interface Api {
  type: 'openapi';
  url: string;
  is_user_authenticated: boolean;
}

export interface Manifest {
  schema_version: string;
  name_for_human: string;
  name_for_model: string;
  description_for_human: string;
  description_for_model: string;
  auth: ManifestAuth;
  api: Api;
  logo_url: string;
  contact_email: string;
  legal_info_url: string;
}
