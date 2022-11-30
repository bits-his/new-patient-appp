import React from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoIosList } from "react-icons/io";
import { FiSettings, FiShoppingCart } from "react-icons/fi";
import { FaClipboardList } from "react-icons/fa";
import { AiOutlineFileDone } from "react-icons/ai";
// import DrugSale from "./drug/DrugSales";
import Users from "../admin/Users";
import { createUser } from "../../redux/actions/pharmacy";
import DrugCount from "./DrugCount";
import AddnewDrug from "./drug/AddnewDrug";
import DrugView from "./DrugView";
import ReturnItem from "./return-drug/ReturnItem";
import ManageStore from "./ManageStore";
import Supplier from "./supplier/Supplier";
import SupplierForm from "./supplier/SupplierForm";
import SupplierPayment from "./supplier/SupplierPayment";
import SupplierReport from "./supplier/SupplierReport";
import Sales from "./sales/Sales";
import PharmacyDashboard from "./PharmacyDashboard";
import MainDashboard from "./MainDashboard";
import DashboardReports from "./DashboardReports";
import DrugSalesPage from "./drug/DrugSalesPage";
import PostSalePage from "./drug/PostSalePage";
import Transfer from "./transfer/Transfer";
import DrugList from "./druglist/DrugList";
import ReprintTrans from "./Reprint";
import ViewDrugByGRN from "./ViewDrugByGRN";

// import PharmacyIndex from "../../pages/pharmacy/PharmacyIndex";
// import ReturnDrug from "../../pages/pharmacy/ReturnDrug";
// import Drug from "../../pages/pharmacy/drug/Drug";
// import SignUp from "../../pages/pharmacy/Users/SignUp";

// import DrugCount from "../../pages/pharmacy/DrugCount";
// import Sales from "../../pages/pharmacy/sales/Sales";
// import Supplier from "../../pages/pharmacy/supplier/Supplier";
// import PharmacyDashboard from "../../pages/pharmacy/PharmacyDashboard";
// import SupplierForm from "../../pages/pharmacy/supplier/SupplierForm";
// import SupplierPayment from "../../pages/pharmacy/supplier/SupplierPayment";
// import SupplierReport from "../../pages/pharmacy/supplier/SupplierReport";
// import AddnewDrug from "../../pages/pharmacy/drug/AddnewDrug";
// import DrugView from "../../pages/pharmacy/DrugView";
// import ManageStore from "../../pages/pharmacy/ManageStore";
// import CreateUser from "../../pages/pharmacy/Users/CreateUser";
// import Users from "../../pages/pharmacy/Users/Users";
// import ReturnItem from "../../pages/pharmacy/return-drug/ReturnItem";
// import DrugSale from "../../pages/pharmacy/drug/DrugSales";

const PharmTabs = withRouter(({ history, location }) => {
  return (
    <div>
      <button
        onClick={() => history.push(`/me/pharmacy/dashboard`)}
        className={`text-left btn ${
          location.pathname === `/me/pharmacy/dashboard`
            ? "btn-primary"
            : "btn-outline-primary"
        } col-md-12 col-lg-12`}
      >
        <MdDashboard size={26} style={{ marginRight: 10 }} /> Dashboard
      </button>
      <button
        onClick={() => history.push(`/me/pharmacy/inventory`)}
        className={`text-left btn ${
          location.pathname === `/me/pharmacy/inventory`
            ? "btn-primary"
            : "btn-outline-primary"
        } col-md-12 col-lg-12`}
      >
        <FaClipboardList size={26} style={{ marginRight: 10 }} />
        Inventory
      </button>
      <button
        onClick={() => history.push(`/me/pharmacy/purchase`)}
        className={`text-left btn ${
          location.pathname === `/me/pharmacy/purchase`
            ? "btn-primary"
            : "btn-outline-primary"
        } col-md-12 col-lg-12`}
      >
        <AiOutlineFileDone size={26} style={{ marginRight: 10 }} />
        Purchase Record
      </button>
      <button
        onClick={() => history.push(`/me/pharmacy/dispensary`)}
        className={`text-left btn ${
          location.pathname === `/me/pharmacy/dispensary`
            ? "btn-primary"
            : "btn-outline-primary"
        } col-md-12 col-lg-12`}
      >
        <FiShoppingCart size={26} style={{ marginRight: 10 }} /> Drug Sales
      </button>
      <button
        onClick={() => history.push(`/me/pharmacy/dispensary`)}
        className={`text-left btn ${
          location.pathname === `/me/pharmacy/sale`
            ? "btn-primary"
            : "btn-outline-primary"
        } col-md-12 col-lg-12`}
      >
        <FiShoppingCart size={26} style={{ marginRight: 10 }} /> Sales
      </button>
      <button
        onClick={() => history.push(`/me/pharmacy/suppliers`)}
        className={`text-left btn ${
          location.pathname === `/me/pharmacy/suppliers`
            ? "btn-primary"
            : "btn-outline-primary"
        } col-md-12 col-lg-12`}
      >
        <FiSettings size={26} style={{ marginRight: 10 }} />
        Manage Suppliers
      </button>
      <button
        onClick={() => history.push(`/me/pharmacy/druglist`)}
        className={`text-left btn ${
          location.pathname === `/me/pharmacy/druglist`
            ? "btn-primary"
            : "btn-outline-primary"
        } col-md-12 col-lg-12`}
      >
        <IoIosList size={26} style={{ marginRight: 10 }} /> Drug List
      </button>
      {/*<button
        onClick={() => history.push(`/me/pharmacy/addDrug`)}
        className={`text-left btn ${
          location.pathname === `/me/pharmacy/addDrug` ? 'btn-primary' : 'btn-outline-primary'
        } col-md-12 col-lg-12`}>
        Add Drug
      </button>
       <button
        onClick={() => history.push(`/me/pharmacy/addDrug`)}
        className={`text-left btn ${
          location.pathname === `/me/pharmacy/addDrug` ? 'btn-primary' : 'btn-outline-primary'
        } col-md-12 col-lg-12`}>
        Inventory Report
      </button>
      <button
        onClick={() => history.push(`/me/pharmacy/upToDateStockBalance`)}
        className={`text-left btn ${location.pathname === `/me/pharmacy/upToDateStockBalance`? 'btn-primary' : 'btn-outline-primary'} col-md-12 col-lg-12`}
      >
        Stock Balance
      </button> */}
    </div>
  );
});

function PharmacyRoute() {
  return (
    <Switch>
      <Redirect from={`/me/pharmacy`} to={`/me/pharmacy/dashboard`} exact />
      <Route path={`/me/pharmacy/drug-sales`} component={DrugSalesPage} />
      <Route
        path={`/me/pharmacy/sales-receipt`}
        component={PostSalePage}
        exact
      />
      <Route path={`/me/pharmacy/manage-user`} component={Users} exact />
      <Route
        path={`/me/pharmacy/manage-user/form`}
        component={createUser}
        exact
      />
      <Route path={`/me/pharmacy/drug-purchase`} component={DrugCount} exact />
      <Route
        path={`/me/pharmacy/drug-purchase/add-new-purchase`}
        component={AddnewDrug}
        exact
      />
      <Route
        path={`/me/pharmacy/drug-purchase/drug-view`}
        component={DrugView}
      />
      <Route
        path={`/me/pharmacy/returned-drugs`}
        component={ReturnItem}
        exact
      />

      <Route path={`/me/pharmacy/manage-store`} component={ManageStore} exact />
      <Route path={`/me/pharmacy/reprint`} component={ReprintTrans} exact />
      {/* <Route path={`/me/pharmacy/manage-customer/client_reg_form`} component={ClientReg} exact />
      <Route
        path="/me/pharmacy/manage-customer/client_deposit"
      component={Deposit}
        exact
      /> */}

      <Route
        path={`/me/pharmacy/manage-customer/client_account_view`}
        component={ManageStore}
        exact
      />
      <Route
        path={`/me/pharmacy/manage-suppliers`}
        component={Supplier}
        exact
      />
      <Route
        path={`/me/pharmacy/manage-suppliers/supplier_form`}
        component={SupplierForm}
        exact
      />
      <Route
        path={`/me/pharmacy/manage-suppliers/supplier_payment`}
        component={SupplierPayment}
        exact
      />
      <Route
        path={`/me/pharmacy/manage-suppliers/supplier-report`}
        component={SupplierReport}
        exact
      />
      <Route path={`/me/pharmacy/sales-report`} component={Sales} exact />
      <Route
        path={`/me/pharmacy/dashboard`}
        component={PharmacyDashboard}
        exact
      />
      <Route
        path={`/me/pharmacy/main-dashboard`}
        component={MainDashboard}
        exact
      />
      <Route
        path="/me/pharmacy/dashboard-view"
        component={DashboardReports}
        exact
      />
      <Route path="/me/pharmacy/transfer" component={Transfer} exact />
      <Route path="/me/pharmacy/drug-list" component={DrugList} exact />
      <Route path={`/me/pharmacy/drug-purchase/grn-view`} component={ViewDrugByGRN} exact />
    </Switch>
  );
}

export default PharmacyRoute;
export { PharmTabs };
