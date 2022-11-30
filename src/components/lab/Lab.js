import React, { lazy, useEffect } from 'react'
import { Route, Redirect, Switch, useHistory, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { canUseThis } from '../auth'
import {
  ALL_DEPARTMENT,
  CARDIOLOGY_SAMPLE_ANALYSIS,
  CHEMICAL_PATHOLOGY_ANALYSIS,
  DOCTOR_COMMENT,
  // DOCTOR_COMMENT,
  HEMATOLOGY_ANALYSIS,
  MICRO_SAMPLE_ANALYSIS,
  RADIOLOGY_SAMPLE_ANALYSIS,
  RADIOLOGY_SAMPLE_SCAN,
  // SAMPLE_ANALYSIS,
  SAMPLE_COLLECTION,
} from './labRedux/actions'
import { Suspense } from 'react'
// import FullscreenLoading from '../comp/components/FullscreenLoading'
// import FallbackLayout from './components/FallbackLayout'
import ReportFormFallback from './components/ReportFormFallback'
import { FallbackComp } from '../comp/components/FallbackSkeleton'
import PatientRegistrationOne from '../lab/NewLaboratory/PatientRegistrationOne'
// import PrintResult from "./PrintResult";
// import Verify from "./Verify";
// import DoctorCommentContainer from "./NewLaboratory/DoctorCommentContainer";
// import HematologyAnalysisContainer from "./NewLaboratory/HematologyAnalysisContainer";
// import PastLabRequisition from "./NewLaboratory/PastLabRequisition";
import CompletedLabTests from './CompletedLabTests'
import PatientRegTable from './NewLaboratory/PatientRegTable'
import ReportsContainer from './NewLaboratory/reports/ReportsContainer'
// import PendingPayments from './NewLaboratory/registration/PendingPayments'
import WorkList from './NewLaboratory/reports/WorkList'
// import PatientRegistration1 from "./NewLaboratory/PatientRegistration1";

import LabRecordsArchive from './NewLaboratory/archive'
import VerticalLabMenu from './components/LabMenu'
import LabProcesses from './LabProcesses'
import SampleTracking from './SampleTracking'
import LabSetup from './lab-setup/LabSetup'
import NewLabTest from './NewLabTest'
import PatientRegistation from './NewLaboratory/Index'
// import ContinueReg from "./NewLaboratory/ContinueReg"
import StepBar from './NewLaboratory/Stepbar'
import CustomerApproval from './CustomerApproval'
// import DonationReport from "./DonationReport"
import OrganizationReport from './OrganizationReport'
import ReportForm from './ReportForm'
import AntibioticsForm from './AntibioticsForm'
import AddClient from '../account/AddClient'
import ViewCompletedLabResults from './ViewCompletedLabResult'
import GenerteBarCodeImg from './GenerateBarCodeImg'
import BarCodeGenerator from './GenerateBarCode'
import Dashboard from '../pharmacy/PharmacyDashboard'
import Container from './NewLaboratory/analysis/Container'
import PendingLabRequest from './PendingLabRequest'
import DoctorFeesDetails from '../account/reports/DoctorFeesDetails'

export default function Lab(props) {
  const location = useLocation();
  const history = useHistory()
  const user = useSelector((state) => state.auth.user)

  const fullMode = true
  // location.pathname === "/me/lab/setup" ||
  // location.pathname === "/me/lab/customerapproval" ||
  // location.pathname.includes("/me/lab/patients/new") ||
  // user.functionality.length === 1;

  const navigateUser = (user) => {
    let functionality = user.functionality
    switch (functionality[0]) {
      case 'Dashboard':
        return history.push('/me/lab/dashboard')
      case 'Setup Lab Test':
        return history.push('/me/lab/setup')
      case 'Registrations':
        return history.push('/me/lab/patients')
      case 'Sample Collection':
        return history.push('/me/lab/sample-collection')
      case 'Antibiotics Form':
        return history.push('/me/lab/antibiotic-form')
      case 'Report Form':
        return history.push('/me/lab/report-form')
      case 'Chemical Pathology Analysis':
        return history.push('/me/lab/chemical-pathology-analysis')
      case 'Hematology Analysis':
        return history.push('/me/lab/hematology-analysis')
      case 'Microbiology Analysis':
        return history.push('/me/lab/microbiology-analysis')
      case 'Radiology Analysis':
        return history.push('/me/lab/radiology-analysis')
      case 'Radiology Scan':
        return history.push('/me/lab/radiology-scan')
      case 'Doctor Comment':
        return history.push('/me/lab/doctor-comment')
      default:
        return history.push('/me/lab/patients')
    }
  }

  useEffect(() => {
    if (user && !location.pathname.includes('setup')) {
      navigateUser(user)
    }
  }, [user])

  const hasMoreAccess = user.functionality && user.functionality.length > 1

  return (
    <>
      {hasMoreAccess && <VerticalLabMenu />}
      <div className="row" style={{ margin: 0, padding: 0 }}>
        {/* {location.pathname === '/me/lab/newmicrobiologyanalysis' ? (
        <div className="col-md-9 col-lg-9">
        <NewMicroBiology />
        </div>
        ) : location.pathname === '/me/lab/radiology' ? (
          <div className="col-md-9 col-lg-9">
          <Radiology />
          </div>
        ) : null} */}

        {fullMode ? null : (
          <div className="col-md-3 col-lg-3">
            <PendingLabRequest />
            {/* {user.functionality.length === 1 ? (
            <PastLabRequisition />
          ) : (
          )} */}
            {/* {JSON.stringify(user.functionality.length)} */}
          </div>
        )}

        <div className={fullMode ? 'col-md-12 col-lg-12' : 'col-md-9 col-lg-9'}>
          <Switch>
            <Redirect exact from="/me/lab" to="/me/lab/patients" />
            {/* 
            <Route
              path="/me/lab/patients"
              exact
              component={PatientRegTable}
            /> 
          */}

              {user.accessTo
                ? canUseThis(user, ['Registrations']) && (
                    <Route
                      exact
                      path="/me/lab/patients/new"
                      render={() => <PatientRegistation fullMode={fullMode} />}
                    />
                  )
                : null}
              {/* {user.accessTo
                ? canUseThis(user, ["Registrations"]) && (
                    <Route
                      exact
                      path="/me/lab/patients/pending-payments"
                      render={() => <PendingPayments />}
                    />
                  )
                : null} */}

              {user.accessTo
                ? canUseThis(user, ['Registrations']) && (
                    <Route
                      exact
                      path="/me/lab/patients/reports"
                      render={() => <ReportsContainer fullMode={fullMode} />}
                    />
                  )
                : null}

              {user.accessTo
                ? canUseThis(user, ['Registrations']) && (
                    <Route
                      exact
                      path="/me/lab/patients/work-list"
                      render={() => <WorkList fullMode={fullMode} />}
                    />
                  )
                : null}

              {user.accessTo
                ? canUseThis(user, ['Registrations']) && (
                    <Route
                      path="/me/lab/patients/new/:patientId"
                      exact
                      render={() => <PatientRegistation fullMode={fullMode} />}
                    />
                  )
                : null}

              {user.accessTo
                ? canUseThis(user, ['Registrations']) && (
                    <Route
                      path="/me/lab/patients/edit/:patientId"
                      exact
                      render={() => (
                        <PatientRegistrationOne fullMode={fullMode} />
                      )}
                    />
                  )
                : null}

              {user.accessTo
                ? canUseThis(user, ['Registrations']) && (
                    <Route
                      path="/me/lab/request/edit/:patientId/:bookingNo"
                      exact
                      render={() => <PatientRegistation fullMode={fullMode} />}
                    />
                  )
                : null}

              {user.accessTo
                ? canUseThis(user, ['Registrations']) && (
                    <Route
                      // exact
                      path="/me/lab/patients"
                      component={PatientRegTable}
                    />
                  )
                : null}

            {/* <Route
            path="/me/lab/patients/new/receipt"
            exact
            component={LabReceipt}
          /> */}
            {/* <Redirect
                exact
                from="/me/lab"
                to="/me/lab/patients/new"
              /> */}
              {user.accessTo
                ? canUseThis(user, ['Setup Lab Test']) && (
                    <Route path="/me/lab/setup" exact component={LabSetup} />
                  )
                : null}

              <Route path="/me/lab/newlab" component={NewLabTest} />
              <Route
                path="/me/lab/process/:patientId"
                component={LabProcesses}
              />
              <Route path="/me/lab/tracking" component={SampleTracking} />
              {/* <Route path="/me/lab/print-result" component={PrintResult} /> */}
              {/* <Route path="/me/lab/verify" component={Verify} /> */}

              <Route
                path="/me/lab/completed/view/:patientId/:labNo"
                component={ViewCompletedLabResults}
              />
              <Route
                path="/me/lab/uncompleted/view/:patientId/:labNo"
                component={ViewCompletedLabResults}
              />
              <Route path="/me/lab/completed" component={CompletedLabTests} />

              <Route
                path="/me/lab/antibiotic-form"
                component={() => (
                  <Suspense fallback={<FallbackComp />}>
                    <AntibioticsForm />
                  </Suspense>
                )}
              />
              <Route
                path="/me/lab/customer-approval"
                component={CustomerApproval}
              />

              {user.accessTo
                ? canUseThis(user, ['Dashboard']) && (
                    <Route path="/me/lab/dashboard" component={Dashboard} />
                  )
                : null}

              {user.accessTo
                ? canUseThis(user, ['Sample Collection']) && (
                    <Route
                      path="/me/lab/sample-collection"
                      component={() => (
                        <Container type={SAMPLE_COLLECTION} department={''} />
                      )}
                      // component={SampleCollectionContainer}
                    />
                  )
                : null}

              {user.accessTo
                ? canUseThis(user, ['Sample Analysis']) && (
                    <Route
                      path="/me/lab/sample-analysis"
                      component={() => (
                        <Container type={ALL_DEPARTMENT} department={'All'} />
                      )}
                      // component={SampleAnalysisContainer}
                    />
                  )
                : null}

              {user.accessTo
                ? canUseThis(user, ['Chemical Pathology Analysis']) && (
                    <Route
                      path="/me/lab/chemical-pathology-analysis"
                      // component={SampleAnalysisContainer}
                      component={() => (
                        <Container
                          type={CHEMICAL_PATHOLOGY_ANALYSIS}
                          department={'Chemical Pathology'}
                        />
                      )}
                    />
                  )
                : null}

              {user.accessTo
                ? canUseThis(user, ['Hematology Analysis']) && (
                    <Route
                      path="/me/lab/hematology-analysis"
                      component={() => (
                        <Container
                          type={HEMATOLOGY_ANALYSIS}
                          department={'Hematology'}
                        />
                      )}
                      // component={HematologyAnalysisContainer}
                    />
                  )
                : null}

              {user.accessTo
                ? canUseThis(user, ['Microbiology Analysis']) && (
                    <Route
                      path="/me/lab/microbiology-analysis"
                      // component={MicrobiologyAnalysisContainer}
                      component={() => (
                        <Container
                          type={MICRO_SAMPLE_ANALYSIS}
                          department={'Microbiology'}
                        />
                      )}
                    />
                  )
                : null}

              {user.accessTo
                ? canUseThis(user, ['Radiology Analysis']) && (
                    <Route
                      path="/me/lab/radiology-analysis-scan"
                      // component={RadiologyAnalysisContainer}
                      component={() => (
                        <Container
                          type={RADIOLOGY_SAMPLE_SCAN}
                          department={'Radiology'}
                        />
                      )}
                    />
                  )
                : null}

              {user.accessTo
                ? canUseThis(user, ['Lab Archive']) && (
                    <Route
                      path="/me/lab/archive"
                      component={LabRecordsArchive}
                    />
                  )
                : null}

              {user.accessTo
                ? canUseThis(user, ['Radiology Analysis']) && (
                    <Route
                      path="/me/lab/radiology-analysis"
                      // component={RadiologyAnalysisContainer}
                      component={() => (
                        <Container
                          type={RADIOLOGY_SAMPLE_ANALYSIS}
                          department={'Radiology'}
                        />
                      )}
                    />
                  )
                : null}
              {user.accessTo
                ? canUseThis(user, ['Cardiology Analysis']) && (
                    <Route
                      path="/me/lab/cardiology-analysis"
                      // component={RadiologyAnalysisContainer}
                      component={() => (
                        <Container
                          type={CARDIOLOGY_SAMPLE_ANALYSIS}
                          department={'Cardiology'}
                        />
                      )}
                    />
                  )
                : null}
              {user.accessTo
                ? canUseThis(user, ['Doctor Comment']) && (
                    <Route
                      path="/me/lab/doctor-comment"
                      // component={RadiologyAnalysisContainer}
                      component={() => (
                        <Container
                          type={DOCTOR_COMMENT}
                          // department={"Radiology"}
                        />
                      )}
                    />
                  )
                : null}
              {/* {user.accessTo
                ? canUseThis(user, [
                    'Doctor Comment',
                    'Radiology Report',
                    'Cardiology Report',
                  ]) && ( */}
                    <Route
                      exact
                      path="/me/lab/doctors-report-fees-details/:docId"
                      component={DoctorFeesDetails}
                    />
                {/* //   )
                // : null} */}

              <Route
                exact
                path="/me/lab/client-registration"
                component={AddClient}
              />

              <Route
                path="/me/lab/report-form"
                component={() => (
                  <Suspense fallback={<ReportFormFallback />}>
                    <ReportForm />{' '}
                  </Suspense>
                )}
              />

              {/* <Route path="/me/lab/newitem" exact component={StoreManagement} /> */}
              {/* <Route
            path="/me/lab/point-of-sale"
            component={RequisitionDashboard}
          />
          <Route path="/me/lab/store-management" component={LabInventaryTabe} /> */}
            <Route
              path="/me/lab/organization-report"
              component={OrganizationReport}
            />
            <Route path="/me/lab/step-bar" component={StepBar} />
            {/* <Route
            exact
            path="/me/lab/grcode-reader"
            component={GRcodeReader}
          /> */}
            <Route
              exact
              path="/me/lab/generate-qr-code"
              component={BarCodeGenerator}
            />
            <Route
              exact
              path="/me/lab/bar-code-img"
              component={GenerteBarCodeImg}
            />
          </Switch>
        </div>

        {/* {location.pathname === '/me/lab/patients/new' ? (
          <div className="col-md-3 col-lg-3">
          <DisplayDepartemnt />
          </div>
          ) : fullMode ? null : (
            <div className="col-md-3 col-lg-3">
            <LabRequisition />
            {/* <PendingLabRequest /> *
              </div>
            )} */}
      </div>
    </>
  )
}
