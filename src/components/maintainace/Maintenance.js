import React, { Component } from "react";
import { connect } from "react-redux";
import MaintenanceDashboard, { MaintenanceTabs } from "./MaintenanceDashboard";
import { PharmacyGuide } from "../utils/Guide/Guides";
import { getPatients } from "../../redux/actions/records";
import { init } from "../../redux/actions/pharmacy";

class Maintenance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: false,
      isRoute: true,
      processing: false,
      details: {},
      component: "DieselUsage",
    };
  }

  componentDidMount() {
    this.props.getPatients();
  }

  setComponentToRender = (component) => this.setState({ component });

  toggleProcessingForm = () =>
    this.setState((prevState) => ({ processing: !prevState.processing }));

  getDetails = (details) => {
    this.setState({ details });
    this.toggleProcessingForm();
  };

  toggleRoute = () =>
    this.setState((prevState) => ({ isRoute: !prevState.isRoute }));

  render() {
    const {
      state: { details, processing, component },

      toggleProcessingForm,
      setComponentToRender,
    } = this;
    return (
      <div className="row" style={{ margin: 0, padding: 0 }}>
        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <PharmacyGuide />
        </div>
        <div className="col-xs-12 col-s-12 col-md-7 col-lg-7">
          <MaintenanceDashboard
            component={component}
            details={details}
            processing={processing}
            toggleProcessingForm={toggleProcessingForm}
          />
        </div>
        <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <MaintenanceTabs
            component={component}
            setComponentToRender={setComponentToRender}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getPatients: () => dispatch(getPatients()),
});

export default connect(null, mapDispatchToProps)(Maintenance);
