import React from "react";
import { Table, Button, Card, CardHeader, CardBody } from "reactstrap";
import Scrollbars from "react-custom-scrollbars";
import { useState } from "react";
import DrugDispensary from "./DrugDispensary";
import { useEffect } from "react";
import { _fetchApi, _updateApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaPrint, FaWindowClose } from "react-icons/fa";
import { PDFViewer } from "@react-pdf/renderer";
import { DispensaryInventoryPDF } from "./DispensaryInventoryPDF";
import { _customNotify } from "../utils/helpers";
import CustomButton from "../comp/components/Button";
import { FormGroup } from "reactstrap";
import Badge from "reactstrap/lib/Badge";
import { Route, useHistory, useLocation } from "react-router";
import { getAllBranchRequest } from "../../redux/actions/account";
import SearchBar from "../record/SearchBar";

function ItemsList() {
  const [updating, setUpdating] = useState(false);
  const [list, setList] = useState([]);
  const [tableEdited, setTableEdited] = useState(false);
  const [, setTotal] = useState("");
  const pharmHasStore = useSelector((state) => state.pharmacy.pharmHasStore);
  const [preview, setPreview] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [getAllBranch, setGetAllBranch] = useState([]);
  const branch = useSelector((state) => state.auth.user.branch_name);

  const handlePreview = () => {
    setPreview((d) => !d);
  };

  const history = useHistory();
  const location = useLocation();
  const getDispensaryRecords = () => {
    _fetchApi(`${apiURL()}/account/get/all/store-list`, (data) => {
      setList(data.results);
    });
  };

  // const getDispensaryWithoutStore = () => {
  //   _fetchApi(`${apiURL()}/drugs/dispensary/only/balance`, (data) => {
  //     setList(data.results);
  //   });
  // };

  const getDispensaryWithoutStore = () => {
    _fetchApi(`${apiURL()}/account/drug-count-without-store`, (data) => {
      setTotal(data.results.total);
      // setList(data.results.data);
      if (data && data.results) {
        let _list = [];
        let _data = data.results.data;
        _data.forEach((item) => _list.push({ ...item, editing: false }));
        setList(_list);
      }
    });
  };
  const allBranchReq = useSelector((state) => state.account.allBranchReq);
  const dispatch = useDispatch();

  useEffect(() => {
    if (pharmHasStore) {
      getDispensaryRecords();
      _getAllBranch();
    } else {
      getDispensaryWithoutStore();
    }
    dispatch(getAllBranchRequest());
  }, []);

  const handleInputChange = (item, key, value) => {
    setTableEdited(true);

    let _newList = [];
    list.forEach((i) => {
      if (
        i.drug === item.drug &&
        i.price === item.price &&
        i.expiry_date === item.expiry_date
      ) {
        _newList.push({ ...i, [key]: value });
      } else {
        _newList.push(i);
      }
    });

    setList(_newList);
  };

  const resetPage = () => {
    // setModifiedRows([]);
    setTableEdited(false);
  };
  const _getAllBranch = () => {
    _fetchApi(
      `${apiURL()}/account/get-all/branches`,
      (data) => {
        if (data.success) {
          setGetAllBranch(data.results);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const saveUpdate = () => {
    setUpdating(true);
    const success = () => {
      _customNotify("Updated Saved");
      setTableEdited(false);
      if (pharmHasStore) {
        getDispensaryRecords();
      } else {
        getDispensaryWithoutStore();
      }
      resetPage();
    };

    for (let id = 0; id < list.length; id++) {
      // console.log(data.code)
      // if (list[id].quantityReturned > 0) {
      console.log(list[id]);
      _updateApi(`${apiURL()}/drugs/shelf/update/quantity-price`, list[id]);
      // }
      if (id === list.length - 1) {
        success();

        setUpdating(false);
      }
    }
  };
  const rows = [];
  getAllBranch.length &&
    getAllBranch.forEach((purchase, i) => {
      if (
        purchase.branch_name
          .toString()
          .toLowerCase()
          .indexOf(searchTerm.toLowerCase()) === -1 &&
        purchase.state
          .toString()
          .toLowerCase()
          .indexOf(searchTerm.toLowerCase()) === -1
        // &&
        // purchase.receive_date
        // .toString()
        // .toLowerCase()
        // .indexOf(searchTerm.toLowerCase()) === -1
      ) {
        return;
      }
      let newFF = allBranchReq.filter(
        (item) => item.branch_name === purchase.branch_name
      );
      // newFF.filter(item => item.branch_name === purchase.branch_name)
      //  allBranchReq.forEach(item => {
      //    if(item.branch_name === purchase.branch_name){
      //      newFF.push(item)
      //    }
      //  })

      rows.push(
        <tr
          className={newFF.length ? "bg-warning" : ""}
          key={i}
          style={{ cursor: "pointer" }}
          onClick={() => {
            history.push(
              `/me/new_inventory/goods_transfer_form/form?branch=${
                purchase.branch_name
              }`
            );
            // setItems(purchase);
          }}
        >
          <td>{purchase.branch_name}</td>
          <td className="text-right">{purchase.state}</td>
          <td className="text-center">
            {purchase.editing ? (
              <input
                className="form-control form-control-sm text-center"
                style={{ width: 100 }}
                type="number"
                name="quantity_in_shelf"
                value={purchase.balance}
                onChange={(e) =>
                  handleInputChange(
                    purchase,
                    "quantity_in_shelf",
                    e.target.value
                  )
                }
              />
            ) : null}
            {purchase.address}{" "}
            {newFF.length ? (
              <Badge className="ml-2" color="dark">
                {newFF.length}
              </Badge>
            ) : null}
          </td>
        </tr>
      );
    });
  const goBack = () => history.push("/me/new_inventory/goods_transfer_form");
  return (
    <div>
      <Route path="/me/new_inventory/goods_transfer_form/form">
        <DrugDispensary back={goBack} />
      </Route>
      {location.pathname === "/me/new_inventory/goods_transfer_form" ? (
        <>
          <div className="d-flex justify-content-between" />
          <Card>
            <CardHeader>
              <h5 align="center"> Goods Transfer Form</h5>
            </CardHeader>

            <CardBody>
              <div className="d-flex flex-row-reverse">
                {preview ? (
                  <center>
                    <CustomButton
                      loading={updating}
                      size="sm"
                      color={tableEdited ? "warning" : "primary"}
                      className="pl-5 pr-5 mb-1"
                      onClick={tableEdited ? saveUpdate : handlePreview}
                    >
                      {tableEdited ? (
                        <>
                          <FaEdit size="16" className="mr-1" /> Save
                        </>
                      ) : (
                        <>
                          <FaPrint size="16" className="mr-1" /> Print
                        </>
                      )}
                    </CustomButton>
                  </center>
                ) : (
                  <>
                    <div>
                      <Button
                        color="danger"
                        className="p-3 float-right mb-3"
                        onClick={handlePreview}
                      >
                        <FaWindowClose size="20" /> Close
                      </Button>
                    </div>
                    <center>
                      <PDFViewer height="900" width="600">
                        <DispensaryInventoryPDF list={list} branch={branch} />
                      </PDFViewer>
                    </center>
                  </>
                )}
              </div>
              {preview ? (
                <>
                  <FormGroup className="m-3">
                    <SearchBar
                      filterText={searchTerm}
                      onFilterTextChange={(value) => setSearchTerm(value)}
                      placeholder="Search lab by name"
                    />
                  </FormGroup>
                  <Scrollbars style={{ height: 400 }}>
                    <Table bordered size="sm">
                      <thead>
                        <tr>
                          <th>Lab Name</th>
                          <th className="text-center">State </th>
                          <th className="text-center">Address</th>
                        </tr>
                      </thead>
                      <tbody>{rows}</tbody>
                    </Table>
                  </Scrollbars>
                </>
              ) : null}
            </CardBody>
          </Card>
        </>
      ) : null}
    </div>
  );
}

export default ItemsList;
