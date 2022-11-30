import React, { useState } from "react";
// import Barcode from 'react-barcode';
import { Button, Card } from "reactstrap";
import { FiPrinter } from "react-icons/fi";
import { useBarcode } from "react-barcodes";
// import JSPM from 'jsprintmanager'
// import { getUniqueArray } from "../utils/util";

const Printers = ({handlePrinterChange}) => (
  <div>
      <label for="installedPrinterName">Select an installed Printer: </label>
      <select onChange={handlePrinterChange}>
          <option >Select printer</option>
          <option >P</option>
      </select>
  </div>
)

const styles = {
  display: "none",
  width: "2.97in",
  height: "1.98in",
};

function PrintBarcode({ labels, type, patientInfo = {} }) {
  const [printer,setPrinter] = useState(null)
  const handlePrinterChange = (val) => setPrinter(val)
  
  // let cpj = JSPM.Cl
  const onPrintClick = () => {
    window.frames[
      "print_frame"
    ].document.body.innerHTML = document.getElementById("barCode").innerHTML;
    window.frames["print_frame"].window.focus();
    window.frames["print_frame"].window.print();
    // window.frames['print_frame'].document.body.style.display = "inline"
  };
  const isLater = type === "Later";
  // let newArr = labels.map((item) => item.code);
  return (
    <Card body>
      <div>
        {/* {JSON.stringify(patientInfo)} */}
        <center>
          <Button
            color="primary"
            className="pl-5 pr-5 font-weight-bold"
            onClick={onPrintClick}
          >
            <FiPrinter /> Print
          </Button>
        </center>
        
      </div>
      <iframe
        title="print_code"
        name="print_frame"
        width="0"
        height="0"
        src="about:blank"
        // style={styles}
      />
      <div id="barCode">
        <style>
          {`@media print {
              /* * {
                font-size: 10px
              }*/
              table {
                table-layout: fixed;
                height: 2.0in;
                width:3.0in,
                /*border-collapse: collapse;
                border: 1px solid #999;*/
                font-family: "Times New Roman";
                margin-top: 0.15in;
                margin-bottom: 0.5in;
                margin-left:0.02in;
              }
             td {
                overflow: hidden;
              }
               /*td, tr {
                border-collapse: collapse;
                border: 1px solid #999;
              }*/
              .tests-rotated {
                transform: rotate(-270deg);
                /*text-align: center;
                margin-right: -30em;*/
                font-family: "Times New Roman"
              }
              
              .acc-no {
                margin-right: 30px
              }
              .name {
                font-size:13px;
                font-family: "Times New Roman";
              }
              .timestamp {
                font-size:12.5px;
                font-family: "Times New Roman";
                font-weight: bold;
              }
              .f10 {
                font-size:10px;
                font-family: "Times New Roman";
              }
              .f12 {
                font-size:12px;
                /*font-weight: bold;*/
                font-family: "Times New Roman";
              }
              .capital {
                text-transform: uppercase;
              }
              .pName {
                font-size:10px;
                font-weight: bold;
                font-family: "Times New Roman";
              }
            }
          `}
        </style>
        {labels.map((item, index) => {
          if (item.type === "info") {
            return (
              <table key={index} className="details-top">
                <tbody>
                  <tr>
                    <td className='name capital'>{item.name}</td>
                  </tr>
                  <tr>
                    <td>
                      {/* <Barcode value={item.code&&item.code.split('-').join('')} /> */}
                      <TopBarcode
                        value={
                          item.code && item.code.split("-").join("")
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            );
          } else {
            let disp = [];
            for (let i = 0; i < item.noOfLabels; i++) {
              let dept =
                item.department === "2000"
                  ? "Hematology"
                  : item.department === "3000"
                  ? "ChemPath"
                  : item.department === "4000"
                  ? "Microbiology"
                  : "Radiology";
                    // console.log(dept)
              disp.push(
                <table key={index} className="details">
                  <tr>
                    <td colSpan={3} className="mt-5 f10 timestamp">
                      {item.timestamp}
                    </td>
                    <td
                      rowSpan={4}
                      colSpan={1}
                      // style={{ fontSize: "16px" }}
                    >
                      <div className='tests-rotated'>
                      <span className="capital f12">
                        { item.tests}
                      </span></div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text f10 capital">{`${dept} - ${
                      item.sample
                    }`}</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      <span className="acc-no f10">
                        {isLater ? patientInfo.id : item.accNo}
                      </span>
                      <span className="pName capital">
                        \ {isLater ? patientInfo.name : item.patientName}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={1}>
                      {/* <Barcode value={item.code&&item.code.split('-').join('')} /> */}
                      <BarCodes
                        value={
                          isLater
                            ? item.code
                            : item.code && item.code.split("-").join("")
                        }
                      />
                    </td>
                  </tr>
                </table>
              );
            }
            return disp;
          }
        })}
      </div>
    </Card>
  );
}

function BarCodes({ value }) {
  const { inputRef } = useBarcode({
    value: value,
    options: {
      height: 35,
      width: 1.5,
      fontSize: 12,
      fontWeight: "bold",
    },
  });

  return <svg ref={inputRef} alt="_barcode" />;
}

function TopBarcode({ value }) {
  const { inputRef } = useBarcode({
    value: value,
    options: {
      height: 50,
      width: 1.5,
      fontSize: 12,
      fontWeight: "bold",
    },
  });

  return <svg ref={inputRef} alt="_barcode" />;
}

export default PrintBarcode;
