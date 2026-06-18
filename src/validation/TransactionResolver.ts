import { inherits } from "util";
import { TransactionForm } from "../interfaces/Transaction";
import { Resolver } from "./Resolver";

export class TransactionResolver extends Resolver {
  public transactionValidation(form: TransactionForm): boolean {
    if (form.amount == null || form.amount <= 0) {
      return false;
    }
    if (!form.type) {
      return false;
    }
    if (!form.category) {
      return false;
    }
    if (!form.description) {
      return false;
    }
    return true;
  }
}
