import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Form, FormGroup } from 'reactstrap'
import LabTree from '../components/LabTree'
import { getAllLabServices } from '../../../redux/actions/lab'
import { _customNotify, _warningNotify } from '../../utils/helpers'
import { getSpecimenList, postLabSetup, queryLabSetup } from './helper'
import CustomButton from '../../comp/components/Button'
import SuccessModal from './components/SuccessModal'

function LabDepartment() {
  const headRef = useRef()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({})
  const [successModal, setSuccessModal] = useState(false)

  const labServices = useSelector((state) => state.lab.labservices)
  const facilityId = useSelector((state) => state.auth.user.facilityId)

  const toggleSuccessModal = () => {
    setSuccessModal((p) => !p)
  }

  const _getAllLabServices = useCallback(() => {
    dispatch(getAllLabServices())
  }, [dispatch])

  useEffect(() => {
    _getAllLabServices()

    // if (!labServices.length) {
    //   console.log(facility);
    //   setLab((prev) => ({ ...prev, labSub: facility }));
    //   subRef.current.setState({ text: facility });
    // }
  }, [_getAllLabServices])

  const handleSubmit = () => {
    // _postApi(`${apiURL()}/lab/lab-setup`)
    setLoading(true)
    postLabSetup(
      { ...form, query_type: 'new_test' },
      () => {
        setLoading(false)
        _customNotify('Success')
        dispatch(getAllLabServices())
        toggleSuccessModal()
      },
      (e) => {
        console.log(e)
        setLoading(false)
        _warningNotify('An error occured, please try again later.')
      },
    )
  }

  const handleChange = ({ target: { name, value } }) =>
    setForm((p) => ({ ...p, [name]: value }))

  const getNextCode = (head) => {
    queryLabSetup({ head, facilityId, query_type: 'next subhead' }, (resp) => {
      if (resp && resp.results) {
        setForm((p) => ({ ...p, subhead: resp.results[0].next_code }))
      }
    })
  }

  const handleAddNode = (node) => {
    setForm((p) => ({
      ...p,
      head: node.title,
    }))
    getNextCode(node.title)
    headRef.current.setState({ text: node.title })
  }

  // const handleDeleteNode = node => {
  //   postLabSetup({query_type:'delete',subhead: node.subhead}, () => {
  //     _customNotify('Item Deleted Successfully')
  //   })
  // }

  return (
    <div className="row">
      <div className="col-md-5 col-lg-5">
        {/* {} */}
        {/* <ChartTree tree={this.props.accChartTree} /> */}
        <LabTree
          // handleEditTree={handleTreeEdit}
          handleAddNode={handleAddNode}
          labServices={labServices}
          // handleDeleteNode={handleDeleteNode}
          refreshList={_getAllLabServices}
        />
      </div>
      <Form className="col-md-7 col-lg-7">
        <FormGroup>
          <label>Select Department</label>
          <Typeahead
            ref={headRef}
            id="head"
            align="justify"
            labelKey="description"
            // labelKey={(item) => `${item.description} (${item.head})`}
            options={[]}
            onChange={(val) => {
              if (val.length) {
                let selected = val[0]
                // setSubHead(selected['head'])
                // this.getNextCode(selected.description)
                // console.log(selected);
              }
            }}
            // onInputChange={head => setSubHead(head)}
            // allowNew
            // ref={this.headRef}
          />
        </FormGroup>
        <FormGroup>
          <label>Unit Code</label>
          <input
            type="text"
            className="form-control"
            name="subhead"
            onChange={handleChange}
            value={form.subhead}
          />
        </FormGroup>
        <FormGroup>
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            name="description"
            onChange={handleChange}
            value={form.description}
          />
        </FormGroup>

        {/* <center>
            <span style={{ color: 'red' }}>
              {accountCharFormAlert.length ? accountCharFormAlert : null}
            </span>
          </center> */}
        <CustomButton
          loading={loading}
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Create
        </CustomButton>
        {/* {deletable && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )} */}
        {/* {JSON.stringify(this.props.accChartTree)} */}
        <SuccessModal
          isOpen={successModal}
          toggle={toggleSuccessModal}
          nextPageText="Go to Create Groups"
          nextPage={`/me/lab/setup?lab-type=Lab Group&departmentCode=${form.subhead}&department=${form.description}`}
        />
      </Form>
    </div>
  )
  // }
}

// const mapStateToProps = ({
//   transactions: { accHeads, loadingAccHead },
//   account: { LabDepartment, accChartTree },
// }) => ({
//   accHeads,
//   loadingAccHead,
//   LabDepartment,
//   accChartTree,
// })

// const mapDispatchToProps = (dispatch) => ({
//   getAccHeads: () => dispatch(getAccHeads()),
//   createAccHead: (data, callback) => dispatch(createAccHead(data, callback)),
//   getAccChart: () => dispatch(getAccChart()),
// })

export default LabDepartment
