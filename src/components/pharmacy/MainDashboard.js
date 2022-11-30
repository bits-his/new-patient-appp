import moment from "moment";
import React, { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
// import Scrollbars from "react-custom-scrollbars";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Card,
  // CardBody,
  Table,
  // CardTitle,
  Col,
  // CardHeader,
} from "reactstrap";
import { getAllReport } from "../../redux/actions/pharmacy";
import Checkbox from "../comp/components/Checkbox";
import CustomScrollbar from "../comp/components/CustomScrollbar";
import DaterangeSelector from "../comp/components/DaterangeSelector";
// import Loading from "../comp/components/Loading";
import Widget from "../comp/components/Widget";
import SearchBar from "../record/SearchBar";
import { formatNumber } from "../utils/helpers";
import DashboardReport from "./DashboardReports";

function PharmacyDashboard() {
  const today = moment().format("YYYY-MM-DD");
  const [dateInfo, setDateInfo] = useState({ from: today, to: today });
  const dispatch = useDispatch();
  const [purchase, setPurchase] = useState([]);
  const [sales, setSales] = useState([]);
  const [discount, setDiscount] = useState([]);
  const [debts, setDebts] = useState([]);
  const [list, setList] = useState([]);
  const [items, setItems] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [showAllPurchase, setShowAllPurchase] = useState(false);
  const syncData = useCallback(() => {
    dispatch(
      getAllReport(setPurchase, dateInfo.from, dateInfo.to, "Purchase summary")
    );
    dispatch(
      getAllReport(setSales, dateInfo.from, dateInfo.to, "Sales summary")
    );
    dispatch(
      getAllReport(setDiscount, dateInfo.from, dateInfo.to, "Discount summary")
    );
    dispatch(
      getAllReport(setDebts, dateInfo.from, dateInfo.to, "Debt summary")
    );
  }, [dispatch, dateInfo.from, dateInfo.to]);

  useEffect(() => {
    syncData();
  }, [syncData]);

  const getReports = useCallback(() => {
    dispatch(
      getAllReport(
        setList,
        dateInfo.from,
        dateInfo.to,
        "Purchase category summary"
      )
    );
  }, [dispatch, dateInfo.from, dateInfo.to]);

  const [searchTxt, addSearchTxt] = useState("");

  const retrieveList = useCallback(() => {
    setItems(
      searchTxt.length > 2 && list.length
        ? list.filter((item) => {
            return item.description
              .toLowerCase()
              .includes(
                searchTxt.toLowerCase() ||
                  item.receive_date.toString().includes(searchTxt)
              );
          })
        : list
    );

    //  setItems(list);
  }, [list, searchTxt]);
  useEffect(() => {
    getReports();
  }, [getReports]);

  useEffect(() => {
    retrieveList();
  }, [retrieveList]);
  const fetchData = useCallback(() => {
    // dispatch(getItemList());
  }, [dispatch]);
  const handleChange = ({ target: { name, value } }) => {
    setDateInfo((p) => ({ ...p, [name]: value }));
  };
  const totalAmount = list.reduce(
    (a, b) => parseFloat(a) + parseFloat(b.amount),
    0
  );
  const total_selling_price = list.reduce(
    (a, b) => parseFloat(a) + parseFloat(b.selling_price) * parseFloat(b.qty),
    0
  );
  const final = items.length > 0 && showAllPurchase ? items : items.slice(-15);
  return (
    <Card body className="container">
      <div className="">
        {/* <span className="h5">Welcome back, {user.busName}</span> */}
      </div>
      <DaterangeSelector
        from={dateInfo.from}
        to={dateInfo.to}
        handleChange={handleChange}
      />
      <Row>
        <Widget
          fa="fa-store"
          id={0}
          link={`/me/pharmacy/main-dashboard?route=Purchase category summary&from=${dateInfo.from}&to=${dateInfo.to}`}
          title="Total purchase"
          content={`₦ ${
            purchase.length
              ? purchase[0].total
                ? formatNumber(purchase[0].total)
                : 0
              : 0
          }`}
        />
        <Widget
          fa="fa-credit-card"
          id={0}
          link={`/me/pharmacy/main-dashboard?route=Sales category summary&from=${dateInfo.from}&to=${dateInfo.to}`}
          title="Total sales"
          content={`₦ ${
            sales.length
              ? sales[0].total
                ? formatNumber(sales[0].total)
                : 0
              : 0
          }`}
        />
      </Row>
      {/* <Row>
        <Col md={10}>
          <SearchBar
            onFilterTextChange={(v) => addSearchTxt(v)}
            filterText={searchTxt}
            placeholder="search for purchase"
          />
        </Col>
        <Col className="d-flex flex-direction-row align-items-center">
          <Checkbox
            label="Show All"
            checked={showAllPurchase}
            onChange={() => setShowAllPurchase((p) => !p)}
          /> */}
      {/* <CustomButton
              className="mb-2 btn-block"
              onClick={() => {
                // retrieveList()
                syncData()
                fetchData()
              }}
            >
              Get list
            </CustomButton> */}
      {/* </Col>
      </Row> */}
      {/* <div
        className=""
        style={{ marginLeft: "auto", marginRight: 0, paddingRight: "20px" }}
      >
        <div style={{ fontSize: "12px", fontFamily: "sans-serif" }}>
          Total No. of Items:{" "}
          <span style={{ textAlign: "center", fontWeight: "bold" }}>
            {final.length}
          </span>
        </div>
        <div style={{ fontSize: "12px", fontFamily: "sans-serif" }}>
          Total Cost:
          <span style={{ textAlign: "center", fontWeight: "bold" }}>
            ₦{formatNumber(totalAmount)}
          </span>
        </div>
        <div style={{ fontSize: "12px", fontFamily: "sans-serif" }}>
          Total Selling Price:
          <span style={{ textAlign: "center", fontWeight: "bold" }}>
            ₦{formatNumber(total_selling_price)}
          </span>
        </div>
      </div> */}
      <CustomScrollbar style={{ height: "38vh" }}>
        <DashboardReport main={true} from={dateInfo.from} to={dateInfo.to} />
      </CustomScrollbar>
    </Card>
  );
}

export default PharmacyDashboard;
