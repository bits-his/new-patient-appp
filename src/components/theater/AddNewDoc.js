import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Col,
  Row,
  Label,
  Input,
  Button,
} from "reactstrap";
import { _postApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import { _customNotify, _warningNotify } from "../utils/helpers";
import SurgeonsListTable from "./SurgeonListTable";
import { MdAddCircleOutline, MdUpdate } from "react-icons/md";
import { useSelector } from "react-redux";
import CustomButton from "../comp/components/Button";
import { iconStyle } from "../utils/styles-helper";

export default function AddNewDoc() {
  const [name, setName] = useState("");
  const [type, setType] = useState("Surgeon");
  const [formType, setFormType] = useState("new");
  const [surgeonsList, setSurgeonsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newId, setNewId] = useState(0);

  const facId = useSelector((state) => state.facility.info.id);

  const handleReset = () => {
    setName("");
    setType("Surgeon");
  };
  const handleAdd = () => {
    if (name === "" || type === "") {
      _warningNotify("Uncompleted form");
    } else {
      _postApi(
        `${apiURL()}/operationnotes/surgeons/new`,
        { name, type },
        (data) => {
          if (data.success) {
            _customNotify(`${type} addedd successfully`);
            fetchSugeonsList();
            handleReset();
          }
        },
        (err) => {
          _warningNotify("An error occured");
        }
      );
    }
  };

  const fetchSugeonsList = () => {
    const id = null;
    const query_type = "select";
    _postApi(
      `${apiURL()}/operationnotes/surgeons/all/${id}/${facId}/${query_type}`,
      {},
      ({ results }) => {
        setSurgeonsList(results);
        // console.log(data.J)
      },
      (err) => console.log(err)
    );
  };
  useEffect(() => {
    fetchSugeonsList();
  }, []);

  const handleDelete = (id) => {
    const query_type = "delete";
    setLoading(true);
    _postApi(
      `${apiURL()}/operationnotes/surgeons/all/${id}/${facId}/${query_type}`,
      {},
      (data) => {
        // if (data.success) {
        _customNotify("Deleted successfully");
        setLoading(false);
        fetchSugeonsList();
        // }
      },
      (err) => {
        _warningNotify("error");
        console.log(err);
        setLoading(false);
      }
    );
  };
  const _updateSurgeon = () => {
    const query_type = "update";
    const id = newId;
    setLoading(true);
    _postApi(
      `${apiURL()}/operationnotes/surgeons/all/${id}/${facId}/${query_type}`,
      { name, type },
      (data) => {
        // if (data.success) {
        _customNotify("Data update successfully");
        fetchSugeonsList();
        handleReset();
        setLoading(false);
        // }
      },
      (err) => {
        _warningNotify("error");
        console.log(err);
        setLoading(false);
      }
    );
  };

  return (
    <>
      <Card>
        <CardHeader tag="h5" className="align-text-center">
          Add New Doctor To The Theater
        </CardHeader>

        <CardBody>
          <Form>
            <Row>
              {/* {JSON.stringify(facId)} */}
              <Col md={6}>
                {/* {JSON.stringify(surgeonsList)} */}
                <FormGroup>
                  <Label for="exampleSelect">Full Name</Label>
                  <Input
                    type="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="exampleSelect">Select</Label>
                  <Input
                    type="select"
                    name="type"
                    onChange={({ target }) => setType(target.value)}
                  >
                    <option value="Surgeon">Surgeon</option>
                    <option value="Anesthetists">Anesthetists</option>
                    <option value="Scrub Nurse">Scrub Nurse</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <center>
              {formType === "new" ? (
                <Button
                  color="primary"
                  className="pl-5 pr-5 m-2"
                  onClick={handleAdd}
                >
                  <MdAddCircleOutline /> Add{" "}
                </Button>
              ) : (
                <CustomButton
                  loading={loading}
                  onClick={_updateSurgeon}
                  className="pr-5 pl-5 m-2 btn-success"
                >
                  <MdUpdate style={iconStyle} size={16} />
                  Update
                </CustomButton>
              )}
            </center>
          </Form>
          <div>
            <SurgeonsListTable
              surgeonsList={surgeonsList}
              handleDelete={handleDelete}
              handleEdit={(name, type, newId, formType) => {
                setName(name);
                setType(type);
                setNewId(newId);
                setFormType(formType);
              }}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
}
