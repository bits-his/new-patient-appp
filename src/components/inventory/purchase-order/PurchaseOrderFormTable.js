import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { useLocation } from "react-router";
import { Row, Col, Table, Input, Button } from "reactstrap";
import { formatNumber } from "../../utils/helpers";

function PurchaseOrderFormTable({
  tableData,
  handlePriceChange = (f) => f,
  handleTableInputChange = (f) => f,
  handleDelete = (f) => f,
  handlePQtychange = (f) => f,
}) {
  const location = useLocation();

  let totalAmount = tableData.reduce(
    (a, b) => a + parseFloat(b.propose_amount),
    0
  );
  return (
    <Row>
      <Col
        md={
          location.pathname.includes("me/pharmacy/purchase-order/form")
            ? 12
            : 12
        }
        className="m-0 p-0"
      >
        <Table bordered>
          <thead>
            <tr>
              <th className="text-center">S/N</th>
              <th className="text-center">Item Name</th>
              <th className="text-center">P. Qty</th>
              <th className="text-center">Price</th>
              <th className="text-center">Amt</th>
              {location.pathname.includes(
                "/me/pharmacy/purchase-order/preview"
              ) ||
              location.pathname.includes("/me/auditor/purchase/form") ||
              location.pathname.includes("/me/manager/audited/preview") ||
              location.pathname.includes("/me/pharmacy/purchase-order/edit") ||
              location.pathname.includes(
                "/me/account/purchase/record/preview"
              ) ||
              location.pathname.includes(
                "/me/reviewer/purchase/form"
              ) ? null : (
                <>
                  {/* <th className="text-center">Remark</th> */}
                  <th className="text-center">Action</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, i) => (
              <tr>
                <td key={i}>{i + 1}</td>
                <td>
                  {location.pathname.includes(
                    "/me/pharmacy/purchase-order/preview"
                  ) ||
                  location.pathname.includes(
                    "/me/pharmacy/purchase-order/form"
                  ) ||
                  location.pathname.includes("/me/auditor/purchase/form") ||
                  location.pathname.includes("/me/manager/audited/preview") ||
                  location.pathname.includes(
                    "/me/account/purchase/record/preview"
                  ) ||
                  location.pathname.includes("/me/reviewer/purchase/form") ||
                  location.pathname.includes("/me/reviewer/purchase/form") ? (
                    item.item_name
                  ) : (
                    <Input
                      type="text"
                      value={item.item_name}
                      disabled={
                        location.pathname.includes(
                          "/me/pharmacy/purchase-order/preview"
                        ) ||
                        location.pathname.includes(
                          "/me/pharmacy/purchase-order/form"
                        ) ||
                        location.pathname.includes(
                          "/me/auditor/purchase/form"
                        ) ||
                        location.pathname.includes(
                          "/me/manager/audited/preview"
                        ) ||
                        location.pathname.includes(
                          "/me/account/purchase/record/preview"
                        ) ||
                        location.pathname.includes(
                          "/me/reviewer/purchase/form"
                        ) ||
                        location.pathname.includes("/me/reviewer/purchase/form")
                      }
                      name="item_name"
                      onChange={(e) => {
                        let name = e.target.name;
                        let value = e.target.value;
                        handleTableInputChange(name, value, i);
                      }}
                    />
                  )}
                </td>
                <td className="text-center">
                  <Input
                    className="text-center"
                    // type="number"
                    value={formatNumber(item.propose_quantity)}
                    disabled={
                      location.pathname.includes(
                        "/me/pharmacy/purchase-order/preview"
                      ) ||
                      location.pathname.includes(
                        "/me/pharmacy/purchase-order/form"
                      ) ||
                      location.pathname.includes("/me/auditor/purchase/form") ||
                      location.pathname.includes(
                        "/me/manager/audited/preview"
                      ) ||
                      location.pathname.includes(
                        "/me/account/purchase/record/preview"
                      ) ||
                      location.pathname.includes("/me/reviewer/purchase/form")
                    }
                    name="propose_quantity"
                    onChange={(e) => {
                      let name = e.target.name;
                      let value = e.target.value;
                      handlePQtychange(name, value, i);
                    }}
                  />
                </td>
                <td className="text-right">
                  <Input
                    className="text-right"
                    name="price"
                    value={formatNumber(item.price)}
                    // type="number"
                    disabled={
                      location.pathname.includes(
                        "/me/pharmacy/purchase-order/preview"
                      ) ||
                      location.pathname.includes(
                        "/me/pharmacy/purchase-order/form"
                      ) ||
                      location.pathname.includes("/me/auditor/purchase/form") ||
                      location.pathname.includes(
                        "/me/manager/audited/preview"
                      ) ||
                      location.pathname.includes(
                        "/me/account/purchase/record/preview"
                      ) ||
                      location.pathname.includes("/me/reviewer/purchase/form")
                    }
                    onChange={(e) => {
                      let name = e.target.name;
                      let value = e.target.value;
                      handlePriceChange(name, value, i);
                    }}
                  />
                </td>
                <td className="text-right">
                  <Input
                    className="text-right"
                    // type="number"
                    name="propose_amount"
                    value={formatNumber(item.propose_amount)}
                    disabled
                  />
                </td>
                {location.pathname.includes(
                  "/me/pharmacy/purchase-order/preview"
                ) ||
                location.pathname.includes("/me/auditor/purchase/form") ||
                location.pathname.includes("/me/manager/audited/preview") ||
                location.pathname.includes(
                  "/me/pharmacy/purchase-order/edit"
                ) ||
                location.pathname.includes(
                  "/me/account/purchase/record/preview"
                ) ||
                location.pathname.includes(
                  "/me/reviewer/purchase/form"
                ) ? null : (
                  <>
                    <td>
                      <Input
                        type="text"
                        value={item.remarks}
                        name="remarks"
                        disabled={
                          location.pathname.includes(
                            "/me/pharmacy/purchase-order/preview"
                          ) ||
                          location.pathname.includes(
                            "/me/auditor/purchase/form"
                          ) ||
                          location.pathname.includes(
                            "/me/account/purchase/record/preview"
                          ) ||
                          location.pathname.includes(
                            "/me/manager/audited/preview"
                          )
                        }
                        onChange={(e) => {
                          let name = e.target.name;
                          let value = e.target.value;
                          handleTableInputChange(name, value, i);
                        }}
                      />
                    </td>
                    <td>
                      <Button
                        color="danger"
                        className="ml-1"
                        onClick={() => handleDelete(i)}
                      >
                        <AiFillDelete size={20} />
                      </Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            <tr>
              <th colSpan={4} className="text-right">
                Total Amount
              </th>
              <th className="text-right">{formatNumber(totalAmount)}</th>
            </tr>
          </tbody>
        </Table>
      </Col>
      {/* 
            {location.pathname.includes(
              "/me/pharmacy/purchase-order/form"
            ) ? null : (
              <Col md={3} className="m-0 p-0">
                <Table>
                  <thead>
                    <tr>
                      <th>Remark</th>
                      {location.pathname.includes(
                        "/me/auditor/purchase/form"
                      ) ||
                      location.pathname.includes(
                        "/me/manager/audited/preview"
                      ) ||
                      location.pathname.includes(
                        "/me/reviewer/purchase/form"
                      ) ? (
                        <th>New Remark</th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {remarkData.map((item, i) => (
                      <tr>
                        <td>
                          <Input
                            type="text"
                            value={item.remarks}
                            name="remarks"
                            disabled={
                              location.pathname.includes(
                                "/me/pharmacy/purchase-order/preview"
                              ) ||
                              location.pathname.includes(
                                "/me/auditor/purchase/form"
                              ) ||
                              location.pathname.includes(
                                "/me/account/purchase/record/preview"
                              ) ||
                              location.pathname.includes(
                                "/me/manager/audited/preview"
                              ) ||
                              location.pathname.includes(
                                "/me/reviewer/purchase/form"
                              )
                            }
                            onChange={(e) => {
                              let name = e.target.name;
                              let value = e.target.value;
                              handleTableInputChange(name, value, i);
                            }}
                          />
                        </td>
                        {location.pathname.includes(
                          "/me/auditor/purchase/form"
                        ) ||
                        location.pathname.includes(
                          "/me/reviewer/purchase/form"
                        ) ||
                        location.pathname.includes(
                          "/me/manager/audited/preview"
                        ) ? (
                          <td>
                            <Input
                              type="text"
                              value={item.newRemarks}
                              name="newRemarks"
                              onChange={({ target: { name, value } }) => {
                                handleTableInputChange(name, value, i);
                                // console.log(name,value, i)
                              }}
                            />
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            )} */}
    </Row>
  );
}

export default PurchaseOrderFormTable;
