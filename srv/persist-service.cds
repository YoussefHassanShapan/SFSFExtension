using {jaldb} from '../db/schema';
service CatalogService {
  entity EmployeeTime as projection on jaldb.EmployeeTime;
  entity PerPersonal as projection on jaldb.PerPersonal;
  entity TimeAccount as projection on jaldb.TimeAccount;
  entity TimeType as projection on jaldb.TimeType;

  action uploadExcel(filename: String, data: LargeBinary) returns array of {
    externalCode: String;
    status: String;
    error: String;
  };
}

// @protocol: 'rest'
// service CatalogServiceRest {
//   entity PerPersonal as projection on CatalogService.PerPersonal;
//   entity TimeType as projection on CatalogService.TimeType;
//   entity TimeAccount as projection on CatalogService.TimeAccount;
//   entity EmployeeTime as projection on CatalogService.EmployeeTime;
//}
