/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
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
import moment from "moment";
import { _fetchApi } from "../../../redux/actions/api";
import { apiURL } from "../../../redux/actions";

// import { FallbackComp } from "../../comp/components/FallbackSkeleton";
import SelectLab from "./registration/select-lab";
import BasicInfo from "./BasicInfo";
// import RadioGroup from "../../comp/components/RadioGroup";

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
  existingLabNo = null,
  handleLabSelected = (f) => f,
  handleHistoryChange,
  labType = "",
  setLabType = (f) => f,
  labSearchTextRef = (f) => f,
}) {
  const [formType, setFormType] = useState("normal");
  const [labInView, setLabInView] = useState([]);
  const [sub, setSub] = useState([]);
  const [expandView, setExpandView] = useState({ header: "", tests: [] });
  const [expandView2, setExpandView2] = useState({ header: "", tests: [] });
  const [image, setImages] = useState([]);
  const expandedViewRef = useRef();

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
    let _ch = children.sort((a, b) => a.children.length - b.children.length);
    setLabInView(_ch);
    setExpandView({ header: "", tests: [] });
  };
  // const handleRegType = (val) => {
  //   setFormType(val);
  // };

  // const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

  useEffect(
    () => {
      // set intial labInView
      /**
       * How it works:
       * If user opens page afresh, it loads the first unit on the lab list which
       * in most cases would be hematology;
       * If user opens page after clicking on existing lab test, the it loads the
       * department of the selected test;
       */
      if (labList[0] && labList[0].children && labList[0].children.length) {
        if (existingLabNo) {
          setTimeout(() => {
            let res = labList[0].children.filter((i) => i.title === labType);
            if (res) {
              if (res.length) {
                setLabInView(res[0].children);
              }
            }
          }, 200);
        } else {
          setLabType(labList[0].children[0].title);
          setLabInView(labList[0].children[0].children);
        }
      }
      // else {
      //   setLabType('');
      //   setLabInView([]);
      // }
      getSpecimenList();

      // let printers = zebraPrinter.getPrinters()
      // console.log(printers)
    },
    [labList, labList.length]
  );

  useEffect(
    () => {
      // let top = []
      if (labInView && labInView.length) {
        let _test = labInView[0];
        setExpandView({
          header: _test.title,
          description: _test.description,
          tests: _test.children,
        });
        // console.log("lab now in view", labInView);
        // labInView.forEach(item => {
        //   if(i.children){
        //     // if()
        //   }
        // })
      }
    },
    [labInView]
  );

  return (
    <>
    {/* {JSON.stringify()} */}
      <Row>
        <Col md={5} className="mx-0 px-1">
          <Card outline color="primary">
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
            </CardBody>
          </Card>
        </Col>
          {/* {JSON.stringify(patientInfo)} */}
        <Col md={7} className="mx-0 px-1">
          <SelectLab
            labList={labList}
            labType={labType}
            handleLabType={handleLabType}
            setExpandView={setExpandView}
            setExpandView2={setExpandView2}
            specimenList={specimenList}
            labInView={labInView}
            expandView={expandView}
            expandView2={expandView2}
            handleAddBatchTest={handleAddBatchTest}
            handleTestAdd={handleTestAdd}
            labSearchTextRef={labSearchTextRef}
            handleLabSelected={handleLabSelected}
            selectedLabs={selectedLabs}
          />
        </Col>
      </Row>
    </>
  );
}
