import { apiURL } from '../../../../redux/actions'
import { _fetchApi } from '../../../../redux/actions/api'
// import {splitTestsByView} from '.'

// export function saveDocComment (data) {
//         _postApiAsync(`${apiURL()}/lab/comment/doctors/new`)
//         .then(() => {
//             cb()
//         })
//         .catch(err => {

//         })

// }

export function saveMicrobiologyResults() {
  // _postApi(
  //     `${apiURL()}/lab/microbiology/new`,
  //     {
  //       labs: [...labs, ...tabledLabs],
  //     },
  //     (data) => {
  //       saveComment(() => setLoading(false));
  //       console.log(data);
  //       // if (data.success) {
  //       _customNotify("Analysis Submitted");
  //       resetPage();
  //       // }
  //     },
  //     (err) => {
  //       console.log(err);
  //       setLoading(false);
  //     }
  //   );
}

export function getUncompletedTests(
  labNo,
  callback = (f) => f,
  error = (f) => f,
) {
  _fetchApi(
    `${apiURL()}/lab/lab-results/uncompleted/${labNo}`,
    (data) => {
      if (data.success) {
        let _data = splitTestsByView(data.results)
        callback(_data, data.results)
        // let _tabledLab = {};
        // let _tabledLabList = [];
        // let inputList = [];
        // let microbiology = [];
        // let _hoWidalLabs = [];
        // let _hoWidalLabsList = [];
        // // let customList = []
        // let otherList = [];
        // data.results.forEach((item) => {
        //   if (item.report_type === "table") {
        //     _tabledLabList.push({
        //       ...item,
        //       n_unit: item.unit,
        //       n_range_from: item.range_from,
        //       n_range_to: item.range_to,
        //     });

        //     if (Object.keys(_tabledLab).includes(item.group_head)) {
        //       _tabledLab[item.group_head] = [
        //         ..._tabledLab[item.group_head],
        //         {
        //           ...item,
        //           n_unit: item.unit,
        //           n_range_from: item.range_from,
        //           n_range_to: item.range_to,
        //         },
        //       ];
        //     } else {
        //       _tabledLab[item.group_head] = [item];
        //     }
        //   } else if (item.report_type === "input") {
        //     inputList.push(item);
        //   } else if (item.report_type === "microbiology_form") {
        //     microbiology.push(item);
        //   } else if (item.report_type === "ho_widal") {
        //     // hoWidalList.push(item);
        //     _hoWidalLabsList.push(item);

        //     if (Object.keys(_hoWidalLabs).includes(item.group_head)) {
        //       _hoWidalLabs[item.group_head] = [
        //         ..._hoWidalLabs[item.group_head],
        //         item,
        //       ];
        //     } else {
        //       _hoWidalLabs[item.group_head] = [item];
        //     }
        //   } else {
        //     otherList.push(item);
        //   }
        // });

        // let _data = {
        //   _tabledLab,
        //   _tabledLabList,
        //   inputList,
        //   microbiology,
        //   _hoWidalLabs,
        //   _hoWidalLabsList,
        //   otherList,
        // };
        // callback(_data);
        // setTabledLabs(_tabledLab);
        // setTabledLabsList(_tabledLabList);
        // setInputLabs(inputList);
        // setMicrobiologyLabs(microbiology);
        // setHOWidalLabs(_hoWidalLabs);
        // setHOWidalLabsList(_hoWidalLabsList);
        // console.log(_hoWidalLabsList, hoWidalLabs);
        // console.log(otherList);
        // setLabs(otherList);
      }
    },
    (err) => {
      error(err)
      console.log(err)
    },
  )
}

export function splitTestsByView(tests) {
  let _tabledLab = {}
  let _tabledLabList = []
  let inputList = []
  let microbiology = []
  let _hoWidalLabs = {}
  let _hoWidalLabsList = []
  let macroscopyList = []
  let _tabledWithResultLab = {}
  let _tabledWithResultLabList = []
  // let customList = []
  let otherList = []
  tests.forEach((item) => {
    if (item.report_type === 'table') {
      _tabledLabList.push({
        ...item,
        n_unit: item.unit,
        n_range_from: item.range_from,
        n_range_to: item.range_to,
      })

      if (Object.keys(_tabledLab).includes(item.group_head)) {
        _tabledLab[item.group_head] = [
          ..._tabledLab[item.group_head],
          {
            ...item,
            n_unit: item.unit,
            n_range_from: item.range_from,
            n_range_to: item.range_to,
          },
        ]
      } else {
        _tabledLab[item.group_head] = [item]
      }
    } else if (item.report_type === 'table_result') {
      _tabledWithResultLabList.push({
        ...item,
        n_unit: item.unit,
        n_range_from: item.range_from,
        n_range_to: item.range_to,
      })

      if (Object.keys(_tabledWithResultLab).includes(item.group_head)) {
        _tabledWithResultLab[item.group_head] = [
          ..._tabledWithResultLab[item.group_head],
          {
            ...item,
            n_unit: item.unit,
            n_range_from: item.range_from,
            n_range_to: item.range_to,
          },
        ]
      } else {
        _tabledWithResultLab[item.group_head] = [item]
      }
    } else if (item.report_type === 'input') {
      inputList.push(item)
    } else if (item.report_type === 'microbiology_form') {
      microbiology.push(item)
    } else if (item.report_type === 'ho_widal') {
      // hoWidalList.push(item);
      _hoWidalLabsList.push(item)

      if (Object.keys(_hoWidalLabs).includes(item.group_head)) {
        _hoWidalLabs[item.group_head] = [..._hoWidalLabs[item.group_head], item]
      } else {
        _hoWidalLabs[item.group_head] = [item]
      }
    } else if (item.report_type === 'macroscopy') {
      macroscopyList.push(item)
    } else {
      otherList.push(item)
    }
  })

  return {
    _tabledLab,
    _tabledLabList,
    inputList,
    microbiology,
    _hoWidalLabs,
    _hoWidalLabsList,
    macroscopyList,
    _tabledWithResultLab,
    _tabledWithResultLabList,
    otherList,
  }
}

export function getCompletedTests(
  labNo,
  callback = (f) => f,
  error = (f) => f,
) {
  _fetchApi(
    `${apiURL()}/lab/lab-results/${labNo}`,
    (data) => {
      if (data.success) {
        let _data = splitTestsByView(data.results)
        callback(_data, data.results)
      }
    },
    (err) => {
      error(err)
      console.log(err)
    },
  )
}

export function printResult(
  patient_id = '',
  booking_no = '',
  callback = (f) => f,
  error = (f) => f,
  request_id = '',
  // insufficientBalance=f=>f
) {
  // let accNo = patient_id.split('-')[0]
  // _fetchApi(`${apiURL()}/transactions/balance/${accNo}`, (data) => {
  //   if (data.results.length) {
  //     if (data.results[0].balance < 0) {
  //       insufficientBalance(data.results[0])
  //     } else {
        _fetchApi(
          `${apiURL()}/lab/request/history/${patient_id}/${booking_no}/${request_id}`,
          (data) => {
            if (data.success) {
              // console.log(data.results[0])

              _fetchApi(
                `${apiURL()}/lab/lab-results/uncompleted/${booking_no}`,
                (data2) => {
                  // console.log(data2);
                  if (data2.success) {
                    _fetchApi(
                      `${apiURL()}/lab/comment/${booking_no}`,
                      (data3) => {
                        _fetchApi(
                          `${apiURL()}/lab/sample/history/${booking_no}`,
                          (data4) => {
                            // setPrinting(false);
                            // console.log(data);
                            let history = data4.results
                            let splitted = splitTestsByView(data2.results)
                            // console.log(history)
                            if (data.results) {
                              let dd = {
                                patientInfo: data.results[0],
                                results: data2.results,
                                disp_results: splitted,
                                comments: data3.results,
                                printType: data2.results[0].test_group,
                                history,
                                reportType: data2.results[0].report_type,
                              }
                              callback(dd)
                              // console.log(dd)
                            }
                          },
                          (err) => {
                            console.log(err)
                          },
                        )
                      },
                      (err) => console.log(err),
                    )
                  }
                },
                (err) => {
                  console.log(err)
                },
              )
            }
          },
          (err) => console.log(err),
        )
      // }
    // } else {
    //   alert('Account Not Found!')
    // }
    // console.log(data)
  // })
}

export function getBarcode() {}
