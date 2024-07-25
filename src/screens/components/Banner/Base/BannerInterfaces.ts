interface BannerData {
  title: string;
  datatype: "Event" | "Trip";
  start: Date;
  end: Date;
  user: string;
}

interface TripData extends BannerData {
  _id?: string;
  trip: string;
  days: Map<string, EventData[]>;
  accommodation: Map<string, Accommodation>
  misc: Miscellaneous[]
}

interface Miscellaneous {
  item: string, 
  cost: {
    currency: string;
    amount: number;
  }
}

interface EventData extends BannerData {
  _id: string;
  trip: string;
  day: string;
  location: string,
  geometry: {lat: number, lng: number},
  description: string;
  cost: {
    currency: string;
    amount: number;
  }
  items: string[];
  remarks: string;
  tag: string;
}

interface Accommodation {
    name: string;
    cost: {
      currency: string;
      amount: number;
  }
}