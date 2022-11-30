import React from "react";
import { Table } from "reactstrap";
import { formatNumber } from "../../utils/helpers";

const UnfinishedPurchaseTable = ({
  handleOnchangeDate,
  unfinishedPurchaseList,
  handleUnfinishedChange,
}) => {
  return (
    <>
        {/* {JSON.stringify(unfinishedPurchaseList)} */}
    <Table bordered responsive>
      <thead>
        <tr>
          {/* <th className="text-center">S/N</th> */}
          <th className="text-center">Items</th>
          <th className="text-center">Price(₦)</th>
          <th className="text-center">Rate</th>
          <th className="text-center">Approved</th>
          <th className="text-center">Received</th>
          <th className="text-center">Balance</th>
          <th className="text-center">Total(₦)</th>
          <th className="text-center">Expiring D.</th>
        </tr>
      </thead>
      <tbody>
        {unfinishedPurchaseList.map((item, index) => (
          <tr key={index}>
            {/* <td className="text-center">{index+1}</td> */}
            <td className="text-center">{item.item_name}</td>
            <td className="text-right">
              {formatNumber(parseFloat(item.price))}
            </td>
            <td className="text-center">{item.exchange_rate}</td>
            <td className="text-center">{item.propose_quantity}</td>
            <td className="text-center">{item.qty_in}</td>
            <td className="col-xs-2">
              <input
                // className=""
                onChange={(e) => {
                  let name = e.target.name;
                  let value = e.target.value;
                  handleUnfinishedChange(name, value, index);
                }}
                name="quantity"
                value={item.quantity}
                type="number"
                className="text-center input-sm form-control"
                style={{ width: "90px" }}
              />
            </td>
            <td className="text-right">
              {formatNumber(parseFloat(item.price) * parseFloat(item.quantity))}
            </td>
            <td>
              <input
                className="text-center input-sm form-control"
                type="date"
                style={{ width: "140px" }}
                name="date"
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleOnchangeDate(name, value, index);
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    </>
  );
};

export default UnfinishedPurchaseTable;
