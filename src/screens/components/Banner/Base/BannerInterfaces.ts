interface BannerData {
  title: string;
  datatype: "Event" | "Trip";
  start: Date;
  end: Date;
  user: string;
}

interface TripData extends BannerData {
  trip: string;
  days: Map<string, EventData[]>;
}

interface EventData extends BannerData {
  trip: string;
  day: string;
  description: string;
  location: string,
  cost: {
    currency: string;
    amount: number;
  }
  items: string[];
  remarks: string;
  tag: string;
}