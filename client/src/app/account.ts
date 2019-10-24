export class Account {
	constructor(
    public name?: string,
    public contact_name?: string,
    public phone?: string,
    public number?: string,
    public address?: string,
    public email?: string,
    public event_id?: number,
    public is_active? :boolean,
    public items? :any,
		public station_id? :any
  ) {}
}
