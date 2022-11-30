import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap'
import {
  today,
  _warningNotify,
  _fetchData,
  url,
  _customNotify,
} from '../../utils/helpers'
import { v4 as UUIDV4 } from 'uuid'
import { toaster } from 'evergreen-ui'
import { FiFilePlus } from 'react-icons/fi'
import moment from 'moment'
import { _updateApi, _postApi } from '../../../redux/actions/api'
import { getPatients } from '../../../redux/actions/records'
import AutoComplete from '../../comp/components/AutoComplete'
import OperationNoteForm from './OperationNoteForm'

class OperationNote extends PureComponent {
  constructor(props) {
    super(props)
    this.patientTypeahead = React.createRef()

    this.state = {
      formType: 'NEW',
      inputType: 'NEW',
      formdata: {
        prescriptionRequestList: [
          {
            _id: UUIDV4(),
            route: '',
            drug: '',
            dosage: '',
            duration: '1',
            period: 'days',
            frequency: '',
            price: '',
            treatmentPlan: '',
          },
        ],
      },
      patients: [],
      names: [],
      patientIds: [],
      user: '',
      savingNote: false,
      surgeonsCollapseOpen: true,
      anesthetistsCollapseOpen: true,
      modal: false,
      prescriptionList:[]
    }
  }

  toggle = () => this.setState((prevState) => ({ ...prevState, modal: !prevState.modal }))

  componentDidMount() {
    this.props.getPatients()
  }

  setPatients(list) {
    let patients = []
    let names = []
    let patientIds = []
    list.forEach(({ id, firstname, surname }) => {
      patients.push({ id, firstname, surname })
      names.push(`${surname} ${firstname}`)
      patientIds.push(id)
    })
    this.setState(prev => ({ ...prev, patients, names, patientIds }))
  }

  setName(patientId) {
    let patient = this.state.patients.filter((p) => p.id === patientId)
    this.setState((prevState) => ({
      ...prevState,
      formdata: Object.assign({}, prevState.formdata, {
        name: patient.length
          ? `${patient[0].surname} ${patient[0].firstname}`
          : '',
      }),
    }))
  }

  setNumber(surname, firstname) {
    let patient = this.state.patients.filter(
      (p) => p.surname === surname && p.firstname === firstname,
    )
    this.setState((prevState) => ({
      ...prevState,
      formdata: Object.assign({}, prevState.formdata, {
        patientId: patient.length ? patient[0].id : null,
      }),
    }))
  }

  handleIdChange = (val) => {
    this.setState(
      (prevState) => ({
        ...prevState,
        formdata: Object.assign({}, prevState.formdata, { patientId: val }),
      }),
      () => this.setName(val),
    )
  }

  handleNamesChange = (val) => {
    let surname = val.split(' ')[0]
    let firstname = val
      .split(' ')
      .filter((d) => d !== surname)
      .join(' ')
    this.setState(
      (prevState) => ({
        ...prevState,
        formdata: Object.assign({}, prevState.formdata, { name: val }),
      }),
      () => this.setNumber(surname, firstname),
    )
  }

  componentWillReceiveProps(nextProps) {
    // console.log('prev',prevProps)
    // console.log('next',nextProps)
    if (nextProps.formType) {
      // console.log(nextProps.note.surgeons[0].split(","));
      this.setState(prevState =>({
        ...prevState,
        inputType: nextProps.formType,
        formType: nextProps.formType,
        formdata: Object.assign({}, nextProps.note, {
          ...prevState.formdata,
          surgeons: nextProps.note.surgeons.length
            ? nextProps.note.surgeons[0].split(',')
            : [],
          anesthetist: nextProps.note.anesthetist.length
            ? nextProps.note.anesthetist[0].split(',')
            : [],
          scrubNurse: nextProps.note.scrubNurse.length
            ? nextProps.note.scrubNurse.split(',')
            : [],
        }),
      }))
    }
  }

  getPatients = () => {
    const cachedPatientsList =
      JSON.parse(localStorage.getItem('allpatients')) || []
    if (cachedPatientsList.length) {
      this.setPatients(cachedPatientsList)
    }
    let route = 'patientrecords/patientlist'

    let success_callback = ({ results }) => {
      this.setPatients(results)
      if (results) {
        localStorage.setItem('allpatients', JSON.stringify(results))
      }
    }

    let error_callback = (error) => _warningNotify(error.toString())
    _fetchData({ route, success_callback, error_callback })
  }

  handleInputChange = ({ target: { value, name } }) => {
    this.setState((prevState) => ({
      ...prevState,
      formdata: Object.assign({}, prevState.formdata, { [name]: value }),
    }))
  }

  // changes the state of the checkboxes
  handleCheck = (name, checked, value) => {
    if (checked) {
      this.setState((prevState) => ({
        ...prevState,
        formdata: Object.assign({}, prevState.formdata, {
          [name]: [...prevState.formdata[name], value],
        }),
      }))
    } else {
      this.setState((prevState) => ({
        ...prevState,
        formdata: Object.assign({}, prevState.formdata, {
          [name]: prevState.formdata[name].filter((i) => i !== value),
        }),
      }))
    }
  }

  handleAdd = (name, values) => {
    if (values.length) {
      let testData = this.state.formdata[name]
      let newData = [...testData]
      values.forEach((d) => {
        if (!testData.includes(d)) {
          return newData.push(d)
        }
      })

      this.setState((prevState) => ({
        ...prevState,
        formdata: Object.assign({}, prevState.formdata, { [name]: newData }),
      }))
      // console.log(newData)
    }
  }

  handleRemove = (name, value) => {
    let testData = this.state.formdata[name]
    let newData = testData.filter((d) => d !== value)
    this.setState((prevState) => ({
      formdata: Object.assign({}, prevState.formdata, { [name]: newData }),
    }))
  }

  handleSubmit = () => {
    const { formdata, formType } = this.state
    this.setState({ savingNote: true })
    if (!formdata.patientId) {
      toaster.danger('Patient ID is not entered')
    } else {
      if (formType === 'EDIT') {
        // console.log(formdata);
        _updateApi(
          `${url}/operationnotes/update/${formdata.id}`,
          formdata,
          (response) => {
            _customNotify('Note successfully updated')
            this.setState({ savingNote: false })
            this.props.toggle()
          },
          (err) => {
            _warningNotify('There was an error when updating note')
            this.setState({ savingNote: false })
          },
        )
      } else {
        _postApi(
          `${url}/patientrecords/operation`,
          formdata,
          (res) => {
            _customNotify('Data Saved')
            this.setState({ savingNote: false })
            this.props.toggle()
          },
          (err) => {
            _warningNotify('There was an error when submitting note')
            this.props.setState({ savingNote: false })
          },
        )
      }
    }
  }

  resetForm = () =>
    this.setState({
      formdata: {
        date: today,
        diagnosis: '',
        surgery: '',
        pintsGiven: '',
        bloodLoss: '',
        intraOpAntibiotics: '',
        procedureNotes: '',
        intraOpFindings: '',
        remarks: '',
        postOpOrder: '',
        pathologyRequest: '',
      },
    })

  handlePrescriptionChange = (key, value) =>
    this.setState((prevState) => ({
      formdata: Object.assign({}, prevState.formdata, { [key]: value }),
    }))

  render() {
    const {
      state: {
        formdata,
        // names,
        savingNote,
        // surgeonsCollapseOpen,
        // anesthetistsCollapseOpen,
        formType,
      },
      props: { modal, toggle, patientlist },
      handleInputChange,
      // handleIdChange,
      // handleNamesChange,
      handleCheck,
      handleAdd,
      handleRemove,
      // toggleAnesthetistsCollapse,
      // toggleSurgeonsCollapse,
    } = this
    const emptyPrescription = {
      _id: UUIDV4(),
      route: '',
      drug: '',
      dosage: '',
      duration: '1',
      period: 'days',
      frequency: '',
      price: '',
      treatmentPlan: '',
      // mode: 'edit',
    }
    return (
      <div className="row">
        <button
          onClick={toggle}
          style={{ margin: 10 }}
          className="btn btn-secondary btn-sm"
        >
          <span style={{ marginRight: 5 }}>
            <FiFilePlus size={22} style={{ marginLeft: 5 }} />
          </span>
          Add New Operation Note
        </button>

        <Modal backdrop="static" isOpen={modal} toggle={toggle} size="lg">
          <ModalHeader toggle={toggle}>
            {formType === 'EDIT'
              ? 'Review Operation Note'
              : 'Add New Operation Note'}
          </ModalHeader>
          <ModalBody>
            <Form>
              {/* {JSON.stringify(formdata)} */}
              <FormGroup row>
                <div className="col-md-4 col-lg-4">
                  <label>Surgery Date</label>
                  <input
                    type="date"
                    name="date"
                    value={
                      formdata.date
                        ? moment(formdata.date).format('YYYY-MM-DD')
                        : ''
                    }
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="offset-md-2 offset-lg-2 col-md-6 col-lg-6">
                  {/* <PatientInput
                    patientlist={patientlist}
                    setFormData={(data) => {
                      this.setState((prev) => ({
                        formdata: { ...prev.formdata, ...data },
                      }));
                    }}
                  /> */}
                  <label className="">Patient Name</label>
                  {this.state.inputType === 'EDIT' ? (
                    <div className="form-control d-flex flex-direction-row justify-content-between">
                      <span>
                        {formdata.name}({formdata.id})
                      </span>
                      <a
                        href="#no_action"
                        onClick={(e) => {
                          e.preventDefault()
                          this.setState({ inputType: 'NEW' })
                        }}
                      >
                        change
                      </a>
                    </div>
                  ) : (
                    <AutoComplete
                      options={patientlist}
                      labelKey={(i) =>
                        `${i.firstname} ${i.surname} ${i.other} (${i.id})`
                      }
                      onChange={(item) => {
                        if (item.length) {
                          let val = item[0]
                          this.setState((prev) => ({
                            formdata: {
                              ...prev.formdata,
                              name: `${val.firstname} ${val.surname} ${val.other}`,
                              patientId: val.id,
                            },
                          }))
                        }
                      }}
                      // _ref={patientInputRef}
                    />
                  )}
                  {/* <Typeahead
                    align="justify"
                    id="patient"
                    labelKey="patient"
                    options={names.length ? names : [""]}
                    onInputChange={(val) => console.log(val)}
                    onChange={(item) => {
                      let { name, patientId } = extractPatientNameAndId(
                        item[0]
                      );
                      this.setState((prev) => ({
                        formdata: { ...prev.formdata, name: name, patientId },
                      }));
                    }}
                  /> */}
                </div>
              </FormGroup>
                  {/* {JSON.stringify(this.state.formdata)} */}
              <OperationNoteForm
                formdata={this.state.formdata}
                handleInputChange={this.handleInputChange}
                // toggleSurgeonsCollapse=f=>f,
                handleAdd={this.handleAdd}
                handleCheck={this.handleCheck}
                handleRemove={this.handleRemove}
                handleAnestheticAgenChange={(value) =>
                  this.setState((prevState) => ({
                    ...prevState,
                    formdata: Object.assign({}, prevState.formdata, {
                      anesthetic: value,
                    }),
                  }))
                }
                emptyPrescription={emptyPrescription}
                handlePrescriptionChange={this.handlePrescriptionChange}
              />
            </Form>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-primary offset-md-5 col-md-2"
              onClick={this.handleSubmit}
              disabled={!formdata.patientId || !formdata.name}
            >
              {savingNote ? (
                'Please wait...'
              ) : (
                <>{formType === 'EDIT' ? 'Update' : 'Submit'}</>
              )}
            </button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps({ records }) {
  return {
    // names: records.names,
    patientlist: records.patientlist,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getPatients: (x, y) => dispatch(getPatients(x, y)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OperationNote)
