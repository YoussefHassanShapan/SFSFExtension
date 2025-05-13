namespace jaldb;
entity LocalTimeAccount {
  key externalCode : UUID;
  userId           : String;
  startDate        : Date;
  endDate          : Date;
  createdDate      : Date;
  lastModifiedDate : Date;
  bookingStartDate : Date;
  bookingEndDate   : Date;
}
