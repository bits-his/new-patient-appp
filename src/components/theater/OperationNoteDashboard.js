import React from "react";
// import { RecordGuide } from "../utils/Guide/Guides";
import { url, _warningNotify, today, _customNotify } from "../utils/helpers";
import OpNotesTable from "./operation-notes/OperationNotesTable";
import OperationNote from "./operation-notes/OperationNote";
import { PDFViewer } from "@react-pdf/renderer";
import { OperationNote as OperationNotePrintPreview } from "../comp/pdf-templates/operation-note";
import { HistopathReq as Histopath } from "../comp/pdf-templates/histopathology-request";
import { FaTimes } from "react-icons/fa";
import { _deleteApi, _fetchApi } from "../../redux/actions/api";
import { connect } from "react-redux";

class OperationNoteDashboard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      operationNotes: [],
      loading: false,
      formType: "",
      modal: false,
      noteToEdit: {},
      preview: false,
      noteToPrint: {},
    };
  }

  componentDidMount() {
    this.getOperationNotesList();
  }

  getOperationNotesList = () => {
    this.setState({ loading: true });
    const cachedList = JSON.parse(localStorage.getItem("opList")) || [];
    this.setState({ operationNotes: cachedList, loading: false });
    _fetchApi(
      `${url}/operationnotes/all`,
      ({ results }) => {
        // console.log(results)
        if (results.length) {
          localStorage.setItem("opList", JSON.stringify(results));
          this.setState({ operationNotes: results, loading: false });
        }
      },
      (err) => {
        _warningNotify("There was an error from the server");
        this.setState({ loading: false });
      }
    );
  };
  handleDelete = (id) => {
    _deleteApi(
      `${url}/operationnotes/delete/${id}/${this.props.facilityInfo.id}`,
      {},
      (data) => {
        // if(data.success){
        this.getOperationNotesList();
        _customNotify("Deleted successfully");
        // console.log(id,"JDJDHDHDHDHDHD")
        // }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  onReviewButtonClick = (item) => {
    const newNoteObj = Object.assign({}, item, {
      surgeons: item.surgeons.split(", "),
      anesthetist: item.anesthetist.split(", "),
    });
    this.setState({
      formType: "EDIT",
      modal: true,
      noteToEdit: newNoteObj,
    });
  };

  toggle = () => {
    this.setState(
      (prevState) => ({
        modal: !prevState.modal,
        formType: prevState.modal === false ? "NEW" : "",
        noteToEdit: {
          date: today,
          diagnosis: "",
          surgery: "",
          surgeons: [],
          anesthetist: [],
          anesthetic: "GA",
          scrubNurse: [],
          pintsGiven: "",
          bloodLoss: "",
          intraOpAntibiotics: "",
          procedureNotes: "",
          intraOpFindings: "",
          remarks: "",
          postOpOrder: "",
          pathologyRequest: "",
        },
      }),
      () => this.getOperationNotesList()
    );
    // console.log('just cleaned')
  };

  onPrintButtonClick = (note) => {
    this.setState({
      noteToPrint: note,
      preview: true,
    });
  };

  render() {
    const {
      props: { facilityInfo },
      state: {
        operationNotes,
        loading,
        formType,
        modal,
        noteToEdit,
        noteToPrint,
        preview,
      },
      toggle,
      onReviewButtonClick,
      onPrintButtonClick,
      handleDelete,
    } = this;
    return (
      <div className="row" style={{ margin: 0, padding: 0 }}>
        {/* <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <RecordGuide />
        </div> */}
        {/* {JSON.stringify(facilityInfo)} */}
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <OperationNote
            formType={formType}
            toggle={toggle}
            modal={modal}
            note={noteToEdit}
            // reloadOperationNotesList={getOperationNotesList}
          />
          {preview ? (
            <div>
              <button
                className="btn btn-danger offset-md-11"
                onClick={() => this.setState({ preview: false })}
              >
                <FaTimes />
                <>Close</>
              </button>

              <center>
                <PDFViewer height="900" width="600">
                  <OperationNotePrintPreview
                    operationNote={noteToPrint}
                    logo={facilityInfo.logo}
                    facilityInfo={facilityInfo}
                  />
                </PDFViewer>
                <PDFViewer height="900" width="600">
                  <Histopath
                    operationNote={noteToPrint}
                    logo={facilityInfo.logo}
                    facilityInfo={facilityInfo}
                  />
                </PDFViewer>
              </center>
            </div>
          ) : (
            <OpNotesTable
              list={operationNotes}
              loading={loading}
              onReviewButtonClick={onReviewButtonClick}
              onPrintButtonClick={onPrintButtonClick}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    facilityInfo: state.facility.info,
  };
}

export default connect(mapStateToProps)(OperationNoteDashboard);
