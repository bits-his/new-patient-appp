import React, { Component } from "react";
import { connect } from "react-redux";
import { getPatients } from "../../redux/actions/records";
import FullscreenLoading from "../comp/components/FullscreenLoading";

import AccountDashboard from "./AccountDashboard"
import AccountMenu from "./AccountMenu"

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: false,
      isRoute: true,
      depositRequest: [],
      user: null,
      component: "Services",
    };
  }

  toggleRoute = () => {
    this.setState((prevState) => ({ isRoute: !prevState.isRoute }));
  };

  componentDidMount() {
    let user = localStorage.getItem("user") || "";
    this.setState({ user });
    this.props.getPatients();
  }

  setComponentToRender = (component) => this.setState({ component });

  render() {
    const {
      state: { depositRequest, isRoute, component },
    } = this;
    return (
      <div className="row" style={{ margin: 0, padding: 0 }}>
        
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3">
            <AccountMenu />
          </div>
          <div className=" col-xs-12 col-sm-12 col-md-8 col-lg-8">
            <div>
              <AccountDashboard
                component={component}
                depositRequest={depositRequest}
                req={this.state.currentReq}
                isRoute={isRoute}
                toggleRoute={this.toggleRoute}
              />
            </div>
          </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getPatients: () => dispatch(getPatients()),
  };
}

export default connect(
  (state) => ({ type: state.facility.info.type }),
  mapDispatchToProps
)(Account);
