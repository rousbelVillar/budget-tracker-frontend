export interface User {
  email: string;
}
export interface UserSecurity {
  password: string;
}

export interface UserImage {
  profileImage?: File;
  profileImageUrl?: string;
}

export interface UserDetails extends UserSecurity {
  name: string;
  lastName: string;
}

export interface UserUpdateForm extends UserDetails, UserImage {
  confirmPassword: string;
}

export interface UserStore extends User, UserDetails, UserImage {}
export interface Login extends User, UserSecurity {}
export interface UserSignUpForm
  extends User, UserDetails, UserImage, UserUpdateForm {}
