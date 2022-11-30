import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getDepartmentList,
  getGroupList,
  getUnitsList,
} from '../../../redux/actions/lab'
import AutoComplete from '../../comp/components/AutoComplete'

function SetupForm(props) {
  let defaultGroupRef = useRef()
  const {
    //   departmentList,
    selectedDepartment = {},
    setSelectedDepartment,
    //   unitsList,
    setSelectedUnit,
    //   groupList,
    setSelectedGroup,
  } = props
  const dispatch = useDispatch()
  const departmentList = useSelector((state) => state.lab.departmentList)
  const unitsList = useSelector((state) => state.lab.unitList)
  const groupList = useSelector((state) => state.lab.groupList)
  
  
  useEffect(() => {
    dispatch(getDepartmentList())
    dispatch(getUnitsList(selectedDepartment.subhead))
    dispatch(getGroupList(selectedDepartment.subhead))
  }, [dispatch, selectedDepartment.subhead])

  return (
    <div className="py-2 row m-0">
      <AutoComplete
        containerClass="col-md-6"
        label="Select Department"
        options={departmentList}
        labelKey="description"
        onChange={(i) => {
          if (i && i.length) {
            setSelectedDepartment(i[0])
            console.log(i)
          }
        }}
        onInputChange={(e) => {}}
      />
      <AutoComplete
        containerClass="col-md-6"
        label="Select Unit"
        options={unitsList}
        labelKey="unit_name"
        onChange={(i) => {
          if (i && i.length) {
            setSelectedUnit(i[0].unit_name)
            
          }
        }}
        onInputChange={(e) => {}}
      />
      <AutoComplete
        _ref={props.groupRef ? props.groupRef : defaultGroupRef}
        containerClass="col-md-6"
        label="Select Group"
        options={groupList}
        labelKey="description"
        onChange={(i) => {
          if (i && i.length) {
            // console.log(i[0])
            setSelectedGroup(i[0])
          }
        }}
      />
      {/* <CustomForm fields={fields(form)} handleChange={handleChange} /> */}
    </div>
  )
}

export default SetupForm
