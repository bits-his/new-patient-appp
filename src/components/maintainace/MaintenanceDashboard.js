import React from 'react';
import DieselPurchase from './DieselPurchase'
import DieselRefuel from './DieselRefuel'
import DieselUsage from './DieselUsage'
import ServiceLog from './ServiceLog'
import RepairLog from './RepairLog'


const MaintenanceTabs = ({ setComponentToRender, component }) => {
  return (
    <div>
      <button
        onClick={() => setComponentToRender('DieselPurchase')}
        className={`btn ${
          component === 'DieselPurchase' ? 'btn-primary' : 'btn-outline-primary'
        } col-md-12 col-lg-12`}>
        Diesel Purchase
      </button>
      <button
        onClick={() => setComponentToRender('DieselUsage')}
        className={`btn ${
          component === 'DieselUsage' ? 'btn-success' : 'btn-outline-success'
        } col-md-12 col-lg-12`}>
        Diesel Usage
      </button>
      <button
        onClick={() => setComponentToRender('DieselRefuel')}
        className={`btn ${
          component === 'DieselRefuel' ? 'btn-primary' : 'btn-outline-primary'
        } col-md-12 col-lg-12`}>
        Diesel Refuel
      </button>
      <button
        onClick={() => setComponentToRender('ServiceLog')}
        className={`btn ${
          component === 'ServiceLog' ? 'btn-success' : 'btn-outline-success'
        } col-md-12 col-lg-12`}>
        Service Log
      </button>
      <button
        onClick={() => setComponentToRender('RepairLog')}
        className={`btn ${
          component === 'RepairLog' ? 'btn-primary' : 'btn-outline-primary'
        } col-md-12 col-lg-12`}>
        Repair/Error Log
      </button>
    </div>
  );
};

const TabForm = ({
  processing,
  toggleProcessingForm,
  details,
  renderComponents,
}) => {
  return <div>{renderComponents()}</div>;
};

class MaintenanceDashboard extends React.Component {
  state = {
    component: '',
  };

  hideCarousel = () => this.setState({ showCarousel: false });

  renderComponents = () => {
    const { component } = this.props;

    switch (component) {
      case 'DieselPurchase':
        return <DieselPurchase />;
      case 'DieselUsage':
        return <DieselUsage />;
      case 'DieselRefuel':
        return <DieselRefuel />;
      case 'ServiceLog':
        return <ServiceLog />;
      case 'RepairLog':
        return <RepairLog />;

      default:
        return <p className="text-center">Select an item above to view</p>;
    }
  };

  // setComponentToRender = component => this.setState({ component })

  render() {
    const {
      pendingRequest,
      processing,
      toggleProcessingForm,
      details,
    } = this.props;
    return (
      <div>
        <TabForm
          renderComponents={this.renderComponents}
          processing={processing}
          pendingRequest={pendingRequest}
          toggleProcessingForm={toggleProcessingForm}
          details={details}
        />
      </div>
    );
  }
}

export default MaintenanceDashboard;
export { MaintenanceTabs };
