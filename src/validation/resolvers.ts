export function transactionFormResolver(form: Record<string, any>) {
  const errors: Record<string, string> = {};
  console.log(form)
  if (!form.values.type) {
    errors.type = 'Type is required';
  }

  if (!form.values.category) {
    errors.category = 'Category is required';
  }

  if (form.values.amount == null || form.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

//   if (form.values.description && form.description.length > 200) {
//     errors.description = 'Description is too long';
//   }

  if(!form.values.description){
    errors.description = 'Description is required'
  }

  const hasErrors = Object.keys(errors).length > 0;
  return hasErrors
    ? { values: {}, errors }
    : { values: form, errors: {} };
}
