import { UserSignUpForm } from "../interfaces/User";
import { Resolver } from "./Resolver";

export class RegistrationResolver extends Resolver {
  public registrationValidation(form: UserSignUpForm) {
    if (form.name == null) {
      return false;
    }
    if (!form.lastName) {
      return false;
    }
    if (!form.email) {
      return false;
    }
    if (
      !form.password ||
      !form.confirmPassword ||
      form.password != form.confirmPassword
    ) {
      return false;
    }
    return true;
  }
}
