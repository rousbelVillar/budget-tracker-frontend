export interface User {
  id?: number;
  email: string;
  profileImage?: File;
  profileImageUrl?: string;
  name: string;
  lastName: string;
  password?: string;
}

export interface Login {
  emailUser: string;
  password: string;
}

export interface UserForm {
  name: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage?: File;
}
