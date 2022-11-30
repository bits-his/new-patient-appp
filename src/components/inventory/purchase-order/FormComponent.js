import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { useLocation } from "react-router";
import {
  Row,
  FormGroup,
  Label,
  Col,
  Input,
  InputGroup,
  InputGroupButtonDropdown,
} from "reactstrap";
import { formatNumber } from "../../utils/helpers";

function FormComponent({
  typeRef,
  getSub,
  getItemsItemQty,
  getSpecification,
  setForm,
  specification,
  handleChange,
  quantity_available,
  propose_quantity,
  exchange_rate,
  formTitle,
  splitButtonOpen,
  toggleSplit,
  InputGroupAddon,
  price,
  exchageType,
  setFormTitle,
  type,
  exchange_type,
  remark,
}) {
  const location = useLocation();
  return (
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label>Item Name</Label>
          <Typeahead
            placeholder="Your type here"
            labelKey={(item) => item.description}
            ref={typeRef}
            options={getSub}
            disabled={location.pathname.includes(
              "/me/pharmacy/purchase-order/preview"
            )}
            onInputChange={(val) => {
              getItemsItemQty(val);
              getSpecification(val);
              setForm((prev) => ({
                ...prev,
                item_name: val,
              }));
            }}
            onChange={(item) => {
              if (item.length) {
                let val = item[0].description;
                getItemsItemQty(val);
                getSpecification(val);
                setForm((prev) => ({
                  ...prev,
                  item_name: val,
                  expired_status: item[0].expired_status
                }));
              }
            }}
          />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label>Specification</Label>
          <Input
            type="text"
            disabled={location.pathname.includes(
              "/me/pharmacy/purchase-order/preview"
            )}
            name="specification"
            value={specification}
            onChange={handleChange}
          />
        </FormGroup>
      </Col>

      <Col md={6}>
        <FormGroup>
          <Label>Quantity Available </Label>
          <Input
            type="text"
            name="quantity_available"
            disabled
            // disabled={location.pathname.includes(
            //   "/me/pharmacy/purchase-order/preview"
            // )}
            // onFocus={() =>
            //   setForm((p) => ({
            //     ...p,
            //     quantity_available: p.quantity_available === 0 ? "" : p.quantity_available     ,
            //   }))}
            value={quantity_available || 0}
            onChange={handleChange}
          />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label>Proposed Quantity</Label>
          <Input
            type="number"
            name="propose_quantity"
            value={propose_quantity}
            disabled={location.pathname.includes(
              "/me/pharmacy/purchase-order/preview"
            )}
            onChange={({ target: { value } }) => {
              setForm((prev) => ({
                ...prev,
                propose_quantity: value,
                amount: value * parseFloat(exchange_rate) * parseFloat(price),
              }));
            }}
            onFocus={() =>
              setForm((p) => ({
                ...p,
                propose_quantity:
                  p.propose_quantity === 0 ? "" : p.propose_quantity,
              }))
            }
          />
        </FormGroup>
      </Col>
      {formTitle.type === "International" &&
      location.pathname.includes("/me/pharmacy/purchase-order/form") ? (
        <>
          <InputGroup className="my-2">
            <InputGroupButtonDropdown
              addonType="prepend"
              isOpen={splitButtonOpen}
              toggle={toggleSplit}
            >
              <InputGroupAddon addonType="prepend">
                Exchange Type
              </InputGroupAddon>
              <Typeahead
                align="justify"
                id="exchange_type"
                labelKey="exchange_type"
                placeholder="Your type here"
                options={exchageType}
                disabled={location.pathname.includes(
                  "/me/pharmacy/purchase-order/preview"
                )}
                onInputChange={(val) => {
                  setForm((prev) => ({
                    ...prev,
                    exchange_type: val,
                  }));
                  setFormTitle((prev) => ({
                    ...prev,
                    exchange_type: val,
                  }));
                }}
                onChange={(item) => {
                  if (item.length) {
                    setForm((prev) => ({
                      ...prev,
                      exchange_type: item[0],
                    }));
                    setFormTitle((prev) => ({
                      ...prev,
                      exchange_type: item[0],
                    }));
                  }
                }}
              />
            </InputGroupButtonDropdown>
            <Input
              type="number"
              name="exchange_rate"
              value={exchange_rate}
              placeholder="Exchange Rate"
              disabled={location.pathname.includes(
                "/me/pharmacy/purchase-order/preview"
              )}
              onChange={({ target: { value } }) => {
                setForm((prev) => ({
                  ...prev,
                  exchange_rate: value,
                  amount:
                    value * parseFloat(propose_quantity) * parseFloat(price),
                }));
                setFormTitle((prev) => ({
                  ...prev,
                  exchange_rate: value,
                }));
              }}
              onFocus={() =>
                setForm((p) => ({
                  ...p,
                  exchange_rate: p.exchange_rate === 1 ? "" : p.exchange_rate,
                }))
              }
            />
          </InputGroup>
        </>
      ) : null}
      <Col md={4}>
        <FormGroup>
          <Label>
            Unit Price(
            {type === "International" ? exchange_type : " ₦"})
          </Label>
          <Input
            type="number"
            name="price"
            value={price}
            disabled={location.pathname.includes(
              "/me/pharmacy/purchase-order/preview"
            )}
            onChange={({ target: { value } }) => {
              location.pathname.includes("/me/pharmacy/purchase-order/edit") &&
              formTitle === "International"
                ? setForm((prev) => ({
                    ...prev,
                    price: value,
                    amount:
                      value *
                      parseFloat(formTitle.exchange_rate) *
                      parseFloat(price),
                  }))
                : setForm((prev) => ({
                    ...prev,
                    price: value,
                    amount:
                      value * parseFloat(exchange_rate) * parseFloat(price),
                  }));
            }}
            onFocus={() =>
              setForm((p) => ({
                ...p,
                price: p.price === 0 ? "" : p.price,
              }))
            }
          />
        </FormGroup>
      </Col>
      <Col md={4}>
        <FormGroup>
          <Label>Amount(₦)</Label>
          <Input
            type="text"
            name="propose_amount"
            disabled={location.pathname.includes(
              "/me/pharmacy/purchase-order/preview"
            )}
            value={
              (type = "International"
                ? formatNumber(price * propose_quantity * exchange_rate)
                : formatNumber(price * propose_quantity))
            }
            onChange={handleChange}
          />
        </FormGroup>
      </Col>
      <Col md={4}>
        <FormGroup>
          <Label>Remark</Label>
          <Input
            type="text"
            name="remark"
            disabled={location.pathname.includes(
              "/me/pharmacy/purchase-order/preview"
            )}
            value={remark}
            onChange={handleChange}
          />
        </FormGroup>
      </Col>
    </Row>
  );
}

export default FormComponent;
