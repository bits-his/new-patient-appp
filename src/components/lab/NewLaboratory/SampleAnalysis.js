import React, { useState } from 'react'
import { Card, CardBody, CardHeader } from 'reactstrap'
// import Scrollbars from 'react-custom-scrollbars';
import { _fetchApi } from '../../../redux/actions/api'
import { apiURL } from '../../../redux/actions'
import { useRouteMatch, useHistory, useLocation } from 'react-router'
import { useEffect } from 'react'
import CustomButton from '../../comp/components/Button'
// import { _customNotify } from "../../utils/helpers";
// import moment from 'moment';
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  refreshPendingList,
  HEMATOLOGY_ANALYSIS,
  CHEMICAL_PATHOLOGY_ANALYSIS,
  refreshHistoryList,
} from '../labRedux/actions'
import { FaEdit, FaTimes } from 'react-icons/fa'
// import LabComments from "../components/LabComments";
import { useQuery } from '../../../hooks'
import Loading from '../../loading'
import BackButton from '../../comp/components/BackButton'
// import LabContainer from "../components/LabContainer";
import LabTestAnalysisResultTable from './LabTestAnalysisResultTable'
import SampleForm from './SampleForm'

export default function SampleAnalysis({ department }) {
  const dispatch = useDispatch()
  const history = useHistory()
  const match = useRouteMatch()
  const location = useLocation()
  const isHistory = location.pathname.includes('history')
  const isHema = location.pathname.includes('hematology-analysis')
  const isChemPath = location.pathname.includes('chemical-pathology-analysis')
  const labno = match.params.labno
  const patientId = match.params.patientId
  // const facility = useSelector((state) => state.facility.info);
  // const isHospital = facility.type === "hospital";
  let query = useQuery()
  const view = query.get('view')
  const request_id = query.get('request_id')

  const [patientInfo, setPatientInfo] = useState({})
  const [labs] = useState([])
  const [editting, setEditting] = useState(false)

  const getPatientLabInfo = useCallback(() => {
    _fetchApi(
      `${apiURL()}/lab/request/history/${patientId}/${labno}/${request_id}`,
      (data) => {
        if (data.success) {
          setPatientInfo(data.results[0])
        }
      },
      (err) => console.log(err),
    )
  }, [patientId, request_id, labno])

  // const getPendingAnalysis = useCallback(
  //   () => {
  //     _fetchApi(
  //       `${apiURL()}/lab/collected/${labno}/${department}`,
  //       (data) => {
  //         if (data.success) {
  //           let newList = [];
  //           data.results.forEach((i) =>
  //             newList.push({
  //               ...i,
  //               n_unit: i.unit,
  //               n_range_from: i.range_from,
  //               n_range_to: i.range_to,
  //             })
  //           );
  //           setLabs(newList);
  //         }
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );
  //   },
  //   [labno]
  // );

  useEffect(() => {
    if (patientId && labno) {
      getPatientLabInfo()
      // getPendingAnalysis();
    }

    if (isHistory) {
      setEditting(false)
    } else {
      setEditting(true)
    }
  }, [getPatientLabInfo, isHistory])

  const submitCb = () => {
    if (department === 'Chemical Pathology') {
      history.push('/me/lab/chemical-pathology-analysis')
      dispatch(refreshPendingList(CHEMICAL_PATHOLOGY_ANALYSIS, department))
      dispatch(refreshHistoryList(CHEMICAL_PATHOLOGY_ANALYSIS, department))
    } else {
      history.push('/me/lab/hematology-analysis')
      dispatch(refreshPendingList(HEMATOLOGY_ANALYSIS, department))
      dispatch(refreshHistoryList(HEMATOLOGY_ANALYSIS, department))
    }
  }

  // const handleResultChange = (val, item) => {
  //   let newList = [];
  //   labs.forEach((i) => {
  //     if (i.test === item.test) {
  //       // let flag = '';
  //       // if(val)
  //       newList.push({ ...item, result: val });
  //     } else {
  //       newList.push(i);
  //     }
  //   });
  //   setLabs(newList);
  // };

  // const handleUnitChange = (val, item) => {
  //   let newList = [];
  //   labs.forEach((i) => {
  //     if (i.test === item.test) {
  //       // let flag = '';
  //       // if(val)
  //       newList.push({ ...item, result: val });
  //     } else {
  //       newList.push(i);
  //     }
  //   });
  //   setLabs(newList);
  // };

  // const handleRangeFromChange = (val, item) => {
  //   let newList = [];
  //   labs.forEach((i) => {
  //     if (i.test === item.test) {
  //       // let flag = '';
  //       // if(val)
  //       newList.push({ ...item, n_range_from: val });
  //     } else {
  //       newList.push(i);
  //     }
  //   });
  //   setLabs(newList);
  // };

  // const handleRangeToChange = (val, item) => {
  //   let newList = [];
  //   labs.forEach((i) => {
  //     if (i.test === item.test) {
  //       // let flag = '';
  //       // if(val)
  //       newList.push({ ...item, n_range_to: val });
  //     } else {
  //       newList.push(i);
  //     }
  //   });
  //   setLabs(newList);
  // };

  // const handleSubmit = () => {
  //   setLoading(true);

  //   const success = () => {
  //     _customNotify("Result submitted");
  //     if (department === "Chemical Pathology") {
  //       history.push("/me/lab/chemical-pathology-analysis");
  //       dispatch(refreshPendingList(CHEMICAL_PATHOLOGY_ANALYSIS, department));
  //       dispatch(refreshHistoryList(CHEMICAL_PATHOLOGY_ANALYSIS, department));
  //     } else {
  //       history.push("/me/lab/hematology-analysis");
  //       dispatch(refreshPendingList(HEMATOLOGY_ANALYSIS, department));
  //       dispatch(refreshHistoryList(HEMATOLOGY_ANALYSIS, department));
  //     }
  //   };

  //   for (let i = 0; i < labs.length; i++) {
  //     _updateApi(`${apiURL()}/lab/result/new`, labs[i]);

  //     if (i === labs.length - 1) {
  //       success();
  //     }
  //   }
  // };

  const dept =
    (labs &&
      labs.length &&
      labs[0].department_head &&
      labs[0].department_head.toUpperCase()) ||
    ''

  return (
    <>
      <BackButton />
      <Card>
        <CardHeader className="d-flex flex-row justify-content-between align-items-center">
          <h5>
            {isHema
              ? 'Haematology Analysis'
              : isChemPath
              ? 'Chemistry'
              : 'Sample Analysis'}
          </h5>
          <CustomButton
            color="danger"
            size="sm"
            onClick={() => history.goBack()}
          >
            <FaTimes color="#fff" size="16" className="mr-1" />
            Close
          </CustomButton>
        </CardHeader>

        <CardBody>
          {/* {JSON.stringify(patientInfo)} */}
          <SampleForm
            labno={labno}
            patientInfo={patientInfo}
            historyMode="read"
            otherInfo={{
              label: 'Sample Collected',
              value: labs && labs.length && labs[0].sample_collected_at,
            }}
          />
          <div className="d-flex flex-row justify-content-between mb-1">
            <h6>{dept}</h6>
            {view ? null : !editting ? (
              <CustomButton size="sm" onClick={() => setEditting(true)}>
                <FaEdit className="mr-1" /> Edit
              </CustomButton>
            ) : null}
          </div>

          {JSON.stringify(labs)}
          {/* <Scrollbars autoHide style={{ height: 420 }}> */}

          {/* {isHistory ? ( */}

          {view ? (
            <LabTestAnalysisResultTable
              patientId={patientId}
              labno={labno}
              department={department}
              submitCb={submitCb}
              // labs={labs}
              editting={editting}
              isHistory={isHistory}
              toggleEdit={() => setEditting((p) => !p)}
              // getResults={getPendingAnalysis}
            />
          ) : (
            <LabTestAnalysisResultTable
              patientId={patientId}
              labno={labno}
              department={department}
              submitCb={submitCb}
              // labs={labs}
              editting={editting}
              isHistory={isHistory}
              toggleEdit={() => setEditting((p) => !p)}
              // getResults={getPendingAnalysis}
            />
          )}

          {/* // ) : (
          //   <ResultsTable labs={labs} handleResultChange={handleResultChange} />
          // )} */}

          {/* </Scrollbars> */}

          {/* {isHistory ? null : (
            <center>
              
            </center>
          )} */}
        </CardBody>
      </Card>
    </>
  )
}

// function ResultsTable({ labs, handleResultChange }) {
//   return (
//     <Table striped>
//       <thead>
//         <tr>
//           <th className="text-center">S/N</th>
//           <th className="text-center">Test Name</th>
//           <th className="text-center">Result</th>
//           <th className="text-center">Unit</th>
//           <th className="text-center">Range</th>
//         </tr>
//       </thead>
//       <tbody>
//         {labs.map((item, i) => (
//           <tr
//             key={i}
//             style={{
//               background:
//                 item.result && item.result !== ""
//                   ? parseFloat(item.result) > parseFloat(item.n_range_to)
//                     ? "#DC143C"
//                     : parseFloat(item.result) < parseFloat(item.n_range_from)
//                     ? "#F0E68C"
//                     : "#7FFF00"
//                   : "",
//               color:
//                 item.result && item.result !== ""
//                   ? parseFloat(item.result) > parseFloat(item.n_range_to)
//                     ? "#fff"
//                     : parseFloat(item.result) < parseFloat(item.n_range_from)
//                     ? "#000"
//                     : "#000"
//                   : "",
//             }}
//           >
//             <td className="w-5">{i + 1}</td>
//             <td className="w-25">{item.description}</td>
//             <td className="text-center w-25">
//               <Input
//                 type="text"
//                 placeholder="Write your result here..."
//                 value={item.result}
//                 onChange={(e) => handleResultChange(e.target.value, item)}
//               />
//             </td>
//             <td>{item.unit}</td>
//             {/* <td className="text-center w-20">
//                     <Input
//                       type="text"
//                       placeholder="unit"
//                       // className='w-50'
//                       value={item.n_unit}
//                       onChange={(e) => handleUnitChange(e.target.value, item)}
//                     />
//                   </td> */}
//             <td>
//               {item.range_from} - {item.range_to}
//             </td>
//             {/* <td className="row">
//                     <Input
//                       type="text"
//                       placeholder="from"
//                       className="col-md-5 mx-1"
//                       value={item.n_range_from}
//                       onChange={(e) =>
//                         handleRangeFromChange(e.target.value, item)
//                       }
//                     />
//                     <Input
//                       type="text"
//                       placeholder="to"
//                       className="col-md-5 mx-1"
//                       value={item.n_range_to}
//                       onChange={(e) =>
//                         handleRangeToChange(e.target.value, item)
//                       }
//                     />
//                   </td> */}
//           </tr>
//         ))}
//       </tbody>
//     </Table>
//   );
// }
