import React from 'react';
import { FormGroup, Form, Input, Col, Label } from 'reactstrap';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
import AutoComplete from '../../comp/components/AutoComplete';
import InputGroup from '../../comp/components/InputGroup';
import Button from '../../comp/components/Button';
// import { Typeahead } from 'react-bootstrap-typeahead';

function LabSetupForm(props) {
  // const headRef = useRef();
  // const subRef = useRef();
  const {
    logChange,
    handleSubmit,
    handleTestChange,
    handleAddClick,
    error,
    labServices,
    saving,
    lab,
    headRef,
    subRef,
    isEdit,
    closeEditMode,
    // labHeads,
  } = props;

  return (
    <>
      <div className="">
        <FormGroup row className="">
          <AutoComplete
            label="Lab Head"
            name="labhead"
            options={labServices}
            labelKey="labSub"
            value={lab.labhead}
            onChange={(value) => {
              if (value.length) {
                logChange('labHead', value[0].labSub);
                // console.log(value[0].labSub)
              } else {
                logChange('labHead', '');
              }
            }}
            containerClass="col-md-4 col-lg-4"
            _ref={headRef}
          />

          <AutoComplete
            label="Lab SubHead"
            required
            options={[]}
            name="labSub"
            value={lab.labSub}
            onChange={(value) => {
              if (value.length) {
                logChange('labSub', value[0]);
              }
            }}
            onInputChange={(value) => logChange('labSub', value)}
            containerClass="col-md-4 col-lg-4"
            _ref={subRef}
          />
          <AutoComplete
            label="Specimen"
            required
            options={[]}
            name="specimen"
            value={lab.specimen}
            onChange={(value) => {
              if (value.length) {
                logChange('specimen', value[0]);
              }
            }}
            onInputChange={(value) => logChange('specimen', value)}
            containerClass="col-md-4 col-lg-4"
            _ref={subRef}
          />
        </FormGroup>

        <h6 className="font-weight-bold">Add Tests for this lab</h6>

        <Form className="m-0 p-0">
          {lab &&
            lab.tests &&
            lab.tests.map((item, index) => (
              <FormGroup row className="m-0 p-0" key={index}>
                <InputGroup
                  label="Test"
                  name="test_name"
                  value={item.test_name}
                  onChange={(e) =>
                    handleTestChange('test_name', e.target.value, index)
                  }
                />

                <InputGroup
                  label="Unit"
                  name="test_unit"
                  value={item.test_unit}
                  container="col-2"
                  onChange={(e) =>
                    handleTestChange('test_unit', e.target.value, index)
                  }
                />
                <Col md="2">
                  <Label className="font-weight-bold">Range</Label>
                  <Input
                    name="range_from"
                    value={item.range_from}
                    placeholder="From"
                    onChange={(e) =>
                      handleTestChange('range_from', e.target.value, index)
                    }
                  />
                </Col>
                <Col md="2">
                  <Label />
                  <Input
                    className="mt-2"
                    name="range_to"
                    value={item.range_to}
                    placeholder="To"
                    onChange={(e) =>
                      handleTestChange('range_to', e.target.value, index)
                    }
                  />
                </Col>
                <Col md="2">
                  <Label>Price</Label>
                  <Input
                    // className="mt-2"
                    name="price"
                    value={item.price}
                    placeholder=""
                    onChange={(e) =>
                      handleTestChange('price', e.target.value, index)
                    }
                  />
                </Col>
              </FormGroup>
            ))}
          <div className="d-flex flex-row justify-content-end mr-3">
            <button
              className="btn btn-outline-secondary"
              onClick={handleAddClick}
            >
              <FaPlus className="mr-1" />
              Add more
            </button>
          </div>
        </Form>

        <div className="" style={{ textAlign: 'center' }}>
          <div>
            {error !== '' ? (
              <div style={{ color: 'red' }}>
                <center>{error}</center>
              </div>
            ) : null}
          </div>
          <br />
          <Button loading={saving} onClick={handleSubmit}>
            {isEdit ? (
              <>
                <FaEdit size={20} className="mr-1" /> Update
              </>
            ) : (
              <>
                <MdSend size={20} className="mr-1" />
                Submit
              </>
            )}
          </Button>

          {isEdit && (
            <button
              className="btn btn-outline-secondary ml-1"
              onClick={closeEditMode}
            >
              New Lab Service
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default LabSetupForm;
