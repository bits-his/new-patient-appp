import moment from "moment";
import React, { useState } from "react";
import { Button, Card, CardBody, CardHeader, Row } from "reactstrap";
import DaterangeSelector from "../../comp/components/DaterangeSelector";
import SelectInput from "../../comp/components/SelectInput";
import ExpensesBreakdown from "./ExpensesBreakdown";
import FinancialPosition from "./FinancialStatement";
import SalesExpensesReport from "./SalesExpensesReport";
import RevenueBreakdown from "./RevenueBreakdown";
import TrialBalance from "./TrialBalance";
import DailyTotal from "../../lab/NewLaboratory/reports/DailyTotal";
import PatientIncome from "../../lab/NewLaboratory/reports/PatientIncome";

function ReportsContainer() {
  // const startOfMonth = moment()
  //   .startOf("month")
  //   .format("YYYY-MM-DD");
  // const endOfMonth = moment()
  //   .endOf("month")
  //   .format("YYYY-MM-DD");

  let today = moment().format("YYYY-MM-DD");

  const [range, setRange] = useState({ from: today, to: today });
  const [reportType, setReportType] = useState("Daily Total");

  const handleRangeChange = ({ target: { name, value } }) => {
    setRange((p) => ({ ...p, [name]: value }));
  };

  const printReport = () => {
    window.frames[
      "print_frame"
    ].document.body.innerHTML = document.getElementById(
      "report_container"
    ).innerHTML;
    window.frames["print_frame"].window.focus();
    window.frames["print_frame"].window.print();
  };

  return (
    <Card>
      <CardHeader className="h6 text-center">{reportType}</CardHeader>
      <CardBody>
        <DaterangeSelector
          from={range.from}
          to={range.to}
          handleChange={handleRangeChange}
        />

        <Row className="d-flex flex-direction-row justify-content-between align-items-center">
          <SelectInput
            label="Select Report Type"
            value={reportType}
            options={[
              "Daily Total",
              "Patient Income",
              "Summary of Sales and Expenses",
              "Revenue",
              "Expenses",
              "Statement of Financial Position",
              "Trial Balance",
            ]}
            onChange={(e) => {
              setReportType(e.target.value);
              // getTotalRevenue()
            }}
            // container='col-md-6'
          />

          <Button color="primary" onClick={printReport}>
            Export/Download
          </Button>
        </Row>
        {/* <Rout exact path="">
          <RevenueDetails />
        </Route> */}
        <iframe
          title="print_financial"
          name="print_frame"
          width="0"
          height="0"
          src="about:blank"
          // style={styles}
        />

        <div id="report_container">
          <style>
            {`@media print {
              table {
                font-size: 75%;
                table-layout: fixed;
                width: 100%;
              }
              
              table {
                border-collapse: collapse;
                border-spacing: 2px;
              }
              
              th,
              td {
                border-width: 1px;
                padding: 0.5em;
                position: relative;
                text-align: left;
              }
              
              th,
                td {
                    border-radius: 0.25em;
                    border-style: solid;
                }
                
                th {
                    background: #EEE;
                    border-color: #BBB;
                }
                
                td {
                    border-color: #DDD;
                }
                .text-right {
                    text-align: right;
                }
                .text-center {
                    text-align: center;
                }
                .font-weight-bold {
                    font-weight: bold;
                }
                .print-start{
                    margin: 2em;
                    margin-top: 4em;
                }
                .print-only{
                  display: block;
                }
            }

            @media screen {
              .print-only{
                display: none;
              } 
           }   
          `}
          </style>

          {reportType === "Daily Total" && (
            <DailyTotal
              reportType={reportType}
              start={range.from}
              end={range.to}
            />
          )}
          {reportType === "Patient Income" && (
            <PatientIncome
              reportType={reportType}
              start={range.from}
              end={range.to}
            />
          )}
          {reportType === "Trial Balance" && (
            <TrialBalance start={range.from} end={range.to} />
          )}
          {reportType === "Statement of Financial Position" && (
            <FinancialPosition start={range.from} end={range.to} />
          )}
          {/* {reportType === "Statement of Profit or Loss" && ( */}
          {reportType === "Summary of Sales and Expenses" && (
            <SalesExpensesReport start={range.from} end={range.to} />
          )}
          {reportType === "Revenue" && (
            <RevenueBreakdown start={range.from} end={range.to} />
          )}
          {reportType === "Expenses" && (
            <ExpensesBreakdown start={range.from} end={range.to} />
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default ReportsContainer;
