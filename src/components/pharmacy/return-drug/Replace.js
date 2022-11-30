import React from "react";
import { useDispatch } from "react-redux";
import { Col, Table, Row, Form } from "reactstrap";
import SearchItemInput from "./SearchItem";
import CustomCard from "../../comp/components/CustomCard";
import TextInput from "../../comp/components/TextInput";
import { formatNumber } from "../../utils/helpers";
import CustomButton from "../../comp/components/Button";
// import CustomButton from '../../../app/components/Button'
// import { formatNumber } from '../../../app/utilities'
// import { sellItem } from '../../../redux/actions/purchase'
// import TextInput from '../../components/TextInput'
// import SearchItemInput from '../make-sales/SearchItem'

export default function Replace({
  _ref,
  theme,
  form = {},
  setForm=(f)=> f,
  handleChange = (f) => f,
  itemDetails = {},
  setSelected,
  handleAdd = (f) => f,
  data,
  handleDelete = (f) => f,
  selling_price,
  returnItem,
  selected,
  handleQtyChanges,
  handleSubmit,
  returnAmt,
  repRef,
  amount_paid,
  loading,
}) {
  const dispatch = useDispatch();
  const total_rep = data
    .filter((item) => item.type === "replace")
    .reduce((a, b) => a + parseInt(b.selling_price) * parseInt(b.quantity), 0);
  const total_ret = data
    .filter((item) => item.type === "return")
    .reduce((a, b) => a + parseInt(b.selling_price) * parseInt(b.quantity), 0);
  return (
    <CustomCard header="Replace Item " container="m-2 h-100 border border-primary" style={{ height: "97%" }}>
      <Form onSubmit={handleAdd}> 
      <Row className="m-0"> 
        <Col md="6" className="p-1">
          <SearchItemInput
            label="Item Name"
            _ref={_ref}
            disabled
            onInputChange={(v) => setSelected(v)}
            onChange={(v) => setSelected(v)}
          />
        </Col>
        <Col md="6" className="p-1">
          <TextInput
            container="col-md-12"
            type="number"
            className="mb-2"
            label="Quantity Return"
            placeholder="quantity"
            name="ret_quantity"
            value={form.ret_quantity}
            onChange={handleQtyChanges}
          />
        </Col>
        <Col md="6" className="p-1">
          <SearchItemInput
            _ref={repRef}
            labelKey="item_name"
            label="Replace With"
            onChange={(v) => setSelected([v])}
            onInputChange={(v) => setSelected([v])}
          />
        </Col>
        <Col md="6" className="p-1">
          <TextInput
            container="col-md-12"
            type="number"
            className="mb-2"
            label="Quantity Replace"
            placeholder="quantity"
            name="rep_quantity"
            value={form.rep_quantity}
            onChange={handleChange}
          />
        </Col>
        <Col>
          Remaining Qty:{" "}
          <span className="font-weight-bold">{itemDetails.quantity}</span>
        </Col>
        <Col>
          Selling Price:
          <span className="font-weight-bold">
            {formatNumber(itemDetails.selling_price)}
          </span>
        </Col>
        <Col>
          Expiry Date:
          <span className="font-weight-bold">{itemDetails.expiry_date}</span>
        </Col>
      </Row>
      <center>
        <CustomButton className="m-2" onClick={handleAdd}>
          Add to cart
        </CustomButton>
      </center>
      </Form>
      {/* {JSON.stringify(data)} */}
      <Table striped bordered>
        <tr>
          <th className="text-center">Item Name</th>
          <th className="text-center">Selling Price</th>
          <th className="text-center">Qty</th>
          <th className="text-center">Amount</th>
          <th className="text-center">Status</th>
          <th className="text-center">X</th>
        </tr>

        {data.map((item, i) => (
          <tr key={i}>
            {/* {JSON.stringify()} */}
            <td>{item.item_name ? item.item_name : item.description}</td>
            <td className="text-right">{formatNumber(item.selling_price)}</td>
            <td className="text-center">{formatNumber(item.quantity)}</td>
            <td className="text-right">
              {formatNumber(item.selling_price * item.quantity)}
            </td>
            <td>{item.type}</td>
            <td>
              <a href="#oppen"
                onClick={() => handleDelete(i)}
                className="text-danger outline"
                size="xs"
              >
                {/* <Trash className="text-danger" size={20} /> */}
              </a>
            </td>
          </tr>
        ))}
      </Table>

      <div className="d-flex flex-direction-row justify-content-between mb-1">
        <div>
          Total Amount Returned:{" "}
          <span className="font-weight-bold">{formatNumber(total_ret)}</span>
        </div>
        <div className="">
          Total Replace Amount:{" "}
          <span className="font-weight-bold">{formatNumber(total_rep)}</span>
        </div>
      </div>
      <span>
        Total Balance to be paid:{" "}
        <b>{formatNumber(parseFloat(total_rep) - parseFloat(total_ret))}</b>
      </span>

      <Row>
        <Col md="6" className="p-0">
          <TextInput
            container="col-md-12"
            type="number"
            className="mb-2"
            label="Amount Paid"
            name="amountPaid"
            value={form.amount_paid||amount_paid}
            onChange={({ target: { value } }) => {
              setForm({...form,amount_paid:value})
              dispatch({ type: "AMOUNT_PAID", payload: value });
            }}
          />
        </Col>
        <Col md="6" className="p-0">
          <TextInput
            container="col-md-12"
            type="number"
            className="mb-2"
            label="Discount"
            name="discount"
            value={form.discount}
            onChange={handleChange}
          />
        </Col>
      </Row>
      <center>
        <CustomButton
          className="px-5 m-2"
          onClick={handleSubmit}
          loading={loading}
        >
          ₦{formatNumber(amount_paid)} Submit
        </CustomButton>
      </center>
    </CustomCard>
  );
}
