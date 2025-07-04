sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/table/Table",
  "sap/ui/table/Column",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox"
],
  function (Controller, JSONModel, Table, Column, Fragment, MessageBox) {
    "use strict";

    return Controller.extend("expenseviewapproval.controller.View1", {
      /// return Controller.extend("expenseview.controller.View1", {
      onInit: function () {
        this._oRejectRow = null; // initialize
        this.initModel();
        this._getExpenseSet("000", "202507", "NotSubmit");
        this._loadRejectDialog();
        this._getTeamSet();

      },
      initModel: function () {
        var oData = {};
        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel);
      },

      onListTeamChange: function (oEvent) {
        var sTeamKey = this.byId("listTeamBox").getSelectedKey();

        // var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
        //MessageBox.show(sTeamKey);

        var sPeriod = this._getPeriod();

        var Stab = this.byId("iconTabBar");

        var SacitveTab = Stab.getSelectedKey();

        //MessageBox.show(SacitveTab)
        //_getExpenseSet(sTeamKey,"");
        this._getExpenseSet(sTeamKey, sPeriod, SacitveTab);


      },



      onPeriodChange: function (oEvent) {
        //  this._getPeriod();


        var sTeamKey = this.byId("listTeamBox").getSelectedKey();

        // var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
        //MessageBox.show(sTeamKey);

        var sPeriod = this._getPeriod();


        var Stab = this.byId("iconTabBar");

        var SacitveTab = Stab.getSelectedKey();

        //MessageBox.show(SacitveTab)

        //_getExpenseSet(sTeamKey,"");
        this._getExpenseSet(sTeamKey, sPeriod, SacitveTab);


        /////




      },

      onSelectTab: function (oEvent) {
        var sStatus = oEvent.getParameter("key");
        var sTeamKey = this.byId("listTeamBox").getSelectedKey();
        var sPeriod = this._getPeriod();

        if (sStatus == "NotSubmit" || sStatus == "Rejected") {

          this.byId("btnPdf").setVisible(false);
        } else {
          this.byId("btnPdf").setVisible(true);
        }

        this._getExpenseSet(sTeamKey, sPeriod, sStatus,);






        // MessageBox.show(sKey);
      },
      onSelect: function (oEvent) {
        var that = this;

        const selectedKey = oEvent.getParameter("key");
        const selectedItem = oEvent.getParameter("item");
        //MessageBox.show("Select");
      },


      onRejectSelectedPress: function (oEvent) {

        // 
        var oButton = oEvent.getSource();

        // Get the binding context of the row where the button resides
        var oContext = oButton.getBindingContext();
        var oRejectData = this.getOwnerComponent().getModel();

        if (oContext) {
          // Get the actual data of the row (JSON object)
          var oRowData = oContext.getObject();

          this._oRejectRow = oRowData; // initialize

          this.getOwnerComponent().myGlobalData = oRowData;

          this.getView().getModel().setProperty("/RowData", oRowData);
          // this.getView().setModel(oRowData, "RowData");

          this._rejectDialog.then(function (oDialog) {
            // this.getView().setModel(oRowData, "RowData");
            //this._selectReject = "test select";
            oDialog.open();

          });


          // this._getExpenseSet(sTeamKey, sPeriod, SacitveTab);

          //oRowData.


          //

        }
      },


      onRejectPress: function () {

        var oTable = this.byId("tableExpense");
        var aSelectionIndices = oTable.getSelectedIndices();
        var aSelectItems = [];
        var oModel = oTable.getModel();
        aSelectionIndices.forEach(function (iIndex) {
          var oContent = oTable.getContextByIndex(iIndex);
          var oData = oContent.getObject();

          this._oRejectRow = oData;
          //MessageBox.show (oData.RequestorFirstName);
          // MessageBox.error(oData.RequestorFirstName + " " + oData.RequestorLastName, {
          // title: "Confirm Reject"
          //});


        }
        );


        this._rejectDialog.then(function (oDialog) {

          //this._selectReject = "test select";
          oDialog.open();

        });
      },

      onConfRejectN: function () {
        var vInput = this.byId("InRejectedReason");
        vInput.setValue("");

        this._oRejectRow = "";

        // var vRejectReason = /RejectReason
        this._rejectDialog.then(function (oDialog) {
          oDialog.close();
        });
      },

      onConfRejectY: function () {

        var RejectData = this.getOwnerComponent().myGlobalData;
        //var RejectDetail = "test";
        var oRejectModel = this.getOwnerComponent().getModel();



        var vTeamKey = this.byId("listTeamBox").getSelectedKey();
        var vPeriod = this._getPeriod();
        var vtab = this.byId("iconTabBar");
        var vAcitveTab = vtab.getSelectedKey();

        var vCurrentData = this.getView().getModel().getProperty("/ExpenseSet"); // local data array

        var vInput = this.byId("InRejectedReason");

        // Get the value from the input
        var vValue = vInput.getValue();
        RejectData.RejectReason = vValue;

        this._oRejectRow.RejectReason = vValue;
        //vInput = "";  

        var vTemplate = [

          { PeriodMonth: "aa", TeamId: "bb", Requestor: "cc" }
          //  { PeriodMonth: "", Requestor: "", RejectReason: "" }

        ];
        //let vItem = Object.assign({}, vItems[0]);

        //  let vItems = {};

        //vTemplate.forEach(key => {
        //  vItems[key] = original[key];
        //});


        let vItems = [
          ["PeriodMonth", "aa"],
          ["TeamId", "bb"],
          ["Requestor", "cc"]
        ];

        let vItem = Object.assign({}, vItems[0]);

        vItem.PeriodMonth = RejectData.PeriodMonth;
        vItem.TeamId = RejectData.TeamId;
        vItem.Requestor = RejectData.Requestor;
        //vItem.RejectReason = RejectData.RejectReason;

        vItems.push(vItem);
        vItems.shift();


        oRejectModel.create("/RejectSet", this._oRejectRow, {
          success: function (oData, response) {


            // MessageBox.show (oData.);
            sap.m.MessageToast.show("reject successfully!");
          },
          error: function (oError) {
            sap.m.MessageBox.error("Error reject.");
          }
        });


        this._getExpenseSet(vTeamKey, vPeriod, vAcitveTab);
        this._rejectDialog.then(function (oDialog) {
          oDialog.close();
        });

        this._oRejectRow = "";

        vInput.setValue("");

        //this.getView().setModel(oRejectModel, "empModel");

        // var oButton = oEvent.getSource();

        // Get the binding context of the row where the button resides
        //var oContext = oButton.getBindingContext();

      },

      onConfRejectY1: function () {
        var oTable = this.byId("tableExpense");

        var aSelectionIndices = oTable.getSelectedIndices();
        var aSelectItems = [];
        var oModel = oTable.getModel();
        var oRejectModel = this.getOwnerComponent().getModel();


        // oModel.setHeaders({
        //   "zaction": "create"
        // });

        aSelectionIndices.forEach(function (iIndex) {
          var oContent = oTable.getContextByIndex(iIndex);
          var oData = oContent.getObject();

          aSelectItems.push(oData);

          oRejectModel.create("/RejectSet", oData, {
            success: function (oData, response) {

              //_getExpenseSet (vTeamId, vPeriod, vStatus) 
              // MessageBox.show (oData.);
              //sap.m.MessageToast.show("Customer created successfully!");
            },
            error: function (oError) {
              //sap.m.MessageBox.error("Error creating customer.");
            }
          });

          // oRejectModel.create("/RejectSet", oData, null, true);
          // oRejectModel.submitChanges({
          // success: function () {
          //   sap.m.MessageToast.show("All selected customers created successfully!");
          // },
          // error: function () {
          //   sap.m.MessageBox.error("Error while creating some customers.");
          // }
          // MessageBox.show(oData.RequestorFirstName);


          // MessageBox.error(oData.RequestorFirstName + " " + oData.RequestorLastName, {
          // title: "Confirm Reject"
          //});

        }
        );
        var that = this;
        //var oRejectModel = that.getView().getModel(); // ODataModel

        // var oRejectModel = this.getOwnerComponent().getModel();
        // aSelectItems.forEach(function (oEntry) {
        //   oRejectModel.create("/RejectSet", oEntry, {
        //     success: function () {
        //       sap.m.MessageToast.show("Customer created.");
        //     },
        //     error: function () {
        //       sap.m.MessageBox.error("Failed to create customer.");
        //     }
        //   });
        // });

        /////********/
        //var aItems = oTable.getRows();
        // var temp = aItems.getCells()[1];
        //aItems.forEach(oRow=> {
        // aItems.forEach(row => {
        //  const oCheckbox = row.getCells()[0];
        //if (oCheckbox.getSelected()) {

        //var oModel =  this.getView().getModel();
        // var oContext = row.getBindingContext();
        //const oData = oContext.getObject();
        //MessageBox.show(oData.RequestorFirstName);
        //MessageBox.information(oData.RequestorFirstName, {
        //  title: "Confirm Reject"
        //});

        // if (oContext){
        // oRowdata = oContext.getObject();
        //  MessageBox.show (oRowdata);
        // }
        //var oCheckbox = oRow.getCells()[1];
        // });


        //};
        //});



        //const oModel = this.getView().getModel();
        //const aData = oModel.getProperty("tableApproved");
        //const aSeletedItems =  aData.filter(status => item.selected);
        //MessageBox.show (aSeletedItems);
        this._rejectDialog.then(function (oDialog) {

          oDialog.close();
        });
      },

      onCallPress1: function (oEvent) {

        var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

        var hash = oCrossAppNavigator.hrefForExternal({
          target: {
            semanticObject: "Expense",      // <-- ต้องตรงกับที่กำหนดในแอปปลายทาง
            action: "displayDetail"       // <-- ต้องตรงกับที่กำหนดในแอปปลายทาง
          },
          params: {
            Requestor: "CHUSANA",      // <-- ส่ง Parameters ที่จำเป็นทั้งหมด
            PeriodMonth: "202507",
            Mode: "Display",
            ProjectId: "TN1",
            CalendarId: "Z3"
          }


        });




        // var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

        oCrossAppNavigator.toExternal({
          target: {
            shellHash: hash
          }
        });

      },

      onCallPress: function (oEvent) {
        var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

        // ใช้ toExternal เพื่อทำการนำทางไปทันที
        oCrossAppNavigator.toExternal({
          target: {
            semanticObject: "Expense",
            action: "displayDetail"
          },
          params: {
            Requestor: "CHUSANA",
            PeriodMonth: "202507",
            Mode: "Display",
            ProjectId: "TN1",
            CalendarId: "Z3"
          }
        });

        oCrossAppNavigator.toExternal({
          target: {
            shellHash: hash
          }
        });

      },



      onPdfPress: function () {


        var oTable = this.byId("tableExpense");

        var aSelectionIndices = oTable.getSelectedIndices();
        var aSelectItems = [];
        var aSelectItems2 = [];
        var oModel = oTable.getModel();
        var oRejectModel = this.getOwnerComponent().getModel();


        var oServiceUrl = oRejectModel.sServiceUrl;



        //var aItems = this.byId("tableExpense").getModel().getProperty("/ExpenseSet");




        // oModel.setHeaders({
        //   "zaction": "create"
        // });

        var aItems = [
          { PeriodMonth: "", TeamId: "", Requestor: "" }
          //{ ItemID: "20", Quantity: 5, Description: "Item 20 Desc" }
        ];

        var vTeamId = "";
        var vPeriodMonth = "";

        var sEntityPath = "ExpensePdfSet(PeriodMonth='"
        aSelectionIndices.forEach(function (iIndex) {
          var oContent = oTable.getContextByIndex(iIndex);
          var oData = oContent.getObject();


          //aSelectItems.push(oData);

          // let aItem = Object.assign({}, aItems[0]);
          // vTeamId = oData.TeamId;
          // vPeriodMonth = oData.PeriodMonth;
          // aItem.TeamId = oData.TeamId;
          // aItem.Requestor = oData.Requestor;
          // aItem.PeriodMonth = oData.PeriodMonth;
          //aItems.push(aItem);


          var vPeriod = oData.PeriodMonth;
          var vRequestor = oData.Requestor;

          //  if (iIndex == 0) {
          //sEntityPath = "ExpensePdfSet(PeriodMonth='" + vPeriod ;
          // }

          // elseif (iIndex == 1){ 
          // sEntityPath = sEntityPath + + "',Requestor='" + vRequestor;


          //}

          if (iIndex == 0) {
            sEntityPath = "ExpensePdfSet(PeriodMonth='" + vPeriod + "',Requestor='" + vRequestor;
          }

          else {
            sEntityPath = sEntityPath + "-" + vRequestor;
            //MessageBox.show("1");
          }




          // }//else{   



          //  }



        }
        );

        sEntityPath = sEntityPath + "')"

        aItems.shift();


        var oPayload = {
          TeamId: vTeamId,
          PeriodMonth: vPeriodMonth,

          ToItems: aItems // table data

        };



        // var vPeriod = "202507";
        //var vTeam = "DV2";
        //var vRequestor = "CHUSANAffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffzaaaa";

        //var 
        //sEntityPath = "ExpensePdfSet(PeriodMonth='" + vPeriod + "',Requestor='" + vRequestor + "')";
        //var
        // sEntityPath = "ExpensePdfSet(PeriodMonth='" + vPeriod + "',Requestor='" + vRequestor + "')";
        //var aEntityKey = "RejectSet('12345')"; // Replace with your entity key
        const sDownloadUrl = oServiceUrl + "/" + sEntityPath + "/$value";



        window.open(sDownloadUrl, "_blank");





        //////////////////
        //       // Send to backend
        //       oRejectModel.create("/RejectSet", oPayload, {
        //         success: function (oData) {
        //           //   sap.m.MessageToast.show("Order created!");
        //         },
        //         error: function (oError) {
        //           sap.m.MessageBox.error("Failed to create order.");
        //        }
        //      });
        ///////////////////////////       

      },

      _loadRejectDialog: function () {
        var that = this;
        var oView = this.getView();
        if (!this._rejectDialog) {
          this._rejectDialog = Fragment.load({
            id: oView.getId(),
            name: "expenseviewapproval.view.Reject",
            //name: "expenseview.view.Reject",
            controller: this
          }).then(function (oDialog) {
            oView.addDependent(oDialog);


            return oDialog;

          });

        };
      },

      _getTeamSet: function () {

        var that = this;
        var oServiceTeam = this.getOwnerComponent().getModel();

        oServiceTeam.read("/TeamIDSet", {
          // urlParameters: { "iv_key": cPeriodMonth

          //},
          //filters: aFilters,

          success: function (oData, response) {
            that.getView().getModel().setProperty("/TeamIDSet", oData.results);



          },
          error: function (oError) {
            MessageBox.show("Error");
          }



        });

      },

      _getPeriod: function () {

        var sPickDay = this.byId("DatePicker").getDateValue();
        var sPickYear = sPickDay.getFullYear();
        var sPickMonth = sPickDay.getMonth() + 1;

        if (sPickMonth.toString().length == 1) {
          var s_period = sPickYear.toString() + "0" + sPickMonth.toString();
        }
        else {
          s_period = sPickYear.toString() + sPickMonth.toString();
          //MessageBox.show("1");
        }
        return s_period;
        //MessageBox.show(s_period);


      },

      _getExpenseSet: function (vTeamId, vPeriod, vStatus) {

        var that = this;
        var oService = this.getOwnerComponent().getModel();
        //const cPeriodMonth = [{ KEY: "202407" }];
        //const cPeriodMonthLoad = { IT_KEY_TAB: cPeriodMonth };
        // const cPeriodMonthList = cPeriodMonth.join(",");
        //  oService.read("/SHStatusSet", {

        //var aFilters = [new sap.ui.model.Filter("TeamId", sap.ui.model.FilterOperator.EQ, vTeamId)];
        var sTable = this.byId("tableExpense");
        var sColumns = sTable.getColumns();

        debugger;
        if (vStatus == "NotSubmit") {
          var sSet = "/NotSubmitSet"
          var sStausdesc = "Not Submitted"
          sColumns[3].setVisible(true);
          sColumns[4].setVisible(false);
          sColumns[5].setVisible(false);
          sColumns[6].setVisible(false);
          sColumns[7].setVisible(false);
          sColumns[8].setVisible(false);
          sColumns[9].setVisible(false);
        } else if (vStatus == "Approved") {
          var sSet = "/ApproveSet"
          sStausdesc = "Approved"
          sColumns[3].setVisible(false);
          sColumns[4].setVisible(true);
          sColumns[5].setVisible(true);
          sColumns[6].setVisible(true);
          sColumns[7].setVisible(true);
          sColumns[8].setVisible(true);
          sColumns[9].setVisible(true);
        } else if (vStatus == "Rejected") {
          var sSet = "/RejectSet"
          sStausdesc = "Rejected"
          sColumns[3].setVisible(true);
          sColumns[4].setVisible(true);
          sColumns[5].setVisible(true);
          sColumns[6].setVisible(true);
          sColumns[7].setVisible(true);
          sColumns[8].setVisible(true);
          sColumns[9].setVisible(false);
        }
        else {
          sSet = "/ExpenseSet"
          sStausdesc = "Waiting"
          sColumns[3].setVisible(false);
          sColumns[4].setVisible(true);
          sColumns[5].setVisible(true);
          sColumns[6].setVisible(true);
          sColumns[7].setVisible(true);
          sColumns[8].setVisible(true);
          sColumns[9].setVisible(true);
        }

        var aFilters = [new sap.ui.model.Filter("TeamId", sap.ui.model.FilterOperator.EQ, vTeamId),
        new sap.ui.model.Filter("PeriodMonth", sap.ui.model.FilterOperator.EQ, vPeriod)];
        //oService.read("/ExpenseSet", {
        // urlParameters: { "iv_key": cPeriodMonth
        oService.read(sSet, {


          //},
          filters: aFilters,


          success: function (oData, response) {
            //    that.getView().getModel().setProperty("/SHStatusSet", oData.results);
            that.getView().getModel().setProperty("/ExpenseSet", oData.results);
            // MessageBox.show("Success");
            // that.getView().getModel().setProperty("/ApprovedCount",);
            that.getView().getModel().setProperty("/vStatusDesc", sStausdesc);
            that.getView().getModel().setProperty("/TotalCount", oData.results.length);


            if (vStatus == "NotSubmit") {
              that.getView().getModel().setProperty("/NotSubmitCount", oData.results.length);
              that.getView().getModel().setProperty("/ApproveCount", "");
              that.getView().getModel().setProperty("/WaitingCount", "");
              that.getView().getModel().setProperty("/RejectedCount", "");
            } else if (vStatus == "Approved") {
              that.getView().getModel().setProperty("/ApproveCount", oData.results.length);
              that.getView().getModel().setProperty("/NotSubmitCount", "");
              that.getView().getModel().setProperty("/WaitingCount", "");
              that.getView().getModel().setProperty("/RejectedCount", "");

            } else if (vStatus == "Rejetced") {
              that.getView().getModel().setProperty("/RejectedCount", oData.results.length);
              that.getView().getModel().setProperty("/NotSubmitCount", "");
              that.getView().getModel().setProperty("/WaitingCount", "");
              that.getView().getModel().setProperty("/ApproveCount", "");
            }
            else {
              that.getView().getModel().setProperty("/WaitingCount", oData.results.length);
              that.getView().getModel().setProperty("/NotSubmitCount", "");
              that.getView().getModel().setProperty("/ApproveCount", "");
              that.getView().getModel().setProperty("/RejectedCount", "");
            }

            //  <OverflowToolbar id="overflowToolbarApproved">
            //        <Title
            //           id="titleApproved"
            //         text="{vStatusDesc} ({/ApprovedCount})"


          },
          error: function (oError) {
            MessageBox.show("Error");
          }

        });
        //this.byId("iconTabBar").getItems()[0].setCount("2");
        //oView.getModel().setProperty("/ApprovedCount", oData.length);

        //var sTable = this.byId("tableExpense");
        //var sColumns = sTable.getColumns();
        //sColumns[3].setVisible(false);
        //sColumns[4].setVisible(false);
        //sColumns[5].setVisible(false);
        //sColumns[6].setVisible(false);
        //sColumns[7].setVisible(false);
        //var WaitingCount = "5";





      }
    });
  });
