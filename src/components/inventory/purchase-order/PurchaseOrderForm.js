import React, { useEffect, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  InputGroupAddon,
  CardHeader,
} from "reactstrap";
import { _customNotify } from "../../utils/helpers";
import { useHistory, useLocation } from "react-router";
import { AiOutlinePlus } from "react-icons/ai";
import BackButton from "../../comp/components/BackButton";
import { _fetchApi, _postApi } from "../../../redux/actions/api";
import { apiURL } from "../../../redux/actions";
import { useSelector } from "react-redux";
import PurchaseOrderFormFooter from "./PurchaseOrderFormFooter";
import FormComponent from "./FormComponent";
// import OtherExpensesTable from "./OtherExpensesTable";

const exchageType = ["EUR", "USD", "JPY", "CHF", "GBP", "CAD", "ZAR"];

export default function PurchaseOrderForm({
  onInputChange = (f) => f,
  handleDelete,
  formTitle,
  form,
  approvedManagement,
  handleAdd = (f) => f,
  handleChange = (f) => f,
  handleSubmit = (f) => f,
  handleTableInputChange = (f) => f,
  addNewExpenses = (f) => f,
  setForm,
  tableData,
  loading,
  supplierList,
  setFormTitle,
  typeRef,
  approvedReviewer,
  type,
  handleUpdate,
  handleUpdateAuditedFile,
  auditorReject,
  handlePriceChange,
  handlePQtychange,
  items = [],
  toggle,
  setToggle,
  setTableData,
  remarkData,
  gRemarkData,
  ReviewerReject,
  getSpecification = (f) => f,
  newExpenses,
  handleExpInputChange,
  list = [],
  handleTablechange = (f) => f,
  getOtherExpenses = (f) => f,
  suppliers = [],
}) {
  const {
    exchange_rate,
    specification,
    propose_quantity,
    quantity_available,
    price,
    exchange_type,
    remark,
  } = form;

  const [splitButtonOpen, setSplitButtonOpen] = useState(false);
  const [itemCategory, setItemCategory] = useState("");
  const [getSub, setGetSub] = useState([]);

  const getAllItemsBySub = () => {
    const subhead = itemCategory;
    _fetchApi(
      `${apiURL()}/account/get/items_by_sub/${subhead}`,
      (data) => {
        setGetSub(data.results);
        console.log(data, "HHEHEHHE");
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const getItemsItemQty = (item) => {
    _fetchApi(
      `${apiURL()}/account/get/items_by_qty/${item}`,
      (data) => {
        setForm((prev) => ({
          ...prev,
          quantity_available: data.results,
        }));
        console.log(data, "HHEHEHHE");
      },
      (err) => {
        console.log(err);
      }
    );
  };

  useEffect(
    () => {
      getAllItemsBySub();
    },
    [itemCategory]
  );

  const toggleSplit = () => setSplitButtonOpen(!splitButtonOpen);
  const location = useLocation();
  const history = useHistory();
  const handleExchange = (name, value) => {
    let arr = [];
    tableData.forEach((item) => {
      arr.push({
        ...item,
        propose_amount:
          parseFloat(value) *
          parseFloat(item.price) *
          parseFloat(item.propose_quantity),
        [name]: value,
      });
    });
    setTableData(arr);
  };

  const processed_by = useSelector((name) => name.auth.user.username);

  const managementReject = () => {
    let data = {
      data: formTitle.PONo,
      remark: formTitle.management_remark,
      processed_by: processed_by,
    };
    const callBack = () => {
      _customNotify("Rejected");
      history.push("/me/manager/audited/table");
    };
    const error = () => {
      // _warningNotify("Not Rejected");
    };
    _postApi(`${apiURL()}/management/reject`, data, callBack, error);
  };

  const printPurchaseOrder = () => {
    window.frames[
      "print_frame"
    ].document.body.innerHTML = document.getElementById(
      "purchaseOrderPrintable"
    ).innerHTML;
    window.frames["print_frame"].window.focus();
    window.frames["print_frame"].window.print();
  };

  return (
    <>
      <Card>
        {/* {JSON.stringify({ formTitle, form })} */}
        <CardHeader className="d-flex flex-direction-row justify-content-between">
          <BackButton />
          <button className="btn btn-warning" onClick={printPurchaseOrder}>
            Print
          </button>
        </CardHeader>
        <iframe
          title="print_purchase_order"
          name="print_frame"
          width="0"
          height="0"
          src="about:blank"
          // style={styles}
        />
        <div id="purchaseOrderPrintable">
          <CardBody>
            <Form>
              <Row form>
                <Col md={4}>
                  <FormGroup>
                    {location.pathname.includes(
                      "/me/new_inventory/purchase_order/form"
                    ) ? (
                      <>
                        {/* <Label>PO No. </Label>
                      <Input
                        type="text"
                        name="PONo"
                        value={formTitle.PONo}
                        onChange={onInputChange}
                        disabled
                        // disabled={location.pathname.includes(
                        //   '/me/new_inventory/purchase_order/preview'
                        // )}
                      /> */}
                      </>
                    ) : (
                      <Label>PO No.: {formTitle.PONo}</Label>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4} className="offset-4">
                  <FormGroup>
                    {location.pathname.includes(
                      "/me/new_inventory/purchase_order/form"
                    ) ? (
                      <>
                        <Label>Date </Label>
                        <Input
                          type="date"
                          name="date"
                          value={formTitle.date}
                          onChange={onInputChange}
                          disabled={location.pathname.includes(
                            "/me/new_inventory/purchase_order/preview"
                          )}
                        />
                      </>
                    ) : (
                      <Label>Date: {formTitle.date}</Label>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <div className="col-md-4 col-lg-6">
                  {location.pathname.includes(
                    "/me/new_inventory/purchase_order/form"
                  ) ? (
                    <>
                      <Label for="wupplier">Supplier Name:</Label>
                      <Typeahead
                        align="justify"
                        id="supplier"
                        labelKey="supplier_name"
                        options={
                          suppliers.length ? suppliers : [{ supplier_name: "" }]
                        }
                        onInputChange={(val) => console.log(val)}
                        onChange={(item) => {
                          if (item.length) {
                            setFormTitle((prev) => ({
                              ...prev,
                              vendor: item[0].supplier_name,
                              type: "Local",
                              supplier_code: item[0].id,
                            }));
                          }
                        }}
                      />
                    </>
                  ) : (
                    <Label for="wupplier">
                      Vendor Name: {formTitle.vendor}
                    </Label>
                  )}
                </div>
                <Col md={6}>
                  <FormGroup>
                    {location.pathname.includes(
                      "/me/new_inventory/purchase_order/form"
                    ) ? (
                      <>
                        <Label>Type </Label>
                        <Input
                          type="select"
                          name="type"
                          value={formTitle.type}
                          disabled={location.pathname.includes(
                            "/me/new_inventory/purchase_order/preview"
                          )}
                          onChange={onInputChange}
                        >
                          <option value="Local">Local</option>
                          <option value="International">International</option>
                        </Input>
                      </>
                    ) : (
                      <Label>Type: {formTitle.type}</Label>
                    )}
                  </FormGroup>
                </Col>
                {/* <Col md={6}>
                <FormGroup>
                  <Label>Vendor</Label>
                  <Input
                    type="text"
                    name="vendor"
                    value={vendor}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col> */}
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    {location.pathname.includes(
                      "/me/new_inventory/purchase_order/form"
                    ) ? (
                      <>
                        <Label>Client</Label>
                        <Input
                          type="text"
                          name="client"
                          disabled={location.pathname.includes(
                            "/me/new_inventory/purchase_order/preview"
                          )}
                          value={formTitle.client}
                          onChange={onInputChange}
                        />
                      </>
                    ) : (
                      <Label>Client: {formTitle.client}</Label>
                    )}
                  </FormGroup>
                </Col>
                {location.pathname.includes(
                  "/me/new_inventory/purchase_order/form"
                ) ||
                location.pathname.includes(
                  "/me/new_inventory/purchase_order/edit"
                ) ? (
                  <Col md={6}>
                    <Label for="wupplier">Item Category</Label>
                    <Typeahead
                      align="justify"
                      id="item_category"
                      labelKey={(item) => item.description}
                      options={items}
                      onInputChange={(val) => console.log(val)}
                      onChange={(item) => {
                        console.log(item);
                        if (item.length) {
                          setForm((prev) => ({
                            ...prev,
                            item_category: item[0].description,
                          }));
                          setItemCategory(item[0].head);
                        }
                      }}
                    />
                  </Col>
                ) : (
                  ""
                )}
              </Row>
              {location.pathname.includes("/me/new_inventory/purchase_order/edit") &&
              formTitle.other_remark !== "" ? (
                <FormGroup>
                  <Label>
                    Other Comment:<span>{formTitle.other_remark}</span>
                  </Label>
                </FormGroup>
              ) : null}
              {formTitle.type === "International" ? (
                <Row>
                  <Col md={4}>
                    {location.pathname.includes(
                      "/me/new_inventory/purchase_order/preview"
                    ) ||
                    location.pathname.includes(
                      "/me/new_inventory/purchase_order/edit"
                    ) ||
                    location.pathname.includes("/me/manager/audited/preview") ||
                    location.pathname.includes("/me/auditor/purchase/form") ? (
                      <Label>
                        Exchange Rate: {formTitle.exchange_rate}(
                        {formTitle.exchange_type})
                      </Label>
                    ) : (
                      ""
                    )}
                  </Col>
                  <Col md={4}>
                    {location.pathname.includes(
                      "/me/new_inventory/purchase_order/preview"
                    ) ||
                    location.pathname.includes(
                      "/me/new_inventory/purchase_order/edit"
                    ) ||
                    location.pathname.includes("/me/manager/audited/preview") ||
                    location.pathname.includes("/me/auditor/purchase/form") ? (
                      <Label>
                        {toggle ? (
                          <Typeahead
                            align="justify"
                            id="exchange_type"
                            labelKey="exchange_type"
                            placeholder="Your type here"
                            options={exchageType}
                            onChange={(item) => {
                              if (item.length) {
                                setFormTitle((prev) => ({
                                  ...prev,
                                  exchange_type: item,
                                }));
                                let arr = [];
                                tableData.forEach((i) => {
                                  arr.push({ ...i, exchange_type: item[0] });
                                });
                                setTableData(arr);
                              }
                            }}
                          />
                        ) : (
                          `Exchange Type : ${formTitle.exchange_type}`
                        )}
                      </Label>
                    ) : (
                      ""
                    )}
                  </Col>
                  {/* <Col md={4}>
                  {location.pathname.includes(
                    "/me/new_inventory/purchase_order/preview"
                  ) ? (
                    <OtherExpensesTable />
                  ) : (
                    ""
                  )}
                </Col> */}
                  <Col md={4}>
                    {location.pathname.includes(
                      "/me/new_inventory/purchase_order/edit"
                    ) ? (
                      toggle ? (
                        <FormGroup>
                          <Input
                            placeholder="Exchange rate"
                            type="number"
                            name="exchange_rate"
                            // value={exchange}
                            value={exchange_rate}
                            onChange={(e) => {
                              let name = e.target.name;
                              let value = e.target.value;
                              handleExchange(name, value);
                              setForm((prev) => ({
                                ...prev,
                                exchange_rate: value,
                              }));
                              setFormTitle((prev) => ({
                                ...prev,
                                exchange_rate: value,
                              }));
                            }}
                          />
                        </FormGroup>
                      ) : (
                        <Button
                          size="sm"
                          color="warning"
                          onClick={() => setToggle(true)}
                        >
                          Click to Edit Exchange Rate
                        </Button>
                      )
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
              ) : (
                ""
              )}

              {location.pathname.includes(
                "/me/new_inventory/purchase_order/preview"
              ) ||
              location.pathname.includes("/me/auditor/purchase/form") ||
              location.pathname.includes("/me/manager/audited/preview") ||
              location.pathname.includes(
                "/me/account/purchase/record/preview"
              ) ||
              location.pathname.includes(
                "/me/reviewer/purchase/form"
              ) ? null : (
                <>
                  <FormComponent
                    typeRef={typeRef}
                    getSub={getSub}
                    getItemsItemQty={getItemsItemQty}
                    getSpecification={getSpecification}
                    setForm={setForm}
                    specification={specification}
                    handleChange={handleChange}
                    quantity_available={quantity_available}
                    propose_quantity={propose_quantity}
                    exchange_rate={exchange_rate}
                    formTitle={formTitle}
                    splitButtonOpen={splitButtonOpen}
                    toggleSplit={toggleSplit}
                    InputGroupAddon={InputGroupAddon}
                    price={price}
                    exchageType={exchageType}
                    setFormTitle={setFormTitle}
                    type={type}
                    exchange_type={exchange_type}
                    remark={remark}
                  />
                </>
              )}
              {location.pathname.includes(
                "/me/new_inventory/purchase_order/preview"
              ) ||
              location.pathname.includes("/me/auditor/purchase/form") ||
              location.pathname.includes("/me/manager/audited/preview") ||
              location.pathname.includes(
                "/me/account/purchase/record/preview"
              ) ||
              location.pathname.includes(
                "/me/reviewer/purchase/form"
              ) ? null : (
                <center>
                  <Button color="success" className="px-4" onClick={handleAdd}>
                    <AiOutlinePlus size={20} /> Add to list
                  </Button>
                </center>
              )}
            </Form>
          </CardBody>
          <PrintStyle />
          <PurchaseOrderFormFooter
            tableData={tableData}
            gRemarkData={gRemarkData}
            handlePriceChange={handlePriceChange}
            handleTableInputChange={handleTableInputChange}
            handleDelete={handleDelete}
            handlePQtychange={handlePQtychange}
            newExpenses={newExpenses}
            addNewExpenses={addNewExpenses}
            handleExpInputChange={handleExpInputChange}
            formTitle={formTitle}
            onInputChange={onInputChange}
            loading={loading}
            handleUpdate={handleUpdate}
            handleSubmit={handleSubmit}
            auditorReject={auditorReject}
            handleUpdateAuditedFile={handleUpdateAuditedFile}
            approvedManagement={approvedManagement}
            managementReject={managementReject}
            approvedReviewer={approvedReviewer}
            ReviewerReject={ReviewerReject}
            list={list}
            handleTablechange={handleTablechange}
            getOtherExpenses={getOtherExpenses}
          />
        </div>
      </Card>
    </>
  );
}

export function LetterHead({ title }) {
  return (
    <div>
      <h2>{title}</h2>
    </div>
  );
}

export function PrintStyle() {
  return (
    <style>
      {`@media print {
              body {
                font-family: aria 'Segoe UI'
              }
              table {
                font-size: 75%;
                table-layout: fixed;
                width: 100%;
              }
              input {
                background: transparent;
                border: none;
                margin: 0;
                padding: 0;
                width: 50px;
              }
              
              table {
                border-collapse: collapse;
                border-spacing: 2px;
              }
              
              th,
              td {
                border-width: 1px;
                padding: 0.5em;
                position: relative;
                text-align: left;
              }
              
              th,
                td {
                    border-radius: 0.25em;
                    border-style: solid;
                }
                
                th {
                    background: #EEE;
                    border-color: #BBB;
                }
                
                td {
                    border-color: #DDD;
                }
                .text-right {
                    text-align: right;
                }
                .text-center {
                    text-align: center;
                }
                .font-weight-bold {
                    font-weight: bold;
                }
                .print-start{
                    margin: 2em;
                    margin-top: 4em;
                }
                .print-only{
                  display: block;
                }
                .no-print{
                  display: none;
                }
            }
            @media screen {
              .no-print{
                display: block;
              } 
              .print-only{
                display: none;
              } 
           }   
          `}
    </style>
  );
}
