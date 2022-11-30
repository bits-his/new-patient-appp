import React, {  useEffect, useRef } from 'react'
import { Row, Col } from 'reactstrap'
import { Route, Switch, useHistory, useLocation } from 'react-router'
// import { useSelector } from "react-redux";
// import Loading from "../../../comp/components/Loading";
import Scrollbar from '../../../comp/components/Scrollbar'
// import Loading from '../../../comp/component/Loading'
// import { HEMATOLOGY_ANALYSIS } from "../labRedux/actions";
import AllDepartment from './AllDepartment'
import labRoutes from './routes'
import SampleAnalysis from '../SampleAnalysis'
import UnitsNavBar from '../components/UnitsNavBar'
import LabRequisition from '../LabRequisitions'
import PastLabRequisition from '../PastLabRequisition'
import AnalysisTopBar from '../analysis/top-bar'
import ColorDetails from '../../../utils/ColorDetails'

function AnalysisContainer({ department, type }) {
  // const department = useSelector(state => state.auth.user.department)
  // let department = 'Hematology';
  // let department = 'Chemical Pathology';
  const location = useLocation()
  const history = useHistory()
  // const user = useSelector((state) => state.auth.user);
  // let showPast = user.functionality.length === 1;
  const historySearchRef = useRef()
  const requestSearchRef = useRef()

  const isCollection = location.pathname.includes('collection')
  const isHema = location.pathname.includes('hematology')
  const isChemPath = location.pathname.includes('chemical-pathology')
  const isMicro = location.pathname.includes('microbiology')
  const isRadio = location.pathname.includes('radiology')
  const isDoctor = location.pathname.includes('doctor')

  const closeForm = () => {
    if (isCollection) {
      history.push('/me/lab/sample-collection')
    } else if (isHema) {
      history.push('/me/lab/hematology-analysis')
    } else if (isChemPath) {
      history.push('/me/lab/chemical-pathology-analysis')
    } else if (isMicro) {
      history.push('/me/lab/microbiology-analysis')
    } else if (isRadio) {
      history.push('/me/lab/radiology-analysis')
    } else if (isDoctor) {
      history.push('/me/lab/doctor-comment')
    } else return
  }

  const handleKeyPress = (e) => {
    // console.log(e.key)
    switch (e.key) {
      case 'Escape':
        return closeForm()
      case 'F2':
        return (document.activeElement.value =
          document.activeElement.value + String.fromCharCode(176))
      case 'F8':
        return historySearchRef.current.focus()
      case 'F9':
        return requestSearchRef.current.focus()

      // case "F10":
      //   return this.saveCosting();

      default:
        return null
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <>
      <UnitsNavBar />

      <AnalysisTopBar />

      <Row>
        {/* {showPast ? ( */}
        <Col md={3}>
          {/* {JSON.stringify({type,department})} */}
          <LabRequisition
            requestSearchRef={requestSearchRef}
            type={type}
            department={department}
          />
        </Col>
        {/* ) : null} */}
        <Col md={6}>
          <Scrollbar>
            {/* {JSON.stringify(department)} */}
            <Switch>
              <Route exact path="/me/lab/sample-collection">
                <img
                  alt="placeholder"
                  src={require('../../../../images/simpleCollection.jpg')}
                  className="img-fluid mt-4"
                  style={{ opacity: 0.5, width: '100%', height: '82%' }}
                />
                <ColorDetails />
              </Route>
              {labRoutes.map((item, index) => (
                <Route
                  key={index}
                  exact
                  path={item.path}
                  component={item.component}
                />
              ))}

              {/* <Route
                exact
                path=""
                component={SampleCollection}
              /> */}
              <Route exact path="/me/lab/hematology-analysis">
                <img
                  alt="placeholder"
                  src={require('../../../../images/analysis.jpg')}
                  className="img-fluid mt-4"
                  style={{ opacity: 0.5, width: '100%', height: '82%' }}
                />
                <ColorDetails />
              </Route>

              <Route exact path="/me/lab/hematology-analysis/:patientId/:labno">
                <SampleAnalysis department={department} />
              </Route>

              <Route
                exact
                path="/me/lab/hematology-analysis/history/:patientId/:labno"
              >
                <SampleAnalysis department={department} />
              </Route>

              <Route exact path="/me/lab/chemical-pathology-analysis">
                <img
                  alt="placeholder"
                  src={require('../../../../images/analysis.jpg')}
                  className="img-fluid mt-4"
                  style={{ opacity: 0.5, width: '100%', height: '82%' }}
                />
                <ColorDetails />
              </Route>
              {/* <Route
                  exact
                  path="/me/lab/sample-collection/history/:patientId"
                  component={SampleCollection}
                /> */}
              <Route exact path="/me/lab/sample-analysis">
                <img
                  alt="placeholder"
                  src={require('../../../../images/analysis.jpg')}
                  className="img-fluid mt-4"
                  style={{ opacity: 0.5, width: '100%', height: '82%' }}
                />
                <ColorDetails />
              </Route>
              <Route exact path="/me/lab/sample-analysis/:patientId/:labno">
                <AllDepartment department={department} />
              </Route>
              <Route
                exact
                path="/me/lab/sample-analysis/history/:patientId/:labno"
              >
                <AllDepartment department={department} />
              </Route>
              <Route exact path="/me/lab/hematology-analysis">
                <img
                  alt="placeholder"
                  src={require('../../../../images/analysis.jpg')}
                  className="img-fluid mt-4"
                  style={{ opacity: 0.5, width: '100%', height: '82%' }}
                />
                <ColorDetails />
              </Route>
              <Route exact path="/me/lab/hematology-analysis/:patientId/:labno">
                <SampleAnalysis department={department} />
              </Route>
              <Route
                exact
                path="/me/lab/hematology-analysis/history/:patientId/:labno"
              >
                <SampleAnalysis department={department} />
              </Route>
              <Route exact path="/me/lab/chemical-pathology-analysis">
                <img
                  alt="placeholder"
                  src={require('../../../../images/analysis.jpg')}
                  className="img-fluid mt-4"
                  style={{ opacity: 0.5, width: '100%', height: '82%' }}
                />
                <ColorDetails />
              </Route>
              <Route
                exact
                path="/me/lab/chemical-pathology-analysis/:patientId/:labno"
              >
                <SampleAnalysis department={department} />
              </Route>
              <Route
                exact
                path="/me/lab/chemical-pathology-analysis/history/:patientId/:labno"
              >
                <SampleAnalysis department={department} />
              </Route>
              <Route exact path="/me/lab/microbiology-analysis">
                <img
                  src={require('../../../../images/microbiology.jpg')}
                  className="img-fluid mt-4"
                  alt="microbiology-pic"
                  style={{ opacity: 0.5, width: '100%', height: '82%' }}
                />
                <ColorDetails />
              </Route>
              {/* <Route
                    path="/me/lab/microbiology-analysis/:patientId/:labno"
                    component={MicroBiologyAnalysis}
                  /> */}

              <Route exact path="/me/lab/radiology-analysis">
                <img
                  src={require('../../../../images/Radiology.jpg')}
                  className="img-fluid mt-4"
                  alt="radiology-pic"
                  style={{ opacity: 0.5, width: '100%', height: '82%' }}
                />
                <ColorDetails />
              </Route>
              <Route exact path="/me/lab/cardiology-analysis">
                <img
                  src={require('../../../../images/echo.jpg')}
                  className="img-fluid mt-4"
                  alt="cardiology-pic"
                  style={{ opacity: 0.5, width: '100%', height: '82%' }}
                />
                <ColorDetails />
              </Route>
              <Route exact path="/me/lab/radiology-analysis-scan">
                <img
                  src={require('../../../../images/x-ray-scan.jpg')}
                  className="img-fluid mt-4"
                  alt="radiology-pic"
                  style={{ opacity: 0.5, width: '100%', height: '82%' }}
                />
              </Route>
              <Route exact path="/me/lab/doctor-comment">
                <img
                  alt="placeholder"
                  src={require('../../../../images/doc_comment.jpg')}
                  className="img-fluid mt-4"
                  style={{ opacity: 0.5, width: '100%', height: '82%' }}
                />
              </Route>
            </Switch>
          </Scrollbar>
        </Col>

        <Col md={3}>
          <PastLabRequisition
            historySearchRef={historySearchRef}
            type={type}
            department={department}
          />
        </Col>
      </Row>
    </>
  )
}

export default AnalysisContainer
