namespace jaldb;

entity EmployeeTime {
  key externalCode: String;
  userId: String;
  timeType: String;
  approvalStatus: String;
  quantityInHours: Decimal(9,2);
  quantityInDays: Decimal(9,2);
  startDate: Date;
  endDate: Date;
  createdDateTime: DateTime;
  lastModifiedDateTime: DateTime;
  createdBy: String;
  lastModifiedBy: String;
  cancellationWorkflowRequestId: String;
  comment: String;
  endTime: Time;

  userIdNav: Association to PerPersonal;
}

entity PerPersonal {
  key personIdExternal: String;
  key startDate: Date;
  firstName: String;
  lastName: String;
  middelName: String;
}

entity TimeAccount {
  key externalCode: String;
  userId: String;
  startDate: Date;
  endDate: Date;
  createdDate: Date;
  lastModifiedDate: Date;
  bookingStartDate: Date;
  bookingEndDate: Date;
  accountTypeNav: String;
}

entity TimeType {
  key externalCode: String;
  externalName_defaultValue: String;
  country: String;
  category: String;
  unit: String;
  allowedFractionsUnitHour: String;
  allocationStrategy: String;
  balanceCalculationSetting: String;
  calculationMethod: String;
  postingPriority: String;
  workflowConfiguration: String;
  mdfSystemStatus: String;
  mdfSystemRecordStatus: String;
  mdfSystemEffectiveStartDate: Date;
  mdfSystemEffectiveEndDate: Date;
  createdDate: Date;
  lastModifiedDate: Date;
  createdBy: String;
  lastModifiedBy: String;
  mdfSystemRecordId: String;
  entityUUID: UUID;
}

