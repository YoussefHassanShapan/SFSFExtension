using {ECPersonalInformation as external} from './external/ECPersonalInformation.csn';
using { ECTimeOff as externalTimeOff } from './external/ECTimeOff.csn';

service CatalogService {

    @cds.autoexpose
   entity EmployeeTime as projection on externalTimeOff.EmployeeTime {
        key externalCode,
        userId,
        timeType,
        approvalStatus,
        quantityInHours,
        quantityInDays,
        startDate,
        endDate,
        createdDateTime,
        lastModifiedDateTime,
        createdBy,
        lastModifiedBy,
        timeTypeNav,cancellationWorkflowRequestId,comment,endTime,
    userIdNav: Association to external.PerPerson on userIdNav.userId = userId,  // ✅ ADD ON condition

    };

// @cds.persistence: { table, skip: false }
    @cds.autoexpose
    entity PerPersonal as projection on external.PerPersonal {
        firstName, lastName, key personIdExternal as id, key startDate, '' as middelName : String
    }
    @cds.autoexpose
     entity TimeAccount as projection on externalTimeOff.TimeAccount{
        key externalCode,
        userId,
        startDate,
        endDate,
        createdDate,
        lastModifiedDate,
        bookingStartDate,
        bookingEndDate,
        accountTypeNav,
        
    }
 @cds.autoexpose
entity TimeType as projection on externalTimeOff.TimeType {
    key externalCode,
    externalName_defaultValue,
    country,
    category,
    unit,
    allowedFractionsUnitHour,
    allocationStrategy,
    balanceCalculationSetting,
    calculationMethod,
    postingPriority,
    workflowConfiguration,
    mdfSystemStatus,
    mdfSystemRecordStatus,
    mdfSystemEffectiveStartDate,
    mdfSystemEffectiveEndDate,
    createdDate,
    lastModifiedDate,
    createdBy,
    lastModifiedBy,
    mdfSystemRecordId,
    entityUUID
}
}

@protocol : 'rest'
service CatalogServiceRest {
    entity PerPersonal as projection on CatalogService.PerPersonal;
    entity TimeType as projection on CatalogService.TimeType;
    entity TimeAccount as projection on CatalogService.TimeAccount;
    entity EmployeeTime as projection on CatalogService.EmployeeTime;
}

