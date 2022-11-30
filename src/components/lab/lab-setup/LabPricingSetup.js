import React, { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from 'reactstrap'
import { getLabSetupAccount } from '../../../redux/actions/lab'
import CustomButton from '../../comp/components/Button'
import CustomForm from '../../comp/components/CustomForm'
import CustomTable from '../../comp/components/CustomTable'
import SearchBar from '../../record/SearchBar'
import { _customNotify, _warningNotify } from '../../utils/helpers'
import { fields } from './components/codeSetupForm'
import { processBatchSetup, queryLabSetup } from './helper'
import SetupForm from './SetupForm'

function LabPricingSetup() {
  const [form, setForm] = useState({})
  const [selectedDepartment, setSelectedDepartment] = useState({})
  const [selectedUnit, setSelectedUnit] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [index, setIndex] = useState('')
  const [loading, setLoading] = useState(false)
  // const data = useSelector((state) => state.lab.lab_setup_account)
  const facilityId = useSelector((state) => state.auth.user.facilityId)
  const dispatch = useDispatch()
  const [allLabList, setAllLabList] = useState([])
  const [filterText, setFilterText] = useState('')

  const getLabSetupAcc = (a = '', b = '', c = '') => {
    dispatch(
      getLabSetupAccount({ department: a, unit: b, group: c, facilityId }),
    )
  }

  useEffect(() => {
    queryLabSetup({ query_type: 'all', facilityId }, (data) => {
      if (data && data.results) {
        setAllLabList(data.results)
      }
    })

    getLabSetupAcc(
      selectedDepartment.subhead,
      selectedUnit,
      selectedGroup.subhead,
    )
  }, [selectedDepartment.subhead, selectedUnit, selectedGroup.subhead])

  const handleChange = ({ target: { name, value } }) =>
    setForm((p) => ({ ...p, [name]: value }))

  const handleSubmit = () => {
    setLoading(true)
    const final = allLabList.filter((item) => item.type === 'update')
    let query_type = 'update_lab_setup_account'

    processBatchSetup(
      final,
      query_type,
      () => {
        setLoading(false)
        _customNotify('Successfully Save')
      },
      () => {
        // alert('Error Occured')
        _warningNotify(false)
      },
    )
    // console.log(final);
    // console.log("final");
  }

  const onFilterTextChange = (value) => {
    setFilterText(value)
  }

  const rows = []
  allLabList.forEach((test) => {
    if (
      test.description.toLowerCase().indexOf(filterText.toLowerCase()) === -1 &&
      (test.label_name &&
        test.label_name.toLowerCase().indexOf(filterText.toLowerCase())) === -1
    )
      return
    rows.push(test)
  })

  return (
    <div>
      {/* {JSON.stringify(selectedGroup,selectedUnit)} */}
      <SetupForm
        setSelectedDepartment={setSelectedDepartment}
        setSelectedUnit={setSelectedUnit}
        setSelectedGroup={setSelectedGroup}
      />
      {/* <div className="py-2">
        <CustomForm fields={fields(form)} handleChange={handleChange} />
      </div> */}

      <SearchBar
          placeholder="Search by test name or label"
          filterText={filterText}
          onFilterTextChange={onFilterTextChange}
        />
      <Scrollbars style={{ height: 500 }}>
        <CustomTable
          fields={[
            { title: 'Name', value: 'description' },
            
            {
              title: 'New Price',
              component: (item, idx) => (
                <div>
                  <Input
                    value={item.price}
                    name="price"
                    onChange={({ target: { name, value } }) => {
                      let arr = []
                      allLabList.forEach((it, i) => {
                        if (it.subhead === item.subhead) {
                          arr.push({
                            ...it,
                            price: value,
                            type: 'update',
                          })
                        } else {
                          arr.push(it)
                        }
                      })

                      setAllLabList(arr)
                      // dispatch({ type: 'GET_LAB_SETUP_ACCOUNT', payload: arr })
                    }}
                  />
                </div>
              ),
            },
            {
              title: 'Old Price',
              component: (item, idx) => (
                <div>
                  <Input
                    value={item.old_price}
                    name="old_price"
                    onChange={({ target: { name, value } }) => {
                      let arr = []
                      allLabList.forEach((it, i) => {
                        if (it.subhead === item.subhead) {
                          arr.push({
                            ...it,
                            old_price: value,
                            type: 'update',
                          })
                        } else {
                          arr.push(it)
                        }
                      })
                      // dispatch({ type: 'GET_LAB_SETUP_ACCOUNT', payload: arr })
                      setAllLabList(arr)
                    }}
                  />
                </div>
              ),
            },
            // { title: "Price", component: (item) =>  item.price },
          ]}
          bordered
          size="sm"
          data={rows}
          input={true}
        />
      </Scrollbars>
      <center className="my-2">
        <CustomButton onClick={handleSubmit} loading={loading}>
          Save
        </CustomButton>
      </center>
    </div>
  )
}

export default LabPricingSetup
