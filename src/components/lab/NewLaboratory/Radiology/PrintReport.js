// PrintReport
import moment from "moment";
import React from "react";
// import { facilityDetails } from "../../../comp/pdf-templates/deposit-receipt";
import { getAgeFromDOB } from "../../../utils/helpers";

// const styles = {
//   display: "none",
//   width: "1.97in",
//   height: "0.98in",
// };

function PrintRadiologyReport(props) {
  const { data = {}, frame_id = "template_print" } = props;
  let results = data.results;
  //   let head = Object.keys(results)[0];
  //   let department = data[head].test_group;
  let requestDate = results && results.created_at;
  let reportDate = results && results.result_at;
  let history = data.history;
  let reportedBy = history && history[0].result_by;
  let reportSignature = history && history[0].signature_title;
  let title = results && results[0] && results[0].description;
  //   let result_by = data[head][0].result_by;/

  const patientInfo = data.patientInfo || {};

  return (
    <div>
      <iframe
        title="print_code"
        name="template_print_frame"
        width="0"
        height="0"
        src="about:blank"
        // style={styles}
      />
      {/* <h1>Print Radiology Report</h1> */}

      <div id={frame_id}>
        <style>
          {`@media print {
              @page {
                size: A4;
                margin-top:40mm;
              }
              .print-only {
                    display: block;
                    font-family: arial, sans-serif;
                }
            
                .body {
                  font-size: 20px;
                  line-height: 2;
                  /* width: 80%; */
                  /* margin: 0 auto; */
                  text-align: justify;
              }
              .main-container {
                  display: flex;
                  flex-direction: column;
                  width: 100%;
                  /* margin: 0 auto */
              }
              .top-border {
                border-top: 1px solid black;
              }
              .bottom-border {
                border-bottom: 1px solid black;
              }
              .main-row {
                  display: flex;
                  flex-direction: row;
                  width: 100%;
                  padding: 2px;
              }
              .left {
                  width: 60%;
                  display: flex;
                  flex-direction: row;
                  padding: 0 5px
              }
              .left-left {
                  width: 25%;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
              }
              .left-right {
                  width: 80%;
                  border: 1px solid black;
                  padding: 5px 10px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
              }
              
              .right {
                  width: 40%;
                  display: flex;
                  flex-direction: row;
                  padding: 0 5px
              }
              .right-left {
                  width: 40%;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
              }
              .right-right {
                  width: 60%;
                  border: 1px solid black;
                  padding: 5px 10px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
              }
              .left-left-left {
                  width: 24%;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  
              }
              .left-group {
                  width: 78%;
                  display: flex;
                  flex-direction: row;
              }
              .left-left-right {
                  width: 35%;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  margin: 0 10px
              }
              .left-right-right {
                  width:35%;
                  border: 1px solid black;
                  padding: 5px 10px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  align-items: center;
              }
              .title {
                  text-align: center;
              }
              .bottom {
                  font-size: 20;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-end;
                  justify-content: center;
              }
              .signature {
                display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
              }
              .large-container {
                  height: 100%;
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
              }
          }

          @media screen {
            .print-only{
              display: none;
            } 
         }  
          `}
        </style>

        {/* {JSON.stringify(data.comments)} */}
        <div className="print-only">
          <div className="large-container">
            <div className="top">
              <div className="main-container">
                <div className="main-row top-border">
                  <div className="left">
                    <div className="left-left">Name</div>
                    <div className="left-right">{patientInfo.name}</div>
                  </div>
                  <div className="right">
                    <div className="right-left">Sex</div>
                    <div className="right-right">{patientInfo.sex}</div>
                  </div>
                </div>
                <div className="main-row top-border">
                  <div className="left">
                    <div className="left-left">Referred By</div>
                    <div className="left-right" />
                  </div>
                  <div className="right">
                    <div className="right-left">Request Date</div>
                    <div className="right-right">
                      {moment(
                        data &&
                          data.results &&
                          data.results[0] &&
                          data.results[0].created_at
                      ).format("YYYY/MM/DD hh:mm a")}
                    </div>
                  </div>
                </div>
                <div className="main-row top-border bottom-border">
                  <div className="left">
                    <div className="left-left-left">ID</div>
                    <div className="left-group">
                      <div className="left-right-right">{patientInfo.id}</div>
                      <div className="left-left-right">Age</div>
                      <div className="left-right-right">
                        {getAgeFromDOB(patientInfo.dob)}
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <div className="right-left">Report Date</div>
                    <div className="right-right">
                      {moment(
                        data &&
                          data.results &&
                          data.results[0] &&
                          data.results[0].result_at
                      ).format("YYYY/MM/DD hh:mm a")}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {/* {JSON.stringify(data)} */}
                <h3 className="title">
                  <u>{title} REPORT</u>
                </h3>
                <div className="body">
                  <div>
                    {data &&
                      data.comments &&
                      data.comments.length &&
                      data.comments.map((item, index) => (
                        <div className="content">
                          <div
                            key={index}
                            dangerouslySetInnerHTML={{ __html: item.comment }}
                            className="content-body"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

{/* {JSON.stringify(history)} */}
            <div className="bottom">
              <div className="signature">
                <span>{reportSignature} Signature</span>
                <span>{reportedBy}</span>
                {/* <span>{reportedByDept}</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintRadiologyReport;
