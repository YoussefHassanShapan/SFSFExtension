using {ECPersonalInformation as external} from './external/ECPersonalInformation.csn';
using { ECTimeOff as externalTimeOff } from './external/ECTimeOff.csn';
// using jaldb from '../db/schema';

service CatalogService {

    @cds.persistence : {
        table,
        skip : false
    }
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
        bookingEndDate

    

    
    }
 @cds.autoexpose
entity TimeType as projection on externalTimeOff.TimeType {
    key externalCode,
    externalName_defaultValue as name,
    externalName_en_US,
    externalName_zh_CN,
    externalName_ja_JP,
    externalName_fr_FR,
    externalName_de_DE,
    externalName_pt_BR,
    externalName_es_ES,
    externalName_ar_SA,
    externalName_ko_KR,


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
    // entity LocalTimeAccount as projection on jaldb.LocalTimeAccount;

}

