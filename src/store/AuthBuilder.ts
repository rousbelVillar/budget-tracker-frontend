import { User } from "./Auth";

export class AuthBuilder {
  private user: User;
  private error: string = "";
  public constructor(user: User) {
    this.user = user;
  }

  public buildAuthForm(password?: string, profilePic?: File): FormData {
    const formData = new FormData();
    if (!this.user) {
      this.error = "No Update Data Found.";
      throw new Error(this.error);
    } else {
      formData.append("email", this.user.email);
      formData.append("lastName", this.user.lastName);
      formData.append("name", this.user.name);
    }

    if (profilePic) {
      formData.append("profile_pic", profilePic);
    }

    if (password) {
      formData.append("password", password);
    }
    return formData;
  }

  public formatUser(): void {
    if (!this.user) {
      this.error = "Error Handling User Format";
      throw new Error(this.error);
    } else {
      this.user.name = this.user.name.replace(
        this.user.name.charAt(0),
        this.user.name.charAt(0).toUpperCase(),
      );
      this.user.lastName = this.user.lastName.replace(
        this.user.lastName.charAt(0),
        this.user.lastName.charAt(0).toUpperCase(),
      );
    }
  }
}
