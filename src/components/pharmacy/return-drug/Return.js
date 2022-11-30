import React from "react";
import "./hover.css";
import {
  Alert,
  Input,
  InputGroup,
  Table,
} from "reactstrap";
// import CustomButton from '../../../app/components/Button'
// import { formatNumber } from '../../../app/utilities'
import CustomCard from "../../comp/components/CustomCard";
import { formatNumber } from "../../utils/helpers";
import CustomButton from "../../comp/components/Button";

export default function Return({
  form = {},
  handleChange = (f) => f,
  handleSearch = (f) => f,
  loading = false,
  list = [],
  handleTable = (f) => f,
  returnAmt,
  data,
  setReturnItem,
  theme,
  returnItem,
}) {
  const total = list.reduce((a, b) => a + parseFloat(b.amount), 0);

  return (
    <CustomCard
      header="Return Item"
      container="border border-dark m-2 h-100"
      style={{ height: "97%" }}
    >
      <div className="  p-0 pb-3 col-md-6">
        <InputGroup>
          <Input
            container=""
            placeholder="Receipt No"
            name="receiptNo"
            value={form.receiptNo}
            onChange={handleChange}
          />
          {/* <InputGroupAddon addonType="append"> */}
          <CustomButton
            onClick={handleSearch}
            loading={loading}
            // className="mb-1 px-5"
          >
            Search
          </CustomButton>
          {/* </InputGroupAddon> */}
        </InputGroup>
      </div>
      {list.length ? (
        <Alert className="text-center">Select an item to return</Alert>
      ) : null}
      <Table striped bordered>
        <tr>
          <th className="text-center">Item Name</th>
          <th className="text-center">Selling Price</th>
          <th className="text-center">Qty</th>
          <th className="text-center">Amount</th>
          {/* <th>R. Qty</th> */}
        </tr>
        {/* {JSON.stringify(list)} */}
        {list.map((item, i) => (
          <tr
            style={{ cursor: "pointer" }}
            className="hover"
            onClick={() => {
              // data.forEach((item)=>{
              //   // if(item.it)
              // })
              setReturnItem(item);
            }}
          >
            <td> {item.description}</td>
            <td className="text-right">{formatNumber(item.amount)}</td>
            <td className="text-center">{formatNumber(item.quantity)}</td>
            <td className="text-right">
              {formatNumber(parseInt(item.amount) / parseInt(item.quantity))}
            </td>
            {/* <td>
                <TextInput
                  container="col-md-12"
                  className="mb-2"
                  name="return_quantity"
                  value={item.return_quantity}
                  onChange={(e) => {
                    let value = e.target.value;
                    handleTable("return_quantity", value, i);
                  }}
                />
              </td> */}
          </tr>
        ))}
      </Table>
      <div className="text-right">
        <span className="mr-2 font-weight-bold">
          Total Amount: ₦{formatNumber(total)}
        </span>
        {/* <span className="font-weight-bold">Amount Return: ₦{returnAmt}</span> */}
      </div>
    </CustomCard>
  );
}
