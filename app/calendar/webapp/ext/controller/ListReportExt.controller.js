sap.ui.define([
  "sap/ui/core/mvc/ControllerExtension",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (ControllerExtension, Fragment, MessageToast, MessageBox) {
  "use strict";

  return ControllerExtension.extend("calendar.calendar.ext.controller.ListReportExt", {
    onUploadExcelPress: async function () {
      const oView = this.getView();

      if (!this._pDialog) {
        this._pDialog = await Fragment.load({
          name: "calendar.calendar.ext.fragment.UploadExcelButton",
          controller: this
        });
        oView.addDependent(this._pDialog);
      }

      this._pDialog.open();
    },

    onFileSelected: function (oEvent) {
      this._file = oEvent.getParameter("files")[0];
    },

    onUploadFile: async function () {
      if (!this._file) {
        MessageToast.show("No file selected");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result.split(",")[1];
        try {
          const response = await fetch("/odata/v4/catalog/CatalogService.uploadExcel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: base64 })
          });
          if (!response.ok) throw new Error(response.statusText);
          MessageToast.show("Upload successful!");
        } catch (err) {
          MessageBox.error("Upload failed: " + err.message);
        }
      };
      reader.readAsDataURL(this._file);

      this._file = null;
      this._pDialog.close();
    },

    onCloseUploadDialog: function () {
      this._pDialog.close();
    }
  });
});
