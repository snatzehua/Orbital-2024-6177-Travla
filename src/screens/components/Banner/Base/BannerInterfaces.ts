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
}

interface EventData extends BannerData {
  _id: string;
  trip: string;
  day: string;
  location: string,
  description: string;
  cost: {
    currency: string;
    amount: number;
  }
  items: string[];
  remarks: string;
  tag: string;
}