import { Category } from "./Category";


export interface Transaction{
  type: "income" | "expense" | '';
  category:Category | string;
  description: string;
  amount:number;
  date:string;
  id:number;
};

export interface TransactionForm{
  type: "income" | "expense" | "";
  category:string;
  description: string;
  amount:number;
};
