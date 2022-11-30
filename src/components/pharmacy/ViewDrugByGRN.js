import React, { useCallback, useEffect, useState } from "react";
import { FaPrint } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Card, CardHeader, Table } from "reactstrap";
import { useQuery } from "../../hooks";
import { apiURL } from "../../redux/actions";
import { _fetchApi2 } from "../../redux/actions/api";
import { CustomButton } from "../comp/components";
import PrintWrapper from "../comp/components/print/PrintWrapper";
import Scrollbar from "../comp/components/Scrollbar";
import BackButton from "../landing/BackButton";
import { formatNumber } from "../utils/helpers";

export default function ViewDrugByGRN() {
  const query = useQuery();
  const grn_no = query.get("grn_no");
  const { facilityId } = useSelector((state) => state.auth.user);
  const [data, setData] = useState([]);

  const getData = useCallback(() => {
    _fetchApi2(
      `${apiURL()}/api/pharmacy/get-drug-grn-no?grn_no=${grn_no}&facilityId=${facilityId}`,
      (data) => {
        setData(data.results);
      },
      (err) => {
        console.log(err);
      }
    );
  }, [grn_no]);

  useEffect(() => {
    getData();
  }, [getData]);

  const printFunction = () => {
    window.frames[
      "print_frame"
    ].document.body.innerHTML = document.getElementById(
      "print-count"
    ).innerHTML;
    window.frames["print_frame"].window.focus();
    window.frames["print_frame"].window.print();
  };
  const total = data.reduce((a, b) => parseInt(b.price), 0);
  return (
    <div className="m-2">
      <Card body>
        <CardHeader>
          <div className="d-flex justify-content-between">
            <BackButton />
            <h3>Goods Received Note ({grn_no})</h3>
            <CustomButton
              outline
              color="warning"
              className="px-5"
              onClick={printFunction}
            >
              <FaPrint /> Print
            </CustomButton>
          </div>
        </CardHeader>
        <Scrollbar style={{ height: 400 }}>
          <div id="print-count">
            <h2 className="text-right">Total: {formatNumber(total)}</h2>
            <PrintWrapper title="Goods Received Note" footer={false}>
              <Table bordered striped>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Drug Name</th>
                    <th>Cost Price</th>
                    <th className="no-print">Selling Price</th>
                    <th>Quantity</th>
                    <th>Supplier Name</th>
                    <th>Expiry Date</th>
                    <th>Store</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.drug_name}</td>
                        <td className="text-right">
                          {formatNumber(item.price)}
                        </td>
                        <td className="text-right no-print">
                          {formatNumber(item.selling_price)}
                        </td>
                        <td className="text-right">{item.balance}</td>
                        <td>{item.supplier_name}</td>
                        <td>{item.expiry_date}</td>
                        <td>{item.store}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </PrintWrapper>
          </div>
        </Scrollbar>
      </Card>
      <iframe
        title="print-count"
        name="print_frame"
        width="0"
        height="0"
        src="about:blank"
        // style={styles}
      />
    </div>
  );
}
