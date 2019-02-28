export class Event {
	constructor(
    public name?: string,
    public published_name?: string,
    public gst_number?: any,
    public admin?: boolean,
    public active?: boolean,
    public password?: any,
    public station_id?: number,
    public station_name?: string,
    public logo?: string,
    public icon?: string
  ) {}
}
