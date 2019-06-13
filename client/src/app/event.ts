export class Event {
	constructor(
    public id?: number,
    public name?: string,
    public published_name?: string,
    public gst_number?: any,
    public admin?: boolean,
    public active?: boolean,
    public password?: any,
		public station_id?: number,
    public second_station_id?: number,
    public station_name?: string,
    public logo?: string,
    public icon?: string,
    public item_image?: string,
    public help_url?: string,
    public event_help_url?: string,
    public show_date?: boolean,
    public is_one_off?: boolean,
    public start_date?: any,
    public end_date?: any,
    public is_allowed_to_order?: boolean,
		public earliest_preorder_date?: any,
		public latest_preorder_date?: any,
		public printed_image?: string,
		public banner_message?: string,
		public printouts_email?: string,
		public phone_number?: string,
		public total_costs?: number,
		public number_of_tiles?: number,
		public number_of_tiles_array?: number,
		public disable_print_popup?: boolean,
		public disable_print_popup_customer?: boolean,
		public comments_label?: string
		public website?: string
  ) {}
}
