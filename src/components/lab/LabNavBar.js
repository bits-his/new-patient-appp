import React from 'react';
import '../doctor/components/test.css'

    const LabNavBar =({component,setTab})=>
    {
        return(
            <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 ml-auto mr-auto mb-4">
              <div className="multisteps-form__progress">
                {/* <button
                  type="button"
                  title="Request"
                  onClick={() => setTab('Request')}
                  className={`multisteps-form__progress-btn ${component === 'Request' ? 'js-active' : ''}`}>
                 Request
                </button> */}
                <button
                  type="button"
                  title="SampleCollection"
                  onClick={() => setTab('SampleCollection')}
                  className={`multisteps-form__progress-btn ${component === 'SampleCollection' ? 'js-active' : ''}`}>
                  Sample Collection
                </button>
                {/* <button
                  type="button"
                  title="Process Test"
                  onClick={() => setTab('ProcessTest')}
                  className={`multisteps-form__progress-btn ${component === ' ProcessTest' ? 'js-active' : ''}`}>
                  Process Test
                </button> */}
                <button
                  type="button"
                  title="Sample Analysis"
                  onClick={() => setTab('EnterResult')}
                  className={`multisteps-form__progress-btn ${component === 'EnterResult' ? 'js-active' : ''}`}>
                 Sample Analysis
                </button>
                <button
                  type="button"
                  title="Pathologist Comment"
                  onClick={() => setTab('Comments')}
                  className={`multisteps-form__progress-btn ${component === 'Comments' ? 'js-active' : ''}`}>
                  Pathologist Comment
                </button>
                <button
                  type="button"
                  title="Verify"
                  onClick={() => setTab('Verify')}
                  className={`multisteps-form__progress-btn ${component === 'Verify' ? 'js-active' : ''}`}>
                  Verify
                </button>
                <button
                  type="button"
                  title="Print"
                  onClick={() => setTab('Print')}
                  className={`multisteps-form__progress-btn ${component === 'Print' ? 'js-active' : ''}`}>
                  Print
                </button>
              </div>
            </div>
          </div>
        )
    }
export default LabNavBar;