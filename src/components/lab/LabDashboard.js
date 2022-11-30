import React from 'react'
// import { NavLink } from "react-router-dom";
import { IoMdListBox } from 'react-icons/io'
// import { AiFillSkype } from 'react-icons/ai';
// import { AiTwotoneFile } from 'react-icons/ai';
import { AiTwotoneEdit } from 'react-icons/ai'
import { MdFeaturedPlayList } from 'react-icons/md'
import { MdLocalPrintshop } from 'react-icons/md'
// import LabProcesses from './LabProcesses';
import { withRouter } from 'react-router-dom'

import LaboratorySetupForms from './LabSetupForm'
import SampleReception from './SampleReception'
import { RequestProcessingForm } from './RequestProcessingForm'
import SampleTracking from './SampleTracking'
import CompletedLabTests from './CompletedLabTests'

const buttonStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}

export const Tabs = withRouter(
  ({
    hideCarousel = (f) => f,
    fetchData = (f) => f,
    setMode = (f) => f,
    history,
    component,
    setComponentToRender = (f) => f,
  }) => {
    return (
      <div style={{ width: '10px 0' }}>
        {/* <button
        
        className={`btn ${
          component === 'PendingLab' ? 'btn-primary' : 'btn-outline-primary'
        } col-md-12 col-lg-12`}
        onClick={() => setComponentToRender('PendingLab')}
        style={buttonStyle}
      >
        <span>
        <MdFeaturedPlayList size={26} fontWeight='bold' style={{marginRight:10}} />
        Pending Lab Request
        </span>
      </button> */}
        <button
          className={`btn ${
            component === 'LaboratorySetupForms'
              ? 'btn-success'
              : 'btn-outline-success'
          } col-md-12 col-lg-12`}
          onClick={() => {
            history.push('/me/lab/setup')
          }}
          style={buttonStyle}
        >
          <span>
            <MdFeaturedPlayList
              size={26}
              fontWeight="bold"
              style={{ marginRight: 10 }}
            />
            Lab Setup Form
          </span>
        </button>
        <button
          onClick={() => {
            history.push('/me/lab/')
          }}
          className={`btn ${
            component === 'CompletedLabTests'
              ? 'btn-primary'
              : 'btn-outline-primary'
          } col-md-12 col-lg-12`}
          style={buttonStyle}
        >
          <IoMdListBox size={26} style={{ marginRight: 10 }} />
          Completed Lab Tests
        </button>
        {/* <button
        onClick={() => setComponentToRender('SampleCollection')}
        className={`btn ${
          component === 'SampleCollection' ? 'btn-success' : 'btn-outline-success'
        } col-md-12 col-lg-12`}
        style={buttonStyle}
      >
      <AiFillSkype size={26} style={{marginRight:10}} />
        Sample Collection
      </button>
      <button
        onClick={() => setComponentToRender('SampleReception')}
        className={`btn ${
          component === 'SampleReception' ? 'btn-primary' : 'btn-outline-primary'
        } col-md-12 col-lg-12`}
        style={buttonStyle}
      >
         <IoMdListBox size={26} style={{marginRight:10}} />
        Sample Analysis
      </button> */}
        {/* <button
        onClick={() => setComponentToRender('PathologistComment')}
        className={`btn ${
          component === 'PathologistComment' ? 'btn-success' : 'btn-outline-success'
        } col-md-12 col-lg-12`}
        style={buttonStyle}
      >
         <AiTwotoneFile size={26} style={{marginRight:10}} />
        Pathologist Comment
      </button> */}
        <button
          onClick={() => {
            history.push('/me/lab/track')
          }}
          className={`btn ${
            component === 'SampleTracking'
              ? 'btn-primary'
              : 'btn-outline-primary'
          } col-md-12 col-lg-12`}
          style={buttonStyle}
        >
          <AiTwotoneEdit size={26} style={{ marginRight: 10 }} />
          Sample Tracking
        </button>
        <button
          onClick={() => {
            history.push('/me/lab/result')
          }}
          className={`btn ${
            component === 'PrintResult' ? 'btn-success' : 'btn-outline-success'
          } col-md-12 col-lg-12`}
          style={buttonStyle}
        >
          <MdLocalPrintshop size={26} style={{ marginRight: 10 }} />
          Print Result
        </button>
      </div>
    )
  },
)

const TabForm = ({
  req,
  isRoute,
  toggleRoute,
  carouselIsOpen,
  updateTable,
  mode,
  renderComponents,
}) => {
  return (
    <div>
      {renderComponents()}

      <div>
        <RequestProcessingForm
          req={req}
          toggleRoute={toggleRoute}
          updateTable={updateTable}
          mode={mode}
        />
      </div>
    </div>
  )
}

class LabDashboard extends React.Component {
  state = {
    component: 'PendingLab',
  }

  hideCarousel = () => {
    this.setState({ carouselIsOpen: false })
  }

  setComponentToRender = (component) => this.setState({ component })

  renderComponents = () => {
    // const { pendingRequest, updateTable } = this.props;
    const { component } = this.props

    switch (component) {
      // case 'PendingLab' : return <PendingLab />
      case 'LaboratorySetupForms':
        return <LaboratorySetupForms />

      case 'SampleTracking':
        return <SampleTracking />
      case 'SampleReception':
        return <SampleReception />
      // case 'SampleCollection' : return <SampleCollection pendingRequest={pendingRequest} updateTable={updateTable} />
      // case 'PathologistComment' : return <PathologistComment />
      case 'CompletedLabTests':
        return <CompletedLabTests />
      default:
        return (
          <p style={{ marginTop: 30, textAlign: 'center' }}>
            Select an item to view
          </p>
        )
    }
  }
  render() {
    const {
      req,
      // isRoute,
      // toggleRoute,
      updateTable,
      // fetchData,
      // setMode,
      // mode,
    } = this.props
    return (
      <div>
        {/* <Tabs
          // hideCarousel={this.hideCarousel}
          // fetchData={fetchData}
          // setMode={setMode}
          setComponentToRender={this.setComponentToRender}
        />   */}
        <br />
        <TabForm
          req={req}
          // isRoute={isRoute}
          // toggleRoute={toggleRoute}
          updateTable={updateTable}
          renderComponents={this.renderComponents}
        />
        {/* <LabProcesses /> */}
      </div>
    )
  }
}

export default LabDashboard
