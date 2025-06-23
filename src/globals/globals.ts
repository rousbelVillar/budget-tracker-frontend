export const formatTransactionDate = (transactionDate:string)=>{
    const non_formated_date:Date = new Date(transactionDate);
    const date:number = non_formated_date.getDate();
    const month = non_formated_date.getMonth() +1;
    const year = non_formated_date.getFullYear();
    return month + '-' + date + '-' + year;
}