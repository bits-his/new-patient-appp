import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Card, Button, CardTitle } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { checkEmpty, _warningNotify, _customNotify } from '../utils/helpers'
// import { deleteLabService } from "./actions/labActions";
import Loading from '../comp/components/Loading'
import { FaTimes, FaTrash } from 'react-icons/fa'
import { WarningModal } from '../comp/components/Modal'
import {
  _postApi,
  _fetchApi,
  _updateApi,
  _deleteApi,
} from '../../redux/actions/api'
import { apiURL } from '../../redux/actions'
import { useHistory } from 'react-router'
import { getAllLabServices } from '../../redux/actions/lab'
import CustomButton from '../comp/components/Button'
// import { getLabServiceById } from "./actions/labActions";
// import { _postApi } from '../../redux/actions/api';
// import { apiURL } from '../../redux/actions';

import LabSetupForm from './LabSetupForm'
import LabTree from './components/LabTree'

const LabSetup = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [saving, toggleSaving] = useState(false)
  const [error, setError] = useState('')
  const [isEdit, setEditMode] = useState(false)
  const [itemsToDelete, setItemsToDelete] = useState([])
  const [deleteWarning, setDeleteWarning] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [loadingService, toggleLoadingService] = useState(false)
  const [labHeads, setLabHeads] = useState([])
  const headRef = useRef()
  const subRef = useRef()
  const testNameRef = useRef()

  const [lab, setLab] = useState({
    head: '',
    subhead: '',
    description: '',
    codeType: 'group',
    specimen: '',
    noOfLabels: '',
    percentageType: 'group',
    percentage: 0,
    tests: [
      {
        test_name: '',
        range_from: '',
        range_to: '',
        unit: '',
        price: '',
      },
    ],
  })

  const resetForm = () => {
    setLab({
      head: '',
      subhead: '',
      description: '',
      codeType: 'group',
      specimen: '',
      noOfLabels: '',
      percentageType: 'group',
      percentage: 0,
      tests: [
        {
          test_name: '',
          range_from: '',
          range_to: '',
          unit: '',
          price: '',
        },
      ],
    })

    headRef.current.clear()
    subRef.current.clear()
    // testNameRef.current.clear();
  }

  const labServices = useSelector((state) => state.lab.labservices)
  // let facility = useSelector((state) => state.facility.info.facility_name);

  const logChange = (key, value) => {
    setLab((prev) => ({ ...prev, [key]: value }))
    setError('')
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

  const toggleDeleteWarning = () => setDeleteWarning((d) => !d)

  const handleSubmit = () => {
    const { subhead, tests } = lab
    // Validate lab subhead
    if (subhead === '') {
      setError('please complete the form')
    } else {
      toggleSaving(true)
      // If subhead is not empty, add a new lab subhead
      console.log('add new lab subhead')
      let testsEmpty =
        tests && tests.length === 1 ? checkEmpty(tests[0]) : false

      // create request callback function
      const cb = () => {
        toggleSaving(false)
        resetForm()
        setEditMode(false)
        _customNotify('Lab saved successfully')
        _getAllLabServices()
      }

      // Check if tests list is empty
      if (testsEmpty) {
        // If empty, save only the head and subhead;
        // - create a copy of the lab object and delete tests property
        let newLab = Object.assign({}, lab)
        if (newLab.tests) {
          delete newLab.tests
        }

        // console.log(newLab);
        // isEdit
        //   ? dispatch(updateLabService(newLab, cb))
        //   : dispatch(saveLabService(newLab, cb));

        // console.log(newLab);
        _postApi(
          `${apiURL()}/lab/head/new`,
          { ...newLab, sort_index: 1 },
          cb,
          () => _warningNotify('An error occurred'),
        )
        // facilityId: "966a89f6-05d8-4564-b319-2f8863821e75"
        // head: "3000"
        // noOfLabels: 0
        // price: "600"
        // range_from: "3.0"
        // range_to: "5.6"
        // specimen: "Blood"
        // subhead: "K"
        // test: ""
        // test_name: "K"
        // unit: "mmol/L"
        // userId: "admin"

        // dispatch(saveLabService(newLab, cb));
      } else {
        // If not empty, trim the last item off
        let newTestList = []
        tests.forEach((item) => {
          if (!checkEmpty(item)) {
            newTestList.push(item)
          }
        })

        // After trimming, save the new lab setup
        // let newLab = {
        //   ...lab,
        //   tests: newTestList,
        // };
        let newLab = [
          {
            ...lab,
            noOfLabels: lab.codeType === 'group' ? lab.noOfLabels : 0,
            unit: '',
            range_from: '',
            range_to: '',
            test_name: '',
            price: '',
            percentage: lab.percentageType === 'group' ? lab.percentage : 0,
          },
        ]

        newTestList.forEach((test, i) => {
          newLab.push({
            ...test,
            noOfLabels: lab.codeType === 'group' ? 0 : lab.noOfLabels,
            head: lab.subhead,
            subhead: `${lab.subhead}${i + 1}`,
            description: test.test_name,
            specimen: lab.specimen,
            percentage: lab.percentage,
            sort_index: i,
          })
        })
        // console.log(newLab);

        // isEdit
        //   ? dispatch(updateLabService(newLab, cb))
        //   : dispatch(saveLabService(newLab, cb));
        // console.log(newLab);

        // if (newLab) {
        //   if (newLab.tests && newLab.tests.length) {
        //     let finallist = [];
        //     newLab.tests.forEach((item) => {
        //       finallist.push({ ...lab, ...item });
        //       // _postApi(`${apiURL()}/lab/head/new`, { ...lab, ...item }, cb);
        //     });
        //     // console.log(finallist)
        //   }
        // }
        for (let i = 0; i < newLab.length; i++) {
          _postApi(`${apiURL()}/lab/service/new`, newLab[i])
        }

        cb()
      }
    }
    // console.log()
  }

  const handleUpdate = () => {
    const { subhead, tests } = lab
    // Validate lab subhead
    if (subhead === '') {
      setError('Form is invalid')
    } else {
      toggleSaving(true)

      // If subhead is not empty, add a new lab subhead
      console.log('add new lab subhead')
      let testsEmpty =
        tests && tests.length === 1 ? checkEmpty(tests[0]) : false

      // create request callback function
      const cb = () => {
        toggleSaving(false)
        resetForm()
        setEditMode(false)
        _customNotify('Lab updated successfully')
        _getAllLabServices()
      }

      // Check if tests list is empty
      if (testsEmpty) {
        // If empty, save only the head and subhead;
        // - create a copy of the lab object and delete tests property
        let newLab = Object.assign({}, lab)
        if (newLab.tests) {
          delete newLab.tests
        }

        // console.log(newLab);
        // isEdit
        //   ? dispatch(updateLabService(newLab, cb))
        //   : dispatch(saveLabService(newLab, cb));

        // console.log(newLab);
        _updateApi(`${apiURL()}/lab/setup/head/update`, newLab, cb, () =>
          _warningNotify('An error occurred'),
        )

        // dispatch(saveLabService(newLab, cb));
      } else {
        // If not empty, trim the last item off
        let newTestList = []
        tests.forEach((item) => {
          if (!checkEmpty(item)) {
            newTestList.push(item)
          }
        })

        // After trimming, save the new lab setup
        // let newLab = {
        //   ...lab,
        //   tests: newTestList,
        // };
        let newLab = [
          {
            ...lab,
            noOfLabels: lab.codeType === 'group' ? lab.noOfLabels : 0,
            unit: '',
            range_from: '',
            range_to: '',
            test_name: lab.description,
            price: 0,
            percentage: lab.percentageType === 'group' ? lab.percentage : 0,
          },
        ]

        newTestList.forEach((test, i) => {
          newLab.push({
            ...test,
            noOfLabels: lab.codeType === 'group' ? 0 : lab.noOfLabels,
            head: lab.subhead,
            subhead: `${lab.subhead}${i + 1}`,
            description: test.test_name,
            specimen: lab.specimen,
            percentage: lab.percentage,
            sort_index: test.new ? i : test.sort_index,
          })
        })

        // let testsToUpdate = [];
        // let testsToInsert = [];

        newLab.forEach((item) => {
          if (item.new) {
            _postApi(`${apiURL()}/lab/service/new`, item)
            // testsToInsert.push(item);
          } else {
            _updateApi(`${apiURL()}/lab/setup/tests/update`, item)
            // testsToUpdate.push(item);
          }
        })

        if (itemsToDelete.length) {
          itemsToDelete.forEach((item) => {
            _deleteHelper(item.subhead)
          })
        }

        setTimeout(() => {
          cb()
        }, 1500)
      }
    }
    // console.log()
  }

  const handleTestChange = (key, value, index) => {
    // console.log(key, value, index);
    let newTestArr = []
    let oldTestArr = lab.tests
    oldTestArr.forEach((item, i) => {
      if (i === index) {
        newTestArr.push({ ...oldTestArr[index], [key]: value })
      } else {
        newTestArr.push(item)
      }
    })
    setLab((prev) => ({ ...prev, tests: newTestArr }))
  }

  const handleAddClick = (e) => {
    e.preventDefault()
    const { tests, subhead } = lab
    // Check if lab.tests exists
    if (subhead !== '') {
      if (tests) {
        // Get the last item on test list
        let lastItem = tests.length && tests[tests.length - 1]
        // Check if the last item is empty
        let lastItemEmpty = checkEmpty(lastItem)

        // Confirm form is not empty before adding a new form
        if (!lastItemEmpty) {
          setLab((prev) => ({
            ...prev,
            tests: [
              ...prev.tests,
              {
                test: '',
                range_from: '',
                range_to: '',
                unit: '',
                new: true,
              },
            ],
          }))
        }
      } else {
        setLab((prev) => ({
          ...prev,
          tests: [
            {
              test: '',
              range_from: '',
              range_to: '',
              unit: '',
              new: true,
            },
          ],
        }))
      }
    } else {
      _warningNotify('Form is invalid')
    }
  }

  useEffect(() => {
    _getAllLabServices()

    // if (!labServices.length) {
    //   console.log(facility);
    //   setLab((prev) => ({ ...prev, labSub: facility }));
    //   subRef.current.setState({ text: facility });
    // }
  }, [])

  const getLabListByHead = (head) => {
    _fetchApi(
      `${apiURL()}/lab/setup/head/${head}`,
      (data) => {
        if (data.results.length) {
          setLab((p) => ({ ...p, tests: data.results }))
        } else {
          setLab((p) => ({
            ...p,
            tests: [
              {
                test_name: '',
                range_from: '',
                range_to: '',
                unit: '',
                price: '',
              },
            ],
          }))
        }
      },
      (err) => console.log(err),
    )
  }

  const handleTreeEdit = (item) => {
    setEditMode(true)
    const {
      description,
      noOfLabels,
      percentage,
      price,
      specimen,
      subhead,
      title,
    } = item

    headRef.current.setState({ text: subhead })
    subRef.current.setState({ text: specimen })

    setLab((p) => ({
      ...p,
      head: subhead,
      subhead: title,
      description,
      specimen,
      percentage,
      price,
      noOfLabels,
    }))

    getLabListByHead(title)
    // toggleLoadingService(true);
  }

  // const handleHeadSelect = (item) => {
  //   let id = item.id;
  //   getLabServiceById(id)
  //     .then((lab) => {
  //       setLab(lab);
  //       headRef.current.setState({ text: lab.labHead || "" });
  //       subRef.current.setState({ text: lab.labSub || "" });
  //       setEditMode(true);
  //       toggleLoadingService(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       toggleLoadingService(false);
  //     });
  // };

  const closeEditMode = () => {
    setEditMode(false)
    resetForm()
  }

  const _deleteHelper = (head, cb = (f) => f, err = (f) => f) => {
    _deleteApi(`${apiURL()}/lab/setup/head`, { head }, cb, err)
  }

  const _deleteService = () => {
    // console.log(lab.subhead);
    _deleteHelper(
      lab.subhead,
      () => {
        _customNotify('Lab service(s) deleted successfully')
        closeEditMode()
      },
      () => {
        _warningNotify('An error occured!')
      },
    )
    resetForm()
    toggleDeleteWarning()
    _getAllLabServices()

    // let selectedServiceId = lab._id;
    // dispatch(
    //   deleteLabService(selectedServiceId, lab.labSub, () => resetForm())
    // );
  }

  const handleTestSelect = (_item, index) => {
    // console.log(_item, index)
    let newTestArr = []
    let oldTestArr = lab.tests
    oldTestArr.forEach((item, i) => {
      if (i === index) {
        newTestArr.push({
          ...oldTestArr[index],
          test_name: _item.description,
          price: _item.price,
        })
      } else {
        newTestArr.push(item)
      }
    })
    setLab((prev) => ({ ...prev, tests: newTestArr }))
  }

  const handleTestInputChange = (_item, index) => {
    console.log(_item, index)
    let newTestArr = []
    let oldTestArr = lab.tests
    oldTestArr.forEach((item, i) => {
      if (i === index) {
        newTestArr.push({ ...oldTestArr[index], test_name: _item })
      } else {
        newTestArr.push(item)
      }
    })
    setLab((prev) => ({ ...prev, tests: newTestArr }))
  }

  const handleSubDelete = (item) => {
    // console.log(item)
    let newList = lab.tests.filter((t) => t.test_name !== item.test_name)

    setLab((prev) => ({ ...prev, tests: newList }))
    setItemsToDelete((prev) => [...prev, item])
  }

  return (
    <>
      <Row>
        <Col>
          <Button
            color="dark"
            className="mb-1"
            onClick={() => history.push('/me/lab/patients')}
          >
            New Registration
          </Button>
        </Col>
        <Col>
          <CardTitle className="h5 my-1">Setup your lab services</CardTitle>
        </Col>

        <div className="mr-3">
          <CustomButton color="danger" onClick={() => history.goBack()}>
            <FaTimes className="mr-1" size={16} />
            Close
          </CustomButton>
        </div>
      </Row>

      <Card body>
        <div className="row">
          <div className="col-md-6">
            {/* {JSON.stringify(lab)} */}
            <LabTree
              handleEditTree={handleTreeEdit}
              labServices={labServices}
            />
          </div>
          <div className="card p-3 col-md-6">
            {loadingService && <Loading />}
            <div className="d-flex flex-row justify-content-between">
              <h6 className="font-weight-bold">
                {isEdit ? 'Update' : 'Create a'} lab service
              </h6>

              {isEdit && (
                <button
                  className="btn btn-warning"
                  onClick={toggleDeleteWarning}
                >
                  <FaTrash /> Delete
                </button>
              )}
            </div>
            <LabSetupForm
              logChange={logChange}
              handleSubmit={handleSubmit}
              handleUpdate={handleUpdate}
              lab={lab}
              handleTestChange={handleTestChange}
              handleAddClick={handleAddClick}
              error={error}
              labServices={labServices}
              saving={saving}
              headRef={headRef}
              subRef={subRef}
              testNameRef={testNameRef}
              isEdit={isEdit}
              closeEditMode={closeEditMode}
              labHeads={labHeads}
              labHead={lab.labHead}
              handleTestSelect={handleTestSelect}
              handleTestInputChange={handleTestInputChange}
              handleSubDelete={handleSubDelete}
              itemsToDelete={itemsToDelete}
            />
          </div>
        </div>
        <WarningModal
          title="Delete Confirmation"
          body={
            <p>
              This action cannot be undone, the
              <strong> selected lab service </strong> will be
              <strong>
                <em> deleted </em>
              </strong>
              along with its sub-modules, are you sure you want to
              <strong>
                <em> DELETE </em>
              </strong>
              this lab service?
            </p>
          }
          isOpen={deleteWarning}
          toggle={toggleDeleteWarning}
          okay={_deleteService}
        />
        {/* {JSON.stringify({ lab: lab.tests, itemsToDelete })} */}
      </Card>
    </>
  )
}

export default LabSetup
