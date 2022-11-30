import React, { useCallback, useEffect, useState } from 'react'
import { MdSave, MdSend } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { apiURL } from '../../../redux/actions'
import { _fetchApi, _postApi, _updateApi } from '../../../redux/actions/api'
import CustomButton from '../../comp/components/Button'
import { _customNotify, _warningNotify } from '../../utils/helpers'
import LabComments from '../components/LabComments'
import SpeechInput from '../../comp/speech-to-text/SpeechInput'
import { useHistory } from 'react-router'
import TableWithRange from './analysis/TableWithRange'
import Loading from '../../comp/components/Loading'

function LabTestAnalysisResultTable({
  // labs=[],
  editting = false,
  // getResults = (f) => f,
  submitCb = (f) => f,
  labno = '',
  department = '',
  patientId = '',
  isHistory = false,
  isDoctor = false,
  toggleEdit = (f) => f,
}) {
  const [_labs, _setLabs] = useState([])
  const [list2, setList2] = useState({})
  // const listToDisplay = editting ? _labs : labs;
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const facility = useSelector((state) => state.facility.info)
  const isHospital = facility.type === 'hospital'
  const [comments, setComments] = useState([])
  const [remark, setRemark] = useState('')
  // const match = useRouteMatch();
  // const head = match.params.test;
  const head = _labs.length && _labs[0].department
  const history = useHistory()

  const getComments = useCallback(() => {
    _fetchApi(
      `${apiURL()}/lab/comment/${labno}`,
      (data) => {
        // _fetchApi(`${apiURL()}/lab/comment/${labno}/${department}`, (data) => {
        if (data.success) {
          setComments(data.results)
        }
      },
      (err) => console.log(err),
    )
  }, [labno])

  const getPendingAnalysis = useCallback(() => {
    setFetching(true)
    _fetchApi(
      `${apiURL()}/lab/collected/${labno}/${department}`,
      (data) => {
        setFetching(false)
        if (data.success) {
          let newList = []
          let newList2 = {}

          data.results.forEach((i) => {
            newList.push({
              ...i,
              unit: i.n_unit && i.n_unit!=="" ? i.n_unit : i.unit,
              range_from: i.n_range_from && i.n_range_from!=="" ? i.n_range_from : i.range_from,
              range_to: i.n_range_to && i.n_range_to!=="" ? i.n_range_to : i.range_to,
            })

            if (Object.keys(newList2).includes(i.group_head)) {
              newList2[i.group_head] = [...newList2[i.group_head], i]
            } else {
              newList2[i.group_head] = [i]
            }
          })
          _setLabs(newList)
          setList2(newList2)
        }
      },
      (err) => {
        setFetching(false)
        console.log(err)
      },
    )
  }, [labno])

  useEffect(() => {
    if (patientId && labno) {
      getPendingAnalysis()
    }
    if (isHospital) {
      getComments()
    }
  }, [getPendingAnalysis])

  const handleInputChange = (key, val, idx, main, test) => {
    console.log(key, val, idx, main)
    let newList = []
    let newObj = {}

    Object.keys(list2).forEach((_main) => {
      if (_main === main) {
        let _newList = []
        list2[_main].forEach((_item, _idx) => {
          if (_idx === idx) {
            // if(_main === 'Prothrombin time') {
            //   let control = list2[_main].find(a => a.description === 'Control(PT)')
            //   let sample = list2[_main].find(a => a.description === 'Sample(PT)')
            //   console.log('checking...', control, sample, list2[_main])
            // }
            _newList.push({ ..._item, [key]: val, editted: true })
          } else {
            _newList.push(_item)
          }
        })
        newObj[_main] = _newList
      } else {
        newObj[_main] = list2[_main]
      }
    })

    setList2(newObj)

    _labs.forEach((item, i) => {
      // console.log(i, idx, '===============================')
      if (test.description === item.description) {
        newList.push({ ...item, [key]: val, editted: true })
      } else {
        newList.push(item)
      }
    })

    _setLabs(newList)
  }

  const handleUpdateLab = () => {
    console.log('update test')
    let edittedList = []
    _labs.forEach((item) => {
      console.log(item)
      if (item.editted) {
        console.log('editted')
        edittedList.push(item)
      }
    })
    // console.log(edittedList);

    for (let m = 0; m < edittedList.length; m++) {
      let curr = edittedList[m]
      _updateApi(`${apiURL()}/lab/result/update`, curr)

      if (m === edittedList.length - 1) {
        toggleEdit()
        _customNotify('Results Updated!')
        // getPendingAnalysis();
        submitCb()
      }
    }
  }

  const handleSubmit = () => {
    setLoading(true)
    // let incompleteResult = _labs.some(i => i.result === "")
    // if(incompleteResult) {}

    const success = () => {
      _customNotify('Result submitted')
      submitCb()
    }

    let list = []
    let unCompleted = []
    Object.keys(list2).forEach((item) => {
      list2[item].forEach((_item) => {
        if (_item.result !== '') {
          list.push({ ..._item, status: 'analyzed' })
        } else {
          unCompleted.push(_item)
        }
      })
    })
    // console.log(list);
    // console.log(unCompleted);

    if (!unCompleted.length) {
      for (let i = 0; i < list.length; i++) {
        _updateApi(`${apiURL()}/lab/result/new`, list[i])

        if (i === list.length - 1) {
          success()
          getPendingAnalysis()
        }
      }

      let _head = head[0].padEnd(4, '0') || ''
      if (isHospital) {
        let newList = []
        _labs.forEach((item) => newList.push(item.test))
        let data = {
          labno,
          comment: remark,
          department: _head,
          tests: newList,
          amount: 0,
        }

        _postApi(
          `${apiURL()}/lab/comment/doctors/new`,
          data,
          (data) => {
            _customNotify('Comment Saved!')
            history.push('/me/lab/sample-analysis')
          },
          (err) => {
            console.log(err)
          },
        )

        _postApi(`${apiURL()}/lab/comment/doctors/new`, {
          comment: remark,
          labName: _head,
          labno: labno,
        })
      }
    } else {
      _warningNotify(
        'Result(s) not completed, please complete the results or save for later!',
      )
    }

    setLoading(false)
  }

  const handleSave = () => {
    const success = () => {
      _customNotify('Result Saved')
      submitCb()
    }

    console.log(list2, '==============object============')

    let list = []
    Object.keys(list2).forEach((item) => {
      list2[item].forEach((_item) => {
        list.push({
          ..._item,
          // unit: _item.n_unit,
          // range_from: _item.n_range_from,
          // range_to: _item.n_range_to,
          status: 'saved',
        })
      })
    })

    // console.log(list);
    for (let i = 0; i < list.length; i++) {
    console.log(list[i], '==============item from arr============')
    _updateApi(`${apiURL()}/lab/result/new`, list[i])

      if (i === list.length - 1) {
        success()
        getPendingAnalysis()
      }
    }
  }

  const showUpdate = (isDoctor && editting) || (isHistory && editting)
  const showSave = !isHistory && !isDoctor && editting
  const showSubmit = !isHistory && !isDoctor && editting

  const tabledLabsListIsValid = false
  const tabledWithResultLabsListIsValid = false

  const submitBtnIsValid =
    tabledLabsListIsValid && tabledWithResultLabsListIsValid

  return (
    <>
      {/*{JSON.stringify(head[0].padEnd(4, '0'))}*/}
      {/* {JSON.stringify(list2)} */}
      {fetching && <Loading />}
      <TableWithRange
        list={list2}
        editting={editting}
        handleInputChange={handleInputChange}
      />
      {/* <Table striped bordered size="sm" hover>
        <thead>
          <tr>
            <th className="text-center">S/N</th>
            <th className="text-center">Test Name</th>
            <th className="text-center">Range</th>
            <th className="text-center">Unit</th>
            <th className="text-center">Result</th>
          </tr>
        </thead>
        <tbody>
          {_labs.map((item, i) => (
            <tr
              className="border border-lg-light py-3"
              key={i}
              style={{
                background:
                  item.result && item.result !== ""
                    ? parseFloat(item.result) > parseFloat(item.n_range_to)
                      ? "#DC143C"
                      : parseFloat(item.result) < parseFloat(item.n_range_from)
                      ? "#F0E68C"
                      : "#7FFF00"
                    : "",
                color:
                  item.result && item.result !== ""
                    ? parseFloat(item.result) > parseFloat(item.n_range_to)
                      ? "#fff"
                      : parseFloat(item.result) < parseFloat(item.n_range_from)
                      ? "#000"
                      : "#000"
                    : "",
                // border: "1px solid green",
              }}
            >
              <td style={columnStyle}>{i + 1}</td>
              <td style={columnStyle}>{item.description}</td>
              <td style={columnStyle} className="text-center">
                {editting ? (
                  <span className="d-flex flex-direction-row justify-content-between align-items-center">
                    <Input
                      size="sm"
                      value={item.range_from}
                      style={{ width: 50 }}
                      onChange={(e) =>
                        handleInputChange("range_from", e.target.value, i)
                      }
                    />
                    -
                    <Input
                      size="sm"
                      value={item.range_to}
                      style={{ width: 50 }}
                      onChange={(e) =>
                        handleInputChange("range_to", e.target.value, i)
                      }
                    />
                  </span>
                ) : (
                  `${item.range_from} - ${item.range_to}`
                )}
              </td>
              <td style={columnStyle} className="text-center">
                {editting ? (
                  <Input
                    size="sm"
                    value={item.unit}
                    style={{ width: 70 }}
                    onChange={(e) =>
                      handleInputChange("unit", e.target.value, i)
                    }
                  />
                ) : (
                  item.unit
                )}
              </td>
              <td style={columnStyle} className="text-center">
                {editting ? (
                  <Input
                    size="sm"
                    value={item.result}
                    style={{ width: 70 }}
                    onChange={(e) =>
                      handleInputChange("result", e.target.value, i)
                    }
                  />
                ) : (
                  item.result
                )}
              </td>
            </tr>
          
          ))}
        </tbody>
      </Table> */}
      <>
        {(isHistory || isHospital) && (
          <LabComments getComment={getComments} comments={comments} />
        )}
        {isHospital ? (
          <div className="my-2">
            <label className="font-weight-bold">Pathologist Comment</label>
            <SpeechInput
              type="textarea"
              value={remark}
              onInputChange={(val) => setRemark(val)}
            />
          </div>
        ) : null}
      </>
      <center>
        {/* {isDoctor ? null : isHistory ? ( */}
        {showUpdate ? (
          <CustomButton
            size={isDoctor ? 'sm' : 'md'}
            color="warning"
            onClick={handleUpdateLab}
            className={isDoctor ? '' : 'px-4'}
          >
            Update
          </CustomButton>
        ) : null}
        {showSave ? (
          <CustomButton
            color="primary"
            onClick={handleSave}
            className="px-5 mr-2"
          >
            <MdSave /> Save
          </CustomButton>
        ) : null}

        {/* {JSON.stringify({ submitBtnIsValid })} */}
        {showSubmit ? (
          <CustomButton
            color="success"
            loading={loading}
            onClick={handleSubmit}
            // disabled={!submitBtnIsValid}
            className="px-5"
          >
            <MdSend /> Submit
          </CustomButton>
        ) : null}

        {/* {isHistory ? (
          editting ? (
            <CustomButton
              size={isDoctor ? "sm" : "md"}
              color="warning"
              onClick={handleUpdateLab}
              className={isDoctor ? "" : "px-4"}
            >
              Update
            </CustomButton>
          ) : null
        ) : isDoctor && editting ? (
            <CustomButton
              size={isDoctor ? "sm" : "md"}
              color="warning"
              onClick={handleUpdateLab}
              className={isDoctor ? "" : "px-4"}
            >
              Update
            </CustomButton>
          ) : (
          <>
            <CustomButton
              color="primary"
              onClick={handleSave}
              className="px-5 mr-2"
            >
              <MdSave /> Save
            </CustomButton>
            <CustomButton
              color="success"
              loading={loading}
              onClick={handleSubmit}
              className="px-5"
            >
              <MdSend /> Submit
            </CustomButton>
          </>
        )} */}
      </center>
    </>
  )
}

export default LabTestAnalysisResultTable
