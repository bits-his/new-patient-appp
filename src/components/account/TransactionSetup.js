import React from "react";
import { Card, CardHeader, CardBody, Form, FormGroup, Table } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAccHeads } from "../../redux/actions/transactions";
import { _postApi, _fetchApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import CustomButton from "../comp/components/Button";
import { checkEmpty, _customNotify } from "../utils/helpers";
import { FaTimes } from "react-icons/fa";

function TransactionSetup() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [txnList, setTxnList] = useState([]);

  const [setupTxnList, setSetupTxnList] = useState([
    { title: "", debit: "", credit: "" },
  ]);
  const [txnForm, setTxnForm] = useState({
    title: "",
    debit: "",
    credit: "",
  });

  const accHeads =
    useSelector((state) => state.transactions.accHeads).reverse() || [];
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = () => {
    setLoading(true);
    let successCb = () => {
      setLoading(false);
      setTxnForm({
        title: "",
        debit: "",
        credit: "",
      });
      _customNotify("Transaction Saved!");
    };

    let errorCb = () => setLoading(true);

    _postApi(
      `${apiURL()}/transactions/setup/new`,
      {
        ...txnForm,
        user: user.id,
      },
      successCb,
      errorCb
    );
  };

  useEffect(
    () => {
      dispatch(getAccHeads());
      getTxns();
    },
    [dispatch]
  );

  const handleChange = (key, val) =>
    setTxnForm((prev) => ({ ...prev, [key]: val }));

  const getTxns = () => {
    let success = (resp) => {
      //   console.log(resp.results);
      if (resp.success) {
        setTxnList(resp.results);
      }
    };

    _fetchApi(`${apiURL()}/transactions/setup/list`, success, (err) =>
      console.log(err)
    );
  };

  const addMore = (e) => {
    e.preventDefault();
    setSetupTxnList((prev) => [
      ...prev,
      { title: txnForm.title, debit: "", credit: "" },
    ]);
  };

  const remove = (index) => {
    console.log(index);
    let newList = setupTxnList.filter((i, idx) => index !== idx);
    setSetupTxnList(newList);
  };

  // const handleSubmit = () => {
  //   setLoading(true);
  //   console.log(txnForm);

  //   // const success_cb = () => setLoading(false);

  //   setupTxnList.forEach((txn) => {
  //     _postApi(`${apiURL()}/transactions/setup/new`, txn);
  //   });
  // };

  const formValid = !checkEmpty(txnForm);
  return (
    <Card>
      <CardHeader className="d-flex flex-row justify-content-between">
        <h5>Transactions Setup</h5>
        {/* <a
          href="#pablo"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Click here to link forms
        </a> */}
      </CardHeader>
      <CardBody>
        <div className="row">
          <Form className="col-md-6 col-lg-6">
            <FormGroup>
              <label>Transaction Name</label>
              <input
                type="text"
                className="form-control"
                name="title"
                onChange={({ target: { value } }) => {
                  setTitle(value);
                  // setSetupTxnList(prev => ([...prev, { title: '', debit: '', credit: '' },]))
                }}
                value={title}
              />
            </FormGroup>
            <Table size="sm" bordered>
              <thead>
                <tr>
                  <th>Credit</th>
                  <th>Debit</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {setupTxnList.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <Typeahead
                        id="head"
                        align="justify"
                        labelKey="head"
                        options={accHeads}
                        onChange={(val) => {
                          if (val.length)
                            handleChange("debit", val[0]["head"], i);
                        }}
                      />
                    </td>
                    <td>
                      <Typeahead
                        id="head"
                        align="justify"
                        labelKey="head"
                        options={accHeads}
                        onChange={(val) => {
                          if (val.length)
                            handleChange("credit", val[0]["head"], i);
                        }}
                      />
                    </td>
                    <td className="text-right">
                      <button
                        className="btn"
                        onClick={(e) => {
                          e.preventDefault();
                          remove(i);
                        }}
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="text-right">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={addMore}
                    >
                      Add More
                    </button>
                  </td>
                </tr>
              </tbody>
            </Table>

            {/* <CustomButton
              loading={loading}
              onClick={handleSubmit}
              //   disabled={!formValid}
            >
              Save
            </CustomButton> */}

            {/* <FormGroup>
              <label>Debit Account</label>
              <Typeahead
                id="head"
                align="justify"
                labelKey="head"
                options={accHeads}
                onChange={(val) => {
                  if (val.length) handleChange('debit', val[0]['head']);
                }}
                // onInputChange={head => setSubHead(head)}
                // allowNew
              />
            </FormGroup>
            <FormGroup>
              <label>Credit Account</label>
              <Typeahead
                id="head"
                align="justify"
                labelKey="head"
                options={accHeads}
                onChange={(val) => {
                  if (val.length) handleChange('credit', val[0]['head']);
                }}
              />
            </FormGroup>
             */}
            {/* <center>
                  <span style={{ color: 'red' }}>
                    {accountCharFormAlert.length ? accountCharFormAlert : null}
                  </span>
                </center> */}
            {/* <button className="btn btn-primary" onClick>
              Create
            </button> */}
            <CustomButton
              loading={loading}
              onClick={handleSubmit}
              disabled={!formValid}
            >
              Create
            </CustomButton>
          </Form>
          <div className="col-md-6 col-lg-6">
            <h6>Recent Transactions</h6>
            <ul>
              {txnList.map((item) => {
                let setupForItem = txnList.filter(
                  (i) => i.title === item.title
                );
                return (
                  <li>
                    <a
                      href="#go"
                      onClick={(e) => {
                        e.preventDefault();
                        setTxnForm((p) => ({ ...p, title: item }));
                        setSetupTxnList((prev) => [
                          ...prev,
                          {
                            title: item,
                            debit: "",
                            credit: "",
                          },
                        ]);
                      }}
                    >
                      {item.title}
                    </a>
                    {/* {JSON.stringify()} */}
                    {setupForItem.map((item, i) => (
                      <ul key={i}>
                        <li>Debit: {item.debit}</li>
                        <li>Credit: {item.credit}</li>
                      </ul>
                    ))}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default TransactionSetup;
