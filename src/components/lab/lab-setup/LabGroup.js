import React, { useEffect, useRef, useState } from 'react'
import { Row, Col } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { apiURL } from '../../../redux/actions'
import { _fetchApi, _fetchApi2, _postApi } from '../../../redux/actions/api'
import LabTree from '../components/LabTree'
import { getAllLabServices } from '../../../redux/actions/lab'
import RadioGroup from '../../comp/components/RadioGroup'
import StandaloneTestForm from './components/StandaloneTestForm'
import GroupedTestForm from './components/GroupedTestForm'
import { getSpecimenList, postLabSetup, queryLabSetup } from './helper'
import { _customNotify, _warningNotify } from '../../utils/helpers'
import { useHistory } from 'react-router'
import SuccessModal from './components/SuccessModal'

function LabGroup() {
  const headRef = useRef()
  const dispatch = useDispatch()
  const history = useHistory()
  const facilityId = useSelector((state) => state.auth.user.facilityId)
  const [specimenList, setSpecimenList] = useState([])
  const [labHeads, setLabHeads] = useState([])
  const [reportTypes, setReportTypes] = useState([])
  const modeList = ['Stand Alone Test', 'Grouped Test']
  const [formMode, setFormMode] = useState(modeList[0])
  const [formState, setFormState] = useState('new_test')
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [successModal, setSuccessModal] = useState(false)

  const labServices = useSelector((state) => state.lab.labservices)

  const toggleSuccessModal = () => {
    setSuccessModal((p) => !p)
  }

  const _getAllLabServices = () => {
    dispatch(getAllLabServices())
    _fetchApi(
      `${apiURL()}/lab/service/head`,
      (data) => {
        if (data.success) {
          setLabHeads(data.results)
          // let newList = []
          // data.results.forEach(item => {
          //   newList.push(item.head)
          // })
        }
      },
      (err) => {
        console.log(err)
      },
    )
  }

  useEffect(() => {
    _getAllLabServices()
  }, [])

  const getNextCode = (head) => {
    queryLabSetup({ head, facilityId, query_type: 'next subhead' }, (resp) => {
      if (resp && resp.results) {
        setForm((p) => ({ ...p, subhead: resp.results[0].next_code }))
      }
    })
  }

  const getReportTypes = () => {
    queryLabSetup({ facilityId, query_type: 'report_type' }, (resp) => {
      if (resp && resp.results) {
        setReportTypes(
          resp.results.map((a) => a.report_type),
          // .split('_').join(' ')
        )
      }
    })
  }

  useEffect(() => {
    getReportTypes()
    getSpecimenList((d) => {
      setSpecimenList(d)
    })
  }, [])

  const handleAddNode = (node) => {
    // console.log(node)
    setFormState('new_test')
    setForm((p) => ({
      ...p,
      head: node.title,
    }))
    getNextCode(node.title)
  }

  const handleChange = ({ target: { name, value } }) => {
    if (name === 'description' && form.label_name === '') {
      setForm((p) => ({ ...p, [name]: value, label_name: value }))
    } else {
      setForm((p) => ({ ...p, [name]: value }))
    }
  }
  const handleRadioChange = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleSubmit = (callback = (f) => f) => {
    // _postApi(`${apiURL()}/lab/lab-setup`)
    setLoading(true)
    postLabSetup(
      { ...form, query_type: formState },
      () => {
        setLoading(false)
        _customNotify('Success')
        _getAllLabServices()
        if (formState === 'new_test') {
          callback()
        }
      },
      () => {
        setLoading(false)
        _warningNotify('An error occured, please try again later.')
      },
    )
  }

  const getRoute = (route, obj = {}) => {
    let qString = Object.keys(obj)
      .map((a) => a + '=' + obj[a])
      .join('&')
    return `${route}?${qString}`
  }

  const submitStandAloneTestWithNext = () => {
    handleSubmit(() => {
      history.push(
        getRoute('/me/lab/setup', {
          'lab-type': 'Barcode Setup',
          test: form.subhead,
          formMode: formMode,
          department: form.lab_code,
          test_name: form.description,
          unit: form.unit_name,
          group: form.description,
          groupCode: form.head,
        })
      //   `/me/lab/setup?lab-type=Barcode Setup&
      // test=${form.subhead}&formMode=${formMode}&department=${form.lab_code}&test_name=${form.description}&unit=${form.unit_name}&group=${form.description}&groupCode=${form.head}`,
      )
      
    })
  }

  // const submitGroupedTest = (cb) => {
  //   setLoading(true)
  //   postLabSetup(
  //     { ...form, query_type: 'new_test' },
  //     () => {
  //       setLoading(false)
  //       _customNotify('Success')
  //       cb()
  //     },
  //     () => {
  //       setLoading(false)
  //       _warningNotify('An error occured, please try again later.')
  //     },
  //   )
  // }

  const addTestUnits = () => {
    handleSubmit(() => {
      history.push(
        `/me/lab/setup?lab-type=Test Unit&test=${form.subhead}&formMode=${formMode}&department=${form.lab_code}&test_name=${form.description}&unit=${form.unit_name}&group=${form.description}&groupCode=${form.subhead}`,
      )
    })
  }

  const handleAutocompleteChange = (value, name) => {
    // console.log(d)
    if (value && value.length) {
      let val = typeof value === 'string' ? value : value[0]
      if (name === 'head') {
        setForm((p) => ({ ...p, [name]: val.subhead }))
        getNextCode(val.subhead)
      } else {
        setForm((p) => ({ ...p, [name]: val.specimen }))
      }
    }
  }

  const handleTreeEdit = (node) => {
    setForm({ ...node, head: node.subhead, subhead: node.title })
    headRef.current.setState({ text: node.subhead })
    setFormState('update_test')
    if (node.children && node.children.length) {
      setFormMode(modeList[1])
    } else {
      setFormMode(modeList[0])
    }
  }

  return (
    <Row>
      <Col md={5}>
        <LabTree
          handleEditTree={handleTreeEdit}
          handleAddNode={handleAddNode}
          labServices={labServices}
        />
      </Col>

      <Col md={7} className="p-0">
        {/* {JSON.stringify(form)} */}
        <RadioGroup
          label="Select Test Type"
          value={formMode}
          options={modeList.map((a) => ({ name: a, label: a }))}
          onChange={(a, b) => setFormMode(b)}
        />
        {/* <div> */}
        {/* {JSON.stringify(labHeads)} */}
        {formMode === modeList[0] && (
          <StandaloneTestForm
            headRef={headRef}
            labHeads={labHeads}
            form={form}
            reportTypes={reportTypes}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            handleSubmit={handleSubmit}
            loading={loading}
            handleSubmitAndNext={submitStandAloneTestWithNext}
            specimenList={specimenList}
            handleAutocompleteChange={handleAutocompleteChange}
            formState={formState}
          />
        )}
        {formMode === modeList[1] && (
          <GroupedTestForm
            labHeads={labHeads}
            headRef={headRef}
            form={form}
            reportTypes={reportTypes}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            specimenList={specimenList}
            handleAutocompleteChange={handleAutocompleteChange}
            addTestUnits={addTestUnits}
            handleSubmit={handleSubmit}
            formState={formState}
          />
        )}
        {/* </div> */}
      </Col>
      <SuccessModal
        isOpen={successModal}
        toggle={toggleSuccessModal}
        nextPageText="Go to Create Groups"
        nextPage={
          formMode === modeList[0]
            ? `/me/lab/setup?lab-type=Barcode Setup&test=${form.subhead}&formMode=${formMode}&department=${form.lab_code}&test_name=${form.description}&unit=${form.unit_name}&group=${form.description}`
            : `/me/lab/setup?lab-type=Test Unit&test=${form.subhead}&formMode=${formMode}&department=${form.lab_code}&test_name=${form.description}&unit=${form.unit_name}&group=${form.description}`
        }
      />
    </Row>
  )
}

// const mapStateToProps = ({
//   transactions: { accHeads, loadingAccHead },
//   account: { LabGroup, accChartTree },
// }) => ({
//   accHeads,
//   loadingAccHead,
//   LabGroup,
//   accChartTree,
// })

// const mapDispatchToProps = (dispatch) => ({
//   getAccHeads: () => dispatch(getAccHeads()),
//   createAccHead: (data, callback) => dispatch(createAccHead(data, callback)),
//   getAccChart: () => dispatch(getAccChart()),
// })

export default LabGroup
