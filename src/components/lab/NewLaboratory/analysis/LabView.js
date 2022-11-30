import React from "react";
import InputResultItem from "./InputResultItem";
import MicrobiologyResultForm from "./MicrobiologyResultForm";
import TableWithRange from "./TableWithRange";
import WidalResultTable from "./WidalResultTable";
import LabComments from "../../components/LabComments";
import MacroscopyResultForm from "./MacroscopyResultForm";
import TableWithResult from "./TableWithResult";

function LabView({
  inputLabs = [],
  microbiology = [],
  isEditting = false,
  handleResultChange = (f) => f,
  handleOthersChange = (f) => f,
  handleSensitivityTableChange = (f) => f,
  sensitivities = [],
  tabledLabs = {},
  tabledLabsList = [],
  tabledWithResultLabs = {},
  tabledWithResultLabsList = [],
  hoWidalLabs = {},
  hoWidalLabsList = [],
  isHistory = true,
  isHospital = false,
  handleTableChange = (f) => f,handleTableWithResultChange = (f) => f,
  handleWidalTableChange = (f) => f,
  getComments = (f) => f,
  comments = [],
  macroscopy = [],
  handleMacroResultChange = (f) => f,
  handleMacroOthersChange = (f) => f,
  showComment=true
}) {
  return (
    <>
      {inputLabs.length
        ? inputLabs.map((item, i) => (
            <InputResultItem
              key={i}
              item={item}
              isEditting={isEditting}
              handleResultChange={handleResultChange}
            />
          ))
        : null}
      {microbiology.length
        ? microbiology.map((item, i) => (
            <MicrobiologyResultForm
              key={i}
              item={item}
              isEditting={isEditting}
              handleOthersChange={handleOthersChange}
              handleSensitivityTableChange={handleSensitivityTableChange}
              sensitivities={sensitivities}
            />
          ))
        : null}
      {macroscopy.length
        ? macroscopy.map((item, i) => (
            <MacroscopyResultForm
              key={i}
              item={item}
              isEditting={isEditting}
              handleResultChange={handleMacroResultChange}
              handleOthersChange={handleMacroOthersChange}
            />
          ))
        : null}
      {tabledLabsList && tabledLabsList.length ? (
        <TableWithRange
          list={tabledLabs}
          // list={{ [tabledLabs[0].group_head]: tabledLabs }}
          editting={isEditting}
          handleInputChange={handleTableChange}
        />
      ) : null}
      {tabledWithResultLabsList && tabledWithResultLabsList.length ? (
        <TableWithResult
          list={tabledWithResultLabs}
          // list={{ [tabledLabs[0].group_head]: tabledLabs }}
          editting={isEditting}
          handleInputChange={handleTableWithResultChange}
        />
      ) : null}
      {/* {JSON.stringify(hoWidalLabsList)} */}
      {hoWidalLabsList && hoWidalLabsList.length ? (
        <WidalResultTable
          list={hoWidalLabs}
          // list={{ [tabledLabs[0].group_head]: tabledLabs }}
          editting={isEditting}
          handleInputChange={handleWidalTableChange}
        />
      ) : null}
      {(isHistory || isHospital) && (
        <LabComments getComment={getComments} comments={comments} />
      )}
    </>
  );
}

export default LabView;
