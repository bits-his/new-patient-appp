import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Form, FormGroup } from 'reactstrap'
import { apiURL } from '../../../redux/actions'
import { _fetchApi } from '../../../redux/actions/api'
import Row from 'reactstrap/lib/Row'
import Col from 'reactstrap/lib/Col'
import { getAllLabServices, getGroupList } from '../../../redux/actions/lab'
import LabTree from '../components/LabTree'
import CustomButton from '../../comp/components/Button'
import { getLabChildren, processBatchSetup, queryLabSetup } from './helper'
import { _customNotify } from '../../utils/helpers'
import { useHistory } from 'react-router'
import { useQuery } from '../../../hooks'
import TestTable from './components/TestTable'
import AutoCompleteWithMultipleSelection from '../../comp/components/AutoCompleteWithMultipleSelection'

function TestUnit() {
  const testHeadRef = useRef()
  const dispatch = useDispatch()
  const query = useQuery()
  const testCode = query.get('test')
  const history = useHistory()
  const [form, setForm] = useState({})
  const [labHeads, setLabHeads] = useState([])
  const groupList = useSelector((state) => state.lab.groupList)
  const facilityId = useSelector((state) => state.auth.user.facilityId)
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(false)
  const [allLabList, setAllLabList] = useState([])

  const labServices = useSelector((state) => state.lab.labservices)

  const _getAllLabServices = () => {
    dispatch(getAllLabServices())
    queryLabSetup({ query_type: 'all', facilityId }, (data) => {
      if (data && data.results) {
        setAllLabList(data.results)
      }
    })
    // _fetchApi(
    //   `${apiURL()}/lab/service/head`,
    //   (data) => {
    //     if (data.success) {
    //       setLabHeads(data.results)
    //       // let newList = []
    //       // data.results.forEach(item => {
    //       //   newList.push(item.head)
    //       // })
    //     }
    //   },
    //   (err) => {
    //     console.log(err)
    //   },
    // )
  }

  useEffect(() => {
    _getAllLabServices()
  }, [])

  const onEditClick = (node) => {
    console.log(node)
    setForm((p) => ({ ...p, ...node }))
    setChildren(node.children)
  }

  useEffect(() => {
    dispatch(getGroupList())
  }, [dispatch])

  const handleTableChange = (name, value, it) => {
    // console.log(name, value, it, children);
    let final = []
    children.map((item) => {
      if (item.description === it.description && item.subhead === it.subhead) {
        return final.push({ ...item, [name]: value, modified: true })
      } else {
        return final.push(item)
      }
    })
    setChildren(final)
    // setChildren((p) =>
    //   p.map((a) => {
    //     if (a.description === it.description && a.unit === it.unit) {
    //       return { ...it, [name]: value }
    //     } else return it
    //   }),
    // )
  }

  const addNewRow = () => {
    setChildren((p) => [...p, { new: true }])
  }

  const callback = () => {
    _customNotify('Saved!')
    _getAllLabServices()
    history.push(
      `/me/lab/setup?lab-type=Barcode Setup&test=${form.subhead}&formMode=Grouped Test&department=${form.lab_code}&unit=${form.unit_name}&group=${form.description}&groupCode=${form.subhead}`,
    )
  }

  const handleSubmit = () => {
    setLoading(true)
    let count = 0
    let newData = []
    let updatedData = []
    let removedData = []

    queryLabSetup(
      { head: form.subhead, facilityId, query_type: 'next subhead' },
      (resp) => {
        if (resp && resp.results) {
          // setForm((p) => ({ ...p, subhead: resp.results[0].next_code }))
          let nextCode = resp.results[0].next_code
          children.map((item) => {
            if (item.new) {
              newData.push({
                ...form,
                ...item,
                subhead: nextCode,
                head: form.subhead,
              })
              return (nextCode = parseInt(nextCode) + 1)
            } else if (item.modified) {
              return updatedData.push({
                ...item,
                subhead: item.title,
                head: item.subhead,
              })
            } else if (item.removed) {
              return removedData.push(item)
            } else {
              return ''
            }
          })

          console.log(newData)
          console.log(updatedData)
          console.log(removedData)

          if (newData.length) {
            processBatchSetup(newData, 'new_test', () => {
              setLoading(false)
              if (count === 0) {
                callback()
              }
            })
          }
          if (updatedData.length) {
            processBatchSetup(updatedData, 'update_test', () => {
              setLoading(false)
            })
          }
          if (removedData.length) {
            processBatchSetup(removedData, 'delete', () => {
              setLoading(false)
              if (count === 0) {
                callback()
              }
            })
          }

          if (!newData.length && !updatedData.length && !removedData.length) {
            history.push(
              `/me/lab/setup?lab-type=Barcode Setup&test=${form.subhead}&formMode=Grouped Test&department=${form.lab_code}&unit=${form.unit_name}&group=${form.description}&groupCode=${form.subhead}`,
            )
          }
        }
      },
    )
  }

  // const getTestInfo = (test = '',callbavk) => {

  // }

  useEffect(() => {
    if (testCode) {
      // test=202222
      queryLabSetup({ query_type: 'test_info', subhead: testCode }, (resp) => {
        if (resp && resp.results) {
          let main = resp.results[0]
          // alert(JSON.stringify(resp.results[0]))
          setForm(main)
          testHeadRef.current.setState({ text: main.description })

          getLabChildren(testCode, (list) =>
            setChildren(list.map((l) => ({ ...l, existing: true }))),
          )
        }
      })
      // getTestInfo(testCode)

      // setForm((p) => ({ ...p, ...selected }));
    }
  }, [testCode])

  const updateLabChildrenList = (subhead) => {
    getLabChildren(subhead, (list) => setChildren(list))
  }

  const handleGroupMemberAdd = (arr) => {
    if (arr && arr.length) {
      let lastIndex = arr.length - 1
      getLabChildren(
        arr[lastIndex].subhead,
        (list) => {
          setChildren((p) => [
            ...p,
            ...list.map((a) => ({
              ...a,
              new: true,
              label_name: form.description,
            })),
          ])
        },
        () => {
          console.log(arr)
          setChildren((p) => [...p, arr[lastIndex]])
        },
      )
    } else {
      setChildren([])
    }
  }

  const removeItem = (item) => {
    setChildren((p) =>
      p.map((a) => {
        if (a.subhead === item.subhead && a.description === item.description) {
          return {
            ...a,
            removed: true,
          }
        } else {
          return a
        }
      }),
    )
  }

  return (
    <div className="row">
      <div className="col-md-5 col-lg-5">
        <LabTree
          // handleEditTree={handleTreeEdit}
          labServices={labServices}
          handleEditTree={onEditClick}
          showAdd={false}
        />
      </div>
      <Form className="col-md-7 col-lg-7">
        {/* {JSON.stringify(children)} */}
        <Row>
          <Col md={6}>
            <FormGroup>
              <label>Lab Group</label>
              <Typeahead
                ref={testHeadRef}
                id="head"
                align="justify"
                options={allLabList}
                labelKey="description"
                onChange={(val) => {
                  if (val.length) {
                    let selected = val[0]
                    // console.log(selected)
                    setForm((p) => ({ ...p, ...selected }))
                    updateLabChildrenList(selected.subhead)
                  }
                }}
                // onInputChange={head => setSubHead(head)}
                // allowNew
                // ref={this.headRef}
              />
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <label>Lab Group Code</label>
              <input
                type="text"
                className="form-control"
                name="subhead"
                disabled
                // onChange={({ target: { value } }) => setDescription(value)}
                value={form.subhead}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <label>Label Print text</label>
              <input
                type="text"
                className="form-control"
                name="label_name"
                // onChange={({ target: { value } }) => setHead(value)}
                disabled
                value={form.label_name}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <label>No Of Labels</label>
              <input
                type="text"
                className="form-control"
                name="noOfLabels"
                disabled
                // onChange={({ target: { value } }) => setHead(value)}
                value={form.noOfLabels}
              />
            </FormGroup>
          </Col>
        </Row>

        <FormGroup>
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            disabled
            // onChange={({ target: { value } }) => setHead(value)}
            value={form.price}
          />
        </FormGroup>
        <FormGroup>
          <AutoCompleteWithMultipleSelection
            label="Select Group Members"
            labelKey="description"
            options={allLabList}
            multiple
            onChange={(v) => handleGroupMemberAdd(v)}
          />
        </FormGroup>

        <TestTable
          data={children.filter((a) => !a.removed)}
          handleTableChange={handleTableChange}
          addNewRow={addNewRow}
          // form={form}
          updateLabChildrenList={updateLabChildrenList}
          removeItem={removeItem}
        />

        <CustomButton loading={loading} className="px-4" onClick={handleSubmit}>
          Save & Setup Barcode
        </CustomButton>
        {/* {deletable && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )} */}
        {/* {JSON.stringify(this.props.accChartTree)} */}
      </Form>
    </div>
  )
}

export default TestUnit
