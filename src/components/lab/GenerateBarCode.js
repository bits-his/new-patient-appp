import React, { useState, useEffect, useCallback } from 'react';
// import Barcode from 'react-barcode';
import {
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';
import { useBarcode } from 'react-barcodes';

import {useRouteMatch } from 'react-router';
import { apiURL } from '../../redux/actions';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { _fetchApi } from '../../redux/actions/api';
import { unflatten } from '../../redux/actions/account';
import { FiPrinter } from 'react-icons/fi';
const styles = {
  display: 'none',
  width: '1.081in',
  height: '0.984in',
  marginTop: '40px',
};
function BarCodeGenerator() {
  const match = useRouteMatch();
  const existingPatientId = match.params.patientId;
  const facilityId = useSelector((state) => state.facility.info.facility_id);

  const [patientInfo, setPatientInfo] = useState({});
  const [, setLabList] = useState([]);

  const getLabList = () => {
    _fetchApi(
      `${apiURL()}/lab/service/tree`,
      (data) => {
        if (data.success) {
          let converted = unflatten(data.results);
          setLabList(converted[0]);
        }
      },
      (err) => {
        console.log(err);
      },
    );
  };
  const getNextPatientId = async () => {
    try {
      const response = await fetch(
        `${apiURL()}/client/next-patient-id/${facilityId}`,
      );
      return await response.json();
    } catch (error) {
      return error;
    }
  };
  const getIds = () => {
    getNextPatientId()
      .then((m) => {
        if (m.success) {
          let id = m.results.id;
          setPatientInfo((prev) => ({
            ...prev,
            patientId: id,
          }));
        }
      })
      .catch((err) => console.log(err));
  };

  const generateBookingNo = useCallback(
    () => {
      const monthCode = moment().format('MM');
      const yearCode = moment().format('YY');
      fetch(`${apiURL()}/lab/next/id/${facilityId}`)
        .then((raw) => raw.json())
        .then((data) => {
          if (data.success) {
            fetch(`${apiURL()}/lab/next/monthid/${facilityId}`)
              .then((raw) => raw.json())
              .then((data) => {
                if (data.success) {
                  let idForMonth = data.results.labId;
                  setPatientInfo((prev) => ({
                    ...prev,
                    booking: `${
                      data.results.labId
                    }-${monthCode}-${yearCode}-${idForMonth}`,
                  }));
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [facilityId],
  );
  const getPatientInfo = (id) => {
    _fetchApi(
      `${apiURL()}/lab/patient/info/${id}`,
      (data) => {
        if (data.success) {
          let info = data.results[0];
          setPatientInfo((p) => ({
            ...p,
            ...info,
            clientAccount: info.accountNo,
            age: moment().diff(info.dob, 'years'),
          }));
        }
      },
      (err) => console.log(err),
    );
  };

  useEffect(
    () => {
      if (existingPatientId) {
        getPatientInfo(existingPatientId);
      }
      if (!existingPatientId) {
        getIds();
      }
      generateBookingNo();
      getLabList();
    },
    [generateBookingNo, existingPatientId],
  );

  const onPrintClick = () => {
    window.frames[
      'print_frame'
    ].document.body.innerHTML = document.getElementById('barCode').innerHTML;
    window.frames['print_frame'].window.focus();
    window.frames['print_frame'].window.print();
    // window.frames['print_frame'].document.body.style.display = "inline"
  };
//   var barCodeOptions = {    
//     width: 3,
//     height: 60,
//     format: "EAN13",
//     displayValue: true,
//     fontOptions: "",
//     font: "monospace",
//     textAlign: "center",
//     textPosition: "bottom",
//     textMargin: 2,
//     fontSize: 20,
//     background: "#ffffff",
//     lineColor: "#000000",
//     margin: 10,
//     marginTop: undefined,
//     marginBottom: undefined,
//     marginLeft: undefined,
//     marginRight: undefined      
// }
  return (
    <Card>
      <CardHeader>BarCode Generator</CardHeader>
      <CardBody>
        <Row className="m-0 pr-0">
          <Col md={6} className="m-0 p-0 d-flex flex-direction-row">
            <iframe
              name="print_frame" title="This is a unique title"
              width="0"
              height="0"
              src="about:blank"
              style={styles}
            />
            <table>
              <tr className="row" />
            </table>
            <div id="barCode">
              <table>
                <tr>
                  <td>
                    {/* <Barcode value={patientInfo.booking} height={40} {...barCodeOptions}/> */}
                    <BarCodes value={patientInfo.booking} />
                  </td>
                </tr>
              </table>
            </div>
          </Col>

          <Col md={3}>
            {/* {JSON.stringify(patientInfo)} */}
            <Button
              color="primary"
              className="pl-5 pr-5 font-weight-bold"
              onClick={onPrintClick}
            >
              <FiPrinter /> Print{' '}
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}



 
function BarCodes({value}) {
  const { inputRef } = useBarcode({
    value: value,
    options: {
      height: 40,
      fontSize: 10
    }
  });
  
  return <img ref={inputRef} alt="barcode"/>;
};

export default BarCodeGenerator;
