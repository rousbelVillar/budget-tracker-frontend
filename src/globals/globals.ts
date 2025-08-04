export const formatTransactionDate = (transactionDate: string) => {
  const non_formated_date: Date = new Date(transactionDate);
  const date: number = non_formated_date.getDate();
  const month = non_formated_date.getMonth() + 1;
  const year = non_formated_date.getFullYear();
  return month + "-" + date + "-" + year;
};

export const formatCurrency = (value: any) => {
  if (value) {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
};

export const getTypeSeverity = (transaction: any) => {
  switch (transaction.type) {
    case "expense":
      return "warn";
    case "income":
      return "success";
    default:
      return "";
  }
};

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return "";
}
