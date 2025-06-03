sap.ui.define([], function () {
	"use strict";
	return {
		openSpreadsheetUploadDialogTable: async function (oEvent) {
            this._view.setBusyIndicatorDelay(0)
            this._view.setBusy(true)
            this.spreadsheetUpload = await this._view.getController().getAppComponent().createComponent({
                usage: "spreadsheetImporter",
                async: true,
                componentData: {
                    context: this
                }
            });
            this.spreadsheetUpload.openSpreadsheetUploadDialog()
            this._view.setBusy(false)
        }
	};
});