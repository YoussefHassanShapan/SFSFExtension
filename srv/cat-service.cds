using {ECPersonalInformation as external} from './external/ECPersonalInformation.csn';

service CatalogService {

    @cds.persistence : {
        table,
        skip : false
    }
    @cds.autoexpose
    entity PerPersonal as projection on external.PerPersonal {
        firstName, lastName, key personIdExternal as id, key startDate, '' as middelName : String

    }


}

@protocol : 'rest'
service CatalogServiceRest {

    entity PerPersonal as projection on CatalogService.PerPersonal
}

