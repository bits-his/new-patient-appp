import React, { useState } from "react";
import { useHistory } from "react-router";
import { Badge, Col, Table } from "reactstrap";
import SearchBar from "../../record/SearchBar";
import { formatNumber } from '../../utils/helpers';


export const GRNTable =                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ({
  purchaseItems = [],
  getSupplier,
  handleSet,
  setStatus,
  setUnfinishe_grn,
  getUnfinishedPurchase,
}) => {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState("");

  let rows = [];
  purchaseItems.length &&
    purchaseItems.forEach((item, index) => {
      let status = item.status;
      if (item.vendor.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1)
        return;
      rows.push(
        <tr
          className={
            status === "Disburse"
              ? "bg-success"
              : status === "unfinished purchase"
              ? "bg-danger"
              : "bg-info"
          }
        >
          <td>{item.date}</td>
          <td>{item.po_id}</td>
          <td>{item.client}</td>
          <td>{item.vendor}</td>
          <td className="text-right">{formatNumber(item.total_amount) || 0}</td>
          <td>
            <Badge
              color="primary"
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleSet(item);
                status === "unfinished purchase"
                  ? getUnfinishedPurchase(item.po_id)
                  : getSupplier(item.po_id);
                setStatus(
                  status === "unfinished purchase" ? "unfinished purchase" : ""
                );
                setUnfinishe_grn(
                  status === "unfinished purchase" ? item.grn_number : ""
                );
                console.log(item);
                history.push(`/me/new_inventory/grn/preview`);
              }}
            >
              Proccess
            </Badge>
          </td>
        </tr>
      );
    });
  return (
    <>
      <Col md={12}>
        <SearchBar
          filterText={searchTerm}
          onFilterTextChange={(searchTerm) => setSearchTerm(searchTerm)}
          placeholder="Search by ShortCode"
        />
      </Col>
      <Col md={12}>
        <Table bordered>
          <thead>
            <tr>
              <th>Date</th>
              <th>P O No.</th>
              <th>Client</th>
              <th>Vendor</th>
              <th>Total(₦)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Col>
    </>
  );
};
