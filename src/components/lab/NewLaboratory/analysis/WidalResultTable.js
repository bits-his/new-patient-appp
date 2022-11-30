import React, { useState, useEffect, useRef } from "react";
import { Input } from "reactstrap";

const centerColumnStyle = {
  borderTop: "2px solid white",
  borderLeft: "2px solid white",
  borderRight: "2px solid white",
};
// const rightColumnStyle = {
//   borderTop: "2px solid white",
// };
const leftColumnStyle = {
  borderTop: "2px solid white",
};

function WidalResultTable({
  list = {},
  editting = false,
  handleInputChange = (f) => f,
}) {
  const bg = ["#034ad3", "#8034ad", "#034a24", "#034ad3"];
  const containerRef = useRef();

  let [currRow, setCurrRow] = useState(0);

  const move = (loc) => {
    const nodeList = containerRef.current.querySelectorAll(
      ".widal-input-with-ref"
    );
    const inputArray = Array.apply(null, nodeList);

    // console.log("going Down", currTable, currRow, nextLoc, inputArray.length);
    if (loc >= 0 && loc < inputArray.length) {
      inputArray[loc].focus();
    }

    // console.log(inputArray);
    // buttonArray[2].focus()
  };

  const goUp = () => {
    // let nextLoc = currTable + currRow - 1;
    // move(nextLoc);
    currRow--;
    currRow--;
    move(currRow);
  };
  const goDown = () => {
    // move(parseInt(currRow)+1)

    currRow++;
    currRow++;
    move(currRow);
    // setCurrRow(currRow + 1);
    // move(currRow + 1);
  };
  const goLeft = () => {
    // console.log("going Left");
    currRow--;
    move(currRow);
  };
  const goRight = () => {
    // console.log("going Right");
    currRow++;
    move(currRow);
  };

  const handleKeyPress = (e) => {
    // console.log(e.key)
    switch (e.key) {
      case "ArrowUp":
        return goUp();
      case "ArrowDown":
        return goDown();
      case "ArrowRight":
        return goRight();
      case "ArrowLeft":
        return goLeft();
      // case "F8":
      //   return null;
      // case "F9":
      //   return null;
      default:
        return null;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <table
      className="table table-striped table-bordered table-sm table-hover"
      ref={containerRef}
      style={{ border: `2px solid ${bg[0]}` }}
    >
      <thead>
        <tr>
          {/* <th className="text-center">S/N</th> FEED */}
          <th className="text-center">Test Name</th>
          <th className="text-center">O</th>
          <th className="text-center">H</th>
        </tr>
      </thead>

      {Object.keys(list).map((main, mainIdx) => {
        return (
          <tbody
            key={mainIdx}
            className="p-3"
            style={{ border: `2px solid ${bg[mainIdx]}` }}
          >
            <tr>
              <th colSpan={4}>
                <u>{main === "Others" ? "" : main}</u>
              </th>
            </tr>
            {list[main]
              .sort((a, b) => a.sn - b.sn)
              .map((item, i) => {
                return (
                  <tr
                    className="border border-lg-light py-3"
                    key={i}
                    style={{
                      background:
                        item.result && item.result !== ""
                          ? parseFloat(item.result) > parseFloat(item.range_to)
                            ? "#DC143C"
                            : parseFloat(item.result) <
                              parseFloat(item.range_from)
                            ? "#F0E68C"
                            : "#7FFF00"
                          : "",
                      color:
                        item.result && item.result !== ""
                          ? parseFloat(item.result) > parseFloat(item.range_to)
                            ? "#fff"
                            : parseFloat(item.result) <
                              parseFloat(item.range_from)
                            ? "#000"
                            : "#000"
                          : "",
                      // border: "1px solid green",
                    }}
                  >
                    {/* <td style={leftColumnStyle}>{item.sn}</td> */}
                    <td style={leftColumnStyle}>{item.description}</td>
                    <td style={centerColumnStyle} className="text-center">
                      {editting ? (
                        <Input
                          size="sm"
                          value={item.o_value}
                          //   style={{ width: 80 }}
                          onChange={(e) =>
                            handleInputChange(
                              "o_value",
                              e.target.value,
                              i,
                              main,
                              item
                            )
                          }
                          className="widal-input-with-ref"
                          onFocus={() => setCurrRow(i)}
                        />
                      ) : (
                        item.o_value
                      )}
                    </td>
                    <td style={centerColumnStyle} className="text-center">
                      {editting ? (
                        <Input
                          size="sm"
                          value={item.h_value}
                          //   style={{ width: 80 }}
                          onChange={(e) =>
                            handleInputChange(
                              "h_value",
                              e.target.value,
                              i,
                              main,
                              item
                            )
                          }
                          className="widal-input-with-ref"
                          onFocus={() => setCurrRow(i)}
                        />
                      ) : (
                        item.h_value
                      )}
                    </td>

                    {/* <td>{item.price}</td>
                      <td>{item.commission_type}</td>
                      <td>{item.percentage}</td> */}
                  </tr>
                );
              })}
          </tbody>
        );
      })}
    </table>
  );
}

export default WidalResultTable;
