import React from "react";
import { GiUltrasound } from "react-icons/gi";
// import { AiOutlineFileDone } from 'react-icons/ai';
import {
  FcTemplate,
  FcDataSheet,
  FcSettings,
  FcViewDetails,
} from "react-icons/fc";
import { MdCollectionsBookmark } from "react-icons/md";
import { FaRegSave, FaMicroscope } from "react-icons/fa";
import { useSelector } from "react-redux";
import { canUseThis } from "../../auth";
import HorizontalMenu from "../../comp/components/horizontal-menu/HorizontalMenu";
import HorizontalMenuItem from "../../comp/components/horizontal-menu/HorizontalMenuItem";
import { IoMdAnalytics } from "react-icons/io";

function VerticalLabMenu() {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <HorizontalMenu>
        {user.accessTo
          ? canUseThis(user, ["Dashboard"]) && (
              <HorizontalMenuItem route="/me/lab/dashboard">
                <FcDataSheet size={20} style={{ marginRight: 10 }} />
                Dashboard
              </HorizontalMenuItem>
            )
          : null}

        {user.accessTo
          ? canUseThis(user, ["Setup Lab Test"]) && (
              <HorizontalMenuItem route="/me/lab/setup?lab-type=Department">
                <FcSettings size={20} style={{ marginRight: 10 }} /> Lab Setup
              </HorizontalMenuItem>
            )
          : null}
        {user.accessTo
          ? canUseThis(user, ["Registrations"]) && (
              <HorizontalMenuItem route="/me/lab/patients">
                <FaRegSave size={20} style={{ marginRight: 10 }} />
                Registrations
              </HorizontalMenuItem>
            )
          : null}
        {user.accessTo
          ? canUseThis(user, ["Sample Analysis"]) && (
              <HorizontalMenuItem route="/me/lab/sample-analysis">
                <IoMdAnalytics size={20} style={{ marginRight: 10 }} /> Sample
                Analysis
              </HorizontalMenuItem>
            )
          : null}
        {/* {user.accessTo
              ? canUseThis(user, ['Client Registrations']) && (
                  <HorizontalMenuItem route="/me/lab/client-registration">
                    <MdRedeem size={20} style={{ marginRight: 10 }} />
                    Client Registrations
                  </HorizontalMenuItem>
                )
              : null}
            {user.accessTo
              ? canUseThis(user, ['Customer Approval']) && (
                  <HorizontalMenuItem route="/me/lab/customer-approval">
                    <MdApps size={20} style={{ marginRight: 10 }} />
                    Customer Approval
                  </HorizontalMenuItem>
                )
              : null} */}
        {user.accessTo
          ? canUseThis(user, ["Sample Collection"]) && (
              <HorizontalMenuItem route="/me/lab/sample-collection">
                <MdCollectionsBookmark size={20} style={{ marginRight: 10 }} />{" "}
                Sample Collection
              </HorizontalMenuItem>
            )
          : null}
        {user.accessTo
          ? canUseThis(user, ["Chemical Pathology Analysis"]) && (
              <HorizontalMenuItem route="/me/lab/chemical-pathology-analysis">
                <MdCollectionsBookmark size={20} style={{ marginRight: 10 }} />{" "}
                Chemical Pathology
              </HorizontalMenuItem>
            )
          : null}
        {user.accessTo
          ? canUseThis(user, ["Hematology Analysis"]) && (
              <HorizontalMenuItem route="/me/lab/hematology-analysis">
                <MdCollectionsBookmark size={20} style={{ marginRight: 10 }} />{" "}
                Hematology
              </HorizontalMenuItem>
            )
          : null}
          
        {user.accessTo
          ? canUseThis(user, ["Antibiotics Form"]) && (
              <HorizontalMenuItem route="/me/lab/antibiotic-form">
                <FaMicroscope size={20} style={{ marginRight: 10 }} />
                Antibiotics Form
              </HorizontalMenuItem>
            )
          : null}
        {user.accessTo
          ? canUseThis(user, ["Microbiology Analysis"]) && (
              <HorizontalMenuItem route="/me/lab/microbiology-analysis">
                <FaMicroscope size={20} style={{ marginRight: 10 }} />{" "}
                Microbiology
              </HorizontalMenuItem>
            )
          : null}
          {user.accessTo
          ? canUseThis(user, ["Radiology Analysis"]) && (
              <HorizontalMenuItem route="/me/lab/radiology-analysis-scan">
                <GiUltrasound size={20} style={{ marginRight: 10 }} />
                Radiology Scan
              </HorizontalMenuItem>
            )
          : null}
        {user.accessTo
          ? canUseThis(user, ["Radiology Analysis"]) && (
              <HorizontalMenuItem route="/me/lab/radiology-analysis">
                <GiUltrasound size={20} style={{ marginRight: 10 }} />
                Radiology
              </HorizontalMenuItem>
            )
          : null}
          {user.accessTo
          ? canUseThis(user, ["Cardiology Analysis"]) && (
              <HorizontalMenuItem route="/me/lab/cardiology-analysis">
                <MdCollectionsBookmark size={20} style={{ marginRight: 10 }} />{" "}
                Cardiology
              </HorizontalMenuItem>
            )
          : null}
        {user.accessTo
          ? canUseThis(user, ["Report Form"]) && (
              <HorizontalMenuItem route="/me/lab/report-form">
                <FcTemplate size={20} style={{ marginRight: 10 }} />
                Report Template
              </HorizontalMenuItem>
            )
          : null}
        {user.accessTo
          ? canUseThis(user, ["Doctor Comment"]) && (
              <HorizontalMenuItem route="/me/lab/doctor-comment">
                <FcViewDetails size={20} style={{ marginRight: 10 }} />
                Report
              </HorizontalMenuItem>
            )
          : null}
          {user.accessTo
          ? canUseThis(user, ["Lab Archive"]) && (
              <HorizontalMenuItem route="/me/lab/archive">
                <FcViewDetails size={20} style={{ marginRight: 10 }} />
                Archive
              </HorizontalMenuItem>
            )
          : null}
      </HorizontalMenu>

      {/* {JSON.stringify(user.functionality)} */}
      {/* {user.functionality[0] === 'Chemical Pathology Analysis' ? (
        <MicroBiologyTable />
      ) : (
        <>
          <VerticalMenu title="What would you like to do?">
            {user.accessTo
              ? canUseThis(user, ['Dashboard']) && (
                  <ListMenuItem route="/me/lab/dashboard">
                    <MdDashboard size={20} style={{ marginRight: 10 }} />
                    Dashboard
                  </ListMenuItem>
                )
              : null}
            {user.accessTo
              ? canUseThis(user, ['Setup Lab Test']) && (
                  <ListMenuItem route="/me/lab/setup">
                    <RiListSettingsLine size={20} style={{ marginRight: 10 }} />{' '}
                    Setup Lab Test
                  </ListMenuItem>
                )
              : null}
            {user.accessTo
              ? canUseThis(user, ['Registrations']) && (
                  <ListMenuItem route="/me/lab/patients">
                    <FaRegSave size={20} style={{ marginRight: 10 }} />
                    Registrations
                  </ListMenuItem>
                )
              : null}
            {user.accessTo
              ? canUseThis(user, ['Client Registrations']) && (
                  <ListMenuItem route="/me/lab/client-registration">
                    <MdRedeem size={20} style={{ marginRight: 10 }} />
                    Client Registrations
                  </ListMenuItem>
                )
              : null}
            {user.accessTo
              ? canUseThis(user, ['Customer Approval']) && (
                  <ListMenuItem route="/me/lab/customer-approval">
                    <MdApps size={20} style={{ marginRight: 10 }} />
                    Customer Approval
                  </ListMenuItem>
                )
              : null} */}
      {/* <ListMenuItem route="/me/lab/createreport">
        <MdReport size={20} style={{ marginRight: 10 }} />
        Create Report
      </ListMenuItem> */}

      {/* <ListMenuItem route="/me/lab/completed">
        <AiOutlineFileDone size={20} style={{ marginRight: 10 }} /> Completed
        Lab Tests
      </ListMenuItem> */}
      {/* <ListMenuItem route="/me/lab/receipt">
        <MdReceipt size={20} style={{ marginRight: 10 }} /> Receipt Code
      </ListMenuItem>  */}
      {/* <ListMenuItem route="/me/lab/microbiologyanalysis">
        <MdArtTrack size={20} style={{ marginRight: 10 }} /> MicroBiology
        Analysis
      </ListMenuItem> */}
      {/* <ListMenuItem route="/me/lab/print-result">
        <FaPrint size={20} style={{ marginRight: 10 }} />
        Print Lab Test Result
      </ListMenuItem> */}
      {/* {user.accessTo
              ? canUseThis(user, ['Bar Code Image']) && (
                  <ListMenuItem route="/me/lab/bar-code-img">
                    <FaQrcode size={20} style={{ marginRight: 10 }} />
                    Bar Code Image
                  </ListMenuItem>
                )
              : null}
            {user.accessTo
              ? canUseThis(user, ["Generate Bar Code"]) && (
                  <ListMenuItem route="/me/lab/generate-qr-code">
                    <AiOutlineQrcode size={20} style={{ marginRight: 10 }} />
                    Generate Bar Code
                  </ListMenuItem>
                )
              : null}
            {user.accessTo
              ? canUseThis(user, ["Donations Report"]) && (
                  <ListMenuItem route="/me/lab/donation-report">
                    <GrDocumentText size={20} style={{ marginRight: 10 }} />
                    Donations Report
                  </ListMenuItem>
                )
              : null}
            {user.accessTo
              ? canUseThis(user, ["Organization Report"]) && (
                  <ListMenuItem route="/me/lab/organization-report">
                    <GrDocumentText size={20} style={{ marginRight: 10 }} />
                    Organization Report
                  </ListMenuItem>
                )
              : null}
            {user.accessTo
              ? canUseThis(user, ["Report Form"]) && (
                  <ListMenuItem route="/me/lab/report-form">
                    <GrTemplate size={20} style={{ marginRight: 10 }} />
                    Design Report Template
                  </ListMenuItem>
                )
              : null}
            {user.accessTo
              ? canUseThis(user, ["Antibiotics Form"]) && (
                  <ListMenuItem route="/me/lab/antibiotic-form">
                    <GrDocumentText size={20} style={{ marginRight: 10 }} />
                    Antibiotics Form
                  </ListMenuItem>
                )
              : null}
            {/* <ListMenuItem route="/me/lab/inventory">
        <FaList size={20} style={{ marginRight: 10 }} />
        Inventory
      </ListMenuItem> */}
      {/* {user.accessTo
              ? canUseThis(user, ['Track Lab Test']) && (
                  <ListMenuItem route="/me/lab/tracking">
                    <MdTrackChanges size={20} style={{ marginRight: 10 }} />{" "}
                    Track Lab Test
                  </ListMenuItem>
                )
              : null}
            {user.accessTo
              ? canUseThis(user, ["Online Lab Requisition"]) && (
                  <ListMenuItem route="">
                    <MdOpenInNew size={20} style={{ marginRight: 10 }} />
                    Online Lab Requisition (Optional)
                  </ListMenuItem>
                )
              : null}
            {user.accessTo
              ? canUseThis(user, ["Online Lab Analysis"]) && (
                  <ListMenuItem route="">
                    <MdArtTrack size={20} style={{ marginRight: 10 }} />
                    Online Lab Analysis (Optional)
                  </ListMenuItem>
                )
              : null}
            {user.accessTo
              ? canUseThis(user, ["Doctor Payment Wallet"]) && (
                  <ListMenuItem route="">
                    <FaMoneyBillWave size={20} style={{ marginRight: 10 }} />
                    Doctor Payment Wallet (Optional)
                  </ListMenuItem>
                )
              : null}
          </VerticalMenu> */}
      {/* </>
      )} */}
    </>
  );
}

export default VerticalLabMenu;
