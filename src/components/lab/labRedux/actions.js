import {
  CHANGE_HEMATOLOGY,
  CHANGE_MICROBIOLOGY,
  CHANGE_PATHOLOGY,
  CHANGE_PATIENT_INFO,
  RESET_FORM,
  CHANGE_RADIOLOGY,
  UPDATE_PENDING_LIST,
  START_LOADING_LAB_LIST,
  STOP_LOADING_LAB_LIST,
  START_LOADING_LAB_HISTORY,
  STOP_LOADING_LAB_HISTORY,
  UPDATE_LAB_HISTORY,
} from './types'
import {
  LOADING_LAB_TREE,
  SET_LAB_TREE,
} from '../../../redux/actions/actionTypes'
// import store from '../../../redux/store';
import { _fetchApi, _fetchApi2 } from '../../../redux/actions/api'
import { apiURL } from '../../../redux/actions'
import { unflatten } from '../../../redux/actions/account'
import store from '../../../redux/store'

export const SAMPLE_COLLECTION = 'SAMPLE_COLLECTION'
export const SAMPLE_ANALYSIS = 'SAMPLE_ANALYSIS'
export const CHEMICAL_PATHOLOGY_ANALYSIS = 'CHEMICAL_PATHOLOGY_ANALYSIS'
export const HEMATOLOGY_ANALYSIS = 'HEMATOLOGY_ANALYSIS'
export const MICRO_SAMPLE_ANALYSIS = 'MICRO_SAMPLE_ANALYSIS'
export const RADIOLOGY_SAMPLE_ANALYSIS = 'RADIOLOGY_SAMPLE_ANALYSIS'
export const CARDIOLOGY_SAMPLE_ANALYSIS = 'CARDIOLOGY_SAMPLE_ANALYSIS'
export const RADIOLOGY_SAMPLE_SCAN = 'RADIOLOGY_SAMPLE_SCAN'
export const DOCTOR_COMMENT = 'DOCTOR_COMMENT'
export const ALL_DEPARTMENT = 'ALL_DEPARTMENT'

export const changeHematology = (newVal) => ({
  type: CHANGE_HEMATOLOGY,
  payload: newVal,
})

export const changeMicrobiology = (newVal) => ({
  type: CHANGE_MICROBIOLOGY,
  payload: newVal,
})

export const changePathology = (newVal) => ({
  type: CHANGE_PATHOLOGY,
  payload: newVal,
})

export const changeRadiology = (newVal) => ({
  type: CHANGE_RADIOLOGY,
  payload: newVal,
})

export const patientInfoChange = (val) => ({
  type: CHANGE_PATIENT_INFO,
  payload: val,
})

const getLab2 = (department, from, to, callback) => {
  const facilityId = store.getState().auth.user.facilityId
  _fetchApi(
    `${apiURL()}/lab/pending-lab-request?department=${department}&from=${from}&to=${to}&facilityId=${facilityId}`,
    (data) => {
      if (data.success) {
        callback(data.results)
      }
    },
    (err) => {
      console.log(err)
    },
  )
}

const getPendingLab = (success, from, to, facId) => {
  _fetchApi2(
    `${apiURL()}/lab/pending/collection/${facId}?from=${from}&to=${to}`,
    (data) => {
      if (data.success) {
        success(data.results)
      }
    },
    (err) => {
      console.log(err)
    },
  )
}

const getPendingAnalysis = (
  department,
  success,
  from,
  to,
  facId,
  unit = '',
) => {
  _fetchApi2(
    `${apiURL()}/lab/pending/analysis/${department}/${facId}?from=${from}&to=${to}&unit=${unit}`,
    (data) => {
      if (data.success) {
        success(data.results)
      }
    },
    (err) => {
      console.log(err)
    },
  )
}

const getPendingMicrobiologyAnalysis = (
  success,
  from,
  to,
  facId,
  unit = '',
) => {
  _fetchApi2(
    `${apiURL()}/lab/pending/sample-collection/microbiology/${facId}?from=${from}&to=${to}&unit=${unit}`,
    (data) => {
      if (data.success) {
        success(data.results)
      }
    },
    (err) => {
      console.log(err)
    },
  )
}

const getPendingRadiology = (success, from, to, facId, unit = '') => {
  _fetchApi2(
    `${apiURL()}/lab/pending/sample-collection/radiology/${facId}?from=${from}&to=${to}&unit=${unit}`,
    (data) => {
      if (data.success) {
        success(data.results)
      }
    },
    (err) => {
      console.log(err)
    },
  )
}

const getPendingLabList = (query_type, dept, success, from, to, facId) => {
  // const facilityId = store.getState().auth.user.facilityId;
  _fetchApi2(
    `${apiURL()}/lab/pending-test?query_type=${query_type}&dept=${dept}&facilityId=${facId}&from=${from}&to=${to}`,
    (data) => {
      if (data.success) {
        success(data.results)
      }
    },
    (err) => {
      console.log(err)
    },
  )
}

const getPendingDocComment = (success, from, to, facId,unit) => {
  const { department = '' } = store.getState().auth.user

  _fetchApi2(
    `${apiURL()}/lab/pending/doctor-comment/${facId}?department=${department}&from=${from}&to=${to}&unit=${unit}`,
    (data) => {
      if (data.success) {
        success(data.results)
      }
    },
    (err) => {
      console.log(err)
    },
  )
}

// export const refreshPendingList = type =>
export function refreshPendingList(type, department, from, to, facId, unit) {
  return (dispatch) => {
    console.log(type)
    // const userDepartment = store.getState().auth.user.department;

    dispatch({ type: START_LOADING_LAB_LIST })
    let success = (data) => {
      dispatch({ type: UPDATE_PENDING_LIST, payload: data })
      dispatch({ type: STOP_LOADING_LAB_LIST })
    }

    switch (type) {
      case SAMPLE_COLLECTION:
        return getPendingLab(success, from, to, facId)
      case ALL_DEPARTMENT:
        return getPendingAnalysis('All', success, from, to, facId)
      case CHEMICAL_PATHOLOGY_ANALYSIS:
        return getPendingAnalysis(department, success, from, to, facId, unit)
      case HEMATOLOGY_ANALYSIS:
        return getPendingAnalysis(department, success, from, to, facId, unit)
      case MICRO_SAMPLE_ANALYSIS:
        return getPendingMicrobiologyAnalysis(success, from, to, facId, unit)
      case RADIOLOGY_SAMPLE_ANALYSIS:
        return getPendingLabList(
          'uploaded',
          'radiology',
          success,
          from,
          to,
          facId,
          unit,
        )
      case CARDIOLOGY_SAMPLE_ANALYSIS:
        return getPendingLabList(
          'uploaded',
          'cardiology',
          success,
          from,
          to,
          facId,
          unit,
        )
      case RADIOLOGY_SAMPLE_SCAN:
        return getPendingRadiology(success, from, to, facId, unit)
      case DOCTOR_COMMENT:
        return getPendingDocComment(success, from, to, facId, unit)
      default:
        return null
    }
  }
}

const getSampleCollectionHistory = (success, from, to, facId, unit) => {
  _fetchApi2(
    `${apiURL()}/lab/history/collection/${facId}?from=${from}&to=${to}&unit=${unit}`,
    (data) => {
      if (data.success) {
        success(data.results)
      }
    },
    (err) => {
      console.log(err)
    },
  )
}

const getAnalysisHistory = (department, success, from, to, facId, unit) => {
  _fetchApi2(
    `${apiURL()}/lab/history/analysis/${department}/${facId}?from=${from}&to=${to}&unit=${unit}`,
    (data) => {
      if (data.success) {
        success(data.results)
      }
    },
    (err) => {
      console.log(err)
    },
  )
}

const getMicrobiologyAnalysisHistory = (success, from, to, facId, unit) => {
  _fetchApi2(
    `${apiURL()}/lab/history/sample-collection/microbiology/${facId}?from=${from}&to=${to}&unit=${unit}`,
    (data) => {
      if (data.success) {
        success(data.results)
      }
    },
    (err) => {
      console.log(err)
    },
  )
}

const getRadiologyAnalysisHistory = (success, from, to, facId, unit, dept) => {
  _fetchApi2(
    `${apiURL()}/lab/history/sample-collection/${dept}/${facId}?from=${from}&to=${to}&unit=${unit}`,
    (data) => {
      if (data.success) {
        success(data.results)
      }
    },
    (err) => {
      console.log(err)
    },
  )
}

const getDocReportHistory = (success, from, to, facId, unit) => {
  const { department = '' } = store.getState().auth.user
  _fetchApi2(
    `${apiURL()}/lab/history/doctor-comment/${facId}?department=${department}&from=${from}&to=${to}&unit=${unit}`,
    (data) => {
      if (data.success) {
        success(data.results)
      }
    },
    (err) => {
      console.log(err)
    },
  )
}

export function refreshHistoryList(type, department, from, to, facId, unit) {
  return (dispatch) => {
    dispatch({ type: START_LOADING_LAB_HISTORY })
    let success = (data) => {
      dispatch({ type: UPDATE_LAB_HISTORY, payload: data })
      dispatch({ type: STOP_LOADING_LAB_HISTORY })
    }

    switch (type) {
      case SAMPLE_COLLECTION:
        return getSampleCollectionHistory(success, from, to, facId, unit)
      case ALL_DEPARTMENT:
        return getAnalysisHistory('All', success, from, to, facId, unit)
      case CHEMICAL_PATHOLOGY_ANALYSIS:
        return getAnalysisHistory(department, success, from, to, facId, unit)
      case HEMATOLOGY_ANALYSIS:
        return getAnalysisHistory(department, success, from, to, facId, unit)
      case MICRO_SAMPLE_ANALYSIS:
        return getMicrobiologyAnalysisHistory(success, from, to, facId, unit)
      case RADIOLOGY_SAMPLE_ANALYSIS:
        return getRadiologyAnalysisHistory(success, from, to, facId, unit,'radiology')
      case CARDIOLOGY_SAMPLE_ANALYSIS:
        return getRadiologyAnalysisHistory(success, from, to, facId, unit,'cardiology')
      case DOCTOR_COMMENT:
        return getDocReportHistory(success, from, to, facId, unit)
      default:
        return null
    }
  }
}

// export const updatePendingList = newlist => ({
//   type: UPDATE_PENDING_LIST,
//   payload: newlist
// })

// export const getPatientCount = () => {
//   const username = store.getState().auth.user.username;

//   _fetchApi(`${apiURL()}/lab/patient/daily-count/${username}`, data => {

//   })
// }

export const resetForm = () => ({ type: RESET_FORM })

export const getLabTreeFromDB = () => {
  return (dispatch) => {
    dispatch({ type: LOADING_LAB_TREE })

    _fetchApi(
      `${apiURL()}/lab/service/tree`,
      (data) => {
        dispatch({ type: LOADING_LAB_TREE })
        if (data.success) {
          // let newList = [];
          // data.results.forEach((item) => {
          //   newList.push({
          //     _id: item.id,
          //     title: item.subhead,
          //     subhead: item.head || '',
          //   });
          // });
          let formatted = unflatten(data.results)
          dispatch({ type: SET_LAB_TREE, payload: formatted })
        }
      },
      (err) => {
        dispatch({ type: LOADING_LAB_TREE })
        console.log(err)
      },
    )

    // let userFacilityId = store.getState().auth.user.facilityId;
    // lab_services_db
    //   .find({
    //     selector: { facilityId: { $eq: userFacilityId } },
    //     fields: ['_id', 'labHead', 'labSub'],
    //   })
    //   .then(({ docs }) => {
    //     dispatch({ type: LOADING_LAB_TREE });
    //     if (docs.length) {
    //       let newList = [];
    //       docs.forEach((item) =>
    //         newList.push({
    //           _id: item._id,
    //           title: item.labSub,
    //           subhead: item.labHead || '',
    //         }),
    //       );
    //       // console.log('new list', newList)
    //       let formatted = unflatten(newList);
    //       // console.log('tree', formatted);
    //       dispatch({ type: SET_LAB_TREE, payload: formatted });
    //     }
    //     // console.log(docs);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     dispatch({ type: LOADING_LAB_TREE });
    //   });
  }
}

// function convert(data, start) {
//   return {
//     subhead: start,
//     // price: data[start] ? data[start].price : 0,
//     title: data
//       .filter((d) => d.subhead === start)
//       .reduce((curr, next) => curr.concat([next.title]), [])
//       .map((c) => convert(data, c)),
//   };
// }
