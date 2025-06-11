using CatalogService as service from '../../srv/persist-service';
annotate service.EmployeeTime with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'externalCode',
                Value : externalCode,
            },
            {
                $Type : 'UI.DataField',
                Label : 'userId',
                Value : userId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'timeType',
                Value : timeType,
            },
            {
                $Type : 'UI.DataField',
                Label : 'approvalStatus',
                Value : approvalStatus,
            },
            {
                $Type : 'UI.DataField',
                Label : 'quantityInHours',
                Value : quantityInHours,
            },
            {
                $Type : 'UI.DataField',
                Label : 'quantityInDays',
                Value : quantityInDays,
            },
            {
                $Type : 'UI.DataField',
                Label : 'startDate',
                Value : startDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'endDate',
                Value : endDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'createdDateTime',
                Value : createdDateTime,
            },
            {
                $Type : 'UI.DataField',
                Label : 'lastModifiedDateTime',
                Value : lastModifiedDateTime,
            },
            {
                $Type : 'UI.DataField',
                Label : 'createdBy',
                Value : createdBy,
            },
            {
                $Type : 'UI.DataField',
                Label : 'lastModifiedBy',
                Value : lastModifiedBy,
            },
            {
                $Type : 'UI.DataField',
                Label : 'cancellationWorkflowRequestId',
                Value : cancellationWorkflowRequestId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'comment',
                Value : comment,
            },
            {
                $Type : 'UI.DataField',
                Label : 'endTime',
                Value : endTime,
            },
            {
                $Type : 'UI.DataField',
                Label : 'userIdNav_personIdExternal',
                Value : userIdNav_personIdExternal,
            },
            {
                $Type : 'UI.DataField',
                Label : 'userIdNav_startDate',
                Value : userIdNav_startDate,
            },
          
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'externalCode',
            Value : externalCode,
        },
        {
            $Type : 'UI.DataField',
            Label : 'userId',
            Value : userId,
        },
        {
            $Type : 'UI.DataField',
            Label : 'timeType',
            Value : timeType,
        },
        {
            $Type : 'UI.DataField',
            Label : 'approvalStatus',
            Value : approvalStatus,
        },
        {
            $Type : 'UI.DataField',
            Label : 'quantityInHours',
            Value : quantityInHours,
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'CatalogService.EntityContainer/uploadExcel',
            Label : 'Upload Excel',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'CatalogService.EntityContainer/addEmployeeTime',
            Label : 'Create',
        },
    ],
    UI.Identification : [
        
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Table View',
    },
    UI.LineItem #tableView : [
    ],
    UI.SelectionPresentationVariant #tableView1 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Table View 1',
    },
);
annotate service with {
    uploadExcel @(
        Common.Label: 'Browse',
        Core.OperationAvailable: true
    );
};
// annotate service.EmployeeTime with {
//     userIdNav @Common.ValueList : {
//         $Type : 'Common.ValueListType',
//         CollectionPath : 'PerPersonal',
//         Parameters : [
//             {
//                 $Type : 'Common.ValueListParameterInOut',
//                 LocalDataProperty : userIdNav_personIdExternal,
//                 ValueListProperty : 'personIdExternal',
//             },
//             {
//                 $Type : 'Common.ValueListParameterDisplayOnly',
//                 ValueListProperty : 'startDate',
//             },
//             {
//                 $Type : 'Common.ValueListParameterDisplayOnly',
//                 ValueListProperty : 'firstName',
//             },
//             {
//                 $Type : 'Common.ValueListParameterDisplayOnly',
//                 ValueListProperty : 'lastName',
//             },
//             {
//                 $Type : 'Common.ValueListParameterDisplayOnly',
//                 ValueListProperty : 'middelName',
//             },
//         ],
//     }
// };

