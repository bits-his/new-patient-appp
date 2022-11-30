import React, { useState, useEffect } from 'react'
import { Card, CardBody, Table, CardHeader } from 'reactstrap'
import SampleForm from './SampleForm'
// import CheckBoxItem from '../../theater/operation-notes/CheckBoxItem';
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom'
import {
  _fetchApi,
  _fetchApi2,
  _postApi,
  _updateApi,
} from '../../../redux/actions/api'
import { apiURL, QUEUE_MGT_SYS } from '../../../redux/actions'
import { toCamelCase, today, _customNotify } from '../../utils/helpers'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { useCallback } from 'react'
import CustomButton from '../../comp/components/Button'
import { useDispatch, useSelector } from 'react-redux'
import {
  refreshHistoryList,
  refreshPendingList,
  SAMPLE_COLLECTION,
} from '../labRedux/actions'
import { useQuery } from '../../../hooks'
import moment from 'moment'

export default function SampleCollection() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const isHistory = location.pathname.includes('history')
  const query = useQuery()
  const request_id = query.get('request_id')

  // const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(false)
  const [patientInfo, setPatientInfo] = useState({})
  const [labs, setLabs] = useState([])
  const [labList, setLabList] = useState([])
  const [patientHistory, setHistory] = useState('')
  // const [department, setDepartment] = useState('')
  const [qmsDeptList, setQMSDeptList] = useState([])
  const user = useSelector((state) => state.auth.user)

  // const handleHistoryChange = (val) => {
  //   setHistory(val);
  // };

  const match = useRouteMatch()

  // const labno = match.params.labno;
  const patientId = match.params.patientId

  const getPatientInfo = useCallback(() => {
    _fetchApi(
      `${apiURL()}/lab/patient/info/${patientId}`,
      (data) => {
        if (data.success) {
          setPatientInfo(data.results[0])
        }
      },
      (err) => console.log(err),
    )
  }, [patientId])

  // const getPatientHistory = useCallback(
  //   () => {
  //     _fetchApi(
  //       `${apiURL()}/lab/patient/info/${patientId}`,
  //       (data) => {
  //         if (data.success) {
  //           setPatientInfo(data.results[0]);
  //         }
  //       },
  //       (err) => console.log(err),
  //     );
  //   },
  //   [patientId],
  // );

  const getLabInfo = useCallback(() => {
    _fetchApi(
      `${apiURL()}/lab/labinfo/${patientId}/${request_id}`,
      (data) => {
        if (data.success) {
          setHistory(data.labHistory)
          setLabList(data.labInfo)
          let newList = []
          data.labInfo.forEach((i) => {
            let itemIndex = newList.findIndex((j) => j.specimen === i.specimen)
            if (itemIndex === -1) {
              newList.push(i)
            } else {
              let temp = []
              // let existing = newList.find(j => j.specimen === i.specimen);
              newList.forEach((n) => {
                if (n.specimen === i.specimen) {
                  temp.push({
                    ...i,
                    group_head: `${n.group_head}, ${i.group_head}`,
                  })
                } else {
                  temp.push(n)
                }
              })
              newList = temp
            }
          })
          setLabs(newList)

          // setCreatedAt(data.labInfo[0].created_at);
        }
      },
      (err) => console.log(err),
    )
  }, [patientId, request_id])

  const handleSampleCollected = (item) => {
    if (item.status === 'pending') {
      let newList = []
      labs.forEach((i) => {
        if (i.specimen === item.specimen) {
          newList.push({ ...i, status: 'Sample Collected' })
        } else {
          newList.push(i)
        }
      })
      setLabs(newList)

      let newLabList = []
      labList.forEach((i) => {
        if (i.specimen === item.specimen) {
          newLabList.push({ ...i, status: 'Sample Collected' })
        } else {
          newLabList.push(i)
        }
      })
      setLabList(newLabList)
      // if (!qmsDeptList.includes(item.qms_dept_id)) {
      // setQMSDeptList((p) => [...p, item.qms_dept_id]);
      // }
    } else {
      let newList = []
      labs.forEach((i) => {
        if (i.specimen === item.specimen) {
          newList.push({ ...i, status: 'pending' })
        } else {
          newList.push(i)
        }
      })
      setLabs(newList)

      let newLabList = []
      labList.forEach((i) => {
        if (i.specimen === item.specimen) {
          newLabList.push({ ...i, status: 'pending' })
        } else {
          newLabList.push(i)
        }
      })
      setLabList(newLabList)
      // if(qmsDeptList.includes(item.qms_dept_id)) {
      // setQMSDeptList(qmsDeptList.filter(j => j !== item.qms_dept_id))
      // }

      // setLabList((p) =>
      //   p
      //     .filter((j) => j.specimen === item.specimen)
      //     .map((m) => ({ ...m, status: "pending" }))
      // );
    }
  }

  const submit = () => {
    // _postApi()
    setLoading(true)

    const success = () => {
      _customNotify('Changes Saved!')
      getLabInfo()
      history.push('/me/lab/sample-collection')
      dispatch(refreshPendingList(SAMPLE_COLLECTION))
      dispatch(refreshHistoryList(SAMPLE_COLLECTION))
      updateQMS()
      // processTransaction()
    }

    for (let i = 0; i < labList.length; i++) {
      let currentLab = labList[i]

      // console.log(currentLab)

      if (currentLab.to_be_analyzed === 'no') {
        currentLab = { ...currentLab, status: 'analyzed' }
      }
      // currentLab.booking_no = labno;
      _updateApi(`${apiURL()}/lab/request/update`, currentLab)
    }

    // _updateApi(
    //   `${apiURL()}/lab/request/save-history`,
    //   {
    //     //  history: patientHistory,
    //     labno },
    //   () => {
    //     setLoading(false);
    //   },
    //   () => {
    //     setLoading(false);
    //   },
    // );

    success()
  }

  useEffect(() => {
    if (patientId) {
      // alert('call')
      getPatientInfo()
      getLabInfo()
    }
  }, [getPatientInfo, patientId])

  const updateQMS = () => {
    let list = []
    labList.forEach((item) => {
      if (item.status === 'Sample Collected') {
        if (!list.includes(item.qms_dept_id)) {
          list.push(item.qms_dept_id)
        }
      }
    })

    // console.log(list)
    list.forEach((item) => {
      _postApi(
        `${QUEUE_MGT_SYS}/api/patient/attend`,
        {
          department_id: item,
        },
        () => {
          console.log('updated QMS')
        },
        (err) => {
          console.log(err)
        },
      )
    })
  }

  const dept =
    (labs &&
      labs.length &&
      labs[0].department &&
      labs[0].department.toUpperCase()) ||
    ''

  // const processTransaction = () => {
  //   let acct = patientId.split('-')[0]

  //   _fetchApi2(
  //     `${apiURL()}/lab/lab-summary?type=sample collection revenue&report_by=${patientId}&from=${today}&to=${today}&facilityId=${
  //       user.facilityId
  //     }`,
  //     (revenueData) => {
  //       console.log(revenueData, 'processing transaction1')
  //       // acct: '5000212'
  //       // amount: '9000'
  //       // fullname: '368-1'
  //       // patient_id: '368-1'
  //       // reference_no: '06102121'
  //       // _fetchApi2(
  //       //   `${apiURL()}/lab/lab-summary?type=pending approval detail&report_by=${patientId}&from=${today}&to=${today}&facilityId=${
  //       //     user.facilityId
  //       //   }`,
  //       // (payablesData) => {
  //       // if (payablesData.results) {
  //       //   console.log(payablesData, 'processing transaction2')
  //       for (let i = 0; i < revenueData.results.length; i++) {
  //         let curr = revenueData.results[i]
  //         // let selected = payablesData.results.find((i) => i.amount === curr.amount)

  //         _postApi(
  //           `${apiURL()}/txn/cashier-approval`,
  //           {
  //             acct,
  //             totalAmount: curr.amount,
  //             receiptNo: curr.reference_no,
  //             // modeOfPayment: 'Cash',
  //             patientId: curr.client_id,
  //             patientName: curr.fullname,
  //             txnType: '',
  //             createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  //             revenueHead: curr.account,
  //             revenueHeadName: curr.account_name,
  //             payablesHead: curr.payable_head,
  //             payablesHeadName: curr.payable_head_name,
  //             receivablesHead: '',
  //             // cashHead : '',
  //             bankName: '',
  //             txn_date: moment().format('YYYY-MM-DD'),
  //             discount: '0',
  //             // discountHead : '',
  //             txn_status: 'pending',
  //             amountPaid: curr.amount,
  //             query_type: 'sample collection',
  //           },
  //           () => {
  //             // getPatientIncome()
  //           },
  //           (err) => {
  //             console.log(err)
  //             // _warningNotify('An error occured!')
  //           },
  //         )
  //       }
  //       // }
  //       //   },
  //       //   (err) => {
  //       //     console.log(err)
  //       //   },
  //       // )
  //     },
  //     (err) => {
  //       console.log(err)
  //     },
  //   )
  // }

  return (
    <Card>
      <CardHeader className="d-flex flex-row justify-content-between align-items-center">
        <h5>PHLEBOTOMY (SPECIMEN COLLECTION)</h5>
        <CustomButton color="danger" size="sm" onClick={() => history.goBack()}>
          <FaTimes color="#fff" size="16" className="mr-1" />
          Close
        </CustomButton>
      </CardHeader>

      <CardBody>
        <SampleForm
          labNoMode="hide"
          patientInfo={patientInfo}
          history={patientHistory}
          historyMode={
            patientHistory && patientHistory !== '' ? 'read' : 'hide'
          }
          otherInfo={{ label: 'Registered', key: 'created_at' }}
          showLabNo={false}
          // handleHistoryChange={handleHistoryChange}
        />
        <h6>{dept}</h6>
        {/* {JSON.stringify(qmsDeptList)} */}
        {/* 
        ============================================================
        {JSON.stringify(labs)} 
        */}
        {/* <Table>
              <thead>
                <th>firstname</th>
                <th>phone</th>
                <th>ad</th>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.ad}</td>
                  </tr>
                ))}
              </tbody>
            </Table> */}
        {/* {location.pathname === '/me/lab/sample-analysis' ||
          location.pathname === '/me/lab/sample-collection' ? ( */}
        {/* {JSON.stringify({ labs, labList })} */}
        <div>
          <Table striped>
            <thead>
              <tr>
                {/* <th>#</th> */}
                <th>Tests</th>
                {/* <th>Test Name</th> */}
                {/* <th>Specimen</th> */}
                <th>Specimen</th>
                {/* <th /> */}
                <th>Sample Status</th>
              </tr>
            </thead>
            <tbody>
              {labs.map((item, i) => (
                <tr key={i}>
                  {/* <td>{item.booking_no}</td> */}
                  {/* <td>{toCamelCase(item.description)}</td> */}
                  <td>{toCamelCase(item.label_name  )}</td>
                  {/* <td>{toCamelCase(item.group_head)}</td> */}
                  {/* <td>Urine</td> */}
                  <td>{item.specimen}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${
                        item.status === 'pending'
                          ? 'btn-primary'
                          : 'btn-success'
                      }`}
                      onClick={() => handleSampleCollected(item)}
                    >
                      {item.status === 'Sample Collected' ? (
                        <>
                          <FaCheck className="mr-1" />
                          Sample Collected
                        </>
                      ) : (
                        'Collect Sample'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {isHistory ? null : (
            <center>
              <CustomButton loading={loading} onClick={submit}>
                Save
              </CustomButton>
            </center>
          )}
        </div>
        {/* ) : null} */}
      </CardBody>
    </Card>
  )
}
