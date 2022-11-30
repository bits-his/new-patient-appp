import React, { useCallback, useEffect, useRef, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { FaSave, FaTrash } from "react-icons/fa";
import { useHistory, useParams } from "react-router";
import {
  Label,
  Col,
  FormGroup,
  Input,
  Row,
  Table,
  Button,
  Card,
  Badge,
} from "reactstrap";
import { _fetchApi2, _postApi, _updateApi } from "../../../redux/actions/api";
import { apiURL } from "../../../redux/actions";
import { v4 as UUIDV4 } from "uuid";
// import { _fetchApi, _postApi, _updateApi } from '../../redux/actions/api'
// import Discount from "../account/Forms/Discount";
// import ServiceForm from "../account/Forms/ServiceForm";
import {
  formatNumber,
  generateReceiptNo,
  _customNotify,
  _warningNotify,
} from "../../utils/helpers";
import { useQuery } from "../../../hooks";
import {
  getDrugList,
  getPharmStore,
  getSalesDrugs,
  makeSale,
} from "../../../redux/actions/pharmacy";
import { useDispatch, useSelector } from "react-redux";
import { CustomButton, SelectInput } from "../../comp/components";
import CustomCard from "../../comp/components/CustomCard";
import Checkbox from "../../comp/components/Checkbox";
// import Replace from '../return-drug/Replace'
// import { auth } from 'firebase'
// import SearchBar from '../../record/SearchBar'

const DrugSelector = ({
  setState,
  drugs_ref,
  saleItems,
  index = null,
  handleChangeDrug,
}) => (
  <Typeahead
    // onInputChange={(filterText) =>
    //   setState(p=>({...p, filterText }))
    // }
    clearButton
    align="justify"
    labelKey={(item) => `${item.drug_name} (${item.balance} available)`}
    id="services"
    ref={drugs_ref}
    placeholder="Search by drug name"
    options={saleItems}
    onChange={(val) => {
      if (val.length) {
        let state = {
          ...val[0],
          drug: val[0].drug_name,
          price: val[0].selling_price,
          expiry_date: val[0].expiry_date,
          dosage: 0,
          duration: "",
          period: "",
          frequency: "",
          qtyDispense: val[0].qtyDispense ? val[0].qtyDispense : 1,
        };
        setState(state);
        if (index !== null) handleChangeDrug(index, state);
      }
    }}
  />
);
export default function PendingDrugSale() {
  const { patientId } = useParams();
  const dispatch = useDispatch();
  const [drugList, setDrugList] = useState([]);
  const history = useHistory();
  const query = useQuery();
  const request_id = query.get("request_id");
  const [balance, setBalance] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { branch_name } = useSelector((state) => state.auth);
  const { facilityId, username } = useSelector((state) => state.auth.user);
  const [accountNo, setAccountNo] = useState(null);
  const [patient, setPatients] = useState({});
  const saleItems = useSelector((state) => state.pharmacy.drugList);
  // const [filterText, setFilterText] = useState('')
  const [store_name, setStore_name] = useState("");
  const pharmStore = useSelector((state) => state.pharmacy.pharmStore);
  const options = pharmStore && pharmStore.map((item) => item.store_name);
  const [state, setState] = useState([]);
  const [discount, setDiscount] = useState([]);
  const [changeDrug, setChangeDrug] = useState(null);
  let _id = UUIDV4();
  let finalList = [];
  let receiptDateSN = "";
  let receiptSN = "";
  generateReceiptNo((rec, recno) => {
    receiptDateSN = rec;
    receiptSN = recno;
  });
  const _getPharmStore = useCallback(() => {
    dispatch(getPharmStore());
  }, [dispatch, store_name]);

  const ReplacedDrugs = [];
  const _getDrugs = useCallback(() => {
    if (store_name) {
      dispatch(getSalesDrugs(store_name));
    }
  }, [store_name]);

  useEffect(() => {
    _getDrugs();
    dispatch(getDrugList());
  }, [_getDrugs]);

  useEffect(() => {
    _getPharmStore();
  }, [0]);

  // const _setDisplay = (index) => {
  //   setDisplay(!display, index);
  // };
  // const _services_typeahead = useRef(null)

  // const _getPriscription = () => {
  //   _fetchApi(
  //     `${apiURL()}/prescriptions/all/${patientId}`,
  //     ({ results }) => {
  //       if (results && results.length) {
  //         let final = results.map((item) => ({
  //           ...item,
  //           total: parseFloat(item.price) * parseFloat(item.qtyDispense),
  //         }))
  //         setDrugList(final)
  //       }
  //     },
  //     (error) => _warningNotify(error.toString()),
  //   )
  // }
  // const handleDel = (index) => {
  //   const newList = [...drugList];
  //   newList.splice(index, 1);
  //   setDrugList(newList);
  // };
  //useSelector((state) => state.individualDoc.patients)
  //
  const getPatientDrugs = useCallback(() => {
    _fetchApi2(
      `${apiURL()}/record/patient-pending-drugs?request_id=${request_id}`,
      ({ results, success }) => {
        if (success) {
          setDrugList(results);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }, [request_id]);

  const getBalance = (acct) => {
    _fetchApi2(
      `${apiURL()}/record/get-patient-account?accountNo=${acct}`,
      ({ results, success }) => {
        if (success) {
          setBalance(results[0].balance);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const getPatient = useCallback(() => {
    _fetchApi2(
      `${apiURL()}/get/patients?patient_id=${patientId}`,
      ({ results, success }) => {
        if (success) {
          setPatients(results[0]);
          setAccountNo(results[0].accountNo);
          getBalance(results[0].accountNo);
          setAccountNo(results[0].accountNo);
          getBalance(results[0].accountNo);
          if (results.length) {
            setAccountNo(results[0].accountNo);
            getBalance(results[0].accountNo);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  useEffect(() => {
    getPatient();
  }, [0]);
  useEffect(() => {
    getPatientDrugs();
  }, [getPatientDrugs]);

  const vList = drugList.filter((drug) => drug.total > 0);
  const totalAmt = vList.reduce((a, b) => a + parseFloat(b.total), 0);
  // useEffect(() => {
  //   _getPriscription()
  // }, [])

  const handleTableChange = (key, value, index, price) => {
    let newArr = [];
    let item_price = 0;
    // console.log(drugList, key, value, index, price)

    drugList.forEach((item, i) => {
      item_price = item.price ? parseFloat(item.price) : price;
      if (i === index) {
        newArr.push({
          ...drugList[index],
          [key]: value,
          total: item_price * parseInt(value),
          selling_price: item.price,
        });
      } else {
        newArr.push(item);
      }
    });
    // console.log(newArr)
    setDrugList(newArr);
    // handleChangeDrug(null)
  };

  const processPaymentNow = () => {
    setSubmitting(true);

    drugList.forEach((item, i) => {
      let patientAcc = patientId.split("-")[0];
      let current = saleItems.filter(
        (itm) => itm.item_code === item.item_code
      )[0];
      if (item.total) {
        finalList.push({
          drug_code: item.drug_code,
          drug: item.drug,
          product_code: item.drug,
          itemList: item.drug,
          // cost: item.cost_price,
          // cost_price: item.cost_price,total
          selling_price: current.selling_price,
          expiry: item.expiry_date,
          expiry_date: item.expiry_date,
          generic: item.generic_name,
          unit_of_issue: item.unit_of_issue,
          quantity: item.qtyDispense, //acct
          userId: username,
          supplierId: item.supplier,
          description: item.drug,
          source: "Deposit",
          amount: current.selling_price * item.qtyDispense,
          total: current.selling_price * item.qtyDispense,
          receiptDateSN,
          receiptSN,
          modeOfPayment: "CASH",
          destination: "CASH",
          quantityAvailable: "",
          mark_up: item.markUp,
          accNo: accountNo,
          acct: accountNo,
          transactionType: "Deposit",
          sourceAcct: "Deposit",
          id: item.id,
          request_id: item.request_id,
          patientAcc: patientAcc,
          customer_name: patient.name,
          name: patient.name,
          branch_name: store_name,
          salesFrom: store_name,
          phone: "",
          customer_bank: "",
          customer_acc_no: accountNo,
          customerId: patientId,
          clientAccount: accountNo,
          business_bank: "",
          business_bank_acc_no: "",
          expiring_date: "",
          truckNo: "",
          waybillNo: "",
          transaction_amount: 0,
          // txn_type: 'cash',
          // selling_price: (parseFloat(item.price) * parseInt(item.qtyDispense)),
          item_code: item.item_code,
          // expiry_date: item.expiry_date,
          // salesFrom: branch_name,
          userName: username,
          transfer_to: "", //customerId
          facId: facilityId,
          facilityId,
          serviceHead: "",
          txn_type: "Full Payment",
          user_balance: balance,
          transaction_type: "NEW_SALE",
          amount_paid: current.selling_price * item.qtyDispense,
          dr: current.selling_price * item.qtyDispense,
          cr: 0,
          selectedItem: saleItems.filter(
            (itm) => itm.item_code === item.item_code
          )[0],
          _id,
        });
      }
    });

    makeSale(
      { data: finalList },
      () => {
        setSubmitting(false);

        _customNotify("successfully transaction!");
        setTimeout(() => {
          // setSubmitting(false)
          finalList = [];
          setDrugList([]);
          history.push(
            `/me/pharmacy/sales-receipt?type=salesPage&transaction_id=${receiptDateSN}&buyer=${
              patient.name
            }&payment=${"deposit"}&amount=${totalAmt}&discount=${discount}&total=${parseInt(
              finalList.reduce((a, b) => a + b.total, 0)
            )}&drugs=${finalList
              .map((d) => d.item_code)
              .join(",")}&qtys=${finalList
              .map((d) => d.quantity)
              .join(",")}&balance=${balance}`
          );
        }, 1000);
      },
      (err) => {
        setSubmitting(false);
        console.log("An error occured", err);
      }
    );

    // console.log('finallist', finalList);

    // const drugID = [];
    // drugList.forEach((item, i) => {
    //   drugID.push({ id: item.id });
    // });
    // for (let i = 0; i < drugID.length; i++) {
    //   const element = drugID[i];

    // }]
    finalList.forEach((element) => {
      if (element.total) {
        _updateApi(`${apiURL()}/prescriptions/update/dispense`, {
          id: request_id,
        });
      }
    });
    // history.push('/me/pharmacy/drug-sales?type=sales')
  };

  const getItem = (drug) => {
    if (
      saleItems.filter(
        (stock) =>
          stock.drug_name &&
          stock.drug_name.toLowerCase().includes(drug.toLowerCase())
      )
    ) {
      return saleItems.filter(
        (stock) =>
          stock.drug_name &&
          stock.drug_name.toLowerCase().includes(drug.toLowerCase())
      );
    } else if (
      saleItems.filter((stock) =>
        stock.generic_name.toLowerCase().includes(drug.toLowerCase())
      )
    ) {
      return saleItems.filter((stock) =>
        stock.generic_name.toLowerCase().includes(drug.toLowerCase())
      );
    } else return {};
  };
  // const itemNameRef = useRef()
  const drugs_ref = useRef();
  // const itemNameRef = useRef()
  const addDrug = (st) => {
    st.qtyDispense = 1;
    st.total = st.selling_price;
    setDrugList((s) => [...s, st]);
  };
  const deleteDrug = (i) => {
    setDrugList(drugList.filter((item) => drugList[i].drug !== item.drug));
  };
  const handleChangeDrug = (i, state) => {
    state.qtyDispense = state.qtyDispense ? state.qtyDispense : 1;
    state.total = state.selling_price;
    finalList[i] = state;
    drugList[i] = state;
  };
  const manualDosage = (i, value, state) => {
    // finalList[i].manual_dosage = value
    let db = state;
    db.manual_dosage = db.manual_dosage ? db.manual_dosage : value;
    ReplacedDrugs.push(db);
    drugList[i] = state;
    drugList[i].manual_dosage = value;
    // setState
  };

  const handleCheck = () => {};

  return (
    <CustomCard
      container="shadow"
      // style={{ padding: 5 }}
      header={<>Prescribed drug list</>}
    >
      <FormGroup row>
        <Col md={12}>
          <Row>
            {/* <SearchBar
          _ref={itemNameRef}
          placeholder="Search drug by code or name"
          filterText={filterText}
          onFilterTextChange={(v) => {
            setFilterText(v);
          }}
        /> */}
            <Col md={6}>
              <Label style={{ fontWeight: "bold" }}>Search Drug</Label>
              <Row>
                <Col md={10}>
                  <DrugSelector
                    drugs_ref={drugs_ref}
                    saleItems={saleItems}
                    setState={setState}
                  />
                </Col>
                <Col md={2}>
                  <Button onClick={() => addDrug(state)} className="btn-info">
                    Add
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <SelectInput
                label="Select Store"
                _default="Select Store"
                type="select"
                value={store_name}
                name="store_name"
                options={options}
                onChange={(e) => setStore_name(e.target.value)}
                container="col-md-6 px-0"
              />
            </Col>
          </Row>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Col md={3}>
          <label style={{ fontWeight: "bold" }}>Patient name: </label>
          <span>{patient.name}</span>
        </Col>
        <Col md={3}>
          <label style={{ fontWeight: "bold" }}>Account No: </label>
          <span>{accountNo}</span>
        </Col>
        <Col md={3}>
          <label style={{ fontWeight: "bold" }}>Balance : {balance}</label>
          {/* <span>{accountNo}</span> */}
        </Col>
      </FormGroup>
      <Table bordered size="sm">
        <thead>
          <tr>
            {/* <th /> */}
            <th className="text-center">Action</th>
            <th className="text-center">Buy Outside</th>
            <th className="text-center" style={{ width: "20%" }}>
              Drug
            </th>
            <th className="text-center">Price(₦)</th>
            {/* <th className='text-center'> Qty request</th> */}
            <th className="text-center">Prescription Detail</th>
            <th className="text-center">Qty Dispensed</th>
            <th className="text-center">Amount (₦)</th>
          </tr>
        </thead>
        {/* {JSON.stringify({saleItems})} */}
        <tbody>
          {drugList.length ? (
            drugList.map((item, i) => {
              let available = getItem(item.drug).length;
              return (
                <tr
                  className={!getItem(item.drug).length ? "" : "bg-info"}
                  key={i}
                >
                  <td className="text-center">
                    {available ? null : changeDrug === i ? (
                      <CustomButton
                        onClick={() => {
                          handleChangeDrug(i, state);
                          setChangeDrug(null);
                        }}
                      >
                        Done
                      </CustomButton>
                    ) : (
                      <CustomButton
                        onClick={() => {
                          setChangeDrug(i);
                        }}
                      >
                        Change
                      </CustomButton>
                    )}
                    <CustomButton
                      color="light"
                      onClick={() => {
                        deleteDrug(i);
                      }}
                    >
                      <FaTrash className="text-danger" />
                    </CustomButton>
                  </td>
                  <td className="text-center">
                    <Checkbox onChange={(e) => handleCheck(i)} />
                    {/* {available ? (
                      <Badge color="primary">Available</Badge>
                    ) : (
                      <Badge color="warning">Not Available</Badge>
                    )} */}
                  </td>
                  {/* <td className="d-flex">
                <Button
                  size="sm"
                  color="danger"
                  disabled={!display}
                  onClick={(i) => _setDisplay(i)}
                >
                  Not Available
                </Button>
                {item.id}
                <Button size="sm" color="primary" className="ml-1">
                  Replace
                </Button>
              </td> */}
                  <td>
                    {changeDrug === i ? (
                      <DrugSelector
                        drugs_ref={drugs_ref}
                        saleItems={saleItems}
                        setState={setState}
                        handleChangeDrug={handleChangeDrug}
                        index={i}
                      />
                    ) : (
                      <span>{item.drug} </span>
                    )}
                  </td>
                  <td className="text-right">
                    {getItem(item.drug).length
                      ? getItem(item.drug)[0].selling_price
                      : ""}
                  </td>
                  <td>
                    {changeDrug === i ? (
                      <Input
                        type="text"
                        name="manual_dosage"
                        className="text-right"
                        style={{ width: 100 }}
                        value={item.manual_dosage}
                        onChange={({ target: { value } }) => {
                          manualDosage(i, value, state);
                          handleChangeDrug(i, state);
                        }}
                      />
                    ) : (
                      <>
                        {item.manual_dosage ? (
                          <span>{`${item.drug} ${item.manual_dosage}`}</span>
                        ) : (
                          <span>{`${item.route} ${item.drug} ${
                            item.dosage
                          } every ${item.frequency} for ${item.duration} ${
                            item.period
                          }(s) ${
                            item.additionalInfo ? item.additionalInfo : ""
                          }`}</span>
                        )}
                      </>
                    )}
                  </td>
                  <td className="text-center">
                    <Input
                      type="number"
                      name="qtyDispense"
                      className="text-right"
                      style={{ width: 100 }}
                      // onblur={() => {
                      //   setChangeDrug(null)
                      //   handleChangeDrug(i, state)
                      // }}
                      value={item.qtyDispense}
                      onChange={({ target: { value } }) => {
                        // handleChangeDrug(i, state)
                        handleTableChange(
                          "qtyDispense",
                          value,
                          i,
                          getItem(item.drug).length
                            ? getItem(item.drug)[0].selling_price
                            : 0
                        );
                      }}
                    />
                  </td>

                  <td className="text-right">{formatNumber(item.total)}</td>
                </tr>
              );
            })
          ) : (
            <h4 className="text-center">N/A</h4>
          )}
          <tr>
            <td colSpan={5} className="text-right">
              Discount:
            </td>
            <td className="text-right font-weight-bold">
              <Input
                type="number"
                onChange={({ target: { value } }) => setDiscount(value)}
                name="discount"
                value={discount}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={3} />
            <td colSpan={2} className="text-right font-weight-bold">
              Total:
              {discount > 0
                ? formatNumber(parseInt(totalAmt) - parseInt(discount))
                : formatNumber(totalAmt)}
            </td>
          </tr>
        </tbody>
      </Table>
      {/* <Discount
        handleRadio={handleRadio}
        discount={discount}
        handlePercentage={handlePercentage}
        discountValue={discountValue}
      />
      <ServiceForm
        balance={balance}
        total={total}
        discount_value={discount_value}
        paymentMedium={paymentMedium}
        discountValue={discount_value}
      /> */}
      <center>
        <CustomButton
          loading={submitting}
          className="px-4"
          color="primary"
          onClick={processPaymentNow}
        >
          <FaSave size={18} style={{ marginRight: 5 }} />
          Pay Now
        </CustomButton>
      </center>
    </CustomCard>
  );
}
