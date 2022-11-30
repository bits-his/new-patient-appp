/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Row,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import BasicInfo from "./BasicInfo";
import moment from "moment";
import BackButton from "../../comp/components/BackButton";
import Scrollbars from "react-custom-scrollbars";
import SearchLab from "../components/SearchLab";
import AutoComplete from "../../comp/components/AutoComplete";
import { _fetchApi } from "../../../redux/actions/api";
import { apiURL } from "../../../redux/actions";
// import * as zebraPrinter from 'zebra-printer'

export default function PatientRegistration({
  accounts,
  walkinAcc = [],
  patientInfo = {},
  handleChange = (f) => f,
  labList = [],
  handleTestAdd = (f) => f,
  selectedLabs = [],
  handleAddBatchTest = (f) => f,
  handleAccChange = (f) => f,
  setRegType = (f) => f,
  existingPatientId = null,
  handleLabSelected = (f) => f,
  handleHistoryChange,
}) {
  const [labType, setLabType] = useState("");
  const [formType, setFormType] = useState("normal");
  const [labInView, setLabInView] = useState([]);
  const [expandView, setExpandView] = useState({ header: "", tests: [] });
  const [image, setImages] = useState([]);

  const [specimenList, setSpecimenList] = useState([]);

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

  const handleLabType = (name, children) => {
    setLabType(name);
    setLabInView(children);
    setExpandView({ header: "", tests: [] });
  };
  // const handleRegType = (val) => {
  //   setFormType(val);
  // };

  useEffect(
    () => {
      if (labList[0] && labList[0].children && labList[0].children.length) {
        setLabType(labList[0].children[0].title);
        setLabInView(labList[0].children[0].children);
      }
      // else {
      //   setLabType('');
      //   setLabInView([]);
      // }
      getSpecimenList();

      // let printers = zebraPrinter.getPrinters()
      // console.log(printers)
    },
    [labList]
  );

  return (
    <>
      <BackButton />
      <Card>
        <CardHeader className="d-flex justify-content-between" tag="h6">
          <div>
            <span className="mr-1">Date:</span>
            {moment().format("YYYY-MM-DD")}
          </div>
          <div>
            <span className="mr-1">Booking No:</span>
            {/* {patientInfo.booking.split('-').join('')} */}
            {patientInfo.booking}
          </div>
        </CardHeader>

        <CardBody>
          {formType === "normal" ? null : (
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="search">Search</Label>
                  <Input
                    type="text"
                    name="search"
                    placeholder="Searching ....."
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup classNam="">
                  <Label for="search">Balance .....</Label>
                  <Input type="text" name="search" />
                </FormGroup>
              </Col>
            </Row>
          )}
          <BasicInfo
            existingPatientId={existingPatientId}
            patientInfo={patientInfo}
            handleChange={handleChange}
            accounts={accounts}
            walkinAcc={walkinAcc}
            handleAccChange={handleAccChange}
            setRegType={setRegType}
            setImages={setImages}
            handleHistoryChange={handleHistoryChange}
            historyMode="write"
          />
          {/* {JSON.stringify(selectedLabs)} */}

          <div className="border border-dark mt-3 ">
            <CardHeader className="d-flex justify-content-between">
              {labList[0] &&
                labList[0].children &&
                labList[0].children.map((i) => (
                  <FormGroup check className="mr-2">
                    <Label check>
                      <Input
                        type="radio"
                        // name="MicroBiology"
                        checked={labType === i.title}
                        value={i.title}
                        onChange={() => handleLabType(i.title, i.children)}
                      />
                      {i.description}
                    </Label>
                  </FormGroup>
                ))}
            </CardHeader>
            <div className="row m-1">
              <SearchLab
                inputClass="col-md-8 col-lg-8"
                selectedUnit={labType}
                handleResult={handleLabSelected}
              />

              <AutoComplete
                // label="Sample"
                options={specimenList}
                labelKey="specimen"
                name="specimen"
                placeholder="Select Sample"
                // value={lab.specimen}
                onChange={(value) => {
                  if (value.length) {
                    // logChange('specimen', value[0].specimen);
                  }
                }}
                // onInputChange={(value) => logChange('specimen', value)}
                containerClass="col-md-4 col-lg-4"
                // _ref={subRef}
              />
            </div>
            <Scrollbars style={{ height: 450 }}>
              <CardBody className="">
                {/* <ContinueReg reg={reg} /> */}
                {/* {JSON.stringify(labInView)} */}
                <Row className="m-0">
                  <Col md={expandView.tests.length ? 6 : 12}>
                    {labInView.map((test, i) => (
                      <FormGroup key={i}>
                        <Label className="">
                          <Input
                            type="checkbox"
                            // checked={test.title === item.name}
                            checked={
                              test.children.length
                                ? selectedLabs.filter(
                                    (j) => j.group === test.title
                                  ).length === test.children.length
                                : selectedLabs.findIndex(
                                    (i) => i.test === test.title
                                  ) !== -1
                              //
                            }
                            onChange={() => {
                              if (test.children.length) {
                                // console.log('expand');
                                setExpandView({
                                  header: test.title,
                                  description: test.description,
                                  tests: test.children,
                                });
                                handleAddBatchTest(
                                  test.children,
                                  labType,
                                  test.title,
                                  test
                                );
                              } else {
                                handleTestAdd(test, labType, "");
                                setExpandView({ header: "", tests: [] });
                              }
                            }}
                          />
                          {test.description}
                        </Label>
                      </FormGroup>
                    ))}
                  </Col>
                  {expandView.tests.length ? (
                    <Col md={6}>
                      <h6 className="text-center">{expandView.description}</h6>
                      <Row>
                        {expandView.tests.map((test, i) => (
                          <FormGroup key={i} className="col-md-6">
                            <Label className="">
                              <Input
                                type="checkbox"
                                checked={
                                  selectedLabs.findIndex(
                                    (i) => i.test === test.title
                                  ) !== -1
                                }
                                onChange={() =>
                                  handleTestAdd(
                                    test,
                                    labType,
                                    expandView.header
                                  )
                                }
                              />
                              {test.description}
                            </Label>
                          </FormGroup>
                        ))}
                      </Row>
                    </Col>
                  ) : null}
                </Row>
              </CardBody>
            </Scrollbars>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
