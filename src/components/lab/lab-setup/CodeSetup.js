import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'reactstrap'
import useQuery from '../../../hooks/useQuery'
// import { apiURL } from '../../../redux/actions'
// import { _fetchApi, _fetchApi2 } from '../../../redux/actions/api'
import {
  getAllLabServices,
  getDepartmentList,
  getGroupList,
  getUnitsList,
} from '../../../redux/actions/lab'
// import AutoComplete from '../../comp/components/AutoComplete'
// import CustomForm from '../../comp/components/CustomForm'
import CustomTable from '../../comp/components/CustomTable'
import RadioGroup from '../../comp/components/RadioGroup'
import LabTree from '../components/LabTree'
import {
  bookingSetupTable,
  codeSetupTable,
  // fields,
} from './components/codeSetupForm'
import { processBatchSetup, queryLabSetup, queryTests } from './helper'
import SetupForm from './SetupForm'
// import Checkbox from '../../comp/components/Checkbox'
import CustomButton from '../../comp/components/Button'
import { _customNotify, _warningNotify } from '../../utils/helpers'
import { useHistory } from 'react-router'
import SearchBar from '../../record/SearchBar'

function CodeSetup() {
  const groupInputRef = useRef()
  const dispatch = useDispatch()
  const query = useQuery()
  const history = useHistory()
  const type = query.get('lab-type')
  const testCode = query.get('test')
  const testName = query.get('test_name')
  const initialFormMode = query.get('formMode')
  const groupCode = query.get('groupCode')
  const groupName = query.get('group')
  const labServices = useSelector((state) => state.lab.labservices)
  const facilityId = useSelector((state) => state.auth.user.facilityId)
  const isBarcodePage = type.includes('Barcode')

  const modeList = ['Stand Alone Test', 'Grouped Test']
  const [formMode, setFormMode] = useState(modeList[0])
  const [testList, setTestList] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterText, setFilterText] = useState(testName || '')

  const [selectedDepartment, setSelectedDepartment] = useState({
    subhead: 'all',
  })
  const [selectedUnit, setSelectedUnit] = useState('')

  const [form, setForm] = useState({})

  const handleChange = ({ target: { name, value } }) =>
    setForm((p) => ({ ...p, [name]: value }))

  const getTestInfo = (test = '') => {
    queryLabSetup({ query_type: 'test_info', subhead: test }, (resp) => {
      if (resp && resp.results) {
        setForm(resp.results[0])
      }
    })
  }

  const getTestsByCodeType = useCallback(() => {
    queryLabSetup({ query_type: 'all', facilityId }, (data) => {
      if (data && data.results) {
        setTestList(data.results)
      }
    })
    // queryLabSetup(
    //   {
    //     query_type: type,
    //     formMode: formMode,
    //     head: selectedDepartment.subhead,
    //     unit_name: selectedUnit,
    //   },
    //   (resp) => {
    //     if (resp && resp.results) {
    //       setTestList(resp.results)
    //     }
    //   },
    // )
  // }, [formMode, type, selectedDepartment.subhead, selectedUnit])
}, [facilityId])

  useEffect(() => {
    // if (initialFormMode) {
    //   setFormMode(initialFormMode)
    // }
    if (testCode) {
      getTestInfo(testCode)
    }
    getTestsByCodeType()
  }, [testCode, getTestsByCodeType])

  useEffect(() => {
    dispatch(getDepartmentList())
    dispatch(getUnitsList(selectedDepartment.subhead))
    dispatch(getGroupList(selectedDepartment.subhead))
  }, [dispatch, selectedDepartment.subhead])

  const onTableChange = (key, val, it) => {
    console.log(key, val, it)
    let final = []
    testList.forEach((item) => {
      if (item.description === it.description && item.subhead === it.subhead) {
        final.push({ ...item, [key]: val, modified: true })
      } else {
        final.push(item)
      }
    })

    setTestList(final)
  }

  useEffect(() => {
    dispatch(getAllLabServices())
  }, [dispatch])

  const getTestsByGroup = (group, callback = (f) => f) => {
    queryTests({ group, facilityId }, (resp) => {
      if (resp && resp.results) {
        setTestList(resp.results)
        callback()
      }
    })
  }

  useEffect(() => {
    if (groupCode) {
      // alert(groupCode)
      getTestsByGroup(groupCode, () => {
        groupInputRef.current.setState({ text: groupName })
      })
    }
  }, [groupCode])

  const onEditClick = (node) => {
    console.log(node)
  }

  const handleSubmit = () => {
    setLoading(true)
    let finalList = []
    testList.forEach((item) => {
      if (item.modified) {
        finalList.push(item)
      }
    })

    processBatchSetup(
      finalList,
      'code_setup',
      () => {
        setLoading(false)
        _customNotify('Updates saved')
        dispatch(getAllLabServices())
        if (isBarcodePage) {
          history.push(
            `/me/lab/setup?lab-type=Print Setup&test=${form.subhead}&formMode=${formMode}&department=${form.lab_code}&unit=${form.unit_name}&group=${form.description}`,
          )
        } else {
          history.push(
            `/me/lab/setup?lab-type=Account&test=${form.subhead}&formMode=${formMode}&department=${form.lab_code}&unit=${form.unit_name}&group=${form.description}`,
          )
        }
      },
      () => {
        setLoading(false)
        _warningNotify('An error occured')
      },
    )
  }

  const onFilterTextChange = (value) => {
    setFilterText(value)
  }

  const rows = []
  testList.forEach((test) => {
    if (
      test.description.toLowerCase().indexOf(filterText.toLowerCase()) === -1 &&
      (test.label_name &&
        test.label_name.toLowerCase().indexOf(filterText.toLowerCase())) === -1
    )
      return
    rows.push(test)
  })

  // const getListByGroup = (_group) => {
  //   queryLabSetup(
  //     {
  //       query_type: 'by_group',
  //       subhead: _group,
  //       formMode: formMode,
  //       head: selectedDepartment.subhead,
  //       unit_name: selectedUnit,
  //     },
  //     (resp) => {
  //       if (resp && resp.results) {
  //         setTestList(resp.results)
  //       }
  //     },
  //   )
  // }

  return (
    <Row>
      <Col md={5}>
        <LabTree
          // handleEditTree={handleTreeEdit}
          labServices={labServices}
          handleEditTree={onEditClick}
          showAdd={false}
        />
      </Col>
      <Col>
        {/* {JSON.stringify({testList})} */}
        {/* <RadioGroup
          label="Select Test Type"
          value={formMode}
          options={modeList.map((a) => ({ name: a, label: a }))}
          onChange={(a, b) => setFormMode(b)}
        /> */}
        <SetupForm
          // departmentList={departmentList}
          setSelectedDepartment={setSelectedDepartment}
          // unitsList={unitsList}
          setSelectedUnit={setSelectedUnit}
          // groupList={groupList}
          groupRef={groupInputRef}
          setSelectedGroup={(group) => {
            // setFormMode(modeList[1])
            // setFilterText(group.description)
            getTestsByGroup(group.subhead)
          }}
        />

        <div className="d-flex flex-direction-row justify-content-end my-2">
          <CustomButton
            loading={loading}
            color="success"
            className=""
            onClick={handleSubmit}
          >
            {isBarcodePage ? 'Save & Setup Lab Number' : 'Save & Setup Pricing'}
          </CustomButton>
        </div>
        <SearchBar
          placeholder="Search by test name or label"
          filterText={filterText}
          onFilterTextChange={onFilterTextChange}
        />
        <div style={{ height: '50vh', overflow: 'scroll' }}>
          <CustomTable
            bordered
            striped
            size="sm"
            fields={
              type.toLowerCase() === 'barcode setup'
                ? codeSetupTable(onTableChange)
                : bookingSetupTable(onTableChange)
            }
            data={rows}
          />
        </div>
        <div className="d-flex flex-direction-row justify-content-end my-2">
          <CustomButton
            loading={loading}
            color="success"
            className=""
            onClick={handleSubmit}
          >
            {isBarcodePage ? 'Save & Setup Lab Number' : 'Save & Setup Pricing'}
          </CustomButton>
        </div>

        {/* <Table bordered striped size="sm">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Stand Alone Test</th>
              <th>Department-wise Grouping</th>
              <th>Test-wise Grouping</th>
            </tr>
          </thead>
          <tbody>
            {testList.map((item, i) => (
              <tr key={i}>
                <td>{item.description}</td>
                <td>
                  <input type='checkbox'
                    id={`check-${item.description}-${item.subhead}-${i}`}
                    name="label_type"
                    // value={item.label_type}
                    checked={item.label_type === 'single'}
                    onChange={() => console.log(i, item)}
                  />
                </td>
                <td>
                  <input type='checkbox'
                    name="label_type"
                    id={`check-${item.description}-${item.subhead}-${i}`}
                    // value={item.label_type}
                    checked={item.label_type === 'grouped'}
                    onChange={() => console.log(i, item)}
                  />
                </td>
                <td>
                  <input type='checkbox'
                    name="label_type"
                    id={`check-${item.description}-${item.subhead}-${i}`}
                    // value={item.label_type}
                    checked={item.label_type === 'grouped_single'}
                    onChange={() => console.log(i, item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table> */}
      </Col>
    </Row>
  )
}

export default CodeSetup
