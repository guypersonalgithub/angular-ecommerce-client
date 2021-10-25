import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export class OrderDetails{
    public constructor (
        public city?:string,
        public street?:string,
        public shipping_date?: NgbDate,
        public credit_card?: number
    ){}
}