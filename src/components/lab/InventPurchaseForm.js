import React from 'react';
import { FormGroup, Label, Input, Row } from 'reactstrap';
import TextInput from '../comp/components/TextInput';
// import { TextInput } from '../components';

function PurchaseForm({
  qttyRef,
  handleItemChange,
  setUnitPrice,
  unitPrice,
  // supplierItemCategory,
  editable = true,
  setItemType,
  itemType,
  // getItemsByCategory,
  itemTypeRef,
  setItemCategory,
  itemCategory,
  // itemCodeRef,
  // supplierRef,
  // unitOfMeasurementRef,
  // pendingItem,
  description,
  setItemCode,
  // fetchSuppliers,
  // supplierList,
  // setSupplier,
  setDescription,
  // unitOfMeasurement,
  // setMeasurement,
  // unitRate,
  setPrice,
  setAmount,
  amount,
  setVatAmount,
  setTotalAmount,
  price,
  setQuantity,
  itemCode,
  quantity,
  // invoiceNo,
  // setInvoiceNo,
  // setUnitRate,
  handleRadio,
  handleRadio1,
  radioInput,
  markUp,
  setMarkUp,
  mark_up,
  setMark_up,
  handleMarkUp,
  selling_price,
  setSelling_price,
  totalamount,
  setIndividualPrice,
  itemRef,
  _item_code_ref=null
}) {
  // const qttyRef = useRef(null)
  //

  return (
    <>
      <Row>
        <FormGroup className="col-md-4 col-lg-4">
          {/* <label style={{ fontWeight: 'bold' }}>Item Code</label> */}
          {/* <Input
            autoFocus
            // ref={itemRef}
            onChange={handleItemChange}
            value={itemCode}
            ref={_item_code_ref}
          /> */}
          <label>Item Code</label>
          <TextInput
            autoFocus
            onChange={handleItemChange}
            value={itemCode}
            _ref={_item_code_ref}
            label="Item Code"
            // onChange={({ target: { value } }) => setItemType(value)}
            // value={itemType}
          />
          {/* <AutoComplete
          required
          label="Item Category"
          labelKey="item_type"
          placeholder="Select Item category"
          name="itemType"
          options={setItemCategory}
          onChange={(text) => {
            if (text.length) {
              setItemType(text[0].item_type);
              // getItemsByCategory(text[0].item_category);
            }
          }}
          _ref={itemTypeRef}
        /> */}
        </FormGroup>
        {/* {JSON.stringify(itemCategory)} */}
        <FormGroup className="col-md-4 col-lg-4">
          <label>Item Name</label>
          <TextInput
            label="Item Name"
            onChange={({ target: { value } }) => setItemType(value)}
            value={itemType}
          />
          {/* <AutoComplete
          required
          label="Item Code"
          type="text"
          name="itemCode"
          placeholder="Select Item Code"
          emptyLabel="select item category"
          labelKey={(item) => `${item.description}(${item.item_code})`}
          _ref={itemCodeRef}
          id="itemType"
          options={pendingItem}
          onChange={(text) => {
            if (text.length) {
              setItemCode(text[0].item_code);
              fetchSuppliers(text[0].item_code);
            }
          }}
        /> */}
        </FormGroup>
        {/* {JSON.stringify(pendingItem)} */}
        {/* <FormGroup className="col-md-4 col-lg-4"> */}
        {/* <AutoComplete
          required
          label="Supplier"
          type="text"
          name="itemType"
          placeholder="Select Supplier "
          emptyLabel="please select item code"
          _ref={supplierRef}
          // id="itemType"
          labelKey={(item) => `${item.name} `}
          options={supplierList}
          onChange={(text) => {
            if (text.length) {
              setSupplier(text[0].name);
            }
          }}
        /> */}
        {/* </FormGroup> */}
        <FormGroup className="col-md-4 col-lg-4">
          <label>Description (optional)</label>
          <input
            type="text"
            onChange={({ target: { value } }) => setDescription(value)}
            value={description}
            className="form-control"
          />
        </FormGroup>
      </Row>
      {/* <FormGroup className="col-md-4 col-lg-4"> */}
      {/* <AutoComplete
          required
          label="Unit of Measurement"
          name="itemType"
          placeholder="Select Item Code"
          labelKey={(item) =>
            `${item.unit_of_measurement}(${item.unit}/${item.per})`
          }
          _ref={unitOfMeasurementRef}
          id="itemType"
          options={unitOfMeasurement}
          onChange={(text) => {
            if (text.length) {
              setMeasurement(text[0].unit_of_measurement);
            }
          }}
        /> */}
      {/* </FormGroup> */}

      {/* <FormGroup className="col-md-4 col-lg-4">
        <TextInput
          label="Unit Rate"
          onChange={({ target: { value } }) => setUnitRate(value)}
          value={unitRate}
        />
      </FormGroup> */}
      <Row>
        <FormGroup className="col-md-4 col-lg-4">
          <label>Price</label>
          {/* {JSON.stringify(parseInt(mark_up)+parseInt(price))} */}
          {/* {JSON.stringify(selling_price+'hjh')} */}
          <TextInput
            type="number"
            label="Price"
            onChange={({ target: { value } }) => {
              // let amt = parseInt(value) * parseInt(quantity);
              // let totalamt = parseInt(amt)
              // let unitPriceItem = value + mark_up;
              // let unitPrice = parseInt(unitPriceItem) * quantity;
              // setUnitPrice(value )
              // setIndividualPrice(() => parseInt(unitPriceItem));
              setSelling_price(
                parseInt(mark_up + parseInt(value)) * parseInt(quantity),
              );
              // + _getVAT(amt);
              setPrice(value);
              // setAmount(amt);
              // setVatAmount(_getVAT(amt));
              // setTotalAmount(totalamt);
              // setSelling_price(totalamt)
              setIndividualPrice(parseInt(mark_up) + parseInt(value));
              // setSelling_price(
              //   (mark_up / 100) * amount + parseInt(totalamount),
              // );
            }}
            value={price}
          />
        </FormGroup>

        <FormGroup className="col-md-4 col-lg-4">
        <label>Quantity</label>
          <TextInput
            label="Quantity"
            _ref={qttyRef}
            onChange={({ target: { value } }) => {
              // let amt = parseInt(price) * parseInt(value);
              // let totalamt = parseInt(amt)
              // + _getVAT(amt);
              // let individualPrice=selling_price/quantity
              // setIndividualPrice(individualPrice)
              // let individualPrice=totalamt/quantity
              // setIndividualPrice(()=>parseInt(individualPrice) )
              // let unitPriceItem = price + mark_up;
              setSelling_price(
                (parseInt(mark_up) + parseInt(price)) * parseInt(value),
              );
              // let unitPrice = parseInt(unitPriceItem) * value;
              // setIndividualPrice( parseInt(value)+parseInt(price));
              // setSelling_price( (parseInt(mark_up)+parseInt(price))*parseInt(quantity));
              setQuantity(value);
              // setAmount(amt);
              // setVatAmount(_getVAT(amt));
              // setTotalAmount(totalamt);
              // setSelling_price(totalamt);
              // setSelling_price(
              //   (mark_up / 100) * amount + parseInt(totalamount),
              // );
            }}
            value={quantity}
            disabled={true}
          />
        </FormGroup>
        <FormGroup className="col-md-4 col-lg-4">
          <Label>
            <b>Mark up</b>
          </Label>
          <Input
            type="text"
            placeholder="fixed amount"
            name="mark_up"
            value={mark_up}
            onChange={({ target: { value } }) => {
              setMark_up(value);
              // handleMarkUp(value);
              // setMarkUp(
              //   (prev) => (parseInt(value) * parseInt(mark_up)) / 100
              // );
              // let unitPriceItem = price + value;
              // let unitPrice = parseInt(unitPriceItem) * quantity;
              // setIndividualPrice(() => parseInt(unitPriceItem));
              setSelling_price(
                (parseInt(value) + parseInt(price)) * parseInt(quantity),
              );
              // setUnitPrice(price)
              // let sale=parseInt(value) + parseInt(totalamount)
              // setSelling_price(sale);
              // let individualPrice=sale/quantity
              setIndividualPrice(parseInt(value) + parseInt(price));
            }}
            // onChange={(e) => {
            //   let { value } = e.target;
            //   handleMarkUp(value);
            //   setMarkUp(value);
            // }}
          />
        </FormGroup>
      </Row>

      {/* <FormGroup className="col-md-4 col-lg-4">
        <TextInput
          label="Invoice Number"
          onChange={({ target: { value } }) => setInvoiceNo(value)}
          value={invoiceNo}
          placeholder="Enter the invoice number"
        />
      </FormGroup> */}
    </>
  );
}

export default PurchaseForm;
