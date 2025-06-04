export interface UserMetadata {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    name: string;
    phone_verified: boolean;
    picture: string;
    provider_id: string;
    sub: string;
  }
  
  export interface User {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    created_at: string;
    last_sign_in_at: string;
    updated_at: string;
    phone: string;
    user_metadata: UserMetadata;
    app_metadata: {
      provider: string;
      providers: string[];
    };
    // Añadir otros campos que uses si hiciera falta
  }
  