import React, { useState } from "react";
import { useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { MdDelete, MdUpdate } from "react-icons/md";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Button, Card, CardBody, Input, Table } from "reactstrap";
import { useQuery } from "../../../hooks";
import { apiURL } from "../../../redux/actions";
import { _deleteApi, _fetchApi, _updateApi } from "../../../redux/actions/api";
import BackButton from "../../comp/components/BackButton";
// import SelectInput from "../../comp/components/SelectInput";
import { _customNotify, _warningNotify } from "../../utils/helpers";

export default function ExpenseDetails() {
  const query = useQuery();
  const receiptDateSN = query.get("receiptNo");
  const description = query.get("description");
  const [getTransaction, setGetTransaction] = useState([]);
  const history = useHistory();
  const [expensesHeads, setExpensesHeads] = useState([])
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  
  const getExpenseHead = () => {
    _fetchApi(
      `${apiURL()}/account/head/expenses`,
      ({ results }) => {
        setExpensesHeads(results);
      },
      (err) => console.log(err)
    );
  };
  const handleDelete = () => {
    _deleteApi(
      `${apiURL()}/account/delete/transaction/${receiptDateSN}/${description}`,
      {},
      (data) => {
        // if(data.success){
        _customNotify("Deleted successfully");
        history.push("/me/account/report");
        // }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const handleTableChange = (key, value, index) => {
    let newArr = [];
    getTransaction.forEach((item, i) => {
      if (i === index) {
        newArr.push({
          ...getTransaction[index],
          [key]: value,
        });
      } else {
        newArr.push(item);
      }
    });
    setGetTransaction(newArr);
  };

  const getAllTransaction = () => {
    fetch( `${apiURL()}/account/transaction/by_details/${facilityId}?receiptDateSN=${receiptDateSN}&description=${description}`,)
    .then(req => req.json())
    .then(res =>  setGetTransaction(res.results))
    .catch(err => console.log(err))
  };

  const handleUpdate = () => {
    const queryType = "expense"
    const newArr = [];
    getTransaction.forEach((item) =>
      newArr.push({
        transaction_date: item.transaction_date,
        credit: item.debit,
        description: item.description,
        modeOfPayment: item.modeOfPayment,
        receiptDateSN: receiptDateSN,
        acct: item.acct
      })
    );
    for (let i = 0; i < newArr.length; i++) {
      const element = newArr[i];
      _updateApi(
        `${apiURL()}/account/update/transaction/${queryType}`,
        element,
        (res) => {
          history.push("/me/account/report");
        },
        (err) => {
          _warningNotify("There was an error when updating");
        }
      );
    }
    _customNotify("Updated successfully");
  };
  useEffect(() => {
    getAllTransaction();
    getExpenseHead()
  }, []);
  return (
    <>
      <BackButton />
      <Card>
        {/* {JSON.stringify(getTransaction)} */}
        <CardBody>
          <Table bordered>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Transaction Date</th>
                <th>Desription</th>
                <th className="text-center">Amount (₦)</th>
                <th>Account Heads</th>
              </tr>
            </thead>
            <tbody>
              {getTransaction.map((item, i) =>
                item.debit === 0 ? null : (
                  <tr>
                    <th key={i}>{i + 1}</th>
                    <td>
                      <Input
                        type="date"
                        name="transaction_date"
                        value={item.transaction_date}
                        onChange={({ target: { value } }) => {
                          handleTableChange("transaction_date", value, i);
                        }}
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        name="description"
                        value={item.newDescription ? item.newDescription: item.description}
                        disabled
                        onChange={({ target: { value } }) => {
                          handleTableChange("newDescription", value, i);
                        }}
                      />
                    </td>
                    <td className="text-right">
                      <Input
                        type="text"
                        name="debit"
                        disabled
                        value={item.debit}
                        onChange={({ target: { value } }) => {
                          handleTableChange("debit", value, i);
                        }}
                      />
                    </td>
                    <td>
                    <Typeahead
                    align="justify"
                    id="newAcc"
                    value={item.acct}
                    labelKey={item => item.description}
                    options={expensesHeads}
                    onInputChange={(val) => console.log(val)}
                    onChange={(val) => {
                      if (val.length) {
                        // setNewAcc(val[0].head);
                        handleTableChange("acct", val[0].head, i)
                      }
                    }}
                    placeholder="Select Account Head"
                    />
                     
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center">
            <Button
              color="primary"
              className="px-5 mr-2"
              onClick={handleUpdate}
            >
              <MdUpdate size="18" /> Update
            </Button>
            <Button color="danger" className="px-5" onClick={handleDelete}>
              <MdDelete size="18" /> Delete
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
