import React, { PureComponent } from "react";
import { Input, Table } from "reactstrap";
import { FaTimes } from "react-icons/fa";
import { formatNumber } from "../utils/helpers";
// import { Pane, Checkbox } from 'evergreen-ui'

export default class ServicesList1 extends PureComponent {
  render() {
    const {
      props: {
        onDelete,
        servicesList,
        total,
        onChecked,
        onUnchecked,
        newView,
        acctNo,
        name,
        patientId,
        handleServicesGroup,
      },
    } = this;
    if (!servicesList.length) return null;

    return (
      <>
        {newView ? (
          <span className="d-flex mb-2">
            <h6>Name:</h6> <h6 className="mr-3 text-muted"> {name}</h6>
            <h6>Patient ID: </h6>{" "}
            <h6 className="mr-3 text-muted">{patientId}</h6>
            <h6>Acct No.: {acctNo}</h6>
          </span>
        ) : null}
        <Table responsive bordered striped>
          <thead>
            <tr>
              <th className="text-center">Delete</th>
              {/* <th>Patient ID</th> */}
              <th className="text-center">Services</th>
              <th className="text-center">Price</th>
              <th className="text-center" style={{ width: 70 }}>
                Quantity
              </th>
              <th className="text-center">Amount</th>
            </tr>
          </thead>
          <tbody>
            {servicesList.length
              ? servicesList.map((service, index) => (
                  <ItemRow
                    key={index}
                    service={service}
                    index={index}
                    onDelete={onDelete}
                    onChecked={onChecked}
                    onUnchecked={onUnchecked}
                    handleServicesGroup={handleServicesGroup}
                  />
                ))
              : null}
            {servicesList.length ? (
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <th className="text-right">Total: {formatNumber(total)}</th>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </>
    );
  }
}

function ItemRow({
  index,
  service,
  onDelete,
  handleServicesGroup,
  // onChecked, onUnchecked
}) {
  // const [ checked, setChecked ] = useState(true)
  console.log("service11", service);
  return (
    <tr key={index}>
      <td>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(service, index)}
        >
          <FaTimes />
        </button>
      </td>
      {/* <td>{service.patientId}</td> */}
      <td>{service.service}</td>
      <td className="text-right">{formatNumber(service.cost)}</td>
      <td className="text-center">
        {/* {service.qtty} */}
        <Input
          style={{ width: 70 }}
          value={service.qtty}
          name="qtty"
          type="number"
          onChange={(e) => {
            let name = e.target.name;
            let value = e.target.value;
            handleServicesGroup(name, value, index);
          }}
        />
      </td>
      <td className="text-right">{formatNumber(service.amount)}</td>
      {/* <td>
        <Pane>
          <Checkbox
            checked={checked}
            onChange={() => {
              if (checked === true) {
                setChecked(false);
                onUnchecked(index);
              } else {
                setChecked(true);
                onChecked(index);
              }
            }}
          />
        </Pane>
      </td> */}
    </tr>
  );
}
