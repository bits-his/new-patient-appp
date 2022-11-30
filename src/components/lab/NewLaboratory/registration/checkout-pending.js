import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { apiURL } from '../../../../redux/actions'
import { _fetchApi } from '../../../../redux/actions/api'
import { saveTransaction } from '../../../doc_dash/actions/helpers/processLabTransaction'
import {
  getPatientLabTestsByVisit,
  updatePendingLabReq,
} from '../../../doc_dash/actions/labActions'
// import { getPatientInfo } from '../../../doc_dash/actions/patientsActions'
import { generateReceiptNo } from '../../../utils/helpers'
import DisplayDepartemnt from '../DisplayDepartment'

const LAB_HOME_ROUTE = '/me/lab/patients'

function CheckoutPending() {
  const { patientId, visitId } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [selectedLabs, setSelectedLabs] = useState([])
  const [receiptDisplayed, setReceiptDisplayed] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [patientInfo, setPatientInfo] = useState({})
  const [form, setForm] = useState({ modeOfPayment: 'CASH' })
  const user = useSelector((state) => state.auth.user)

  const getTestDetails = useCallback(() => {
    
    setLoading(true)
    getPatientLabTestsByVisit(
      patientId,
      visitId,
      (data) => {
        setLoading(false)
        if (data) {
          // console.log(data.labInvestigations);
          setSelectedLabs(data.detail)
          setReceiptDisplayed(data.summary)
          let amt = data.summary.reduce((a, b) => a + parseFloat(b.price), 0)
          console.log(data.summary, data.detail)
          setTotalAmount(amt)
        }
      },
      (err) => {
        console.log(err)
        setLoading(false)
      },
    )
  }, [patientId, visitId])

  const _getPatientInfo = useCallback(() => {
    //   dispatch(
    _fetchApi(`${apiURL()}/lab/patient/info/${patientId}`, (data) => {
      if (data) {
        console.log(data)
        setPatientInfo(data.results[0])
      }
    })
    // getpatientf(
    //   patientId,
    //   (data) => {
    //     data.patientId = data.patientHospitalId;
    //     data.name = data.patient_name;
    //     setPatientInfo(data);
    //   },
    //   (err) => console.log(err)
    // );

    //   );
  }, [patientId])

  useEffect(() => {
    getTestDetails()
    _getPatientInfo()
  }, [getTestDetails, _getPatientInfo])

  //   const closeForm = () => {
  //     history.goBack();
  //   };

  const gotoList = () => {
    history.push(LAB_HOME_ROUTE)
  }

  const submit = () => {
    gotoList()
    // let accNo = patientId.split('-')[0]
    patientInfo.clientAccount = patientInfo.accountNo
    patientInfo.modeOfPayment = form.modeOfPayment

    generateReceiptNo((rec, receiptNo) => {
      saveTransaction(
        receiptDisplayed,
        patientId,
        patientInfo,
        user,
        rec,
        receiptNo,
        {},
      )
    })

    updatePendingLabReq('process', visitId, patientId)
  }

  return (
    <div>
      {/* {JSON.stringify(receiptDisplayed)} */}
      <DisplayDepartemnt
        selectedLabs={selectedLabs}
        receiptDisplayed={receiptDisplayed}
        totalAmount={totalAmount}
        patientInfo={patientInfo}
        formIsValid={true}
        existingPatientId={patientInfo.patientHospitalId}
        openReceipt={(f) => f}
        setMainTxnList={(f) => f}
        closeForm={gotoList}
        removeTest={(f) => f}
        canRemoveTest={false}
        loadingList={loading}
        cb={submit}
      />
    </div>
  )
}

export default CheckoutPending
