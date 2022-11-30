import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Col, Row } from "reactstrap";
import { apiURL } from "../../../redux/actions";
import { v4 as UUIDV4 } from "uuid";
import SelectedDrugList from "./SelectedDrugList";
import NewCustomerModal from "./WarningModal";
import DrugCardList from "./DrugCardList";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  getClientInfo,
  getPharmStore,
  getSalesDrugs,
  makeSale,
  searchDrugSale,
} from "../../../redux/actions/pharmacy";
import { generateReceiptNo } from "../../utils/helpers";
import { _postApi } from "../../../redux/actions/api";

function DrugSale() {
  const navigate = useHistory();
  const pharmStore = useSelector((state) => state.pharmacy.pharmStore);
  const saleItems = useSelector((state) => state.pharmacy.saleItems);
  const clientInfo = useSelector((state) => state.pharmacy.clientInfo);
  const auth = useSelector((state) => state.auth);
  const { username, facilityId } = useSelector((state) => state.auth.user);
  const activeBusiness = useSelector(
    (state) => state.auth.activeBusiness || {}
  );
  const check = "";

  const options = pharmStore && pharmStore.map((item) => item.store_name);
  const [form, setForm] = useState({
    quantity_sold: "",
    // store_name: options[0] ? options[0] : auth.user.branch_name,
    store_name: "",
    user_balance: 0,
    selectedItem: {
      balance: 0,
      drug_name: "",
      item_code: "",
      expiry_date: "",
      store: "",
      selling_price: 0,
    },
    from: 0,
    to: 100,
  });

  const qttyRef = useRef();
  const itemNameRef = useRef();
  const amountPaidRef = useRef();
  const dispatch = useDispatch();
  const _getPharmStore = useCallback(() => {
    dispatch(getSalesDrugs(form.store_name, form.from, form.to));
    dispatch(getClientInfo());
  }, [dispatch, form.from, form.store_name, form.to]);

  useEffect(() => {
    dispatch(
      getPharmStore((d) =>
        setForm((p) => ({ ...p, store_name: d[0].store_name }))
      )
    );
  }, [dispatch]);

  const [filterText, setFilterText] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [otherInfo, setOtherInfo] = useState({
    discount: 0,
    amountPaidDefault: 0,
    amountPaid: null,
    total: 0,
    modeOfPayment: "CASH",
    selectedCustomer,
  });

  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = (i) => {
    let newVal = cart.filter((item, index) => i !== index);
    setCart(newVal);
  };

  const selectItem = (item) => {
    setForm((p) => ({ ...p, selectedItem: item }));
    qttyRef.current.select();
  };

  useEffect(() => {
    if (filterText.length > 3) {
      // console.log('Attempt to search')
      dispatch(
        searchDrugSale(form.store_name, 0, 100, filterText, (d) => {
          if (d.length === 1) {
            selectItem(d[0]);
          }
        })
      );
    } else if (filterText.length === 0) {
      _getPharmStore();
    }
  }, [
    _getPharmStore,
    dispatch,
    filterText,
    filterText.length,
    form.store_name,
  ]);

  const formIsValid =
    form.selectedItem.drug_name && parseInt(form.quantity_sold);

  const addToCart = useCallback(() => {
    console.log("adding to cart", form);
    if (formIsValid) {
      if (parseInt(form.quantity_sold) > parseInt(form.selectedItem.balance)) {
        alert(`Quantity requested is more than the quantity available`);
      } else {
        // let selling_price = parseFloat(form.cost) + parseFloat(form.markup)
        console.error({ selectedCustomer: selectedCustomer });
        let total =
          form.selectedItem.selling_price * parseFloat(form.quantity_sold);
        let id = UUIDV4();
        let itemObj = {
          id,
          patientAcc: selectedCustomer.accountNo,
          accName: selectedCustomer.name,
          name: selectedCustomer.name,
          price: form.selectedItem.selling_price,
          quantity: form.quantity_sold,
          balance: form.selectedItem.balance,
          item_name: form.selectedItem.drug_name,
          item_category: form.selectedItem.itemCategory,
          amount: total,
          customerId: form.acct,
          // expiry_date:,
          item_id: form._id,
          salesFrom: form.store_name,
          item_code: form.selectedItem.item_code,
          discount: otherInfo.discount,
          imeiText: form.imeiText,
          imeiImage: form.imeiImage,
          truckNo: form.truckNo,
          waybillNo: form.waybillNo,
          supplier_code: form.supplier_code,
          supplier_name: form.supplierName,
          supplierName: form.supplierName,
          expiry_date: form.selectedItem.expiry_date,
        };
        setCart((p) => [...p, itemObj]);
        setForm((p) => ({
          ...p,
          quantity_sold: "",
        }));
        // itemNameRef.current?.focus();
      }
    } else {
      console.log("Item not selected");
    }
  }, [form, formIsValid, otherInfo, selectedCustomer]);

  const checkout = useCallback(() => {
    console.log("Called checkout...........");
    setIsNewCustomerModalOpen(false);
    setSubmitting(true);
    let totalDiscount = parseFloat(otherInfo.discount);
    let txn = [];
    cart.forEach((item, index) => {
      let lastIndex = cart.length - 1;
      let itemList = cart.map((state) => state.item_name);
      txn.push({
        _id: item.id,
        source: "STORE",
        product_code: item.item_name,
        dr: parseFloat(item.amount),
        amount: parseFloat(item.amount),
        selling_price: item.price,
        cr: 0,
        business_bank_acc_no: activeBusiness.id || "",
        destination: "CASH",
        accNo: form.acct,
        quantity: item.quantity,
        description: item.item_name,
        category: item.item_category,

        customerId: selectedCustomer.accountNo,
        clientAccount: selectedCustomer.accountNo,
        customerName: selectedCustomer.accName,
        transaction_type: "NEW_SALE",
        branch_name: activeBusiness.business_name,
        // amountPaid: otherInfo.amountPaid,
        totalAmount: txn.total,
        // modeOfPayment: otherInfo.modeOfPayment,
        imeiText: item.imeiText,
        imeiImage: item.imeiImage,
        truckNo: item.truckNo,
        waybillNo: item.waybillNo,
        itemList: index === lastIndex ? itemList.join(",") : "",
        txn_type:
          parseInt(otherInfo.amountPaid) <
          parseInt(cart.reduce((a, b) => a + b.amount, 0))
            ? "Part Payment"
            : "Full Payment",
        supplier_code: item.supplier_code,
        supplierName: item.supplierName,
        supplier_name: item.supplier_name,
        item_id: item.item_id,
        salesFrom: item.salesFrom,
        item_code: item.item_code,
        expiry_date: item.expiry_date,
        expiring_date: item.expiry_date,
        facilityId: auth.user.facilityId,
        ...otherInfo,
        ...form,
        amountPaid: index === lastIndex ? otherInfo.amountPaid : 0,
        amountPaidDefault:
          index === lastIndex ? otherInfo.amountPaidDefault : 0,
        discount: index === lastIndex ? totalDiscount : "0",
        patient_name: selectedCustomer.name,
      });
    });
    generateReceiptNo((receiptDateSN, receiptSN) => {
      const arr = [];
      txn.forEach((item) => {
        arr.push({
          ...item,
          receiptDateSN: receiptDateSN,
          receiptSN: receiptSN,
        });
      });

      makeSale(
        { data: arr },
        () => {
          setSubmitting(false);
          navigate.push(
            `/me/pharmacy/sales-receipt?type=salesPage&transaction_id=${receiptSN}&buyer=${
              selectedCustomer.name
            }&payment=${otherInfo.modeOfPayment}&amount=${
              otherInfo.amountPaid
            }&discount=${otherInfo.discount}&total=${parseInt(
              cart.reduce((a, b) => a + b.amount, 0)
            )}&drugs=${arr.map((d) => d.item_code).join(",")}&qtys=${arr
              .map((d) => d.quantity)
              .join(",")}`
          );
        },
        (err) => {
          setSubmitting(false);
          console.log("An error occured", err);
        }
      );
    });
    let chargesVal = {
      user_id: username,
      facilityId,
      patient_id: selectedCustomer ? selectedCustomer.accountNo : 1,
    };
    _postApi(
      `${apiURL()}/post-charges-pharm`,
      chargesVal,
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }, [cart, form, navigate, selectedCustomer, otherInfo, activeBusiness]);

  const handleSubmit = useCallback(() => {
    otherInfo.amountPaid = otherInfo.amountPaid
      ? otherInfo.amountPaid
      : otherInfo.amountPaidDefault;
    if (!otherInfo.amountPaid) {
      alert("Please enter the amount paid");
      amountPaidRef.current.focus();
    } else if (!selectedCustomer.name) {
      setIsNewCustomerModalOpen(true);
    } else {
      checkout();
    }
  }, [selectedCustomer, otherInfo, checkout]);

  const handleKeyPress = useCallback(
    (e) => {
      switch (e.key) {
        case "Enter":
          return addToCart();
        case "F10":
          return handleSubmit();

        default:
          return null;
      }
    },
    [addToCart, handleSubmit]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleChange = ({ target: { name, value } }) => {
    // console.log({ name, value });
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleOtherInfoChange = ({ target: { name, value } }) => {
    setOtherInfo((p) => ({ ...p, [name]: value }));
  };

  const toggleCustomerForm = () => setIsNewCustomerModalOpen((p) => !p);

  const createCustomerAndCheckout = (customer) => {
    // setLoading(true);
    // console.log("kkjklklkkk");
    // let receiptNo = moment().format("YYMDhms");
    // let txn = [];
    // let customerId = UUIDV4();
    // txn.push({
    //   _id: UUIDV4(),
    //   //   source: CASH,
    //   product_code: "",
    //   amount: 0,
    //   amountPaid: otherInfo.amountPaid,
    //   //   destination: PAYABLE,
    //   quantity: 0,
    //   description: "Customer Deposit",
    //   receiptNo,
    //   narration: "CUSTOMER DEPOSIT",
    //   modeOfPayment: otherInfo.modeOfPayment,
    //   customerId: customerId,
    //   patientAcc: selectedCustomer.accountNo,
    //   transaction_type: TRANSACTION_TYPES.CUSTOMER_DEPOSIT,
    // });
    // console.log({ txn });
    // saveTransaction(
    //   txn,
    //   () => {
    //     // saveCustomerDepositTxnToCache(selectedCustomer, txn, 0)
    //     toggleCustomerForm()
    //     checkout()
    //   },
    //   (err) => {
    //     console.log(err);
    //   },
    // //   TRANSACTION_TYPES.CUSTOMER_DEPOSIT
    // );
  };

  return (
    <Row className="m-0">
      <Col md={8} className="px-1 ">
        <div style={{ height: "60vh" }}>
          <SelectedDrugList
            itemNameRef={itemNameRef}
            qttyRef={qttyRef}
            selectItem={selectItem}
            itemList={saleItems}
            form={form}
            submitting={submitting}
            addToCart={addToCart}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setFilterText={setFilterText}
            filterText={filterText}
            options={options}
            disabled={!check}
          />
        </div>

        {/* {JSON.stringify(selectedCustomer)} */}
      </Col>
      <Col md={4} className="px-1">
        <div style={{ height: "60vh" }}>
          <DrugCardList
            setSelectedCustomer={setSelectedCustomer}
            list={cart}
            clientInfo={clientInfo}
            otherInfo={otherInfo}
            handleOtherInfoChange={handleOtherInfoChange}
            handleSubmit={handleSubmit}
            amountPaidRef={amountPaidRef}
            handleDelete={handleDelete}
            setForm={setForm}
            form={form}
          />
        </div>
      </Col>
      <NewCustomerModal
        isOpen={isNewCustomerModalOpen}
        onSkipClicked={() => {
          setForm((p) => ({ ...p, customerName: "" }));
          checkout();
        }}
        onSubmit={checkout}
        form={setForm}
        toggle={toggleCustomerForm}
      />
    </Row>
  );
}

export default DrugSale;
