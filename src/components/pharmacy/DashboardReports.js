import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Col, Row, Input, Label } from "reactstrap";
// import { _fetchApi } from "../../redux/actions/api";
// import { useParams } from "react-router";
// import DaterangeSelector from "../../app/components/DaterangeSelector";
// import { getAllReport } from "../../redux/actions/reports";
// import CustomCard from "../../components/CustomCard";
// import useQuery from "../hooks/useQuery";
// import { formatNumber } from "../../app/utilities";
// import Checkbox from "../components/CheckBox";
// import { getStoresList } from "../../redux/actions/stores";
import SearchBar from "../record/SearchBar";
import SearchStoresInput from "./components/SearchStoresInput";
import CustomScrollbar from "../comp/components/CustomScrollbar";
import DaterangeSelector from "../comp/components/DaterangeSelector";
import { formatNumber } from "../utils/helpers";
import CustomCard from "../comp/components/CustomCard";
import Checkbox from "../comp/components/Checkbox";

import useQuery from "../../hooks/useQuery";
import { getAllReport } from "../../redux/actions/pharmacy";
import BackButton from "../comp/components/BackButton";
import { SelectInput } from "../comp/components";

export default function DashboardReport({ main = false, from, to }) {
  // const today = moment().format('YYYY-MM-DD')
  const query = useQuery();
  const fromDate = query.get("from");
  const toDate = query.get("to");
  const dispatch = useDispatch();
  const [reports, setReports] = useState([]);
  const [list, setList] = useState([]);
  const [branch, setBranch] = useState("");
  const [filterText, setFilterText] = useState("");
  const query_type = query.get("route") || "Purchase category summary";
  const pharmStore = useSelector((state) => state.pharmacy.pharmStore);
  const [showAllPurchase, setShowAllPurchase] = useState(false);
  const options = pharmStore && pharmStore.map((item) => item.store_name);
  const [range, setRange] = useState({
    from: main ? from : fromDate,
    to: main ? to : toDate,
    modeOfPayment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [form, setForm] = useState({
    branch_name: "",
  });

  const getReports = useCallback(() => {
    dispatch(
      getAllReport(
        setReports,
        main ? from : range.from,
        main ? to : range.to,
        query_type.split(" ")[0] + " category summary"
      )
    );
  }, [dispatch, range, query_type, from, to, main]);

  useEffect(() => {
    getReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [0, getReports]);

  // useEffect(() => {
  //   dispatch(getStoresList());
  // }, [dispatch]);

  const retrieveList = useCallback(() => {
    setList(
      filterText.length > 3
        ? reports.filter(
            (item) =>
              item.description
                .toLowerCase()
                .includes(filterText.toLowerCase()) ||
              (item.mop &&
                item.mop.toLowerCase().includes(filterText.toLowerCase()))
          )
        : reports
    );
  }, [reports, filterText, range.modeOfPayment]);

  const sycSearch = useCallback(() => {
    setList(
      branch.length > 3 && reports.length
        ? reports.filter((item) =>
            item.branch_name.toLowerCase().includes(branch.toLowerCase())
          )
        : reports
    );
  }, [reports, branch, range.modeOfPayment]);

  const sycSearchMode = useCallback(() => {
    setList(
      range.modeOfPayment !== "" && reports.length
        ? reports.filter((item) =>
            // item.mop &&
            item.mop.includes(range.modeOfPayment)
          )
        : reports
    );
  }, [reports, range.modeOfPayment]);

  useEffect(() => {
    sycSearchMode();
  }, [sycSearchMode]);

  useEffect(() => {
    retrieveList();
  }, [retrieveList]);

  useEffect(() => {
    sycSearch();
  }, [sycSearch]);
  const tt =
    list &&
    list.length &&
    list.map((item) => parseInt(item.qty) * parseInt(item.selling_price));

  let total = tt && tt.reduce((total, num) => total + num);
  const tt2 =
    list &&
    list.length &&
    list
      .map((item) => parseInt(item.amount))
      .reduce((total, num) => total + num);

  let purchaseRoute = query_type && query_type.split(" ")[0] === "Purchase";
  // const filterByMode = list.filter((i) => i.mop.includes(range.modeOfPayment));
  // let rows = range.modeOfPayment !== "" ? list : filterByMode;

  return (
    <div className="bg-white">
      <center>
        <div className="d-flex">
          {!main && <BackButton />}
          <b className="text-center">
            Total
            {" " + query_type && query_type.split(" ")[0]} reports
          </b>
        </div>
      </center>
      <div className="m-2">
        <Row clasName="mb-3">
          <Col md={6}>
            {!main && (
              <DaterangeSelector
                handleChange={handleChange}
                from={range.from}
                to={range.to}
              />
            )}
          </Col>
          <Col md={3}>
            {/* <SelectInput
              label="Mode of payment"
              placeholder="Select by Store"
              options={["CASH", "CREDIT", "BANK TRANSFER", "POS"]}
              onChange={handleChange}
              value={range.modeOfPayment}
              name="modeOfPayment"
              width={250}
            /> */}
          </Col>
          <Col md={6}>
            <Label>Search Bar</Label>
            <SearchBar
              filterText={filterText}
              placeholder="Search items"
              onFilterTextChange={(input) => setFilterText(input)}
            />
          </Col>
          <Col className="d-flex flex-direction-row align-items-center">
            <SearchStoresInput
              onChange={(selected) => {
                console.error({ selected });
                setBranch(selected);
              }}
              onInputChange={(v) => {
                setBranch(v);
              }}
              clearButton
            />
          </Col>
          <Col className="d-flex flex-direction-row align-items-center">
            <Checkbox
              label="Show All"
              checked={showAllPurchase}
              onChange={() => setShowAllPurchase((p) => !p)}
            />
          </Col>
        </Row>
      </div>
      <CustomScrollbar height="65vh">
        {/* {JSON.stringify(list)} */}
        <Table bordered size="sm">
          {(query_type && query_type.split(" ")[0]) === "Expenses" ||
          (query_type && query_type.split(" ")[0]) === "Debt" ? (
            <thead>
              <tr>
                <th className="text-center">S/N</th>
                <th className="text-center">Date</th>
                <th className="text-center">Description</th>
                <th className="text-center">Amount</th>
              </tr>
            </thead>
          ) : (
            <thead>
              <tr>
                <th rowSpan={2} className="text-center">
                  S/N
                </th>
                <th rowSpan={2} className="text-center">
                  Date
                </th>
                <th rowSpan={2} className="text-center">
                  Description
                </th>
                <th rowSpan={2} className="text-center">
                  {purchaseRoute ? "Supplier name" : "Patient Name"}
                </th>
                <th rowSpan={2} className="text-center">
                  Mode Of Payment
                </th>
                <th colSpan={3} className="text-center">
                  Item Qty & Cost
                </th>
              </tr>
              <tr>
                <th className="text-center">Qty Purchased</th>
                <th className="text-center">Cost Price</th>
                <th className="text-center">Total</th>
              </tr>
            </thead>
          )}
          {(query_type && query_type.split(" ")[0] === "Expenses") ||
          (query_type && query_type.split(" ")[0] === "Debt") ? (
            <tbody>
              {list &&
                list.map((item, i) => (
                  <tr key={i}>
                    <th className="text-center">{i + 1}</th>
                    <td>{moment(item.created).format("DD-MM-YYYY")}</td>
                    <td>{item.description}</td>
                    <td className="text-center">{formatNumber(item.amount)}</td>
                  </tr>
                ))}
              <tr>
                <th scope="row" colSpan="3" className="text-right">
                  Total
                </th>
                <th className="text-center">{formatNumber("50")}</th>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {list &&
                list.map((item, i) => (
                  <tr key={i}>
                    <th className="text-center">{i + 1}</th>
                    <td>{moment(item.receive_date).format("DD-MM-YYYY")}</td>
                    <td>{item.description}</td>
                    <td className="text-center">
                      {purchaseRoute ? item.supplier_name : item.otherInfo}
                    </td>
                    <td className="text-center">{item.mop}</td>
                    <td className="text-center">{formatNumber(item.qty)}</td>
                    <td className="text-right">
                      {formatNumber(item.selling_price)}
                    </td>
                    <td className="text-right">
                      {formatNumber(
                        parseInt(item.qty) * parseInt(item.selling_price)
                      )}
                    </td>
                  </tr>
                ))}
              <tr>
                <th scope="row" colSpan="6" className="text-right">
                  Total
                </th>
                <th className="text-right">{formatNumber(total)}</th>
              </tr>
            </tbody>
          )}
        </Table>
      </CustomScrollbar>
    </div>
  );
}
