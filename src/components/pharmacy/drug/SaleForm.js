import React from "react";
import { Col, Label, Row } from "reactstrap";
import { SelectInput, TextInput } from "../../comp/components";
import InputGroup from "../../comp/components/InputGroup";
import SearchBar from "../../record/SearchBar";

function SalesForm({
  disabled,
  form,
  handleChange,
  qttyRef,
  itemNameRef,
  setFilterText = (f) => f,
  options,
  user_id,
  filterText,
}) {
  return (
    <Row className="m-0 p-0">
      <Col md={6}>
        <Label>Search by Drug Name or Barcode</Label>
        <SearchBar
          _ref={itemNameRef}
          placeholder="Search drug by code or name"
          filterText={filterText}
          onFilterTextChange={(v) => {
            setFilterText(v);
          }}
        />
      </Col>
      <Col md={3}>
        <InputGroup
          placeholder="Enter Quantity"
          type="number"
          label="Enter Quantity"
          value={form.quantity_sold}
          _ref={qttyRef}
          name="quantity_sold"
          onChange={handleChange}
          container="col-md-12 px-0"
        />
      </Col>
      <Col md={3}>
        <SelectInput
          label="Select Store"
          _default="Select Store"
          type="select"
          value={form.store_name}
          name="store_name"
          options={options}
          onChange={handleChange}
          container="col-md-12 px-0"
        />
      </Col>
    </Row>
  );
}

export default SalesForm;
