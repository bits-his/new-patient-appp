import React, { useState, useRef } from 'react';
import { Card, CardHeader, FormGroup, CardBody, Form } from 'reactstrap';
import { FaPlus } from 'react-icons/fa';
import moment from 'moment';
// import { _postApi, apiURL } from '../../redux/actions/api';
// import { _customNotify, _warningNotify } from '../../redux/helper';
// import { useEffect } from 'react';
import { toaster } from 'evergreen-ui';
import ItemsList from './ItemList';
import PurchaseForm from './InventPurchaseForm';
// import PurchaseMoreInfo from './InventMoreInfo';
// import { useDispatch } from 'react-redux';
import ShortcutKeys from './ShortcutKeys';
import BackButton from '../comp/components/BackButton';
// import { getStoreAlert } from '../../redux/actions/inventory';
// import AddNonCummulativeCosts from '../purchase/create-purchase/AddNonCummulativeCosts';

function Purchase() {
  // const dispatch = useDispatch();
  const date = moment().format('YYYY-MM-DD');
  const [itemType, setItemType] = useState('');
  const [itemCode, setItemCode] = useState('');
  //   const [supplier, setSupplier] = useState('');
  // const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [measurement, setMeasurement] = useState('');
  //   const [unitRate, setUnitRate] = useState(0);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState(0);
  const [vatamount, setVatAmount] = useState(0);
  const [totalamount, setTotalAmount] = useState(0);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [loading,] = useState(false);
  const [purchase,] = useState('cash');
  // const [deductable, setDeductable] = useState('no');
  // eslint-disable-next-line no-unused-vars
  const [supplierList, setSupplierList] = useState([]);
  const [list, setList] = useState([]);
  const itemTypeRef = useRef();
  const itemCodeRef = useRef();
  const supplierRef = useRef();
  const unitOfMeasurementRef = useRef();
  // eslint-disable-next-line no-unused-vars
  const [supplierItemCategory, setSupplierItemCategory] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [pendingItem, setPendingItem] = useState([]);
  const [unitOfMeasurement, setUnitOfMeasurement] = useState([]);
  const [itemCategory, setItemCategory] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [radioInput, setRadioInput] = useState('fixed');
  const [markUp, setMarkUp] = useState(0);
  const [mark_up, setMark_up] = useState(0);
  const [selling_price, setSelling_price] = useState(0);
  const [individualPrice, setIndividualPrice] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [inventoryList, setInventoryList] = useState([]);
  const [available, setAvailable] = useState(0);
  const qttyRef = useRef();
  const itemRef = useRef();
  const _item_code_ref = useRef();
  //   const [isCummulative, setIsCummulative] = useState('yes');

  // useEffect(() => {
  //   fetchSuppliers();
  //   fetchCategory();
  //   fetchItemCategory();
  //   // getInventoryList();
  // }, []);

  // const toggleCummulative = () =>
  //   setIsCummulative((prev) => (prev === 'yes' ? 'no' : 'yes'));

  // const fetchCategory = () => {
  //   _fetchApi(
  //     `${apiURL()}/purchase/unitofmeasurement`,
  //     ({ results }) => {
  //       setSupplierItemCategory(results);
  //     },
  //     (err) => console.log(err),
  //   );
  // };

  // const getItemsByCategory = (category) => {
  //   _fetchApi(
  //     `${apiURL()}/purchase/item/${category}
  //     `,
  //     ({ results }) => {
  //       setPendingItem(results);
  //       setUnitOfMeasurement(results);
  //       // console.log(results);
  //     },
  //     (err) => console.log(err)
  //   );
  // };

  // const fetchSuppliers = (supplier) => {
  //   _fetchApi(
  //     `${apiURL()}/purchase/getsupplier/${supplier}`,
  //     ({ results }) => {
  //       setSupplierList(results);
  //     },
  //     (err) => console.log(err),
  //   );
  // };

  // const getInventoryList = (code) => {
  //   _fetchApi(
  //     `${apiURL()}/api/get/inventory/list/${code}`,
  //     ({ results }) => {
  //       setInventoryList(results);
  //     },
  //     (err) => console.log(err)
  //   );
  // };
  // const handleItemChange = (e) => {
  //   e.preventDefault();
  //   let value = e.target.value;
  //   setItemCode(value);

  //   getInventoryList(value)
  //     .then((data) => {
  //       if (data.success) {
  //         // console.log(results);
  //         if (data.results.length) {
  //           setInventoryList(data.results[0]);
  //           setItemType(data.results[0].item_type);
  //           setPrice(data.results[0].price);
  //           setAvailable(data.results[0].quantity);
  //           setIndividualPrice(data.results[0].price);
  //           qttyRef.current.focus();
  //         }
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  // testRef = () => this.qttyRef.current.focus();

  // const getInventoryList = async (code) => {
  //   try {
  //     let response = await fetch(`${apiURL()}/get/inventory/list/${code}`);
  //     return await response.json();
  //   } catch (error) {
  //     return error;
  //   }
  // };

  // const fetchItemCategory = () => {
  //   _fetchApi(
  //     `${apiURL()}/purchase/batch`,
  //     ({ results }) => console.log(results),
  //     // {
  //     //   setItemCategory(results);
  //     // },
  //     (err) => console.log(err),
  //   );
  // };

  //   const purchaseTxn = (txn1, txn2, credit1, credit2, vat1, vat2) => {
  // if (txn1.length) {
  //   _postApi(
  //     `${apiURL()}/inventory/recordpurchase`,
  //     { txn1, txn2 },
  //     (data) => {
  //       console.log(data);
  //       _customNotify('Transaction successful');
  //       setList([]);
  //     },
  //     (err) => console.log(err)
  //   );
  // }
  // if (credit1.length) {
  //   _postApi(
  //     `${apiURL()}/inventory/recordpurchase`,
  //     { txn1: credit1, txn2: credit2 },
  //     (data) => {
  //       console.log(data);
  //       _customNotify('Transaction successful');
  //       setList([]);
  //     },
  //     (err) => console.log(err)
  //   );
  // }
  // if (vat1.length) {
  //   _postApi(
  //     `${apiURL()}/inventory/recordpurchase`,
  //     { txn1: vat1, txn2: vat2 },
  //     (data) => console.log(data),
  //     (err) => console.log(err)
  //   );
  // }
  //   };

  // const recordPurchase = useCallback((item) => {
  //   _postApi(
  //     `${apiURL()}/inventory/recordpurchase`,
  //     { data: item },
  //     () => {
  //       toggleLoading(false);
  //       setList([]);
  //       dispatch(getStoreAlert());
  //     },
  //     (err) => {
  //       console.log(err);
  //       toggleLoading(false);
  //       _warningNotify('error');
  //     },
  //   );
  // },[dispatch]);

  const handleDelete = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  //   const saveNonCummulativeCosts = cummCost => {

  //   }

  const resetForm = () => {
    // setDate(moment().format('YYYY-MM-DD'));
    setItemType('');
    setItemCode('');
    // setSupplier('');
    setDescription('');
    setAmount(0);
    setTotalAmount(0);
    setInvoiceNo('');
    // setUnitRate(0);
    setPrice(0);
    setQuantity('');
    setVatAmount(0);
    setMark_up(0);
    setSelling_price(0);
    setIndividualPrice(0);
    setAvailable(0);
    // headRef.current.clear();
    // itemTypeRef.current.clear();
    // itemCodeRef.current.clear();
    // supplierRef.current.clear();
    // unitOfMeasurementRef.current.clear();
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (itemCode === '' && quantity > available) {
      toaster.warning('Sorry you have Insufficient quantity!!! ');
    } else {
      let formData = {
        date,
        debit_account: 'Inventory',
        credit_account: 'Item',
        itemCode,
        itemType,
        description,
        // unitRate,
        // mark_up,
        price,
        quantity,
        amount,
        vatamount,
        totalamount,
        individualPrice,
        purchase,
        available,
        // individualPrice,

        // supplier,
        // deductable,
        // invoiceNo,
        // measurement,
      };
      setList([...list, formData]);
      resetForm();
      _item_code_ref.current.focus();
    }
  };

  // const submit = useCallback(() => {
  //   toggleLoading(true);
  //   // const newList = _convertArrOfObjToArr(list);
  //   let updatequantity = [];
  //   list.forEach((item) => updatequantity.push([item.itemCode, item.quantity]));
  //   console.log(updatequantity);
  //   for (let id = 0; id < updatequantity.length; id++) {
  //     let data = updatequantity[id];
  //     _postApi(`${apiURL()}/inventory/moment`, data);
  //     recordPurchase(list[id]);
  //   }
  //   _customNotify('Purchase(s) Submitted');

  //   // recordPurchase(newList, list);
  // }, [list, recordPurchase]);

  const handleUpdate = () => {
    let newList = [];
    list.forEach((i, idx) => {
      if (idx === selectedIndex) {
        newList.push({
          date,
          debit_account: 'Inventory',
          credit_account: 'Item',
          itemCode,
          itemType,
          description,
          //   unitRate,
          price,
          quantity,
          amount,

          vatamount,
          totalamount,

          //   supplier,
          //   deductable,
          //   purchase,
          //   invoiceNo,
          //   measurement,

          individualPrice,
          purchase,
        });

        console.log(newList);
      } else {
        newList.push(i);
      }
    });
    setList(newList);
    setToggle(false);
    resetForm();
  };

  const handleEdit = (item) => {
    setItemType(item.itemType);
    setItemCode(item.itemCode);
    // setSupplier(item.supplier);
    setUnitOfMeasurement(item.unitOfMeasurement);
    setPrice(item.price);
    setQuantity(item.quantity);
    setAmount(item.amount);
    setMark_up(item.mark_up);
    setSelling_price(item.selling_price);
    setIndividualPrice(item.individualPrice);
    setToggle(true);
    setAvailable(item.available);
  };

  const handleRadio = (e) => {
    setRadioInput('percentage');
  };

  const handleRadio1 = (e) => {
    setRadioInput('fixed');
  };

  // const handleClick = () => {
  //   if (radioInput === 'percentage') {
  //     setSelling_price(
  //       parseInt(mark_up * ((_getVAT(amount) + amount) / 100)) +
  //         parseInt(_getVAT(amount) + amount),
  //     );
  //   } else if (radioInput === 'fixed') {
  //     setSelling_price(parseInt(mark_up) + parseInt(_getVAT(amount) + amount));
  //   }
  // };

  // const handleMarkUp = (percent) => {
  //   if (radioInput === 'percentage') {
  //     let percentage = (parseInt(price) * parseInt(percent)) / 100;
  //     setMarkUp(percentage);
  //   } else if (radioInput === 'fixed') {
  //     let fixed = parseInt(percent);
  //     setMarkUp(fixed);
  //   } else {
  //     setMarkUp(0);
  //   }
  // };

  // const handleKeyPress = useCallback(
  //   (e) => {
  //     switch (e.key) {
  //       // f2
  //       case 'F2':
  //         return submit();

  //       default:
  //         return null;
  //     }
  //   },
  //   [submit],
  // );

  // useEffect(() => {
  //   // fetchSuppliers();
  //   // fetchCategory();
  //   // fetchItemCategory();
  //   document.addEventListener('keydown', handleKeyPress);
  //   return () => {
  //     document.removeEventListener('keydown', handleKeyPress);
  //   };
  // }, [handleKeyPress]);

  const formValid =
    itemCode !== '' && itemType !== '' && quantity !== '' && quantity !== 0;

  return (
    <>
      <BackButton />
      <Card>
        <CardHeader className="row m-0">
          {/* <label className="col-md-5">{date}</label>
        <h6 className="col-md-7">Point of sale</h6> */}
          <ShortcutKeys edit={false} />
        </CardHeader>
        {/* {JSON.stringify({ list })} */}
        <CardBody>
          <Form onSubmit={submitForm}>
            <PurchaseForm
              qttyRef={qttyRef}
              itemRef={itemRef}
              // handleItemChange={handleItemChange}
              setIndividualPrice={setIndividualPrice}
              supplierItemCategory={supplierItemCategory}
              setItemType={setItemType}
              setItemCategory={setItemCategory}
              itemCategory={itemCategory}
              itemTypeRef={itemTypeRef}
              itemType={itemType}
              itemCodeRef={itemCodeRef}
              supplierRef={supplierRef}
              unitOfMeasurementRef={unitOfMeasurementRef}
              pendingItem={pendingItem}
              description={description}
              setItemCode={setItemCode}
              itemCode={itemCode}
              // fetchSuppliers={fetchSuppliers}
              supplierList={supplierList}
              setDescription={setDescription}
              unitOfMeasurement={unitOfMeasurement}
              setMeasurement={setMeasurement}
              setPrice={setPrice}
              setAmount={setAmount}
              amount={amount}
              setVatAmount={setVatAmount}
              setTotalAmount={setTotalAmount}
              price={price}
              setQuantity={setQuantity}
              quantity={quantity}
              invoiceNo={invoiceNo}
              setInvoiceNo={setInvoiceNo}
              handleRadio={handleRadio}
              handleRadio1={handleRadio1}
              unitPrice={unitPrice}
              setUnitPrice={setUnitPrice}
              radioInput={radioInput}
              mark_up={mark_up}
              setMark_up={setMark_up}
              markUp={markUp}
              setMarkUp={setMarkUp}
              selling_price={selling_price}
              totalamount={totalamount}
              setSelling_price={setSelling_price}
              _item_code_ref={_item_code_ref}
              // handleClick={handleClick}
            />

            <br />

            {/* <AddNonCummulativeCosts
            isOpen={isCummulative !== 'yes'}
            toggle={() => setIsCummulative('yes')}
            saveNonCummulativeCosts={saveNonCummulativeCosts}
          /> */}

            <FormGroup className="d-flex flex-row justify-content-center mt-2">
              {toggle === true ? (
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleUpdate}
                >
                  <FaPlus /> Update item
                </button>
              ) : (
                <button
                  className="btn btn-outline-primary"
                  type="submit"
                  disabled={!formValid}
                >
                  <FaPlus /> Add to list
                </button>
              )}
            </FormGroup>
          </Form>
          <ItemsList
            list={list}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            setSelectedIndex={setSelectedIndex}
            loading={loading}
            // submit={submit}
          />
        </CardBody>
      </Card>
    </>
  );
}

export default Purchase;
