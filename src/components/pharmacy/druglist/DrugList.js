import React, { useCallback, useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import {
  Card,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { drugList, getAllDrugs } from "../../../redux/actions/pharmacy";
import { CustomButton, CustomTable, TextInput } from "../../comp/components";
import SearchBar from "../../record/SearchBar";
import { _customNotify, _warningNotify } from "../../utils/helpers";

export default function DrugList() {
  const [drugs, setDrugs] = useState([]);
  const _form = { drug_name: "", generic_name: "" };
  const [form, setForm] = useState(_form);
  const [filterText, setFilterText] = useState("");

  const rows = [];
  drugs &&
    drugs.forEach((item) => {
      if (item.drug_name.toLowerCase().indexOf(filterText.toLowerCase()) === -1)
        return;

      rows.push(item);
      // }
    });

  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value }));
  };
  const dispatch = useDispatch();
  const _getDrugs = useCallback(() => {
    dispatch(getAllDrugs(setDrugs));
  }, [dispatch]);

  useEffect(() => {
    _getDrugs();
  }, [_getDrugs]);

  const onEnableChange = (ind) => {
    const arr = [];
    drugs.forEach((state, index) => {
      if (index === ind) {
        arr.push({ ...state, enable: true });
      } else {
        arr.push({ ...state, enable: false });
      }
    });
    setDrugs(arr);
  };
  const onCancelChange = (ind) => {
    const arr = [];
    drugs.forEach((state, index) => {
      if (index === ind) {
        arr.push({ ...state, enable: false });
      } else {
        arr.push(state);
      }
    });
    setDrugs(arr);
  };

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
                  drugList(
                    {
                      drug_name: item.drug_name,
                      generic_name: item.generic_name,
                      id: item.id,
                      query_type: "update",
                    },
                    () => {
                      onCancelChange(index);
                      _getDrugs();
                      _customNotify("Updated Successfully");
                    },
                    () => {
                      _warningNotify("Error Occured");
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
            <>
              <CustomButton
                size="sm"
                className="mr-1"
                onClick={() => {
                  onEnableChange(index);
                }}
              >
                Edit
              </CustomButton>
              <CustomButton
                size="sm"
                color="danger"
                onClick={() => {
                  drugList(
                    {
                      id: item.id,
                      query_type: "delete",
                    },
                    () => {
                      onCancelChange(index);
                      _getDrugs();
                      _customNotify("Deleted Successfully");
                    },
                    () => {
                      _warningNotify("Error Occured");
                    }
                  );
                }}
              >
                <AiFillDelete />
              </CustomButton>
            </>
          );
        }
      },
    },
    {
      title: "S/N",
      custom: true,
      component: (d, i) => <div>{i + 1}</div>,
    },
    {
      title: "Drug Name",
      value: "name",
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
                drugs.forEach((state, ind) => {
                  if (index === ind) {
                    arr.push({ ...state, [name]: value });
                  } else {
                    arr.push(state);
                  }
                });
                setDrugs(arr);
              }}
            />
          );
        } else {
          return item.drug_name;
        }
      },
    },
    {
      title: "Generic name",
      custom: true,
      component: (item, index) => {
        if (item.enable) {
          return (
            <TextInput
              value={item.generic_name}
              name="generic_name"
              onChange={({ target: { name, value } }) => {
                const arr = [];
                drugs.forEach((state, ind) => {
                  if (index === ind) {
                    arr.push({ ...state, [name]: value });
                  } else {
                    arr.push(state);
                  }
                });
                setDrugs(arr);
              }}
            />
          );
        } else {
          return item.generic_name;
        }
      },
    },
  ];

  const handleSubmit = () => {
    drugList(
      {
        drug_name: form.drug_name,
        generic_name: form.generic_name,
        query_type: "insert",
      },
      () => {
        _getDrugs();
        _customNotify("Submited Successfully");
        setForm(_form);
      },
      () => {
        _warningNotify("Error Occured");
      }
    );
  };

  return (
    <div>
      <Card className="m-3 shodow">
        <CardHeader>Drug List</CardHeader>
        <Row className="m-0 p-0">
          <Col>
            <Scrollbars style={{ height: "70vh" }}>
              <SearchBar
                placeholder="Search by drug name"
                onFilterTextChange={(filterText) => setFilterText(filterText)}
                filterText={filterText}
                container="mt-2"
              />
              <CustomTable size="sm" bordered fields={fields} data={rows} />
            </Scrollbars>
          </Col>
          <Col>
            <Card className="m-5 p-2">
              <center>
                <h5>Add New Drug Name</h5>
              </center>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Drug Name</Label>
                  <Input
                    name="drug_name"
                    value={form.drug_name}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Generic Name</Label>
                  <Input
                    name="generic_name"
                    value={form.generic_name}
                    onChange={handleChange}
                  />
                </FormGroup>
                <center>
                  <CustomButton onClick={handleSubmit} className="px-5">
                    Submit
                  </CustomButton>
                </center>
              </Form>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
