                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardBody, Table } from 'reactstrap'
import { Scrollbars } from 'react-custom-scrollbars'
import SearchBar from '../../record/SearchBar'
// import Loading from "../../comp/components/Loading";
import { useHistory, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import {
  SAMPLE_COLLECTION,
  MICRO_SAMPLE_ANALYSIS,
  RADIOLOGY_SAMPLE_ANALYSIS,
  DOCTOR_COMMENT,
  CHEMICAL_PATHOLOGY_ANALYSIS,
  HEMATOLOGY_ANALYSIS,
  refreshHistoryList,
  SAMPLE_ANALYSIS,
  ALL_DEPARTMENT,
  RADIOLOGY_SAMPLE_SCAN,
  CARDIOLOGY_SAMPLE_ANALYSIS,
} from '../labRedux/actions'
import DaterangeSelector from '../../comp/components/DaterangeSelector'
// import moment from "moment";
import { setLabHistoryDateRange } from '../../../redux/actions/lab'
import { useQuery } from '../../../hooks'

function PastLabRequisition(props) {
  const dispatch = useDispatch()
  const query = useQuery()
  let unit = query.get('unit')
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const requisitions = useSelector((state) => state.labServices.history)
  // eslint-disable-next-line no-unused-vars
  const loading = useSelector((state) => state.lab.loadingLabHistory)

  const isCollection = location.pathname.includes("collection");
  const isChempath = location.pathname.includes("chemical-pathology");
  const isHema = location.pathname.includes("hematology");
  const isMicro = location.pathname.includes("microbiology");
  const isRadio = location.pathname.includes("radiology");
  const isDoctor = location.pathname.includes("doctor");
  const isNormalLab = location.pathname.includes("sample-analysis");

  let type = props.type

  // let today = moment().format("YYYY-MM-DD");
  // let tomorrow = moment(today)
  //   .add(1, "day")
  //   .format("YYYY-MM-DD");
  const facilityId = useSelector((state) => state.auth.user.facilityId)
  const range =
    type === DOCTOR_COMMENT
      ? { from: null, to: null }
      : useSelector((state) => state.lab.labHistoryDateRange)

  // const [range, setRange] = useState({
  //   from: type === DOCTOR_COMMENT ? null : today,
  //   to: type === DOCTOR_COMMENT ? null : tomorrow,
  // });

  const handleRangeChange = ({ target: { name, value } }) => {
    dispatch(setLabHistoryDateRange(name, value))
    // setRange((p) => ({ ...p, [name]: value }));
  }

  const isAnalysis = isChempath || isHema || isMicro || isRadio

  const refresh = useCallback(() => {
    dispatch(
      refreshHistoryList(
        props.type,
        props.department,
        range.from,
        range.to,
        facilityId,
        unit,
      ),
    )
  }, [dispatch, range.from, range.to, facilityId])

  // const onPatientClick = (currentReq) => {
  //   props.onPatientClick(currentReq);
  // };

  useEffect(() => {
    refresh()
  }, [refresh])

  // const match = useRouteMatch();
  // const __labno = match.params.labno || "";
  const history = useHistory()

  const gotoPatient = (
    id,
    labno,
    department = '',
    test = '',
    code,
    request_id,
    receiptNo = '',
  ) => {
    // console.log('calling=============================================')
    switch (type) {
      case SAMPLE_COLLECTION:
        return history.push(
          `/me/lab/sample-collection/history/${id}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case HEMATOLOGY_ANALYSIS:
        return history.push(
          `/me/lab/hematology-analysis/history/${id}/${labno}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case CHEMICAL_PATHOLOGY_ANALYSIS:
        return history.push(
          `/me/lab/chemical-pathology-analysis/history/${id}/${labno}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case MICRO_SAMPLE_ANALYSIS:
        return history.push(
          `/me/lab/microbiology-analysis/history/${id}/${labno}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case RADIOLOGY_SAMPLE_ANALYSIS:
        return history.push(
          `/me/lab/radiology-analysis/history/${id}/${labno}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case CARDIOLOGY_SAMPLE_ANALYSIS:
        return history.push(
          `/me/lab/cardiology-analysis/history/${id}/${labno}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case RADIOLOGY_SAMPLE_SCAN:
        return history.push(
          `/me/lab/radiology-analysis-scan/${id}/${labno}/${test}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case DOCTOR_COMMENT:
        return history.push(
          `/me/lab/doctor-comment/reporting/history/${id}/${labno}/${department}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case ALL_DEPARTMENT:
        return history.push(
          `/me/lab/sample-analysis/${id}/${labno}?code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      default:
        return null
    }
  }

  const viewArchive = (
    id,
    labno,
    department = '',
    test = '',
    code,
    request_id,
    receiptNo = '',
  ) => {
    switch (type) {
      case SAMPLE_COLLECTION:
        return history.push(
          `/me/lab/sample-collection/history/${id}?view=true&code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case HEMATOLOGY_ANALYSIS:
        return history.push(
          `/me/lab/hematology-analysis/history/${id}/${labno}?view=true&code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case CHEMICAL_PATHOLOGY_ANALYSIS:
        return history.push(
          `/me/lab/chemical-pathology-analysis/history/${id}/${labno}?view=true&code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case MICRO_SAMPLE_ANALYSIS:
        return history.push(
          `/me/lab/microbiology-analysis/history/${id}/${labno}?view=true&code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case RADIOLOGY_SAMPLE_ANALYSIS:
        return history.push(
          `/me/lab/radiology-analysis/history/${id}/${labno}/${test}?view=true&code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case CARDIOLOGY_SAMPLE_ANALYSIS:
        return history.push(
          `/me/lab/cardiology-analysis/history/${id}/${labno}/${test}?view=true&code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case RADIOLOGY_SAMPLE_SCAN:
        return history.push(
          `/me/lab/radiology-analysis-scan/${id}/${labno}/${test}?view=true&code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case DOCTOR_COMMENT:
        return history.push(
          `/me/lab/doctor-comment/reporting/history/${id}/${labno}/${department}?view=true&code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      case ALL_DEPARTMENT:
        return history.push(
          `/me/lab/sample-analysis/history/${id}/${labno}?view=true&code=${code}&request_id=${request_id}&receiptNo=${receiptNo}&unit=${unit}`,
        )
      default:
        return null
    }
  }

  let rows = []

  requisitions.length &&
    requisitions.forEach((record, i) => {
      const changeable = isCollection
        ? record.status === 'Sample Collected'
        : isAnalysis
        ? record.status === 'analyzed'
        : isDoctor
        ? record.status === 'result'
        : false

      if (
        record.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
        record.department.toLowerCase().indexOf(searchTerm.toLowerCase()) ===
          -1 &&
        record.label_name &&
        record.label_name.toLowerCase().indexOf(searchTerm.toLowerCase()) ===
          -1 &&
        record.code.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
        record.labno.toString().indexOf(searchTerm.toString()) === -1
      )
        return
      rows.push(
        <tr
          style={{
            backgroundColor: changeable ? '' : '#3a63c9',
            cursor: 'pointer',

            // backgroundColor: __labno === record.labno ? "#ccc" : "",
          }}
          key={i}
          onClick={() => {
            // if (changeable) {
              gotoPatient(
                record.patient_id,
                record.labno,
                type === DOCTOR_COMMENT ? record.department : '',
                type === MICRO_SAMPLE_ANALYSIS ||
                  type === RADIOLOGY_SAMPLE_ANALYSIS ||
                  type === RADIOLOGY_SAMPLE_SCAN
                  ? record.subhead
                  : '',
                record.code,
                record.request_id,
                record.receiptNo ? record.receiptNo : '',
              )
            // } else {
            //   viewArchive(
            //     record.patient_id,
            //     record.labno,
            //     type === DOCTOR_COMMENT ? record.department : '',
            //     type === MICRO_SAMPLE_ANALYSIS ||
            //       type === RADIOLOGY_SAMPLE_ANALYSIS ||
            //       type === RADIOLOGY_SAMPLE_SCAN
            //       ? record.subhead
            //       : '',
            //     record.code,
            //     record.request_id,
            //     record.receiptNo ? record.receiptNo : '',
            //   )
            // }
          }}
          className="text-white"
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
              {/* {record.description} *
              </td>
          )} */}
          {/* {type === MICRO_SAMPLE_ANALYSIS && (
            <td className="">{record.description}</td>
          )} */}
        </tr>,
      )
    })

  return (
    <Card
      style={{ backgroundColor: '#6c85c4' }}
      // color="success"
    >
      <CardHeader>
        <h6 className="text-white">History</h6>
      </CardHeader>
      <CardBody className="p-0">
        <div className="p-1">
          {type === DOCTOR_COMMENT ? null : (
            <DaterangeSelector
              from={range.from}
              to={range.to}
              handleChange={handleRangeChange}
              showLabel={false}
              size="sm"
              gap={false}
            />
          )}
          <SearchBar
            _ref={props.historySearchRef}
            placeholder="Search patient name or lab number "
            filterText={searchTerm}
            onFilterTextChange={(searchTerm) => setSearchTerm(searchTerm)}
            container="my-0"
          />
        </div>

        <Scrollbars style={{ height: '70vh' }}>
          <LabList
            list={requisitions}
            loading={loading}
            type={props.type}
            rows={rows}
          />
        </Scrollbars>
      </CardBody>
    </Card>
  )
}

export default PastLabRequisition

function LabList({ list, loading, type, rows }) {
  return (
    <>
      {/* {loading && <Loading />} */}
      <Table hover size="sm" bordered>
        <thead>
          <tr>
            <th className="text-center text-white">
              {/* {JSON.stringify(match)} -  */}
              Lab No.
            </th>
            <th className="text-center text-white">Name</th>
            {type === SAMPLE_COLLECTION ? (
              // ||
              //   type === SAMPLE_ANALYSIS ||
              //   type === CHEMICAL_PATHOLOGY_ANALYSIS ||
              //   type === HEMATOLOGY_ANALYSIS
              <th className="text-center text-white">Unit</th>
            ) : (
              <th className="text-center text-white">Test Name</th>
            )}
            {/* {type === DOCTOR_COMMENT && (
              <th className="text-center text-white">Department</th>
            )} */}
            {/* {type === MICRO_SAMPLE_ANALYSIS && (
              <th className="text-center text-white">Test</th>
            )} */}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>

      {!list.length && (
        <p className="alert alert-primary text-center">List is empty.</p>
      )}
    </>
  )
}
