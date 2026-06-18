export interface User {
  email: string;
}

export interface Login extends User {
  password: string;
}

export interface UserImage {
  profileImage?: File;
  profileImageUrl?: string;
}

export interface UserDetails {
  name: string;
  lastName: string;
  password?: string;
}

export interface UserStore extends User, UserDetails, UserImage {}
export interface UserUpdateForm extends UserDetails, UserImage {
  confirmPassword: string;
}
export interface UserSignUpForm
  extends User, UserDetails, UserImage, UserUpdateForm {}
