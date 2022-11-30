import React from "react";
import { Input, Table } from "reactstrap";
import { formatNumber } from "../../utils/helpers";

export const GRNReviewTable = ({
  handleOnchangeDate,
  supplierItems = [],
  handleOnchange,
}) => {
  return (
    <>
      {/* {JSON.stringify(supplierItems)} */}
      <Table bordered responsive>
        <thead>
          <tr>
            <th className="text-center">Items</th>
            <th className="text-center">Price(₦)</th>
            <th className="text-center">Rate</th>
            <th className="text-center">A. Qty</th>
            <th className="text-center">R. Qty</th>
            <th className="text-center">Total(₦) </th>
            <th>Expiry Date </th>
          </tr>
        </thead>
        <tbody>
          {supplierItems.map((item, i) => (
            <tr key={i}>
              <td>{item.item_name}</td>
              <td className="text-right">{formatNumber(item.price)}</td>
              <td className="text-center">
                {formatNumber(item.exchange_rate)}
              </td>
              <td className="text-center">
                {formatNumber(item.propose_quantity)}
              </td>

              <td>
                <Input
                  style={{ width: "100px" }}
                  size="sm"
                  value={item.renew}
                  name="renew"
                  type="number"
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleOnchange(name, value, i);
                  }}
                />
              </td>
              <td className="text-right">{formatNumber(item.amount)}</td>
              {item.expired_status === "true" ? (
                <td>
                  <input
                    type="date"
                    className="form-control"
                    style={{ width: "100%" }}
                    name="date"
                    value={item.date}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchangeDate(name, value, i);
                    }}
                  />
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default GRNReviewTable;
