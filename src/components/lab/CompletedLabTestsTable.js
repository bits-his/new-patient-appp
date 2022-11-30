import moment from "moment";
import React from "react";
import Scrollbar from "../comp/components/Scrollbar";
import { FaEdit, FaPrint, FaEye } from "react-icons/fa";
import { Table } from "reactstrap";
import CustomButton from "../comp/components/Button";
import DaterangeSelector from "../comp/components/DaterangeSelector";
import SearchBar from "../record/SearchBar";
// import { useSelector } from "react-redux";

function CompletedLabTestsTable({
  searchTerm = "",
  setSearchTerm = (f) => f,
  completedLabTests = [],
  gotoTest = (f) => f,
  gotoUncompletedTest = (f) => f,
  onEditClick = (f) => f,
  onPrintClick = (f) => f,
  getCompletedLabTests = (f) => f,
  onUncompletedTestPrintClick = (f) => f,
  labResultSearchRef = null,
  range = {},
  handleRangeChange = (f) => f,
}) {
  let rows = [];

  completedLabTests.length &&
    completedLabTests.forEach((test, i) => {
      if (
        test.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
        test.label_name.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
        test.status.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
        (test.booking_no && test.booking_no.toString().indexOf(searchTerm.toString()) === -1)
      )
        return;
        let testIsCompleted = test.status === 'result';
      let sampleCollected = test.status === 'Sample Collected' || test.status === 'uploaded';
      let disableEdit = test.approval_status !== 'pending'
      let showPrintButton = test.status === 'result' || test.status === 'analyzed';
      // let testIsCompleted = test.completed === test.tests;
      // let sampleCollected = test.collected === test.tests;
      // let disableEdit = test.approval_status !== 'pending'
      // let showPrintButton = test.completed + test.analyzed === test.tests;
      // let showEditButton = false;
      rows.push(
        <tr
          key={i}
          style={{
            // cursor: "pointer",
            backgroundColor: sampleCollected
              ? "#9ebf6f"
              : testIsCompleted
              ? "#7FFF00"
              : showPrintButton
              ? "#39ff72"
              : "#ffffb3",
          }}
        >
          {/* <td>{i + 1}</td> */}
          <td style={{ border: "3px solid white" }}>
            {moment(test.created_at).format("DD/MM/YYYY")}
          </td>

          <td
            className="text-center"
            // onClick={() => gotoTest(test.patient_id, test.booking_no)}
            style={{ border: "3px solid white" }}
          >
            <a
              href="#test"
              onClick={(e) => {
                e.preventDefault();
                if (testIsCompleted) {
                  gotoTest(test.patient_id, test.booking_no, test.request_id, test.code);
                } else {
                  gotoUncompletedTest(test.patient_id, test.booking_no, test.request_id,test.code);
                }
              }}
            >
              {test.booking_no}
            </a>
          </td>

          {/* <td className="text-center">{test && test.booking_no.split('-').join('')}</td> */}

          <td style={{ border: "3px solid white" }}>{test.name}</td>
          {/* <td style={{ border: "3px solid white" }}>{test.request_id}</td> */}
          {/* <td style={{ border: "3px solid white" }} className="text-center">{`${
            test.collected
          }/${test.tests}`}</td>
          <td style={{ border: "3px solid white" }} className="text-center">{`${
            test.analyzed
          }/${test.tests}`}</td> */}
          <td style={{ border: "3px solid white" }} className="">
            {test.label_name}
            {/* {`${
            test.completed
          }/${test.tests}`} */}
          </td>
          <td style={{ border: "3px solid white" }} className="text-center">
            <CustomButton
              size="sm"
              color="default"
              onClick={() => {
                if (testIsCompleted) {
                  gotoTest(test.patient_id, test.booking_no, test.request_id, test.code);
                } else {
                  gotoUncompletedTest(test.patient_id, test.booking_no, test.request_id, test.code);
                }
              }}
            >
              <FaEye /> View
            </CustomButton>
            {disableEdit ? null : (
              <CustomButton
                size="sm"
                color="info"
                onClick={() => onEditClick(test.patient_id, test.booking_no, test.receiptNo, test.request_id)}
                className="mr-1 ml-1"
              >
                <FaEdit /> Edit
              </CustomButton>
            )}
            {showPrintButton && (
              <CustomButton
                size="sm"
                color="warning"
                onClick={() => {
                  if (testIsCompleted) {
                    onPrintClick(test);
                  } else {
                    onUncompletedTestPrintClick(test);
                  }
                }}
              >
                <FaPrint /> Print
              </CustomButton>
            )}
          </td>
        </tr>
      );
    });
  return (
    <>
      <div className="mx-1 mt-1">
        <DaterangeSelector
          from={range.from}
          to={range.to}
          handleChange={handleRangeChange}
          showLabel={false}
          size="sm"
        />
        {/* {JSON.stringify(comments)} */}
        {/* <DaterangeSelector /> */}
        <SearchBar
          _ref={labResultSearchRef}
          filterText={searchTerm}
          onFilterTextChange={(searchTerm) => setSearchTerm(searchTerm)}
          placeholder="Search for a test by patient, test, date or by scanning barcode"
          // onFilterTextChange={onFilterTextChange}
        />
      </div>
      <Scrollbar height={'60vh'}>
        <div>
          {completedLabTests.length ? (
            <Table bordered hover size="sm">
              <thead>
                <tr>
                  <th className="text-center">Date</th>
                  <th className="text-center">Booking</th>
                  <th className="text-center">Name</th>
                  {/* <th className="text-center">Sample Collected</th>
                <th className="text-center">Analyzed</th> */}
                  <th className="text-center">Test Name</th>
                  {/* <th className="text-center">Completed</th> */}
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          ) : null}
          {/* {JSON.stringify(completedLabTests)} */}
          {!completedLabTests.length && (
            <p className="text-center">No Record found.</p>
          )}
        </div>
      </Scrollbar>
    </>
  );
}

export default CompletedLabTestsTable;
