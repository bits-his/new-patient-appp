import React from 'react'
import { Form } from 'reactstrap'
import CustomButton from '../../../comp/components/Button'
import CustomForm from '../../../comp/components/CustomForm'
import { standaloneTestFormFields } from './testForm'

function StandaloneTestForm({
  form = {},
  handleChange = (f) => f,
  handleRadioChange = (f) => f,
  reportTypes = [],
  handleSubmit = (f) => f,
  loading = false,
  handleSubmitAndNext = (f) => f,
  specimenList = [],
  handleAutocompleteChange = (f) => f,
  labHeads = [],
  headRef = null,
  formState = 'new',
}) {
  return (
    <Form>
      <CustomForm
        fields={standaloneTestFormFields(
          form,
          reportTypes,
          specimenList,
          labHeads,
          headRef,
        )}
        handleChange={handleChange}
        handleRadioChange={handleRadioChange}
        handleAutocompleteChange={handleAutocompleteChange}
        itemClass="py-1"
      />
      <center>
        {/* <CustomButton
         loading={loading}
          className="btn btn-primary px-4 mt-2"
          onClick={handleSubmit}
        >
          Save
        </CustomButton> */}
        <CustomButton
          color={formState === 'new_test' ? 'primary' : 'success'}
          loading={loading}
          className="px-4 mt-2"
          onClick={handleSubmitAndNext}
        >
          {formState === 'new_test' ? 'Submit & Setup Barcode' : 'Update Test'}
        </CustomButton>
      </center>
    </Form>
  )
}

export default StandaloneTestForm
