interface BannerData {
  title: string;
  datatype: "Event" | "Trip";
  start: Date;
  end: Date;
}

interface EventData extends BannerData {
}

interface TripData extends BannerData {
}