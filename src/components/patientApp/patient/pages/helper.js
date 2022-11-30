import { apiURL, _postApi } from "../../redux/Api";

export function appointmentFunc(data, cb, error) {
    _postApi(
      `${apiURL}/all/appointment/new`,
      data,
      (d) => {
        cb(d);
      },
      error()
    );
  }
  export const SET_SELECTED_APPOINTMENT = 'SET_SELECTED_APPOINTMENT';

  export const setSelectedAppointment = (appointment) => ({
    type: SET_SELECTED_APPOINTMENT,
    payload: appointment,
  });