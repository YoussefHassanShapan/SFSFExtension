using {jaldb} from '../db/schema';
service CatalogService {
  entity EmployeeTime as projection on jaldb.EmployeeTime;
  entity PerPersonal as projection on jaldb.PerPersonal;
  entity TimeAccount as projection on jaldb.TimeAccount;
  entity TimeType as projection on jaldb.TimeType;



// action uploadExcel(
//    data: LargeBinary @Core.MediaType: 'text/csv'
//    )
// returns array of EmployeeTime
action uploadExcel(
   data: LargeBinary 
) returns array of EmployeeTime;
  // action uploadExcel() returns Boolean;

  
  action addEmployeeTime(
    externalCode: String,
    userId: String,
    timeType: String,
    approvalStatus: String,
    quantityInHours: Decimal(9,2),
    quantityInDays: Decimal(9,2),
    startDate: Date,
    endDate: Date,
    // createdDateTime: DateTime,
    // lastModifiedDateTime: DateTime,
    // createdBy: String,
    // lastModifiedBy: String,
    // cancellationWorkflowRequestId: String,
    // comment: String,
    // endTime: Time
  ) returns EmployeeTime;
}

// @protocol: 'rest'
// service CatalogServiceRest {
//   entity PerPersonal as projection on CatalogService.PerPersonal;
//   entity TimeType as projection on CatalogService.TimeType;
//   entity TimeAccount as projection on CatalogService.TimeAccount;
//   entity EmployeeTime as projection on CatalogService.EmployeeTime;
//}
