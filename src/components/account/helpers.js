import { apiURL } from "../../redux/actions";
import { _fetchApi2, _postApi } from "../../redux/actions/api";

export const makeQs = (obj) =>
  Object.keys(obj)
    .map((a) => a + "=" + obj[a])
    .join("&");

export function queryAccountChart(
  data = {},
  callback = (f) => f,
  error = (f) => f
) {
  _fetchApi2(
    `${apiURL()}/query-account-chart/get?${makeQs(data)}`,
    (resp) => {
      if (resp && resp.results) {
        callback(resp.results);
      }
    },
    (err) => {
      error(err);
    }
  );
}

export function postAccountChart(
  data = {},
  callback = (f) => f,
  error = (f) => f
) {
  _postApi(
    `${apiURL()}/query-account-chart/post`,
    { data },
    (resp) => {
      if (resp && resp.results) {
        callback(resp.results);
      }
    },
    (err) => {
      error(err);
    }
  );
}

export function getAllPatientTrans(
  patient_id,
  d_from,
  d_to,
  facilityId = "",
  callback = (f) => f,
  error = (f) => f
) {
  _fetchApi2(
    `${apiURL()}/get-all-patient-trans?client_id=${patient_id}&d_from=${d_from}&d_to=${d_to}&facilityId=${facilityId}`,
    (resp) => {
      if (resp && resp.results) {
        callback(resp.results);
      }
    },
    (err) => {
      error(err);
    }
  );
}

export function getChargesLaps(facilityId, patient_id, query_type, callback) {
  _fetchApi2(
    `${apiURL()}/get-charges-list-all?facilityId=${facilityId}&patient_id=${patient_id}&query_type=${query_type}`,

    (data) => {
      callback(data.results);
    },
    (err) => {
      console.log(err);
    }
  );
}
