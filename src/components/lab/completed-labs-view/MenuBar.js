import React from "react";
import { FaBarcode, FaFile, FaReceipt } from "react-icons/fa";
import CustomButton from "../../comp/components/Button";
import {
  RECEIPT_PREVIEW,
  SAMPLE_DETAILS_PREVIEW,
} from "../ViewCompletedLabResult";

const MenuBar = ({
  departmentHead,
  previewIsReceipt,
  setPreviewMode,
  previewMode,
  listLoading,
  previewIsSampleDetails,
  previewIsBarcode,
  printBarcode,
  onSampleDetailsClick,
}) => (
  <div className="d-flex flex-direction-row align-items-center justify-content-between mb-2">
    {departmentHead === "Others" ? (
      <span> </span>
    ) : (
      <p className="font-weight-bold">Unit: {departmentHead}</p>
    )}
    <div d-flex flex-direction-row>
      {previewIsReceipt ? null : (
        <CustomButton
          size="sm"
          className="mx-1"
          color={"primary"}
          onClick={() => setPreviewMode(RECEIPT_PREVIEW)}
          disabled={previewMode || listLoading}
          title={
            previewMode
              ? "Close Preview window to activate this button"
              : "Print Receipt"
          }
        >
          <FaReceipt className="mr-1" />
          Print Receipt
        </CustomButton>
      )}
      {previewIsSampleDetails ? null : (
        <CustomButton
          size="sm"
          className="mx-1"
          color={"warning"}
          onClick={() => {
            onSampleDetailsClick();
            setPreviewMode(SAMPLE_DETAILS_PREVIEW);
          }}
          disabled={previewMode || listLoading}
          title={
            previewMode
              ? "Close Preview window to activate this button"
              : "Print Sample Details"
          }
        >
          <FaFile className="mr-1" />
          Print Sampling Details
        </CustomButton>
      )}

      {previewIsBarcode ? null : (
        <CustomButton
          size="sm"
          className="mx-1"
          color={"secondary"}
          // onClick={() => setPreviewMode(BARCODE_PREVIEW)}
          onClick={printBarcode}
          // disabled={previewMode || listLoading}
          title={
            previewMode
              ? "Close Preview window to activate this button"
              : "Print Barcode"
          }
        >
          <FaBarcode className="mr-1" />
          Print Barcode
        </CustomButton>
      )}
    </div>
  </div>
);

export default MenuBar;
