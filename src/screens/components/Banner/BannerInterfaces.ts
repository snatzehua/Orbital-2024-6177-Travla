interface BannerData {
  title: string;
  datatype: "Event" | "Trip";
  start: Date;
  end: Date;
}

interface TripData extends BannerData {
  days: Map<string, EventData[]>;
}

interface EventData extends BannerData {
}