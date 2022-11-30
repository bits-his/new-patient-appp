import React from "react";
import { Card, Col, FormGroup, Input, Label, Row } from "reactstrap";
import SusceptibilityTest from "../MicroBiology/SusceptibilityTest";
import SpeechInput from "../../../comp/speech-to-text/SpeechInput";

function MicrobiologyResultForm({
  item = {},
  isEditting = true,
  handleOthersChange = (f) => f,
  handleSensitivityTableChange = (f) => f,
  sensitivities,
}) {
  // const showAppearance = !isBlood;
  const showAppearance = true;
  // const showSerology = !isBlood;
  const showSerology = true;
  const showCulture = true;
  // const showSensitivity = true;
  // const showResistivity = true;

  return (
    <Card className="border border-dark my-1 p-2">
      <div>
        <span className="d-block font-weight-bold">
          Investigation: {item.description}
        </span>
        <span className="d-block">Specimen: {item.specimen}</span>
      </div>
      {/*{JSON.stringify(item)}*/}
      <Row className="">
        <Col>
          {showAppearance ? (
            <FormGroup>
              {/* <h6>Appearance/Macroscopy:</h6> */}
              <Label className="font-weight-bold">Appearance/Macroscopy:</Label>
              {isEditting ? (
                <SpeechInput
                  // onInputChange={(text) => this.setState({ appearanceM: text })}
                  onInputChange={(text) =>
                    handleOthersChange({ ...item, appearance: text })
                  }
                  tag="textarea"
                  value={item.appearance}
                  style={{ height: "100px" }}
                />
              ) : (
                <p>{item.appearance}</p>
              )}
            </FormGroup>
          ) : null}
          {showSerology ? (
            <FormGroup>
              {/* <h6>Microscopy:</h6> */}
              <Label className="font-weight-bold">Microscopy:</Label>
              {isEditting ? (
                <SpeechInput
                  // onInputChange={(text) => this.setState({ appearance: text })}
                  onInputChange={(text) =>
                    handleOthersChange({ ...item, serology: text })
                  }
                  tag="textarea"
                  value={item.serology}
                  style={{ height: "100px" }}
                />
              ) : (
                <p>{item.serology}</p>
              )}
            </FormGroup>
          ) : null}
          {showCulture ? (
            <FormGroup>
              {/* <h6>Culture yielded:</h6> */}
              <Label className="font-weight-bold">Culture yielded:</Label>
              {isEditting ? (
                <SpeechInput
                  // onInputChange={(text) => this.setState({ appearanceM: text })}
                  onInputChange={(text) =>
                    handleOthersChange({ ...item, culture_yielded: text })
                  }
                  tag="textarea"
                  value={item.culture_yielded}
                  style={{ height: "100px" }}
                />
              ) : (
                <p>{item.culture_yielded}</p>
              )}
            </FormGroup>
          ) : null}
          {/* {JSON.stringify({ test, labno })} */}
          <FormGroup>
            <Label className="font-weight-bold">Resistant To:</Label>
            {isEditting ? (
              <Input
                type="textarea"
                name="resistantTo"
                onChange={(e) =>
                  handleOthersChange({
                    ...item,
                    [e.target.name]: e.target.value,
                  })
                }
                value={item.resistantTo}
              />
            ) : (
              <p>{item.resistantTo}</p>
            )}
          </FormGroup>
          <FormGroup>
            <Label className="font-weight-bold">Sensitive To:</Label>
            {isEditting ? (
              <Input
                type="textarea"
                name="sensitiveTo"
                value={item.sensitiveTo}
                onChange={(e) =>
                  handleOthersChange({
                    ...item,
                    [e.target.name]: e.target.value,
                  })
                }
              />
            ) : (
              <p>{item.sensitiveTo}</p>
            )}
          </FormGroup>
          <FormGroup>
            <Label className="font-weight-bold">Intermediate Sensitivity</Label>
            {isEditting ? (
              <Input
                type="textarea"
                name="intermediaryTo"
                onChange={(e) =>
                  handleOthersChange({
                    ...item,
                    [e.target.name]: e.target.value,
                  })
                }
                value={item.intermediaryTo}
              />
            ) : (
              <p>{item.intermediaryTo}</p>
            )}
          </FormGroup>
          {/* <>
            {(isHistory || isHospital) && (
              <LabComments getComment={getComments} comments={comments} />
            )}
            {isHospital ? (
              <div className="my-2">
                <label className="font-weight-bold">
                  Microbiologist Comment
                </label>
                <SpeechInput
                  type="textarea"
                  value={form.comment}
                  onInputChange={(val) =>
                    setForm((prev) => ({ ...itemrev, comment: val }))
                  }
                  style={{ height: "100px" }}
                />
              </div>
            ) : null}
          </> */}
        </Col>
        <Col>
          {isEditting ? (
            <>
              <h6>Antibiotics Susceptibility Test</h6>
              <SusceptibilityTest
                sensitivityList={sensitivities}
                currTest={item}
                handleSensitivityTableChange={handleSensitivityTableChange}
              />
            </>
          ) : null}

          {/* {showSensitivity ? (
          <FormGroup>
            <h6>Sensitivity:</h6>
            {isEditting ? (
              <SpeechInput
                // onInputChange={(text) => this.setState({ appearanceM: text })}
                onInputChange={(text) =>
                  handleOthersChange({ ...item, sensitiveTo: text })
                }
                tag="textarea"
                value={item.sensitiveTo}
                style={{ height: "100px" }}
              />
            ) : (
              <p>{item.sensitiveTo}</p>
            )}
          </FormGroup>
        ) : null}
        {showResistivity ? (
          <FormGroup>
            <h6>Resistivity:</h6>
            {isEditting ? (
              <SpeechInput
                // onInputChange={(text) => this.setState({ appearanceM: text })}
                onInputChange={(text) =>
                  handleOthersChange({ ...p, resistantTo: text })
                }
                tag="textarea"
                value={item.resistantTo}
                style={{ height: "100px" }}
              />
            ) : (
              <p>{item.resistantTo}</p>
            )}
          </FormGroup>
        ) : null} */}
        </Col>
      </Row>
    </Card>
  );
}

export default MicrobiologyResultForm;
