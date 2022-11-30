import React from "react";
import { Table } from "reactstrap";

const cellStyle = {
  borderRight: "1px solid black",
  textAlign: "center",
};

function SusceptibilityTest({
  sensitivityList = [],
  sensitiveTo = [],
  handleSensitivityTableChange = (f) => f,
  currTest = {
    sensitiveTo: "",
    resistantTo: "",
    intermediaryTo: "",
  },
}) {
  return (
    <Table striped style={{ border: "1px solid black" }}>
      <thead>
        <tr>
          <th style={cellStyle}>ANTIBIOTICS</th>
          <th
            colSpan={3}
            style={{
              borderRight: "1px solid black",
              borderTop: "1px solid black",
              textAlign: "center",
            }}
          >
            ISOLATES
          </th>
        </tr>
      </thead>

      <tbody>
        <tr style={{ marginLeft: "10px" }}>
          <td style={cellStyle}> </td>
          <td style={cellStyle}>R</td>
          <td style={cellStyle}>S</td>
          <td style={cellStyle}>I</td>
        </tr>

        {sensitivityList.map((item, index) => {
          return (
            <tr key={index}>
              <td
                style={{
                  borderRight: "1px solid black",
                }}
              >
                {item.antibiotic}
              </td>
              <td
                style={{
                  borderRight: "1px solid black",
                }}
              >
                <input
                  type="checkbox"
                  onChange={() =>
                    handleSensitivityTableChange(
                      "resistantTo",
                      item.antibiotic,
                      currTest
                    )
                  }
                  checked={
                    currTest.resistantTo &&
                    currTest.resistantTo.includes(item.antibiotic)
                  }
                />
              </td>

              <td
                style={{
                  borderRight: "1px solid black",
                }}
              >
                <input
                  type="checkbox"
                  onChange={() =>
                    handleSensitivityTableChange(
                      "sensitiveTo",
                      item.antibiotic,
                      currTest
                    )
                  }
                  checked={
                    currTest.sensitiveTo &&
                    currTest.sensitiveTo.includes(item.antibiotic)
                  }
                />
              </td>

              <td
                style={{
                  borderRight: "1px solid black",
                }}
              >
                <input
                  type="checkbox"
                  onChange={() =>
                    handleSensitivityTableChange(
                      "intermediaryTo",
                      item.antibiotic,
                      currTest
                    )
                  }
                  checked={
                    currTest.intermediaryTo &&
                    currTest.intermediaryTo.includes(item.antibiotic)
                  }
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default SusceptibilityTest;
