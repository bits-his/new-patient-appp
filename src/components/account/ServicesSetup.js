import React, { useEffect, useRef, useState } from "react";
import { Card, CardBody, CardHeader, Table, Row, Col } from "reactstrap";
// import { connect } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
// import { FaEdit } from "react-icons/fa";
import {
  url,
  _customNotify,
  _warningNotify,
  _postData,
} from "../utils/helpers";
// import { TiEdit } from "react-icons/ti";
// import SearchBar from "../record/SearchBar";
// import { Scrollbars } from "react-custom-scrollbars";
// import Loading, { LoadingSM } from "../loading";
import { getRevAccHeads } from "../../redux/actions/transactions";
// import { AiTwotoneDelete } from "react-icons/ai";
import { deleteService } from "../../redux/actions/services";
import { _updateApi, _fetchApi, _postApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import CustomButton from "../comp/components/Button";
import { useDispatch, useSelector } from "react-redux";
import GroupingService from "./GroupingService";

export default function ServicesSetup() {
  const revAccHeads = useSelector((state) => state.transactions.revAccHeads);
  const deleteLoading = useSelector((state) => state.services.deletingService);
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  const [state, setState] = useState({
    serviceForm: { price: "0", description: "", title: "", subhead: "" },
    loading: false,
    services: [],
    listLoading: false,
    modal: false,
    updateStatus: false,
    filterText: "",
    formErrorAlert: "",
    edit: false,
    list: [],
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const _accHead = useRef(null);

  const [form, setForm] = useState({
    description: "",
    service_name: "",
    facilityId,
    query_type: "insert",
    quantity: 1,
  });
  const [listData, setListData] = useState([]);
  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value }));
  };
  const handleDelete = (idx) => {
    let newArr = listData.filter((it, id) => id !== idx);
    setListData(newArr);
  };
  const handleAdd = (e) => {
    e.preventDefault();
    setListData((p) => [...p, form]);
    setForm((p) => ({ ...p, service_name: "" }));
  };
  // const handleServiceDelete = (serviceId) => {
  //   setState((p) => ({ ...p, formErrorAlert: "" }));
  //   deleteService(serviceId);
  //   resetForm();
  //   getServicesList();
  // };

  const handleSubmitGroup = () => {
    setLoading(true);
    _postApi(
      `${url}/group-services/new`,
      listData,
      (res) => {
        console.log(res);
        _customNotify("Grouped Successfully");
        setListData([]);
        toggle();
      },
      (err) => {
        console.log(err);
        setLoading(false);
      }
    );
    setLoading(false);
  };
  const getServicesList = () => {
    setState((p) => ({ ...p, listLoading: true }));
    let cachedServicesList = JSON.parse(localStorage.getItem("services")) || [];
    setState((p) => ({
      ...p,
      services: cachedServicesList,
      listLoading: false,
    }));
    _fetchApi(
      `${url}/services/all`,
      ({ results }) => {
        if (results.length) {
          localStorage.setItem("services", JSON.stringify(results));
          setState((p) => ({ ...p, services: results, listLoading: false }));
        }
      },
      (err) => {
        console.log(err);
        _warningNotify(err.toString());
        setState((p) => ({ ...p, listLoading: false }));
      }
    );
  };

  useEffect(() => {
    getServicesList();
    dispatch(getRevAccHeads((d) => setState((p) => ({ ...p, list: d }))));
  }, []);

  const handleInputChange = ({ target: { value } }) => {
    setState((p) => ({
      ...p,
      formErrorAlert: "",
      serviceForm: {
        ...p.serviceForm,
        price: value,
      },
    }));
  };

  const handleFormSubmit = () => {
    const { serviceForm } = state;
    let newArr = [];
    state.list.forEach((it, id) => {
      newArr.push({ ...it, edit: false });
    });

    if (Object.keys(serviceForm).length) {
      if (
        serviceForm.title !== "" &&
        // &&serviceForm.cost!=='0'
        serviceForm.price !== ""
      ) {
        setState((p) => ({ ...p, loading: true, list: newArr }));
        let data = {
          // title: serviceForm.title,
          // description: serviceForm.description,
          cost: serviceForm.price,
          // service_id: serviceForm.service_id,
          acc: serviceForm.title,
        };
        if (data.price === "") data.price = 0;

        _updateApi(
          `${apiURL()}/account/chart/set-price`,
          data,
          (resp) => {
            setState((p) => ({ ...p, loading: false }));
            _customNotify("Update Success");
            dispatch(
              getRevAccHeads((d) => setState((p) => ({ ...p, list: d })))
            );
            resetForm();
            // }
          },
          (err) => {
            console.log(err);
            setState((p) => ({ ...p, loading: false }));
            // _warningNotify("An error occured!");
          }
        );
      } else {
        setState((p) => ({ ...p, formErrorAlert: "Please complete the form" }));
      }
    } else {
      setState((p) => ({ ...p, formErrorAlert: "Please complete the form" }));
    }
  };

  const handleServiceEdit = (service, idx) => {
    let newArr = [];
    state.list.forEach((it, id) => {
      if (it.title === service.title && id === idx) {
        newArr.push({ ...it, edit: true });
      } else {
        newArr.push({ ...it, edit: false });
      }
    });
    setState((p) => ({
      ...p,
      list: newArr,
      serviceForm: service,
    }));
    // console.log(service)
  };

  const toggle = () => {
    setState((p) => ({
      ...p,
      modal: !p.modal,
    }));
  };

  const resetForm = (e) => {
    e.preventDefault();
    setState((p) => ({
      ...p,
      serviceForm: {},
      modal: false,
      updateStatus: false,
    }));
    _accHead.clear();
  };

  return (
    <div className="">
      <Card>
        <CardHeader className="d-flex justify-content-between">
          <h5>Service Setup Form</h5>
          <CustomButton onClick={toggle}>
            + Create New Group Services
          </CustomButton>
        </CardHeader>
        <GroupingService
          modal={state.modal}
          toggle={toggle}
          data={state.list}
          form={form}
          listData={listData}
          handleAdd={handleAdd}
          handleChange={handleChange}
          setForm={setForm}
          handleDelete={handleDelete}
          handleSubmitGroup={handleSubmitGroup}
          loading={loading}
        />
        <CardBody>
          <Row>
            <Col>
              <h6>Revenue Chart</h6>
              {/* {JSON.stringify(form)} */}

              <Table size="sm">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Service</th>
                    <th>Price (₦)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.list.map((item, key) => (
                    <tr key={key}>
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                      <td>
                        {!item.edit ? (
                          item.price
                        ) : (
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <input
                              className="form-control"
                              name="price"
                              value={state.serviceForm.price}
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                      </td>
                      <td>
                        <CustomButton
                          color={!item.edit ? "success" : "warning"}
                          size="sm"
                          loading={state.loading}
                          onClick={() => {
                            return !item.edit
                              ? handleServiceEdit(item, key)
                              : handleFormSubmit();
                          }}
                        >
                          {!item.edit ? "Edit" : "Update"}
                        </CustomButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
}
