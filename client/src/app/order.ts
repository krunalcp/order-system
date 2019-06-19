export class Order {
	constructor(
    public id?: number,
    public customer_name?: string,
    public station?: any,
    public value?: number,
    public item?: string,
    public item_id?: number,
    public quantity?: number,
    public notes?: string,
    public comments?: string,
    public order_items?: any,
    public price?: any,
    public charge_to_account?: boolean,
    public scheduled_order_time?: any,
    public account?: any,
    public account_id?: number,
    public order_number?: number,
		public station_id?: number

  ) {}
}
