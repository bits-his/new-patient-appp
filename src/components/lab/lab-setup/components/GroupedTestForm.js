import React from 'react'
import { Form } from 'reactstrap'
import CustomButton from '../../../comp/components/Button'
import CustomForm from '../../../comp/components/CustomForm'
import { groupedTestFormFields } from './testForm'

function GroupedTestForm({
  form = {},
  handleChange = (f) => f,
  handleRadioChange = (f) => f,
  reportTypes = [],
  handleSubmit = (f) => f,
  specimenList = [],
  handleAutocompleteChange = (f) => f,
  addTestUnits = (f) => f,
  labHeads = [],
  headRef,
  loading = false,
  formState,
}) {
  return (
    <Form>
      <CustomForm
        fields={groupedTestFormFields(
          form,
          reportTypes,
          specimenList,
          labHeads,
          headRef,
        )}
        handleChange={handleChange}
        handleRadioChange={handleRadioChange}
        specimenList={specimenList}
        handleAutocompleteChange={handleAutocompleteChange}
      />
      <center>
        {/* <button
          type="submit"
          className="btn btn-primary px-4 mt-2"
          onClick={handleSubmit}
        >
          Save
        </button> */}
        <CustomButton
          color={formState === 'new_test' ? 'primary' : 'success'}
          loading={loading}
          className="px-4 mt-2"
          onClick={addTestUnits}
        >
          {formState === 'new_test'
            ? 'Save and Add Test & Units'
            : 'Update Test'}
        </CustomButton>
      </center>
    </Form>
  )
}

export default GroupedTestForm
