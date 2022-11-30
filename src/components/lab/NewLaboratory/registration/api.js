import moment from "moment";
import { apiURL } from "../../../../redux/actions";
import { _fetchApi2, _updateApi } from "../../../../redux/actions/api";
import store from "../../../../redux/store";

export const createClientAccount = async (client) => {
  try {
    let response = await fetch(`${apiURL()}/lab/client/account/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const createClientAccount2 = async (client) => {
  try {
    let response = await fetch(`${apiURL()}/client/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const createPatientRecord = async (client) => {
  try {
    let response = await fetch(`${apiURL()}/patientrecords/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const saveClient = async (client) => {
  try {
    let response = await fetch(`${apiURL()}/lab/client/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const updateClientInfo = async (client) => {
  let data = { ...client, query_type: "update" };
  try {
    let response = await fetch(`${apiURL()}/lab/client/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

// export const saveLabHistory = (info) => {
//   _updateApi(
//     `${apiURL()}/lab/request/save-history`,
//     {
//       history: info.history,
//       req_id: info.booking,

//     },
//     () => {
//       console.log("history saved");
//       // setLoading(false);
//     },
//     () => {
//       console.log("error saving history");
//       // setLoading(false);
//     }
//   );
// };

export const generateBarcode = (
  requestList = [],
  patientInfo = {},
  callback = (f) => f
) => {
  _fetchApi2(
    `${apiURL()}/lab/get-last-numbers-per-dept`,
    (data) => {
      // console.log(data.results);
      if (data.results) {
        let newSelectedLabsList = [];
        let labelList = [];
        let hemaCount = data.results[2000];
        let chemPath = data.results[3000];
        let microCount = data.results[4000];
        let radCount = data.results[5000];

        requestList.forEach((test) => {
          if (parseInt(test.noOfLabels) > 0) {
            // create an array to contain name of all tests to show on the barcode
            // let testNames = [];
            // test.children &&
            //   test.children.forEach((i) => testNames.push(i.description));

            if (test.label_type === "single") {
              // console.log("label_type is single");
              // set the labels content
              let code;
              if (test.department === "2000") {
                code = hemaCount;
                hemaCount = hemaCount + 1;
              } else if (test.department === "3000") {
                code = chemPath;
                chemPath = chemPath + 1;
              } else if (test.department === "4000") {
                code = microCount;
                microCount = microCount + 1;
              } else if (test.department === "5000") {
                code = radCount;
                radCount = radCount + 1;
              }

              labelList.push({
                label: test.description.substr(0, 1),
                accNo: patientInfo.patientId,
                timestamp: `${moment().format("DD")}-${moment().format(
                  "MM"
                )} (${moment().format("hh:mm")}) - ${patientInfo.booking
                  .split("-")
                  .join("")}`,
                sample: test.specimen,
                patientName: patientInfo.name,
                code: moment().format("YYMM") + code,
                testCode: test.subhead,
                testName: test.description,
                tests: test.description,
                noOfLabels: test.noOfLabels,
                department: test.department,
                // sort_index: labels.length,
                qms_dept_id: test.qms_dept_id,
              });
              newSelectedLabsList.push({
                ...test,
                code: moment().format("YYMM") + code,
              });
            } else {
              // console.log("label_type is not single");
              // console.log(list, dept, group, test)

              if (labelList.findIndex((i) => i.group === test.subhead) !== -1) {
                // console.log("already contains a label from the same group (dept)");
                let newLabelList = [];
                labelList.forEach((j) => {
                  if (j.group && j.group === test.subhead) {
                    // console.log(j.tests.concat(", ", description));
                    newLabelList.push({
                      ...j,
                      tests: j.tests.concat(", ", test.description),
                    });
                    newSelectedLabsList.push({ ...test, code: j.code });
                  } else {
                    newLabelList.push(j);
                  }
                });
                labelList = newLabelList;
                // newSelectedLabsList.push({ ...test, code: moment().format("YYMM") + code })
              } else {
                let code;
                if (test.department === "2000") {
                  code = hemaCount;
                  hemaCount = hemaCount + 1;
                } else if (test.department === "3000") {
                  code = chemPath;
                  chemPath = chemPath + 1;
                } else if (test.department === "4000") {
                  code = microCount;
                  microCount = microCount + 1;
                } else if (test.department === "5000") {
                  code = radCount;
                  radCount = radCount + 1;
                }

                // console.log("first time adding label from this group");
                labelList.push({
                  type: "lab",
                  department: test.department,
                  label: test.description.substr(0, 1),
                  accNo: patientInfo.patientId,
                  timestamp: `${moment().format("DD")}-${moment().format(
                    "MM"
                  )} (${moment().format(
                    "hh:mm"
                  )}) - ${patientInfo.booking.split("-").join("")}`,
                  sample: test.specimen,
                  patientName: patientInfo.name,
                  code: moment().format("YYMM") + code,
                  tests: test.description,
                  testCode: test.subhead,
                  testName: test.description,
                  noOfLabels: test.noOfLabels,
                  group: test.subhead,
                  // sort_index: test.labels.length,
                  qms_dept_id: test.qms_dept_id,
                });
                newSelectedLabsList.push({
                  ...test,
                  code: moment().format("YYMM") + code,
                });
              }
            }
          } else {
            newSelectedLabsList.push(test);
          }
        });

        // console.log(labelList, newSelectedLabsList);
        callback(labelList, newSelectedLabsList);
      }
    },
    (err) => {
      console.log("An error occured", err);
    }
  );
};

export function getRequestNo(callback) {
  const facilityId = store.getState().auth.user.facilityId;

  _fetchApi2(
    `${apiURL()}/lab/get-request-no?facilityId=${facilityId}`,
    (resp) => {
      // console.log(resp)
      if (resp && resp.length) {
        let request_id = resp[0].request_id;
        callback(request_id);
      }
    },
    (err) => {
      console.log(err);
    }
  );
}
