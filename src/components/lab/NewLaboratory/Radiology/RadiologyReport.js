import React, { useEffect, useState } from 'react'
import { FormGroup } from 'reactstrap'
import AutoComplete from '../../../comp/components/AutoComplete'
import SpeechInput from '../../../comp/speech-to-text/SpeechInput'
import { _fetchApi, _postApi, _updateApi } from '../../../../redux/actions/api'
import { apiURL } from '../../../../redux/actions'
import CustomButton from '../../../comp/components/Button'
// import Editor from '../../../comp/components/Editor'
import { _customNotify, _warningNotify } from '../../../utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { getDocLabCommission } from '../../../../redux/actions/lab'
import {
  RADIOLOGY_SAMPLE_ANALYSIS,
  refreshHistoryList,
  refreshPendingList,
} from '../../labRedux/actions'
import { useHistory, useParams } from 'react-router'
import LabComments from '../../components/LabComments'
import PrintRadiologyReport from './PrintReport'
import { printResult } from '../analysis/helpers'
import moment from 'moment'

function RadiologyReport({
  lab = {},
  viewOnly = false,
  comments = [],
  getComments = (f) => f,
  request_id = '',
}) {
  const dispatch = useDispatch()
  const history = useHistory()
  const { patientId } = useParams()
  const [result, setResult] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState({})
  const [useTemplate, setUseTemplate] = useState(true)
  const [loading, setLoading] = useState(false)
  const [printing, setPrinting] = useState(false)
  const [, setSubmitting] = useState(false)
  const [printOut, setPrintOut] = useState({
    patientInfo: {},
    results: [],
    printType: '',
  })
  const user = useSelector((state) => state.auth.user)
  const today = moment().format('YYYY-MM-DD')

  const [templateList, setTemplateList] = useState([])
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

  const saveComment = (callback, error) => {
    let commissionData = []
    let commission =
      lab.commission_type === 'fixed'
        ? lab.percentage
        : parseFloat(lab.old_price) * (parseFloat(lab.percentage) / 100)

    commissionData.push([
      user.username,
      lab.description,
      commission,
      0,
      lab.booking_no,
      '',
      user.facilityId,
      today,
    ])

    let data = {
      labno: lab.booking_no,
      comment: useTemplate ? selectedTemplate.body : result,
      department: lab.department,
      tests: [lab.test],
      amount: commission,
      useTemplate: useTemplate ? 'yes' : 'no',
      commissionData,
      patientId,
    }

    _postApi(
      `${apiURL()}/lab/comment/doctors/new`,
      data,
      (data) => {
        // alert('succ1')
        callback(data)
      },
      // (e) => {
      //   error(e);
      // }
    )
  }

  const closePage = () => {
    history.push('/me/lab/radiology-analysis')
    dispatch(refreshPendingList(RADIOLOGY_SAMPLE_ANALYSIS))
    dispatch(refreshHistoryList(RADIOLOGY_SAMPLE_ANALYSIS))
  }

  const handleSubmit = () => {
    setLoading(true)
    // for (let i = 0; i < labs.length; i++) {
    //   _updateApi(`${apiURL()}/lab/result/new`);
    // }

    saveComment(
      () => {
        setSubmitting(false)
        dispatch(getDocLabCommission())
        _customNotify('Report Saved!')

        closePage()
      },
      (err) => {
        setSubmitting(false)
        console.log(err)
      },
    )

    // console.log('no:', booking_no, department, test, result)
    // let formData = new FormData();
    // for (let i = 0; i < images.length; i++) {
    //   formData.append('images', images[i]);
    // }

    // fetch(`${apiURL()}/lab/radiology/images`, {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((raw) => raw.json())
    //   .then((data) => {
    //     setLoading(false);
    //     if (data.success) {
    //       _customNotify('Results saved successfully!');
    //     }
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     console.log(err);
    //   });
  }

  useEffect(() => {
    getReportTemplates()
  }, [])

  useEffect(() => {
    if (comments && comments.length) {
      setUseTemplate(comments[0].useTemplate)
      console.log(comments)
    }
  }, [comments])

  const updatePrintStatus = (labno, cb = (f) => f) => {
    _updateApi(
      `${apiURL()}/lab/lab-results/printed`,
      { labno },
      (data) => {
        console.log(`Lab ${labno} printed!`)
        cb()
      },
      (err) => {
        console.log(err)
      },
    )
  }

  const startPrint = () => {
    printResult(
      patientId,
      lab.booking_no,
      (data) => {
        setPrintOut(data)
        console.log(data)

        window.frames[
          'template_print_frame'
        ].document.body.innerHTML = document.getElementById(
          'template_print',
        ).innerHTML
        window.frames['template_print_frame'].window.focus()
        window.frames['template_print_frame'].window.print()

        let booking_no = data.results[0].booking_no
        updatePrintStatus(booking_no, () => {})
        // window.frames['print_frame'].document.body.style.display = "inline"
        _customNotify('Report saved!')
        closePage()
      },
      (err) => {
        console.log(err)
        _warningNotify('An error occured')
      },
      request_id,
    )
  }

  const printReport = () => {
    setPrinting(true)
    // console.log(lab)

    saveComment(() => {
      // alert('succ2')

      startPrint()
    })
  }

  const printReportValid = selectedTemplate.body && selectedTemplate.body !== ''

  return (
    <>
      <FormGroup>
        <div className="text-left d-flex flex-direction-row justify-content-between mt-1">
          {/* <Label className="font-weight-bold">Report</Label> */}

          {/* <div> */}
          {viewOnly ? null : (
            <AutoComplete
              label="Select a Designed Template (optional)"
              labelClass="font-weight-normal"
              containerClass="col-md-12 mx-0 px-0"
              options={templateList}
              labelKey="name"
              onChange={(val) => {
                if (val.length) {
                  setUseTemplate(true)
                  setSelectedTemplate(val[0])
                }
              }}
            />
          )}
          {/* </div> */}
        </div>
        {/* {JSON.stringify(selectedTemplate.body)} */}

        {/* <CKEditor
          editor={ ClassicEditor }
          data="<p>Hello from CKEditor 5!</p>"
          onReady={ editor => {
              // You can store the "editor" and use when it is needed.
              console.log( 'Editor is ready to use!', editor );
          } }
          onChange={ ( event, editor ) => {
              const data = editor.getData();
              console.log( { event, editor, data } );
          } }
          onBlur={ ( event, editor ) => {
              console.log( 'Blur.', editor );
          } }
          onFocus={ ( event, editor ) => {
              console.log( 'Focus.', editor );
          } }
      /> */}
        {/* {JSON.stringify(lab)} */}
        <div className="">
          {useTemplate && !viewOnly ? (
            <div>
              <span className="font-weight-bold">Comment:</span>
              <textarea
                className="form-control"
                value={selectedTemplate.body}
                onChange={({ target: { value } }) =>
                  setSelectedTemplate((p) => ({ ...p, body: value }))
                }
              />
              {/* <Editor
                data={selectedTemplate.body}
                onChange={(e) =>
                  setSelectedTemplate((p) => ({ ...p, body: e }))
                }
              /> */}
              {/*<CKEditor
              editor={ClassicEditor}
              data={selectedTemplate.body}
              onChange={(event, editor) => {
                // const data = event.editor.getData();
                const data = editor.getData();
                setSelectedTemplate((p) => ({ ...p, body: data }));
                // console.log({ event, editor, data });
              }}
              // onInit={() => setEditorLoading(false)}
              config={{ toolbar: 'standard',
              // extraPlugins: 'font,justify', 
              // font_defaultLabel: 'Arial', fontSize_defaultLabel : '20'
                }}
              // readOnly={true}
              // type="classic"
              // style={[
              //   {
              //     name: 'Marker: Yellow',
              //     element: 'span',
              //     styles: { 'background-color': 'Yellow' },
              //   },
              // ]}
              // preset='full'
            />*/}
            </div>
          ) : viewOnly ? (
            <LabComments getComment={getComments} comments={comments} />
          ) : (
            <SpeechInput
              onInputChange={(text) => setResult(text)}
              tag="textarea"
              value={result}
              style={{ height: '250px' }}
            />
          )}
        </div>
      </FormGroup>
      <PrintRadiologyReport data={printOut} />
      <br />
      <center>
        {viewOnly ? (
          <CustomButton
            // disabled={!printReportValid}
            loading={printing}
            onClick={startPrint}
            color="success"
            className="mx-2"
          >
            Reprint Result
          </CustomButton>
        ) : (
          <>
            <CustomButton
              disabled={!printReportValid}
              loading={loading}
              onClick={handleSubmit}
              className="px-5"
            >
              Submit
            </CustomButton>
            <CustomButton
              disabled={!printReportValid}
              loading={printing}
              onClick={printReport}
              color="success"
              className="mx-2"
            >
              Submit & Print now
            </CustomButton>
          </>
        )}
      </center>
    </>
  )
}

export default RadiologyReport

/**
 * Our platform allows you to archive your medical images that offers full DICOM Compliance
 * with highly secured and performant cloud integration, now you can do your radiology report
 * from anywhere in the world
 */
