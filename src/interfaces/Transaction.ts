import { Category } from "./Category";


export interface Transaction{
  type: "income" | "expense";
  category:Category;
  description: string;
  amount:number;
  date:Date;
  id:number;
};

export interface TransactionForm{
  type: "income" | "expense";
  category:string;
  description: string;
  amount:number;
};
