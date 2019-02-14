export class Item {
	constructor(
    public name?: string,
    public price?: number,
    public notes?: string,
    public item_used?: boolean,
    public order_no?: number,
    public active?: boolean
  ) {}
}
