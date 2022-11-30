import React, { useEffect, useState } from "react";
import { FormGroup, Form, Input, Col, Label, Alert } from "reactstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import AutoComplete from "../comp/components/AutoComplete";
import InputGroup from "../comp/components/InputGroup";
import Button from "../comp/components/Button";
import { _fetchApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import { useSelector } from "react-redux";
import CustomButton from "../comp/components/Button";

// import { Typeahead } from 'react-bootstrap-typeahead';

function LabSetupForm(props) {
  // const headRef = useRef();
  // const subRef = useRef();
  const {
    logChange,
    handleSubmit,
    handleUpdate,
    handleTestChange,
    handleAddClick,
    error,
    saving,
    lab,
    headRef,
    subRef,
    isEdit,
    closeEditMode,
    labHeads,
    handleTestSelect,
    handleTestInputChange,
    testNameRef,
    handleSubDelete,
    itemsToDelete = [],
    // handleHeadChange = (f) => f,
  } = props;
  const [specimenList, setSpecimenList] = useState([]);
  const rawLabservices = useSelector((state) => state.lab.rawLabservices);

  const getSpecimenList = () => {
    _fetchApi(
      `${apiURL()}/lab/specimen/list`,
      (data) => {
        if (data.success) {
          setSpecimenList(data.results);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  // const getLabList = () => {
  //   _fetchApi(`${apiURL()}/lab/service/all`, data => {
  //     if(data.success){
  //       setLabList(data.results)
  //     }
  //   }, err => { console.log(err)})
  // }

  useEffect(() => {
    getSpecimenList();
  }, []);

  let norm = "mx-0 px-1";

  return (
    <>
      <div className="">
        <FormGroup row className="">
          <AutoComplete
            required
            label="Select Lab Group"
            name="head"
            options={labHeads}
            labelKey={(item) => `${item.subhead} - ${item.description}`}
            value={lab.subhead}
            onChange={(value) => {
              if (value.length) {
                logChange("head", value[0].subhead);
                logChange("account", value[0].account);
                // console.log(value[0].labSub)
              } else {
                logChange("head", "");
              }
            }}
            containerClass="col-md-4 col-lg-4"
            _ref={headRef}
          />

          <InputGroup
            required
            label="Lab SubHead Code"
            type="text"
            container="col-md-4 col-lg-4"
            name="subhead"
            onChange={({ target: { value } }) => logChange("subhead", value)}
            value={lab.subhead}
          />

          <InputGroup
            required
            label="Description"
            type="text"
            container="col-md-4 col-lg-4"
            name="description"
            onChange={({ target: { value } }) =>
              logChange("description", value)
            }
            value={lab.description}
          />

          {/* <AutoComplete
            label="Lab SubHead"
            required
            options={[]}
            name="labHead"
            value={lab.labHead}
            onChange={(value) => {
              if (value.length) {
                logChange('labHead', value[0]);
              }
            }}
            onInputChange={(value) => logChange('labHead', value)}
            containerClass="col-md-4 col-lg-4"
            _ref={subRef}
          /> */}
        </FormGroup>
        <FormGroup row className="">
          <AutoComplete
            label="Sample"
            options={specimenList}
            labelKey="specimen"
            name="specimen"
            value={lab.specimen}
            onChange={(value) => {
              if (value.length) {
                logChange("specimen", value[0].specimen);
              }
            }}
            onInputChange={(value) => logChange("specimen", value)}
            containerClass="col-md-4 col-lg-4"
            _ref={subRef}
          />

          <FormGroup className={"col-md-4 col-lg-4"}>
            <label className={"font-weight-bold"}>Barcode Type:</label>
            <div>
              <label className={"mr-3"}>
                <input
                  type={"radio"}
                  checked={lab.codeType === "group"}
                  onChange={() => logChange("codeType", "group")}
                  className={"mr-1"}
                />
                Group Barcode
              </label>
              <label className={"mr-3"}>
                <input
                  type={"radio"}
                  checked={lab.codeType === "individual"}
                  onChange={() => logChange("codeType", "individual")}
                  className={"mr-1"}
                />
                Individual Barcode
              </label>
            </div>
          </FormGroup>

          <InputGroup
            label={"No. of Barcodes"}
            container={"col-md-4 col-lg-4"}
            name={"noOfLabels"}
            // value={noOfLabels}
            onChange={(e) => logChange("noOfLabels", e.target.value)}
            value={lab.noOfLabels}
          />

          <FormGroup className={"col-md-4 col-lg-4"}>
            <label className={"font-weight-bold"}>Doctor's Percentage:</label>
            <div>
              <label className={"mr-3"}>
                <input
                  type={"radio"}
                  checked={lab.percentageType === "group"}
                  onChange={() => logChange("percentageType", "group")}
                  className={"mr-1"}
                />
                Group Percentage
              </label>
              <label className={"mr-3"}>
                <input
                  type={"radio"}
                  checked={lab.percentageType === "individual"}
                  onChange={() => logChange("percentageType", "individual")}
                  className={"mr-1"}
                />
                Individual Test Percentage
              </label>
            </div>
          </FormGroup>

          <InputGroup
            label={"Percentage Value"}
            container={"col-md-4 col-lg-4"}
            name={"percentage"}
            onChange={(e) => logChange("percentage", e.target.value)}
            value={lab.percentage}
          />

          <InputGroup
            label={"Select Account"}
            editable={false}
            container={"col-md-4 col-lg-4"}
            name={"account"}
            onChange={(e) => logChange("account", e.target.value)}
            value={lab.account}
          />
        </FormGroup>

        <h6 className="font-weight-bold">Add Tests for this lab</h6>

        <Form className="m-0 p-0">
          {/* <Table bordered striped hover>
            <thead>
              <tr>
                <th className='text-center'>Test</th>
                <th className='text-center'>Unit</th>
                <th className='text-center' colSpan={2}>Range</th>
                <th className='text-center'>Price</th>
              </tr>
            </thead>
            <tbody>
              {lab &&
                lab.tests &&
                lab.tests.map((item, index) => (
              <tr>
                <td>
                <AutoComplete 
                  name="test_name"
                  value={item.test_name}
                  onChange={(e) =>
                    handleTestChange('test_name', e.target.value, index)
                  }
                />
                </td>
                <td>
                <InputGroup
                  name="test_unit"
                  value={item.test_unit}
                  container=""
                  onChange={(e) =>
                    handleTestChange('test_unit', e.target.value, index)
                  }
                />
                </td>
                <td>
                  <Input
                    name="range_from"
                    value={item.range_from}
                    placeholder="From"
                    onChange={(e) =>
                      handleTestChange('range_from', e.target.value, index)
                    }
                  />
                </td>
                <td>
                  <Input
                    name="range_to"
                    value={item.range_to}
                    placeholder="To"
                    onChange={(e) =>
                      handleTestChange('range_to', e.target.value, index)
                    }
                  />
                </td>
                <td>
                  <Input
                    // className="mt-2"
                    name="price"
                    value={item.price}
                    placeholder=""
                    onChange={(e) =>
                      handleTestChange('price', e.target.value, index)
                    }
                  />
                </td>
              </tr>
               ))}
            </tbody>
          </Table> */}

          <div>
            <Label className={`col-3 font-weight-bold ${norm}`}>Test</Label>
            <Label className={`col-2 font-weight-bold ${norm}`}>Unit</Label>
            <Label className={`font-weight-bold col-4 ${norm}`}>Range</Label>
            <Label className={`col-2 font-weight-bold ${norm}`}>Price</Label>
          </div>

          {lab &&
            lab.tests &&
            lab.tests
              .sort((a, b) => a.sort_index - b.sort_index)
              .map((item, index) => {
                let itemFilled =
                  item.test_name !== "" ||
                  item.unit !== "" ||
                  item.range_from !== "" ||
                  item.range_to ||
                  item.price !== "";

                return (
                  <FormGroup row className={`my-0 ${norm}`} key={index}>
                    {/* <InputGroup
                  name="test_name"
                  value={item.test_name}
                  onChange={(e) =>
                    handleTestChange('test_name', e.target.value, index)
                  }
                /> */}
                    {/* {JSON.stringify(item)} */}
                    {isEdit ? (
                      <Input
                        name="test_name"
                        value={item.test_name}
                        onChange={(e) =>
                          handleTestInputChange(e.target.value, index)
                        }
                        className={`col-3 ${norm}`}
                      />
                    ) : (
                      <AutoComplete
                        name="test_name"
                        value={item.test_name}
                        options={rawLabservices}
                        labelKey="description"
                        onChange={(val) => {
                          if (val.length) {
                            // handleTestChange('test_name', e.target.value, index)
                            handleTestSelect(val[0], index);
                          }
                        }}
                        onInputChange={(text) =>
                          handleTestInputChange(text, index)
                        }
                        _ref={testNameRef}
                        containerClass={`col-3 ${norm}`}
                      />
                    )}

                    <InputGroup
                      name="unit"
                      value={item.unit}
                      container={`col-2 ${norm}`}
                      onChange={(e) =>
                        handleTestChange("unit", e.target.value, index)
                      }
                    />
                    <Col md="2" className={norm}>
                      <Input
                        name="range_from"
                        value={item.range_from}
                        placeholder="From"
                        onChange={(e) =>
                          handleTestChange("range_from", e.target.value, index)
                        }
                      />
                    </Col>
                    <Col md="2" className={norm}>
                      <Input
                        name="range_to"
                        value={item.range_to}
                        placeholder="To"
                        onChange={(e) =>
                          handleTestChange("range_to", e.target.value, index)
                        }
                      />
                    </Col>
                    <Col md="2" className={norm}>
                      <Input
                        // className="mt-2"
                        name="price"
                        value={item.price}
                        placeholder=""
                        onChange={(e) =>
                          handleTestChange("price", e.target.value, index)
                        }
                      />
                    </Col>
                    <Col className={norm}>
                      {itemFilled ? (
                        <CustomButton
                          size="sm"
                          color="danger"
                          onClick={() => handleSubDelete(item)}
                        >
                          <FaTrash />
                        </CustomButton>
                      ) : null}
                    </Col>
                  </FormGroup>
                );
              })}
          <div className="d-flex flex-row justify-content-end mr-3">
            <button
              className="btn btn-outline-secondary"
              onClick={handleAddClick}
            >
              <FaPlus className="mr-1" />
              Add more
            </button>
          </div>
        </Form>

        <div className="" style={{ textAlign: "center" }}>
          <div>
            {error !== "" ? (
              <div style={{ color: "red" }}>
                <center>{error}</center>
              </div>
            ) : null}
          </div>

          {itemsToDelete.length ? (
            <center>
              <Alert className="my-1 w-50" color="warning">
                Click "Update" button to submit changes made.
              </Alert>
            </center>
          ) : null}

          <br />
          <Button
            loading={saving}
            onClick={isEdit ? handleUpdate : handleSubmit}
          >
            {isEdit ? (
              <>
                <FaEdit size={20} className="mr-1" /> Update
              </>
            ) : (
              <>
                <MdSend size={20} className="mr-1" />
                Submit
              </>
            )}
          </Button>
          {isEdit && (
            <button
              className="btn btn-outline-secondary ml-1"
              onClick={closeEditMode}
            >
              New Lab Service
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default LabSetupForm;
