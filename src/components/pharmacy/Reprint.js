import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Card, CardHeader, Col, Label, Table } from "reactstrap";
import { getAllReport } from "../../redux/actions/pharmacy";
import DaterangeSelector from "../comp/components/DaterangeSelector";
import Loading from "../comp/components/Loading";
import SearchBar from "../record/SearchBar";
import { today } from "../utils/helpers";

export default function ReprintTrans() {
  const [range, setRange] = useState({
    from: today,
    to: today,
  });

  const history = useHistory();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [printOut, setPrintOut] = useState({});
  const [loading, setLoading] = useState(false);
  const patientSearchRef = useRef();

  const handleRangeChange = (key, val) =>
    setRange((p) => ({ ...p, [key]: val }));

  //   const [list, setList] = useState([]);
  // const history = useHistory();

  const getReprintData = useCallback(() => {
    setLoading(true);
    dispatch(
      getAllReport(
        (d) => {
          setPrintOut(d);
          setLoading(false);
        },
        range.from,
        range.to,
        "reprint"
      )
    );
  }, [range.from, range.to]);

  useEffect(() => {
    getReprintData();
  }, [getReprintData]);

  let rows = [];

  if (printOut.length) {
    printOut.forEach((item, index) => {
      if (
        item.receiptDateSN &&
        item.receiptDateSN.toLowerCase().indexOf(searchTerm.toLowerCase()) ===
          -1
      )
        return;

      rows.push(
        <tr
        // style={{ cursor: "pointer" }}
        // className="bg-success text-white"
        //   onClick={() => handleClick(item)}
        >
          <td>{moment(item.created_at).format("DD-MM-YYYY hh:mm")}</td>
          <td>{item.receiptDateSN}</td>
          <td>
            <button
              className="btn btn-sm btn-info"
              onClick={() =>
                history.push(
                  `/me/pharmacy/sales-receipt?type=salesPage&transaction_id=${item.receiptDateSN}`
                )
              }
            >
              Reprint
            </button>
          </td>
        </tr>
      );
    });
  }
  //   const location = useLocation();
  return (
    <>
      {/* {JSON.stringify(list)} */}
      <Card outline color="primary" className="m-3">
        <CardHeader outline color="success" className="text-center" tag="h6">
          Reprint transaction
        </CardHeader>
        <div className="m-1 row">
          <Col>
            {" "}
            <DaterangeSelector
              from={range.from}
              to={range.to}
              handleChange={({ target: { name, value } }) =>
                handleRangeChange(name, value)
              }
              gap={false}
              size="sm"
              showLabel={true}
            />
          </Col>
          <Col>
            <Label>Search Bar</Label>
            <SearchBar
              filterText={searchTerm}
              placeholder="Search by Receipt number"
              onFilterTextChange={(searchTerm) => setSearchTerm(searchTerm)}
              _ref={patientSearchRef}
            />
          </Col>
        </div>
        {loading && <Loading />}
        <Scrollbars style={{ height: "65vh" }}>
          <Table bordered responsive hover size="sm">
            <thead>
              <th className="text-center">Date</th>
              <th className="text-center">Receipt no</th>
              <th className="text-center">Action</th>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Scrollbars>
      </Card>
    </>
  );
}
