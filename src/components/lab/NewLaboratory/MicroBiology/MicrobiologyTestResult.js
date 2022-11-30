import React from "react";
import { Input } from "reactstrap";
// import SusceptibilityTest from "./SusceptibilityTest";

function MicrobiologyLabTestResult({ labs, edit = false }) {
  let currLab = labs[0];
  return (
    <>
      {currLab.description && currLab.description !== "" ? (
        <h6 className="mb-4 font-weight-bold">Test: {currLab.description}</h6>
      ) : null}
      {/* {JSON.stringify(currLab)} */}
      <div>
        <h6>Appearance/Macroscopy:</h6>
        {edit ? (
          <Input
            // onInputChange={(text) => this.setState({ appearanceM: text })}
            // onInputChange={(text) =>
            //   setForm((p) => ({ ...p, appearanceM: text }))
            // }
            tag="textarea"
            value={currLab.appearance}
            style={{ height: "100px" }}
          />
        ) : (
          <p>{currLab.appearance}</p>
        )}
      </div>
      <div>
        <h6>Microscopy:</h6>
        {edit ? (
          <Input
            // onInputChange={(text) => this.setState({ appearanceM: text })}
            // onInputChange={(text) =>
            //   setForm((p) => ({ ...p, appearanceM: text }))
            // }
            tag="textarea"
            value={currLab.appearance}
            style={{ height: "100px" }}
          />
        ) : (
          <p>{currLab.serology}</p>
        )}
      </div>
      <div>
        <h6>Culture yielded:</h6>
        {edit ? (
          <Input
            // onInputChange={(text) => this.setState({ appearanceM: text })}
            // onInputChange={(text) =>
            //   setForm((p) => ({ ...p, appearanceM: text }))
            // }
            tag="textarea"
            value={currLab.appearance}
            style={{ height: "100px" }}
          />
        ) : (
          <p>{currLab.culture_yielded}</p>
        )}
      </div>
      <div>
        <h6>Sensitive to:</h6>
        {edit ? (
          <Input
            // onInputChange={(text) => this.setState({ appearanceM: text })}
            // onInputChange={(text) =>
            //   setForm((p) => ({ ...p, appearanceM: text }))
            // }
            tag="textarea"
            value={currLab.appearance}
            style={{ height: "100px" }}
          />
        ) : (
          <p>{currLab.sensitivity}</p>
        )}
      </div>
      <div>
        <h6>Resistant to:</h6>
        {edit ? (
          <Input
            // onInputChange={(text) => this.setState({ appearanceM: text })}
            // onInputChange={(text) =>
            //   setForm((p) => ({ ...p, appearanceM: text }))
            // }
            tag="textarea"
            value={currLab.appearance}
            style={{ height: "100px" }}
          />
        ) : (
          <p>{currLab.resistivity}</p>
        )}
      </div>
      {/* <SusceptibilityTest /> */}
      {/* <Table striped bordered>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Test Name</th>
            <th>Appearance</th>
            <th>Serology</th>
            <th>Culture Yielded</th>
          </tr>
        </thead>
        <tbody>
          {labs.map((item, i) => (
            <tr
              className="border border-lg-light py-3"
              key={i}
              style={{
                background:
                  item.result !== ""
                    ? parseFloat(item.result) > parseFloat(item.range_to)
                      ? "#DC143C"
                      : parseFloat(item.result) < parseFloat(item.range_from)
                      ? "#F0E68C"
                      : "#7FFF00"
                    : "",
              }}
            >
              <td style={columnStyle}>{i + 1}</td>
              <td style={columnStyle}>{item.description}</td>
              <td style={columnStyle}>{item.appearance}</td>
              <td style={columnStyle}>{item.serology}</td>
              <td style={columnStyle}>
                {item.culture_yielded}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
       */}
    </>
  );
}

export default MicrobiologyLabTestResult;
