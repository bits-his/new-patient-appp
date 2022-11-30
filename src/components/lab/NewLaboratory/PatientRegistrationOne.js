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
import { toCamelCase } from "../../utils/helpers";
import { patientInfoChange } from "../labRedux/actions";
// import { FallbackComp } from "../../comp/components/FallbackSkeleton";
import SelectLab from "./registration/select-lab";
import BasicInfo from "./BasicInfo";
import { useQuery } from "../../../hooks";
import { useHistory, useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Button from "reactstrap/lib/Button";
import Container from "reactstrap/lib/Container";
import { updateClientInfo } from "./registration/api";
import BackButton from "../../comp/components/BackButton";
// import RadioGroup from "../../comp/components/RadioGroup";

export default function PatientRegistrationOne({
}) {
  const [formType, setFormType] = useState("normal");
  const [labInView, setLabInView] = useState([]);
  const [sub, setSub] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [walkinAcc, setWalkinAcc] = useState("");
  const [expandView, setExpandView] = useState({ header: "", tests: [] });
  const [expandView2, setExpandView2] = useState({ header: "", tests: [] });
  const [image, setImages] = useState([]);
  const expandedViewRef = useRef();
  const [specimenList, setSpecimenList] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true)
  const history = useHistory()
  const [patientInfo, setPatientInfo] = useState({
    accountType: "Walk-In",
    clientAccount: "",
    clientBeneficiaryAcc: "",
    patientId: existingPatientId ? existingPatientId : "",
    booking: "",
    patientNo: "",
    // first_name: '',
    name: "",
    age: "",
    gender: "",
    phone: "",
    diagnosis: "",
    modeOfPayment: "Cash",
    history: "",
  });
  const match = useRouteMatch();
  const query = useQuery();
  const existingPatientId = match.params.patientId;
  const getWalkinAcct = () => {
    _fetchApi(
      `${apiURL()}/walkin/instant/acct`,
      (data) => {
        if (data.success) {
          let _walkin = data.results.accountNo;
          setWalkinAcc(_walkin);
          setPatientInfo((p) => ({
            ...p,
            clientAccount: _walkin,
          }));

          getNextBeneficiaryId(_walkin)
            .then((d) => {
              // console.log(d);
              if (d.success) {
                let ben = d.results.beneficiaryNo;
                setPatientInfo((prev) => ({
                  ...prev,
                  clientBeneficiaryAcc: ben,
                  patientId: `${_walkin}-${ben}`,
                }));
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      },
      (err) => console.log(err)
    );
  };

  const getNextBeneficiaryId = async (acc) => {
    try {
      const response = await fetch(
        `${apiURL()}/client/nextBeneficiaryId/${acc}`
      );
      return await response.json();
    } catch (error) {
      return error;
    }
  };
  const getPatientInfo = (id) => {
    _fetchApi(
      `${apiURL()}/lab/patient/info/${id}`,
      (data) => {
        if (data.success) {
          let info = data.results[0];
          let ageY = moment().diff(info.dob, "years");
          let ageM = ageY < 1 ? moment().diff(info.dob, "months") : "";
          setPatientInfo((p) => ({
            ...p,
            ...info,
            clientAccount: info.accountNo,
            ageY,
            ageM,
          }));
        }
      },
      (err) => console.log(err)
    );
  };
  const handleHistoryChange = (val) => {
    setPatientInfo((prev) => ({ ...prev, history: val }));
  };
  const handleAccChange = (acc) => {
    getNextBeneficiaryId(acc.accountNo)
      .then((d) => {
        if (d.success) {
          let ben = d.results.beneficiaryNo;
          setPatientInfo((prev) => ({
            ...prev,
            clientAccount: acc.accountNo,
            clientBeneficiaryAcc: ben,
            patientId: `${acc.accountNo}-${ben}`,
          }));
        }
      })
      .catch((err) => {
        setPatientInfo((p) => ({ ...p, clientAccount: acc.accountNo }));
        console.log(err);
      });

    // setPatientInfo((p) => ({ ...p, clientAccount: acc.accountNo }));
  };
  // const handleLabType = (name, children) => {
  //   setLabType(name);
  //   let _ch = children.sort((a, b) => a.children.length - b.children.length);
  //   setLabInView(_ch);
  //   setExpandView({ header: "", tests: [] });
  // };
  // const handleRegType = (val) => {
  //   setFormType(val);
  // };
  const setRegType = (val) => {
    setPatientInfo((p) => ({ ...p, accountType: val }));
    // getAccountsPerAccountType(val);
    getWalkinAcct(val);
  };
  const formatStr = (str) => {
    let splitted = str.split(" ");
    let formatted = [];
    splitted.forEach((i) => formatted.push(toCamelCase(i)));
    return formatted.join(" ");
  };
  const handleChange = ({ target: { name, value } }) => {
    let _val = name === "name" ? formatStr(value) : value;
    let newValue = { ...patientInfo, [name]: _val };
    setPatientInfo(newValue);
    dispatch(patientInfoChange(newValue));
  };
  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

  useEffect(() => {
    if (existingPatientId) {
      // alert(existingPatientId)
      getPatientInfo(existingPatientId);
    }
  }, [])

  const handleSubmit = () => {
    let clientNameArr = patientInfo.name ? patientInfo.name.split(" ") : [];
        let firstname = clientNameArr[0] || "";
        let surname = clientNameArr.slice(1).join(" ");
        let other = "";
        let dob = moment()
          .subtract(patientInfo.ageY, "years")
          .subtract(patientInfo.ageM, "months")
          .subtract(patientInfo.ageD, "days")
          .format("YYYY-MM-DD");
          const obj = {
            ...patientInfo,
            firstname,
            surname,
            other,
            // id: patientId,
            facId: user.facilityId,
            userId: user.id,
            dob,
            receiptsn: '',
            receiptno: '',
            depositAmount: 0,
            // modeOfPayment: "Cash",
            description: "",
            phone: patientInfo.phone,
            history: patientInfo.history,
          };
    updateClientInfo(obj)
      .then((data) => {
        if (data.success) {
          // submitLabRequests();
          // submitHistory();
          
          history.goBack()
        }
      })
      .catch((err) => {
        console.log("Error updating client info", err);
        setLoading(false);
      });
  }
  return (
    <Container>
      <BackButton/>
      <Row>
        <Col md={12} className="mx-0 px-1">
          <Card outline color="primary">
            <CardHeader className="d-flex justify-content-between" tag="h6">
              <div>
                <span className="mr-1">Date:</span>
                {moment().format("YYYY-MM-DD")}
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
                textInput="hide"
              />
            </CardBody>
            <center>
              <Button color="primary" className="mb-3" onClick={handleSubmit}>Update</Button>
              </center>
          </Card>
        </Col>
        {/* {JSON.stringify(patientInfo)} */}
        {/* <Col md={7} className="mx-0 px-1">
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
        </Col> */}
      </Row>
    </Container>
  );
}
