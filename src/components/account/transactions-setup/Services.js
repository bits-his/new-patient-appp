import React, { useState, useEffect } from 'react';
import { Row, Col,  } from 'reactstrap';
// import CustomButton from '../../comp/components/Button';
// import { Typeahead } from 'react-bootstrap-typeahead';
import { useDispatch } from 'react-redux';
// import { getAccHeads } from '../../../redux/actions/transactions';
import { 
  // _postApi,
   _fetchApi } from '../../../redux/actions/api';
import { apiURL } from '../../../redux/actions';
// import { FaTimes } from 'react-icons/fa';

function ServicesTxnSetup() {
  // const txnList = [
  //   'Payment from deposit',
  //   'Instant Payment (Cash)',
  //   'Instant Payment (POS/Bank Transfer)',
  //   'VATable Transaction',
  // ];
  // const [formIsSet, setForm] = useState(false)
  const dispatch = useDispatch();
  // const [, setLoading] = useState(false);
  // const [setupTxnList, setSetupTxnList] = useState([]);
  // const [txnForm,] = useState({
  //   title: '',
  //   debit: '',
  //   credit: '',
  // });

  // const accHeads =
  //   useSelector((state) => state.transactions.accHeads).reverse() || [];
  //   const user = useSelector((state) => state.auth.user);

  const [txns, setTxns] = useState([]);
  const getExistingTxns = () => {
    const success = (data) => {
      if (data.success) {
        setTxns(data.results);
      }
    };
    _fetchApi(`${apiURL()}/transactions/setup/list`, success);
  };

  // const handleChange = (key, val, index) => {
  //   let newList = [];
  //   setupTxnList.forEach((t, i) => {
  //     if (index === i) {
  //       newList.push({ ...t, [key]: val });
  //     } else {
  //       newList.push(t);
  //     }
  //   });
  //   setSetupTxnList(newList);
  // };

  // const remove = (index) => {
  //   console.log(index);
  //   let newList = setupTxnList.filter((i, idx) => index !== idx);
  //   setSetupTxnList(newList);
  // };

  useEffect(
    () => {
      // dispatch(getAccHeads());
      getExistingTxns();
    },
    [dispatch],
  );

  // const handleSubmit = () => {
  //   setLoading(true);
  //   console.log(txnForm);

  //   // const success_cb = () => setLoading(false);

  //   setupTxnList.forEach((txn) => {
  //     _postApi(`${apiURL()}/transactions/setup/new`, txn);
  //   });
  // };

  // const addMore = (e) => {
  //   e.preventDefault();
  //   setSetupTxnList((prev) => [
  //     ...prev,
  //     { title: txnForm.title, debit: '', credit: '' },
  //   ]);
  // };

  const [selected, setSelected] = useState([]);

  const toggleCheck = (txn) => {
    let found = selected.findIndex(txn.title) > -1;
    console.log(found);
    if (found) {
      setSelected((prev) => prev.filter((i) => txn.title !== i.title));
    } else {
      setSelected((prev) => prev.concat(txn));
    }
  };

  return (
    <div className="card p-2 mt-1">
      <Row>
        <Col>
          {JSON.stringify(selected)}
          {txns.map((txn, i) => {
            let _checked =
              selected.findIndex((i) => i.title === txn.title) > -1;
            return (
              <div key={i}>
                <label htmlFor={`pid-${i}`}>
                  <input
                    type="checkbox"
                    id={`pid-${i}`}
                    className="pr-2"
                    checked={_checked}
                    onChange={() => toggleCheck(txn)}
                  />
                  {txn.title}
                </label>
              </div>
            );
          })}
          {/* <ul>
            {txnList.map((item) => {
              let setupForItem = txns.filter((i) => i.title === item);
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
                          debit: '',
                          credit: '',
                        },
                      ]);
                    }}
                  >
                    {item}
                  </a>
                  {setupForItem.map((item, i) => (
                    <ul key={i}>
                      <li>Debit: {item.debit}</li>
                      <li>Credit: {item.credit}</li>
                    </ul>
                  ))}
                </li>
              );
            })}
          </ul> */}
        </Col>
        <Col>
          {/* {JSON.stringify(setupTxnList)} */}
          {/* {setupTxnList.length ? (
            <Form>
              <h6>{txnForm.title}</h6>
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
                              handleChange('debit', val[0]['head'], i);
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
                              handleChange('credit', val[0]['head'], i);
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

              <CustomButton
                loading={loading}
                onClick={handleSubmit}
                //   disabled={!formValid}
              >
                Save
              </CustomButton>
            </Form>
          ) : null} */}
        </Col>
      </Row>
    </div>
  );
}

export default ServicesTxnSetup;
