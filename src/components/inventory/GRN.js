import React from "react";
import {
  Card,
  CardBody,
  Row,
  CardHeader,
  CardFooter,
  Button,
} from "reactstrap";
import { useHistory, useLocation } from "react-router";
import { useState } from "react";
import { _fetchApi, _postApi, _updateApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import { useEffect } from "react";
import { _customNotify, _warningNotify } from "../utils/helpers";
import BackButton from "../comp/components/BackButton";
import moment from "moment";
import { useSelector } from "react-redux";
import { GRNTable } from "./goods-received-note/GRNTable";
import GRNReview from "./goods-received-note/GRNReview";
import UnfinishedPurchaseTable from "./goods-received-note/UnfinishedPurchaseTable";
import GRNReviewTable from "./goods-received-note/GRNReviewTable";

function GRN() {
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  const branch = useSelector((state) => state.auth.user.branch_name);

  const [purchaseItems, setPurchaseItem] = useState([]);
  const [supplierItems, setSupplierItems] = useState([]);
  const [poNo, setPoNo] = useState("");
  const [client, setClient] = useState("");
  const [vendor, setVendor] = useState("");
  const [date, setDate] = useState("");
  const [grn, setGrn] = useState("");
  const [, setId] = useState("");
  const [, setType] = useState("");
  const [, setPODId] = useState("");
  const history = useHistory();
  const [status, setStatus] = useState("");
  const [uniqueId] = useState("");
  const [unfinishedPurchaseList, setUnfinishedPurchaseList] = useState([]);

  const handleSet = (item) => {
    setPoNo(item.po_id);
    setClient(item.client);
    setVendor(item.vendor);
    setDate(item.date);
    setId(item.id);
    setType(item.type);
    setPODId(item.po_id);
  };
  const [unfinishe_grn, setUnfinishe_grn] = useState("");
  const getAllPurchases = () => {
    _fetchApi(
      `${apiURL()}/get/disburse/purchase/order`,
      (data) => {
        setPurchaseItem(data.results);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const getGrn = () => {
    let grn = "grn";
    _fetchApi(
      `${apiURL()}/get/number/generator/${grn}`,
      (data) => {
        if (data.success) {
          setGrn(data.results.grn);
          console.log(data);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const generate_item_code = async (description) => {
    try {
      let request = await fetch(
        `${apiURL()}/account/generate/item/code/${description}/${facilityId}`
      );
      return await request.json();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(
    () => {
      getAllPurchases();
      getGrn();
    },
    [supplierItems]
  );

  const updateGRNStatus = () => {
    const newUpdate = [];
    supplierItems.forEach((item) => {
      if (item.propose_quantity === item.received_qty) {
        newUpdate.push({
          status: "ApprovedGRN",
          id: item.po_id,
        });
        _updateApi(
          `${apiURL()}/account/update/grn/status/${newUpdate.id}`,
          { status: newUpdate.status },
          (success) => {},
          (err) => {
            console.log(err);
          }
        );
      }
    });
  };

  const updateGRN = () => {
    const newUpdate = [];
    supplierItems.forEach((item) => {
      newUpdate.push({
        appoveQty: item.renew,
        id: item.id,
      });
    });
    for (let i = 0; i < newUpdate.length; i++) {
      const element = newUpdate[i];
      _updateApi(
        `${apiURL()}/account/update/new/quantity/${element.id}`,
        { appoveQty: element.appoveQty },
        (success) => {
          history.push("/me/new_inventory/grn");
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };
  const handleSubmit = () => {
    const newArray = [];
    const acceptedArray = [];
    const unAcceptedArray = [];
    let status = "";
    let arr = [];
    supplierItems.forEach((item) => {
      console.log("arrrrrrrrrrrr");
      console.log(arr);
      arr.push(item.status);
      if (arr.includes("unfinished purchase")) {
        status = "unfinished purchase";
      } else {
        status = "finished purchase";
      }
      newArray.push({
        receive_date: moment().format("YYYY-MM-DD"),
        item_name: item.item_name,
        po_no: item.po_id,
        qty_in: item.renew,
        qty_out: 0,
        store_type: item.type,
        grm_no: grn,
        query_type: "received",
        expiring_date: item.date,
        unit_price: item.price,
        mark_up: 0,
        selling_price: 0,
        transfer_from: "purchase order",
        status: item.status,
        transfer_to: item.type,
        branch_name: branch,
        uniqueId: item.uniqueId,
        expired_status: item.expired_status,
        item_category: item.item_category,
      });

      if (item.expired_status === "true" && item.date === "") {
        acceptedArray.push(newArray);
      } else {
        unAcceptedArray.push(item);
      }
    });

    if (acceptedArray.length) {
      alert("Please enter expired date");
    } else {
      const data = {
        newArray,
        header: {
          poNo,
          status,
          grn,
        },
      };

      const callBack = () => {
        getAllPurchases();
        history.push("/me/new_inventory/grn");
        _customNotify("Submitted Successfully");
        updateGRN();
        updateGRNStatus();
        getGrn();
      };
      const error = () => {
        _warningNotify("Error Occurred");
      };

      _postApi(`${apiURL()}/account/add-new/store`, data, callBack, error);
    }
  };

  const handleUpdate = () => {
    // let expireStatus = supplierItems.map(
    //   (item) => item.expired_status === "true" && item.expiring_date === ""
    // );
    // if (expireStatus) {
    //   alert("Please put on the expiring date");
    // } else {
    const newArray = [];

    let _status = "";
    let arr = [];
    unfinishedPurchaseList.forEach((item) => {
      console.log(arr);
      arr.push(item.status);
      if (arr.includes("unfinished purchase")) {
        _status = "unfinished purchase";
      } else {
        _status = "finished purchase";
      }

      newArray.push({
        receive_date: moment().format("YYYY-MM-DD"),
        item_name: item.item_name,
        po_no: item.po_id,
        qty_in: item.quantity,
        qty_out: 0,
        store_type: item.type,
        grm_no: unfinishe_grn,
        query_type: "received",
        expiring_date: item.date,
        unit_price: item.price,
        mark_up: 0,
        selling_price: 0,
        transfer_from: "purchase order",
        status: item.status,
        transfer_to: item.type,
        branch_name: "branch_name",
        item_category: item.item_category,
      });
    });

    const data = {
      newArray,
      header: {
        poNo,
        status: _status,
        grn: unfinishe_grn,
      },
    };
    console.log(data);
    const callBack = () => {
      getAllPurchases();
      history.push("/me/new_inventory/grn");
      _customNotify("Submitted Successfully");
      updateGRN();
      updateGRNStatus();
      getGrn();
    };
    const error = () => {
      _warningNotify("Error Occurred");
    };

    _postApi(`${apiURL()}/account/add-new/store`, data, callBack, error);
  };

  const handleOnchange = (name, value, index) => {
    console.log(name, value, index);
    let arr = [];
    supplierItems.forEach((item, i) => {
      if (index === i) {
        arr.push({
          ...item,
          amount:
            item.type === "Local"
              ? item.price * value
              : item.price * item.exchange_rate * value,
          [name]: parseFloat(value),
          status:
            parseFloat(value) < parseFloat(item.propose_quantity)
              ? "unfinished purchase"
              : "finished purchase",
        });
      } else {
        arr.push(item);
      }
    });
    setSupplierItems(arr);
  };
  const handleOnchangeDate = (name, value, index) => {
    console.log(name, value, index);
    let arr = [];
    supplierItems.forEach((item, i) => {
      if (index === i) {
        arr.push({
          ...item,
          [name]: value,
        });
      } else {
        arr.push(item);
      }
    });
    setSupplierItems(arr);
  };
  const handleUnfinishedOnchangeDate = (name, value, index) => {
    console.log(name, value, index);
    let arr = [];
    unfinishedPurchaseList.forEach((item, i) => {
      if (index === i) {
        arr.push({
          ...item,
          [name]: value,
        });
      } else {
        arr.push(item);
      }
    });
    setUnfinishedPurchaseList(arr);
  };
  const handleUnfinishedChange = (name, value, index) => {
    let arr = [];
    unfinishedPurchaseList.forEach((item, i) => {
      if (index === i) {
        arr.push({
          ...item,
          [name]: value,
          status:
            item.quantity < value ? "unfinished purchase" : "finished purchase",
        });
      } else {
        arr.push(item);
      }
    });
    setUnfinishedPurchaseList(arr);
  };
  const getSupplier = (id) => {
    let status = "new order";
    _fetchApi(
      `${apiURL()}/get/supplier/${id}/${status}`,
      (data) => {
        const arr = [];
        // let uniq
        console.log(data, "ghjk");
        data.results.forEach((item) => {
          // let code = uuidv4()
          generate_item_code(item.item_name)
            .then((resp) => {
              arr.push({
                ...item,
                status: "finished purchase",
                renew: item.propose_quantity,
                amount:
                  item.type === "International"
                    ? parseFloat(item.price) *
                      parseFloat(item.propose_quantity) *
                      parseFloat(item.exchange_rate)
                    : parseFloat(item.price) *
                      parseFloat(item.propose_quantity),
                date: "",
                uniqueId: `${resp.item_code}/${item.item_id}`,
              });
            })
            .catch((err) => "");
        });
        //
        // if(arr.length){
        setSupplierItems(arr);
        console.log(arr);
        // };
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const getUnfinishedPurchase = (id) => {
    let status = "unfinished purchase";
    _fetchApi(
      `${apiURL()}/get/supplier/unfinished/${id}/${status}`,
      (data) => {
        let arr = [];
        data.results.forEach((item) => {
          generate_item_code(item.item_name);
          arr.push({ ...item, status: "finished purchase", uniqueId });
        });
        setUnfinishedPurchaseList(arr);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const location = useLocation();
  return (
    <div>
      {location.pathname === "/me/new_inventory/grn/preview" ? (
        <BackButton />
      ) : null}
      <Card>
        <CardHeader tag="h5" className="text-center">
          {/* {JSON.stringify(purchaseItems)} */}
          Goods Received Note
        </CardHeader>
        <CardBody>
          {location.pathname === "/me/new_inventory/grn" ? (
            <Row>
              <GRNTable
                purchaseItems={purchaseItems}
                getSupplier={getSupplier}
                handleSet={handleSet}
                setStatus={setStatus}
                getGrn={getGrn}
                setUnfinishe_grn={setUnfinishe_grn}
                getUnfinishedPurchase={getUnfinishedPurchase}
              />
            </Row>
          ) : (
            <>
            {/* {JSON.stringify(supplierItems)} */}
              <GRNReview
                poNo={poNo}
                vendor={vendor}
                client={client}
                date={date}
                grn={grn}
                status={status}
                supplierItems={supplierItems}
                unfinishe_grn={unfinishe_grn}
              />
              {status === "unfinished purchase" ? (
                <UnfinishedPurchaseTable
                  handleOnchangeDate={handleUnfinishedOnchangeDate}
                  unfinishedPurchaseList={unfinishedPurchaseList}
                  handleUnfinishedChange={handleUnfinishedChange}
                />
              ) : (
                <GRNReviewTable
                  handleOnchangeDate={handleOnchangeDate}
                  supplierItems={supplierItems}
                  handleOnchange={handleOnchange}
                />
              )}
            </>
          )}
        </CardBody>

        <CardFooter>
          {location.pathname === "/me/new_inventory/grn/preview" ? (
            <center>
              {unfinishe_grn.length ? (
                <Button
                  color="primary"
                  onClick={() => {
                    handleUpdate();
                  }}
                >
                  Received
                </Button>
              ) : (
                <Button
                  color="primary"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Received
                </Button>
              )}
            </center>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}

export default GRN;
