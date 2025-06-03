sap.ui.define([
  "sap/ui/core/mvc/ControllerExtension",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox",
  "sap/m/MessageToast",
], function (ControllerExtension, Fragment, MessageBox, MessageToast) {
  "use strict";

  return ControllerExtension.extend("calendar.calendar.ext.controller.ListReportExt", {
    override: {
      actions: {
        uploadExcel: async function () {
          const oFileUploader = new sap.ui.unified.FileUploader({
            fileType: ["xlsx", "xls"],
            change: function (oEvent) {
              const file = oEvent.getParameter("files")[0];
              const reader = new FileReader();
              reader.onload = async function (e) {
                const base64Data = e.target.result.split(",")[1];

                try {
                  const oContext = this.getView().getBindingContext();
                  const oModel = this.getView().getModel();
                  const uploadAction = oModel.bindContext("/uploadExcel(...)");
                  uploadAction.setParameter("data", base64Data);

                  const result = await uploadAction.execute();
                  MessageToast.show("Upload successful");
                  console.log(result.getObject());
                } catch (err) {
                  MessageBox.error("Upload failed: " + err.message);
                }
              }.bind(this);
              reader.readAsDataURL(file);
            }.bind(this),
          });

          oFileUploader.openFileDialog();
        },
      },
    },
  });
});
