export class Order {
	constructor(
    public id?: number,
    public customer_name?: string,
    public station?: any,
    public value?: number,
    public item?: string,
    public quantity?: number,
    public notes?: string,
    public order_items?: any,
    public price?: any,
    public charge_to_account?: boolean,
    public scheduled_order_time?: any,
    public account?: any
  ) {}
}
