sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], function(Controller) {
    "use strict";
  
    return Controller.extend("calendar.calendar.controller.UploadExcel", {
        openSpreadsheetUploadDialog: async function () {
            this.getView().setBusyIndicatorDelay(0);
            this.getView().setBusy(true);
            this.spreadsheetUpload = await this.getView()
              .getController()
              .getOwnerComponent()
              .createComponent({
                usage: "spreadsheetImporter",
                async: true,
                componentData: {
                  context: this,
                  tableId: "yourTableIdHere"
                },
              });
            this.spreadsheetUpload.openSpreadsheetUploadDialog();
            this.getView().setBusy(false);
          },
      onUploadPress: function() {
        // Trigger the hidden FileUploader click
        this.byId("fileUploader").$().find("input[type='file']").click();
      },
  
      onFileChange: function(oEvent) {
        var file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];
        if (file) {
          var reader = new FileReader();
  
          reader.onload = function(e) {
            var data = e.target.result;
            // TODO: Parse Excel data here (for example using SheetJS)
            console.log("Excel file loaded", data);
            sap.m.MessageToast.show("Excel file loaded (check console)");
          };
  
          reader.onerror = function(ex) {
            sap.m.MessageToast.show("Error reading file");
          };
  
          reader.readAsBinaryString(file);
        }
      }
  
    });
  });
  