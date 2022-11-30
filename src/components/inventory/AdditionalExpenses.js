import { Switch } from "evergreen-ui/commonjs/switch";
import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { Button, Input } from "reactstrap";
// import { formatNumber } from "../utils/helpers";
import { useLocation } from "react-router";
export default function AdditionalExpenses({
  newExpenses,
  addNewExpenses,
  handleExpInputChange,
  formTitle = {},
  list,
  handleTablechange,
}) {
  const location = useLocation();
  const editable = location.pathname.includes(
    "/me/pharmacy/purchase-order/edit"
  );

  let poIsInternational = formTitle.type === "International";
  const [preview, setPreview] = useState(false);
  const handleClick = () => {
    setPreview(!preview);
    // newExpenses = [];
  };
  useEffect(() => {
    setPreview(true);
  }, [editable]);
  return (
    <>
      <div className="d-flex justify-content-center font-weight-bold">
        Any Additional Expenses?
        <Switch height={24} check={preview} onChange={handleClick} />
      </div>
      {/* {JSON.stringify(list)} */}
      {/* {newExpenses.map(i => `${i.description} ${i.expenses_amnt}`)} */}
      {/* {"PONo":"","date":"2021-02-12","type":"International","vendor":"","client":"",
      "general_remark":"","auditor_remark":"","exchange_rate":"450","exchange_type":"USD",
      "supplier_code":""} */}
      {preview ? (
        <Table striped bordered>
          <thead>
            <tr>
              <th>Discription</th>
              {poIsInternational ? (
                <th>Amount ({formTitle.exchange_type})</th>
              ) : null}
              <th>Amount (N)</th>
              {editable ? null : <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {editable ? (
              <>
                {list.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Input
                        type="text"
                        name="description"
                        value={item.description}
                        onChange={({ target: { name, value } }) => {
                          handleTablechange(name, value, index);
                        }}
                      />
                    </td>
                    {poIsInternational ? (
                      <td>
                        <Input
                          type="number"
                          name="expenses_raw_amnt"
                          value={item.amount}
                          onChange={({ target: { name, value } }) => {
                            handleTablechange(name, value, index);
                          }}
                          // id="code"
                        />
                      </td>
                    ) : null}
                    <td>
                      <Input
                        type="number"
                        name="amount"
                        value={item.amount}
                        onChange={({ target: { name, value } }) => {
                          handleTablechange(name, value, index);
                        }}
                        // id="code"
                      />
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              newExpenses.map((item, index) => (
                <>
                  <tr key={index}>
                    <td>
                      <Input
                        type="text"
                        name="description"
                        value={item.description}
                        onChange={({ target: { name, value } }) => {
                          handleExpInputChange(name, value, index);
                        }}
                      />
                    </td>
                    {poIsInternational ? (
                      <td>
                        <Input
                          type="number"
                          name="expenses_raw_amnt"
                          value={item.expenses_raw_amnt}
                          onChange={({ target: { name, value } }) => {
                            let converted =
                              parseFloat(value) *
                              parseFloat(formTitle.exchange_rate);
                            handleExpInputChange(name, value, index);
                            handleExpInputChange(
                              "expenses_amnt",
                              converted,
                              index
                            );
                          }}
                          // id="code"
                        />
                      </td>
                    ) : null}
                    <td>
                      <Input
                        type="number"
                        name="expenses_amnt"
                        // disabled={poIsInternational}
                        value={item.expenses_amnt}
                        onChange={({ target: { name, value } }) => {
                          handleExpInputChange(name, value, index);
                        }}
                        // id="code"
                      />
                    </td>

                    <td>
                      {[item].lastIndexOf(item) === index ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            addNewExpenses();
                          }}
                          color="primary"
                        >
                          Add More
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                </>
              ))
            )}
            {/* <tr>
              <th>Total Expenses</th>
              <th className='text-right'>{formatNumber(totalExpenses)}</th>
            </tr> */}
          </tbody>
        </Table>
      ) : null}
    </>
  );
}
