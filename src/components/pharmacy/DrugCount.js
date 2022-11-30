import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { formatNumber } from "../utils/helpers";
import {
  CustomButton,
  CustomTable,
  SelectInput,
  TextInput,
} from "../comp/components";
import CustomCard from "../comp/components/CustomCard";
import SearchBar from "../record/SearchBar";
import Loading from "../comp/components/Loading";
import { GET_PURCHASE_ITEM } from "../../redux/actions/actionTypes";
import Scrollbar from "../comp/components/Scrollbar";
import {
  getPurchaseItem,
  getDrugSearch,
  getTotalDrug,
  updateStock,
  getDrugList,
  getOutOfStock,
  getPharmStore,
  getSalesDrugs,
  searchDrugSale,
} from "../../redux/actions/pharmacy";
import { Col, Row, Table } from "reactstrap";
import DrugAlerts, { ReOderLevel } from "./drug/DrugAlerts";
import CustomPagination from "../comp/CustomPagination";
import PrintWrapper from "../comp/components/print/PrintWrapper";

function DrugCount() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [filterText, setFilterText] = useState("");
  const [reportType, setReportType] = useState("stock");
  const pharmStore = useSelector((state) => state.pharmacy.pharmStore);

  const options = pharmStore && pharmStore.map((item) => item.store_name);
  const { saleItems, drugList, outOfStock } = useSelector(
    (state) => state.pharmacy
  );
  // const loading = useSelector((state) => state.pharmacy.loading);
  const [loading, setLoading] = useState(false);
  const role = useSelector((state) => state.auth.user.role);
  const totalDrugs = useSelector((state) => state.pharmacy.totalDrugs);
  const [form, setForm] = useState({
    from: 0,
    to: 100,
    store_name: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemSearchRef = useRef();
  const onPageChanged = useCallback((event, page) => {
    event.preventDefault();
    setForm((p) => ({ from: (page - 1) * 100, to: page * 100 }));
    setCurrentPage(page);
  }, []);
  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value, query_type: "by_store" }));
  };
  const onEnableChange = (ind) => {
    const arr = [];
    saleItems.forEach((state, index) => {
      if (index === ind) {
        arr.push({ ...state, enable: true });
      } else {
        arr.push({ ...state, enable: false });
      }
    });
    dispatch({ type: GET_PURCHASE_ITEM, payload: arr });
  };
  const onCancelChange = (ind) => {
    const arr = [];
    saleItems.forEach((state, index) => {
      if (index === ind) {
        arr.push({ ...state, enable: false });
      } else {
        arr.push(state);
      }
    });
    dispatch({ type: GET_PURCHASE_ITEM, payload: arr });
  };
  useEffect(() => {
    dispatch(
      getPharmStore((d) =>
        setForm((p) => ({
          ...p,
          store_name: d[0].store_name,
        }))
      )
    );
  }, [dispatch, form.query_type]);

  const _getPharmStore = useCallback(() => {
    dispatch(getSalesDrugs(form.store_name, form.from, form.to));
  }, [dispatch, form.from, form.store_name, form.to]);

  const _getPurchaseItem = useCallback(() => {
    setLoading(true);

    dispatch(
      getPurchaseItem(form.from, form.to, form.store_name, () =>
        setLoading(false)
      ),
      form.query_type
    );
    dispatch(getTotalDrug());
  }, [dispatch, form.from, form.to, form.store_name]);

  useEffect(() => {
    console.log();
    // if (filterText.length > 0) {
    // dispatch(getDrugSearch(filterText, form.from, form.to));
    dispatch(
      searchDrugSale(form.store_name, form.from, form.to, filterText, () =>
        setLoading(false)
      )
    );
    dispatch(getTotalDrug(filterText));
    // }
  }, [filterText, form.from, form.to]);

  useEffect(() => {
    setLoading(true);
    dispatch(getDrugList());
    dispatch(getOutOfStock());
    // console.log('change', filterText, filterText.length, form.from, form.to)

    _getPharmStore();
    _getPurchaseItem();
    setLoading(false);
  }, [_getPurchaseItem, dispatch, reportType]);

  const fields = [
    {
      title: "Action",
      custom: true,
      component: (item, index) => {
        if (item.enable) {
          return (
            <>
              <CustomButton
                size="sm"
                onClick={() => {
                  onCancelChange(index);
                }}
                className="m-1"
                color="danger"
              >
                x
              </CustomButton>
              <CustomButton
                size="sm"
                onClick={() => {
                  updateStock(
                    {
                      item_code: item.item_code,
                      drug_name: item.drug_name,
                      expiry_date: item.expiry_date,
                      store: item.store,
                      selling_price: item.selling_price,
                      balance: item.balance,
                    },
                    () => {
                      onCancelChange(index);
                      alert("Updated Successfully");
                    },
                    () => {
                      alert("Error Occured");
                    }
                  );
                }}
                outline
              >
                Update
              </CustomButton>
            </>
          );
        } else {
          return (
            <CustomButton
              size="sm"
              onClick={() => {
                onEnableChange(index);
              }}
            >
              Edit
            </CustomButton>
          );
        }
      },
      className: "text-center no-print",
      headerClassName: "no-print",
    },
    {
      title: "S/N",
      custom: true,
      component: (item, index) => <div>{index + 1}</div>,
      className: "text-center print-only",
      headerClassName: "print-only",
    },
    {
      title: "GRN",
      value: "grn_no",
      custom: true,
      component: (item) => (
        <div
          style={{ cursor: "pointer", color: "royalblue" }}
          onClick={() =>
            history.push(
              `/me/pharmacy/drug-purchase/grn-view?grn_no=${item.grn_no}`
            )
          }
        >
          {item.grn_no}
        </div>
      ),
      // className: 'text-center print-only',
      // headerClassName: 'print-only',
    },
    {
      title: "Drug Name",
      value: "drug_name",
      custom: true,
      component: (item, index) => {
        if (item.enable) {
          return (
            <TextInput
              value={item.drug_name}
              className="text-right"
              name="drug_name"
              onChange={({ target: { name, value } }) => {
                const arr = [];
                saleItems.forEach((state, ind) => {
                  if (index === ind) {
                    arr.push({ ...state, [name]: value });
                  } else {
                    arr.push(state);
                  }
                });
                dispatch({ type: GET_PURCHASE_ITEM, payload: arr });
              }}
            />
          );
        } else {
          return item.drug_name;
        }
      },
    },
    {
      title: "Quantity",
      custom: true,
      component: (item, index) => {
        if (item.enable) {
          return (
            <TextInput
              value={item.balance}
              className="text-right"
              name="balance"
              onChange={({ target: { name, value } }) => {
                const arr = [];
                saleItems.forEach((state, ind) => {
                  if (index === ind) {
                    arr.push({ ...state, [name]: value });
                  } else {
                    arr.push(state);
                  }
                });
                dispatch({ type: GET_PURCHASE_ITEM, payload: arr });
              }}
            />
          );
        } else {
          return formatNumber(item.balance);
        }
      },
      className: "text-right",
    },
    {
      title: "Selling Price(₦)",
      custom: true,
      component: (item, index) => {
        if (item.enable) {
          return (
            <TextInput
              value={item.selling_price}
              className="text-right"
              name="selling_price"
              onChange={({ target: { name, value } }) => {
                const arr = [];
                saleItems.forEach((state, ind) => {
                  if (index === ind) {
                    arr.push({ ...state, [name]: value });
                  } else {
                    arr.push(state);
                  }
                });
                dispatch({ type: GET_PURCHASE_ITEM, payload: arr });
              }}
            />
          );
        } else {
          return formatNumber(item.selling_price);
        }
      },

      className: reportType === "price" ? "text-right" : "no-print",
      headerClassName: reportType === "price" ? "text-center" : "no-print",
    },

    // {
    //   title: "Amount",
    //   custom: true,
    //   component: (item) =>
    //     parseInt(item.selling_price) * parseInt(item.balance),
    // },
    {
      title: "Supplier Name",
      custom: true,
      value: "supplier_name",
      // className: "text-center",
    },
    {
      title: "Expiry Date",
      custom: true,
      component: (item) =>
        item.expiry_date === "1111-11-11" ? "-" : item.expiry_date,
      className: "text-center",
    },

    {
      title: "Excess",
      value: "excess",
      className: "print-only",
      headerClassName: "print-only",
    },
    {
      title: "Shortage",
      value: "shortage",
      className: "print-only",
      headerClassName: "print-only",
    },
    {
      title: "Action ",
      custom: true,
      component: (item) => (
        <CustomButton
          className="m-1"
          size="sm"
          onClick={() => {
            history.push(
              `/me/pharmacy/drug-purchase/drug-view?item_code=${item.item_code}&store=${item.store}&drug_name=${item.drug_name}&expiry_date=${item.expiry_date}`
            );
          }}
        >
          View
        </CustomButton>
      ),
      className: "text-center no-print",
      headerClassName: "no-print",
    },
  ];

  const printFunction = (value) => {
    setReportType(value);
    setTimeout(() => {
      if (reportType === "out_of_stock") {
        window.frames[
          "print_frame"
        ].document.body.innerHTML = document.getElementById(
          "print-count"
        ).innerHTML;
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();
      } else if (reportType === "priceList") {
        window.frames[
          "print_frame"
        ].document.body.innerHTML = document.getElementById(
          "print-count"
        ).innerHTML;
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();
      } else if (reportType === "stock") {
        window.frames[
          "print_frame"
        ].document.body.innerHTML = document.getElementById(
          "print-count"
        ).innerHTML;
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();
      }
    }, 500);
  };
  const data = reportType === "out_of_stock" ? outOfStock : drugList;
  const totalSelling = drugList.reduce(
    (a, b) => a + parseInt(b.selling_price),
    0
  );
  const totalCost = drugList.reduce((a, b) => a + parseInt(b.price), 0);
  const totalQuantity = drugList.reduce((a, b) => a + parseInt(b.balance), 0);
  const _priceList = reportType === "priceList";
  const _outOfStock = reportType === "out_of_stock";
  const _stock = reportType === "stock";
  return (
    <Row className="m-0">
      <Col md={2} className="px-1">
        <ReOderLevel />
      </Col>
      <Col className="px-1">
        <div>
          <CustomCard
            header="Drug Count"
            headerRight={
              <span className="d-flex">
                <b className="mr-2">
                  Total Count: {drugList && drugList.length}
                </b>
              </span>
            }
          >
            <div className="d-flex justify-content-between">
              <div>
                {/* {JSON.stringify(form.query_type)} */}
                <CustomButton
                  onClick={() =>
                    history.push("/me/pharmacy/drug-purchase/add-new-purchase")
                  }
                >
                  Add New Drug Count
                </CustomButton>
              </div>

              <div className="">
                <b className="mr-2">
                  Total Cost: {formatNumber(totalCost * totalQuantity)}
                </b>
                <b className="mr-2">
                  Total Selling Price:{" "}
                  {formatNumber(totalSelling * totalQuantity)}
                </b>
                <CustomButton
                  onClick={() => printFunction("stock")}
                  color="info"
                  className="mr-1"
                >
                  Print Stock List
                </CustomButton>
                <CustomButton
                  onClick={() => printFunction("priceList")}
                  color="success"
                  className="mr-1"
                >
                  Price List
                </CustomButton>
                <CustomButton
                  onClick={() => printFunction("out_of_stock")}
                  color="warning"
                >
                  Out of stock
                </CustomButton>
                {/* <CustomPagination
                  totalRecords={totalDrugs}
                  pageLimit={10}
                  pageNeighbours={7}
                  onPageChanged={onPageChanged}
                  currentPage={currentPage}
                /> */}
              </div>
            </div>
            <div className="mt-2 mb-2 d-flex">
              <SearchBar
                filterText={filterText}
                onFilterTextChange={(v) => {
                  setFilterText(v);
                }}
                _ref={itemSearchRef}
                placeholder="Search by drug name or expiry date"
              />
              <SelectInput
                placeholder="Select by Store"
                options={options}
                onChange={handleChange}
                value={form.store_name}
                name="store_name"
              />
            </div>
            <div style={{ height: "65vh", overflow: "scroll" }}>
              {loading && <Loading size="sm" />}
              <CustomTable
                size="sm"
                bordered
                fields={fields}
                data={saleItems}
              />

              <div id="print-count">
                <PrintWrapper title="Stock List" footer={false}>
                  <Table className="print-only">
                    <thead>
                      <tr>
                        <th>Drug Name</th>
                        <th>{_stock ? "Selling Price" : "Cost Price"}</th>
                        {_stock && (
                          <>
                            <th>Balance</th>
                            <th>Expired</th>
                            <th>Missing</th>
                            <th>Excess</th>
                            <th>Damage</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {data &&
                        data.map((item, index) => (
                          <tr key={index}>
                            <td>{item.drug_name}</td>
                            <td>{_stock ? item.selling_price : item.price}</td>
                            {_stock && (
                              <>
                                <td className="text-right">{item.balance}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </>
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </PrintWrapper>
              </div>
            </div>
          </CustomCard>
          <iframe
            title="print-count"
            name="print_frame"
            width="0"
            height="0"
            src="about:blank"
            // style={styles}
          />
        </div>
      </Col>
      <Col md={2} className="px-1">
        <DrugAlerts />
      </Col>
    </Row>
  );
}

export default DrugCount;
