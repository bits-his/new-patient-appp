import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardBody, Table, Collapse } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import SearchBar from "../../record/SearchBar";
// import Loading from "../../comp/components/Loading";
import { useHistory, useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  refreshPendingList,
  SAMPLE_COLLECTION,
  MICRO_SAMPLE_ANALYSIS,
  RADIOLOGY_SAMPLE_ANALYSIS,
  RADIOLOGY_SAMPLE_SCAN,
  DOCTOR_COMMENT,
  CHEMICAL_PATHOLOGY_ANALYSIS,
  HEMATOLOGY_ANALYSIS,
  ALL_DEPARTMENT,
  SAMPLE_ANALYSIS,
  CARDIOLOGY_SAMPLE_ANALYSIS,
} from "../labRedux/actions";
import CustomButton from "../../comp/components/Button";
import { MdRefresh } from "react-icons/md";
import DaterangeSelector from "../../comp/components/DaterangeSelector";
// import moment from "moment";
import { ColorDetailsForPendingLab } from "../../utils/ColorDetails";
import { setLabDateRange } from "../../../redux/actions/lab";
import { useQuery } from "../../../hooks";

function LabRequisition(props) {
  const dispatch = useDispatch();
  const query = useQuery();
  let unit = query.get("unit");
  const [searchTerm, setSearchTerm] = useState("");
  const requisitions = useSelector((state) => state.labServices.pending) || [];
  // eslint-disable-next-line no-unused-vars
  const loading = useSelector((state) => state.lab.loadingLabList);

  // const onPatientClick = (currentReq) => {
  //   props.onPatientClick(currentReq);
  // };

  // let today = moment().format("YYYY-MM-DD");
  // let tomorrow = moment(today)
  //   .add(1, "day")
  //   .format("YYYY-MM-DD");
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  const userDept = useSelector((state) => state.auth.user.department);
  const range = useSelector((state) => state.lab.labDateRange);
  // const [range, setRange] = useState({
  //   from: today,
  //   to: tomorrow,
  // });

  const handleRangeChange = ({ target: { name, value } }) => {
    // setRange((p) => ({ ...p, [name]: value }));
    dispatch(setLabDateRange(name, value));
  };

  const refresh = useCallback(() => {
    dispatch(
      refreshPendingList(
        props.type,
        props.department,
        range.from,
        range.to,
        facilityId,
        unit
      )
    );
  }, [dispatch, range.from, range.to, facilityId]);

  useEffect(() => {
    refresh();

    const interval = setInterval(() => {
      refresh();
    }, 100000);

    return () => {
      clearInterval(interval);
    };
  }, [refresh]);

  const match = useRouteMatch();
  const __labno = match.params.labno || "";
  const history = useHistory();

  const gotoPatient = (
    id,
    labno,
    department = "",
    test = "",
    head,
    code,
    request_id,
    receiptNo = ""
  ) => {
    // alert(head)
    switch (type) {
      case SAMPLE_COLLECTION:
        return history.push(
          `/me/lab/sample-collection/${id}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`
        );
      case HEMATOLOGY_ANALYSIS:
        return history.push(
          `/me/lab/hematology-analysis/${id}/${labno}/${test}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`
        );
      case CHEMICAL_PATHOLOGY_ANALYSIS:
        return history.push(
          `/me/lab/chemical-pathology-analysis/${id}/${labno}/${test}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`
        );
      case MICRO_SAMPLE_ANALYSIS:
        return history.push(
          `/me/lab/microbiology-analysis/${id}/${labno}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`
        );
      case RADIOLOGY_SAMPLE_ANALYSIS:
        return history.push(
          `/me/lab/radiology-analysis/${id}/${labno}/${test}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`
        );
      case CARDIOLOGY_SAMPLE_ANALYSIS:
        return history.push(
          `/me/lab/cardiology-analysis/new/${id}/${labno}/${test}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`
        );
      case RADIOLOGY_SAMPLE_SCAN:
        return history.push(
          `/me/lab/radiology-analysis-scan/${id}/${labno}/${test}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`
        );
      case DOCTOR_COMMENT:
        return history.push(
          `/me/lab/doctor-comment/reporting/${id}/${labno}/${department}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`
        );
      case ALL_DEPARTMENT:
        return history.push(
          `/me/lab/sample-analysis/${id}/${labno}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`
        );
      default:
        return null;
    }
  };

  let type = props.type;
  let rows = [];
  // let formatted = {}

  requisitions &&
    requisitions.length &&
    requisitions.forEach((record, i) => {
      if (
        record.name &&
        record.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
        // record.label_name &&
        // record.label_name.toLowerCase().indexOf(searchTerm.toLowerCase()) ===
        //   -1 &&
        record.code &&
        record.code.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
        record.department.indexOf(searchTerm.toLowerCase()) === -1 &&
        record.labno &&
        record.labno.toString().indexOf(searchTerm.toString()) === -1
      )
        return;

      // let unitExistingIndex = Object.keys(formatted).findIndex(
      //   (i) => i === record.unit_name,
      // )
      // if (unitExistingIndex !== -1) {
      //   // formatted[record.unit_name] = [...formatted[record.unit_name], record]
      // } else {
      //   formatted[record.unit_name] = [record]
      // }
      rows.push(
        <tr
          style={{
            cursor: "pointer",
            // backgroundColor: record.status === 'saved' ? '' : '',
            backgroundColor: __labno === record.labno ? "#6c85c4" : "",
          }}
          key={i}
          onClick={() =>
            gotoPatient(
              record.patient_id,
              record.labno,
              type === DOCTOR_COMMENT ? record.department : "",
              type === MICRO_SAMPLE_ANALYSIS ||
                type === RADIOLOGY_SAMPLE_ANALYSIS ||
                type === RADIOLOGY_SAMPLE_SCAN ||
                type === CARDIOLOGY_SAMPLE_ANALYSIS
                ? record.subhead
                : "",
              type === ALL_DEPARTMENT ? record.subhead : "",
              record.code,
              record.request_id,
              record.receiptNo ? record.receiptNo : ""
            )
          }
          className={record.status === "saved" ? "bg-warning" : "bg-light"}
          // className={
          //   record.status === 'saved' ? 'bg-warning text-white' : ''
          // }
        >
          <td>{record.labno}</td>
          {/* <td>{record && record.labno.split('-').join('')}</td> */}
          {/* <td>{JSON.stringify(record)}</td> */}
          <td>{record.name}</td>
          {type === SAMPLE_COLLECTION ? (
            <td className="">{record.department}</td>
          ) : (
            <td className="">{record.label_name}</td>
          )}

          {/* {(type === SAMPLE_ANALYSIS ||
            type === HEMATOLOGY_ANALYSIS ||
            type === CHEMICAL_PATHOLOGY_ANALYSIS ||
            type === MICRO_SAMPLE_ANALYSIS) && (
            <td className="">
              {record.test_group === 'Others' ||
              record.test_group === 'Microbiology'
                ? record.description
                : record.test_group}
            </td>
          )}
          {(type === DOCTOR_COMMENT ||
            type === RADIOLOGY_SAMPLE_ANALYSIS ||
            type === RADIOLOGY_SAMPLE_SCAN ||
            type === CARDIOLOGY_SAMPLE_ANALYSIS) && (
            <td className="">
              {type === RADIOLOGY_SAMPLE_ANALYSIS ||
              type === RADIOLOGY_SAMPLE_SCAN ||
              type === CARDIOLOGY_SAMPLE_ANALYSIS
                ? record.description
                : record.unit_name}
            </td>
          )} */}
          {/* {type === MICRO_SAMPLE_ANALYSIS && (
            <td className="">{record.test_group}</td>
          )} */}
        </tr>
      );
    });

  return (
    <Card>
      <CardHeader className="d-flex flex-row justify-content-between align-items-center py-1">
        <h6>Pending Request</h6>
        <CustomButton color="success" size="sm" onClick={refresh}>
          <MdRefresh color="#fff" size="16" className="mr-1" />
          Refresh
        </CustomButton>
      </CardHeader>
      <CardBody className="p-0">
        <div className="p-1">
          <DaterangeSelector
            from={range.from}
            to={range.to}
            handleChange={handleRangeChange}
            showLabel={false}
            size="sm"
            gap={false}
          />
          <SearchBar
            _ref={props.requestSearchRef}
            placeholder="Search patient name or lab number"
            filterText={searchTerm}
            onFilterTextChange={(searchTerm) => setSearchTerm(searchTerm)}
            container="my-0"
          />
        </div>

        {/* {userDept}------       */}
        <Scrollbars style={{ height: "70vh" }}>
          {/* {JSON.stringify(requisitions)} */}
          <LabList
            list={requisitions}
            loading={loading}
            type={props.type}
            rows={rows}
            // formatted={formatted}
            gotoPatient={gotoPatient}
            __labno={__labno}
          />
        </Scrollbars>
        <ColorDetailsForPendingLab />
      </CardBody>
    </Card>
  );
}

export default LabRequisition;

function LabList({
  list,
  loading,
  type,
  rows,
  formatted,
  gotoPatient,
  __labno,
}) {
  return (
    <>
      {/* {loading && <Loading />} */}
      <Table hover size="sm" bordered>
        <thead>
          <tr>
            <th className="text-center">Lab No.</th>
            <th className="text-center">Name</th>
            {type === SAMPLE_COLLECTION ? (
              // ||
              // type === SAMPLE_ANALYSIS ||
              // type === CHEMICAL_PATHOLOGY_ANALYSIS ||
              // type === HEMATOLOGY_ANALYSIS) && (
              <th className="text-center">Unit</th>
            ) : (
              <th className="text-center">Test Name</th>
            )}

            {/* {(type === DOCTOR_COMMENT ||
              type === RADIOLOGY_SAMPLE_ANALYSIS) && (
              <th className="text-center">Department</th>
            )}
            {type === MICRO_SAMPLE_ANALYSIS && (
              <th className="text-center">Test</th>
            )} */}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
        {/* {Object.keys(formatted).map((unit, i) => (
          <tbody key={i}>
            <tr>
              <th colSpan={3} >
                <div className='d-flex flex-direction-row justify-content-between'>{unit} <CustomButton size='sm'>Collapse</CustomButton></div>
              </th>
            </tr>
            <Collapse isOpen={true}>
            {formatted[unit].map((record, j) => (
              <tr
                style={{
                  cursor: 'pointer',
                  backgroundColor: __labno === record.labno ? '#ccc' : '',
                }}
                key={i}
                onClick={() =>
                  gotoPatient(
                    record.patient_id,
                    record.labno,
                    type === DOCTOR_COMMENT ? record.department : '',
                    type === MICRO_SAMPLE_ANALYSIS ||
                      type === RADIOLOGY_SAMPLE_ANALYSIS ||
                      type === RADIOLOGY_SAMPLE_SCAN
                      ? record.subhead
                      : '',
                    type === ALL_DEPARTMENT ? record.subhead : '',
                    record.code,
                    record.request_id,
                    record.receiptNo ? record.receiptNo : '',
                  )
                }
                className={
                  record.status === 'saved' ? 'bg-warning' : 'bg-light'
                }
              >
                <td>{record.code}</td>
                <td>{record.name}</td>
                {type === SAMPLE_COLLECTION && (
                  <td className="text-center">{record.department}</td>
                )}
                {(type === SAMPLE_ANALYSIS ||
                  type === HEMATOLOGY_ANALYSIS ||
                  type === CHEMICAL_PATHOLOGY_ANALYSIS) && (
                  <td className="text-center">
                    {record.test_group === 'Others'
                      ? record.description
                      : record.unit_name}
                  </td>
                )}
                {(type === DOCTOR_COMMENT ||
                  type === RADIOLOGY_SAMPLE_ANALYSIS ||
                  type === RADIOLOGY_SAMPLE_SCAN) && (
                  <td className="">
                    {type === RADIOLOGY_SAMPLE_ANALYSIS ||
                    type === RADIOLOGY_SAMPLE_SCAN
                      ? record.description
                      : record.department_head}
                  </td>
                )}
                {type === MICRO_SAMPLE_ANALYSIS && (
                  <td className="">{record.unit_name}</td>
                )}
              </tr>
            ))}
            </Collapse>
          </tbody>
        ))} */}
      </Table>

      {!list.length && (
        <p className="alert alert-primary text-center">List is empty.</p>
      )}
    </>
  );
}
