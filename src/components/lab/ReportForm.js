import React, { useEffect, useRef } from 'react'
import {
  Card,
  Col,
  Row,
  Form,
  CardBody,
  CardHeader,
  Table,
  FormGroup,
} from 'reactstrap'
import InputGroup from '../comp/components/InputGroup'
import CustomButton from '../comp/components/Button'
import { useState } from 'react'
import { _postApi, _fetchApi, _updateApi } from '../../redux/actions/api'
import { apiURL } from '../../redux/actions'
import { _customNotify } from '../utils/helpers'
import AutoComplete from '../comp/components/AutoComplete'
// import Editor from "../comp/components/Editor"
// import CKEditor from "ckeditor4-react";

export const cardHeaderProps = {
  tag: 'h6',
  className: 'text-center',
}

export default function ReportForm() {
  const departmentRef = useRef()
  const [templateList, setTemplateList] = useState([])
  const [loading, setLoading] = useState(false)
  // const [editorLoading, setEditorLoading] = useState(true);
  const [departments, setDepartments] = useState([])
  const [templateForm, setTemplateForm] = useState({
    department: '',
    reportName: '',
    header: '',
    body: '',
  })
  const [formMode, setFormMode] = useState('new')

  const handleFormChange = ({ target: { name, value } }) => {
    setTemplateForm((p) => ({ ...p, [name]: value }))
  }

  const getDepartments = () => {
    _fetchApi(
      `${apiURL()}/lab/departments/list`,
      (data) => {
        if (data.success) {
          setDepartments(data.results)
        }
      },
      (err) => console.log(err),
    )
  }

  const getReportTemplates = () => {
    _fetchApi(
      `${apiURL()}/lab/templates/list`,
      (data) => {
        if (data.success) {
          setTemplateList(data.results)
        }
      },
      (err) => {
        console.log(err)
      },
    )
  }

  const saveNewTemplate = () => {
    setLoading(true)
    _postApi(
      `${apiURL()}/lab/templates/new`,
      templateForm,
      () => {
        _customNotify('Report Template Saved Successfully')
        setLoading(false)
        setTemplateForm({
          department: '',
          reportName: '',
          header: '',
          body: '',
        })
        getReportTemplates()
      },
      () => setLoading(false),
    )
  }

  const updateTemplate = () => {
    setLoading(true)
    _updateApi(
      `${apiURL()}/lab/templates/${templateForm.id}`,
      templateForm,
      () => {
        _customNotify('Report Template Successfully Updated')
        setLoading(false)
        setTemplateForm({
          department: '',
          reportName: '',
          header: '',
          body: '',
        })
        setFormMode('new')
        getReportTemplates()
      },
      () => setLoading(false),
    )
  }

  const handleTemplateClick = (template) => {
    // console.log(template);
    setTemplateForm((prev) => ({
      ...prev,
      department: template.department,
      reportName: template.name,
      header: template.header,
      body: template.body,
      id: template.id,
    }))
    departmentRef.current.setState({ text: template.department })
    setFormMode('edit')
  }

  useEffect(() => {
    getReportTemplates()
    getDepartments()
  }, [])

  const formIsValid =
    templateForm.department !== '' ||
    templateForm.reportName !== '' ||
    templateForm.body !== ''

  return (
    <>
      <Row>
        <Col md={8}>
          <Card>
            <CardHeader {...cardHeaderProps}>
              Create New Report Template
            </CardHeader>
            <CardBody>
              <Form>
                {/* {JSON.stringify(templateForm)} */}
                <Row>
                  {/* <InputGroup
                    container="col-6"
                    name="department"
                    id="department"
                    value={templateForm.department}
                    onChange={handleFormChange}
                    label="Department"
                  /> */}
                  {/* {JSON.stringify(departments)} */}
                  <AutoComplete
                    containerClass="col-6"
                    name="department"
                    _ref={departmentRef}
                    id="department"
                    options={departments}
                    labelKey="description"
                    value={templateForm.description}
                    onChange={(val) => {
                      if (val.length) {
                        setTemplateForm((p) => ({
                          ...p,
                          department: val[0].description,
                        }))
                      }
                    }}
                    label="Department"
                  />
                </Row>
                <Row>
                  <InputGroup
                    container="col-6"
                    name="reportName"
                    value={templateForm.reportName}
                    onChange={handleFormChange}
                    id="reportName"
                    label="Report Name"
                  />
                  <InputGroup
                    container="col-6"
                    name="header"
                    value={templateForm.header}
                    onChange={handleFormChange}
                    id="header"
                    label="Report Header"
                  />
                </Row>
                <FormGroup>
                  <label htmlFor="body" className="font-weight-bold">
                    Body
                  </label>
                  {/* {editorLoading && <Spinner />} */}
                  <textarea
                    className="form-control"
                    value={templateForm.body}
                    onChange={({ target: { value } }) =>
                      setTemplateForm((p) => ({ ...p, body: value }))
                    }
                  />
                  {/* <Editor
                      data={templateForm.body}
                      onChange={(data) =>
                        setTemplateForm((p) => ({ ...p, body: data }))
                      }
                    /> */}

                  {/* <textarea
                      name="body"
                      id="body"
                      cols="30"
                      rows="10"
                      className="form-control"
                      value={templateForm.body}
                      onChange={handleFormChange}
                    /> */}
                </FormGroup>
                <center>
                  {formMode === 'new' ? (
                    <CustomButton
                      loading={loading}
                      disabled={!formIsValid}
                      onClick={saveNewTemplate}
                      outline
                      color="primary"
                      className="px-4"
                    >
                      Save Template
                    </CustomButton>
                  ) : (
                    <CustomButton
                      loading={loading}
                      disabled={!formIsValid}
                      onClick={updateTemplate}
                      outline
                      color="success"
                      className="px-4"
                    >
                      Update Template
                    </CustomButton>
                  )}
                </center>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <CardHeader {...cardHeaderProps}>Report Templates</CardHeader>
            {/* <CardBody> */}
            {/* {JSON.stringify(templateList)} */}
            <Table size="sm" hover>
              <thead>
                <tr>
                  <th className="text-center">Report Name</th>
                  <th className="text-center">Department</th>
                </tr>
              </thead>
              <tbody>
                {templateList.map((template, i) => (
                  <tr
                    key={i}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleTemplateClick(template)}
                  >
                    <td>{template.name}</td>
                    <td>{template.department}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {!templateList.length && (
              <p className="alert alert-primary text-center mx-2">
                No template found, create a template to get started.
              </p>
            )}
            {/* </CardBody> */}
          </Card>
        </Col>
      </Row>
    </>
  )
}
