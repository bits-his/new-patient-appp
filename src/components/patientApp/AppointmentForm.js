import React from "react";

import { CardBody, FormGroup } from "reactstrap";
// import DateTimePicker from '../../comp/components/DateTimePicker';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import moment from "moment";
import AutoComplete from "../comp/components/AutoComplete";
import { SelectInput } from "../comp/components";
import { TextArea } from "../comp/components/InputGroup";

function AppointmentForm({
  appointment = {},
  editable = true,
  onInputChange = (f) => f,
  patients = [],
  clearPatient = (f) => f,
  nameNotEditable = false,
  onPatientNameChange = (f) => f,
  typeNotEditable = false,
  new_date,
}) {
  // const [startDate, setStartDate] = useState(new Date());
  return (
    <CardBody>
      {/* {JSON.stringify(appointment)} */}
      <AutoComplete
        label="Doctor"
        placeholder="Search for Doctor..."
        options={patients}
        labelKey={(item) => `${item.username}(${item.id})`}
        onChange={(item) => {
          console.log(item[0]);
          clearPatient();
          if (item.length) {
            onPatientNameChange(
              // item[0]._id,
              item[0].id,
              `${item[0].username}`
            );
          }
        }}
        value={appointment.title}
        editable={!nameNotEditable}
      />

      <FormGroup className="row">
        <div className="col-md-4 col-lg-4">
          <label className="mr-2 font-weight-bold">Time:</label>

          {editable ? (
            <DatePicker
              className="form-control"
              name="start"
              value={appointment.start}
              onChange={(date) => onInputChange("start", date)}
              editable={editable}
              selected={appointment.start}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          ) : (
            <p className="form-control">
              {moment(appointment.start).calendar()}
            </p>
          )}
        </div>
      </FormGroup>

      <div className="d-flex flex-direction-row justify-content-between p-0">
        <InputGroup
          name="location"
          value={appointment.location}
          label="Hospital Location (optional)"
          placeholder="Location"
          container="mt-2 p-0"
          onChange={({ target: { value } }) => onInputChange("location", value)}
          editable={editable}
        />

        <SelectInput
          container="mt-2 p-0 col-md-4"
          label="Apointment Type"
          options={["Checkup", "Emergency", "Follow up", "Routine", "Walk in"]}
          name="appointmentType"
          value={appointment.appointmentType}
          onChange={({ target: { value } }) =>
            onInputChange("appointmentType", value)
          }
          editable={editable && !typeNotEditable}
        />
      </div>

      <TextArea
        label="Appointment Notes (optional)"
        name="notes"
        value={appointment.notes}
        onChange={({ target: { value } }) => onInputChange("notes", value)}
        editable={editable}
      />
    </CardBody>
  );
}

export default AppointmentForm;
