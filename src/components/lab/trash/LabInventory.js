import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardBody, Table } from 'reactstrap';
// import { FaSave, FaPlus } from 'react-icons/fa'
import { Scrollbars } from 'react-custom-scrollbars';
import SearchBar from '../../record/SearchBar';
import Loading from '../../loading';
import InventoryEditModal from '../../pharmacy/InventoryEditModal';
import { getInventory, editInventory } from '../../../redux/actions/pharmacy';

// import { TiEdit } from 'react-icons/ti';

class LabInventory extends PureComponent {
  state = {
    isModalOpen: false,
    selectedDrug: {},
    filterText: '',
  };

  componentDidMount() {
    // this.props.getInventory();
  }

  toggleModal = (drug) =>
    this.setState((prev) => ({
      isModalOpen: !prev.isModalOpen,
      selectedDrug: drug ? drug : {},
    }));

  handleChange = ({ target: { name, value } }) => {
    this.setState((prev) => ({
      selectedDrug: { ...prev.selectedDrug, [name]: value },
    }));
  };

  handleEdit = () => {
    const { selectedDrug } = this.state;
    const { drug_id } = selectedDrug;
    this.props.editInventory(drug_id, selectedDrug, this.toggleModal);
  };

  handleFilterTextChange = (filterText) => this.setState({ filterText });

  render() {
    const { inventoryLoading, updatingDrug } = this.props;
    const { isModalOpen, selectedDrug, filterText } = this.state;
    const inventory = [
      { drug: 'Anesthetics', quantity: 12 },
      { drug: 'Suphur', quantity: 6 },
    ];
    const {
      toggleModal,
      handleEdit,
      handleChange,
      handleFilterTextChange,
    } = this;
    const rows = [];
    inventory.length &&
      inventory.forEach((drug, i) => {
        if (drug.drug.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
          return;
        }

        rows.push(
          <tr key={i}>
            <td>{drug.drug}</td>
            {/* <td>{drug.price}</td> */}
            <td>{drug.quantity}</td>
            {/* <td>{drug.expiry_date}</td>
          <td>
            <button
              className="btn btn-sm btn-success"
              onClick={() => this.toggleModal(drug)}>
                <TiEdit style={{margin: '0 5px'}} size={18} />
                Edit
            </button>
          </td> */}
          </tr>,
        );
      });

    return (
      <div>
        <Card>
          <CardHeader>
            <h5 align="center">Laboratory Equipment</h5>
          </CardHeader>

          <CardBody>
            <SearchBar
              filterText={filterText}
              onFilterTextChange={handleFilterTextChange}
              placeholder="Search for a drug by name"
            />
            <br />
            <Scrollbars style={{ height: 400 }}>
              {inventoryLoading && <Loading />}
              <Table bordered striped>
                <thead>
                  <tr>
                    <th>Item</th>
                    {/* <th>Price</th> */}
                    <th>Quantity</th>
                    {/* <th>Expiry Date</th>
                    <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </Scrollbars>
          </CardBody>
          <InventoryEditModal
            modal={isModalOpen}
            toggle={toggleModal}
            drug={selectedDrug}
            handleChange={handleChange}
            handleEdit={handleEdit}
            updating={updatingDrug}
          />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = ({ pharmacy }) => ({
  inventory: pharmacy.inventory,
  inventoryLoading: pharmacy.inventoryLoading,
  updatingDrug: pharmacy.updatingDrug,
});

const mapDispatchToProps = (dispatch) => ({
  getInventory: () => dispatch(getInventory()),
  editInventory: (id, data, cb) => dispatch(editInventory(id, data, cb)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LabInventory);
