export function transactionFormResolver(form: Record<string, any>) {
  const errors: Record<string, string> = {};
  if (
    form.values.password != form.values.confirmPassword &&
    form.values.password?.length > 0 &&
    form.values.confirmPassword?.length > 0
  ) {
    errors.password = "Passwords don't match.";
    errors.confirmPassword = "Passwords don't match.";
  }
}
