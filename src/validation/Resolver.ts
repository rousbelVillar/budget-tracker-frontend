export class Resolver {
  public formResolver(form: Record<string, any>) {
    const errors: Record<string, string> = {};

    if (!form.values.type) {
      errors.type = "Type is required";
    }

    if (!form.values.category) {
      errors.category = "Category is required";
    }

    if (!form.values.amount || form.amount <= 0) {
      errors.amount = "Amount must be greater than 0";
    }

    if (!form.values.description) {
      errors.description = "Description is required";
    }

    if (!form.values.name) {
      errors.name = "Name is required.";
    }

    if (!form.values.lastName) {
      errors.lastName = "Last Name is required.";
    }

    if (!form.values.email) {
      errors.email = "Email is required.";
    }

    if (!form.values.password) {
      errors.password = "Password is required.";
    }

    if (!form.values.confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    }

    if (
      form.values.password != form.values.confirmPassword &&
      form.values.password?.length > 0 &&
      form.values.confirmPassword?.length > 0
    ) {
      errors.password = "Passwords don't match.";
      errors.confirmPassword = "Passwords don't match.";
    }

    const hasErrors = Object.keys(errors).length > 0;
    return hasErrors ? { values: {}, errors } : { values: form, errors: {} };
  }
}
