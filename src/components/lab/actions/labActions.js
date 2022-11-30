// import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import cuid from 'cuid';
import store from '../../../redux/store';

import { lab_db, lab_services_db } from '../../../db';
import { getPatient } from '../../doc_dash/actions/patientsActions';
import { SET_SELECTED_LAB } from '../../doc_dash/types';
// import { getPatientList } from '../../record/actions/patientsActions';
import {
  GET_FACILITY_PENDING_LABS,
  SET_CURRENT_PATIENT_LAB_INFO,
  LOADING_LAB_SERVICES,
  GET_LAB_SERVICES,
  LOADING_LAB_TREE,
  SET_LAB_TREE,
  GET_VALID_TESTS,
} from '../../../redux/actions/actionTypes';
import { _customNotify, _warningNotify } from '../../utils/helpers';
import { unflatten } from '../../../redux/actions/account';

export const saveLabService = (labService = {}, cb = (f) => f) => {
  return (dispatch) => {
    let user = store.getState().auth.user;
    labService._id = cuid();
    labService.createdAt = new Date().toISOString();
    labService.createdBy = `${user.firstname} ${user.lastname}`;
    labService.userId = `${user.id}`;
    labService.facilityId = `${user.facilityId}`;
    labService.updatedAt = new Date().toISOString();
    labService.updatedBy = `${user.firstname} ${user.lastname}`;

    lab_services_db
      .put(labService)
      .then((suc) => {
        cb();
        _customNotify('Lab service saved!');
        dispatch(getLabServices());
        dispatch(getLabTree());
      })
      .catch((err) => {
        cb();
        _warningNotify('An error occured');
        console.log(err);
      });
  };
};

export const getLabTree = () => {
  return (dispatch) => {
    dispatch({ type: LOADING_LAB_TREE });
    let userFacilityId = store.getState().auth.user.facilityId;
    lab_services_db
      .find({
        selector: { facilityId: { $eq: userFacilityId } },
        fields: ['_id', 'labHead', 'labSub'],
      })
      .then(({ docs }) => {
        dispatch({ type: LOADING_LAB_TREE });
        if (docs.length) {
          let newList = [];
          docs.forEach((item) =>
            newList.push({
              _id: item._id,
              title: item.labSub,
              subhead: item.labHead || '',
            }),
          );
          // console.log('new list', newList)
          let formatted = unflatten(newList);
          // console.log('tree', formatted);
          dispatch({ type: SET_LAB_TREE, payload: formatted });
        }
        // console.log(docs);
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: LOADING_LAB_TREE });
      });
  };
};

export const getLabServices = () => {
  return (dispatch) => {
    dispatch({ type: LOADING_LAB_SERVICES });
    let userFacilityId = store.getState().auth.user.facilityId;

    lab_services_db
      .find({ selector: { facilityId: { $eq: userFacilityId } } })
      .then((data) => {
        // console.log(data);
        dispatch({ type: GET_LAB_SERVICES, payload: data.docs });
        dispatch({ type: LOADING_LAB_SERVICES });
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: LOADING_LAB_SERVICES });
      });
  };
};

export const updateLabService = (labService = {}, cb = (f) => f) => {
  return (dispatch) => {
    let user = store.getState().auth.user;
    labService.updatedAt = new Date().toISOString();
    labService.updatedBy = `${user.firstname} ${user.lastname}`;

    console.log(labService);
    lab_services_db
      .put(labService)
      .then((suc) => {
        console.log(suc);
        cb();
        _customNotify('Lab service updated!');
        dispatch(getLabServices());
        dispatch(getLabTree());
      })
      .catch((err) => {
        cb();
        _warningNotify('An error occured');
        console.log(err);
      });
  };
};

export const deleteLabService = (
  labServiceId = '',
  subName = '',
  cb = (f) => f,
) => {
  return (dispatch) => {
    console.log(labServiceId);

    lab_services_db
      .get(labServiceId)
      .then((data) => {
        data._deleted = true;
        return lab_services_db
          .put(data)
          .then(() => {
            cb();
            dispatch(getLabServices());
            dispatch(getLabTree());
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
};

export const getLabServiceById = async (id = '') => {
  try {
    let selectedlab = await lab_services_db.get(id);
    return selectedlab;
  } catch (error) {
    console.log(error);
  }
};

export const getTestListFromServices = () => {
  return async (dispatch) => {
    let facilityId = store.getState().auth.user.facilityId;
    let services = await lab_services_db.find({
      selector: { _id: { $gte: null }, facilityId: { $eq: facilityId } },
      // fields: ['tests'],
    });
    let validTests = [];
    services.docs.forEach((item) => {
      if (item.tests) {
        validTests.push(item);
      }
    });
    dispatch({ type: GET_VALID_TESTS, payload: validTests });
    // return validTests;
  };
};

export const getLabTestsByServiceId = async (id = '') => {
  try {
    let service = await lab_services_db.get(id);

    return service.tests;
  } catch (error) {
    console.log(error);
  }
};

export const saveLab = (data = [], cb = (f) => f, error = (f) => f) => {
  return (dispatch) => {
    let user = store.getState().auth.user;
    let labList = [];
    data.forEach((item) => {
      item._id = uuidv4();
      item.createdAt = new Date().toISOString();
      item.createdBy = `${user.firstname} ${user.lastname}`;
      item.userId = `${user.id}`;
      item.facilityId = `${user.facilityId}`;
      item.updatedAt = new Date().toISOString();
      item.updatedBy = `${user.firstname} ${user.lastname}`;
      labList.push(item);
    });
    // console.log(labList)
    lab_db
      .bulkDocs(labList)
      .then(() => {
        cb(data);
        dispatch(getFacilityPendingLabList());
      })
      .catch((err) => {
        error();
        console.log(err);
      });
  };
};

export function getPatientLabTests(pid = '', cb = (f) => f) {
  return (dispatch) => {
    // const userId = store.getState().auth.user.facilityId;

    lab_db
      .find({
        selector: {
          // userId: { $eq: JSON.stringify(userId) },
          patient_id: { $eq: pid },
        },
      })
      .then((data) => {
        const labs = data.docs;

        dispatch(
          getPatient(pid, (patient) => {
            let patientLab = Object.assign({}, { patientInfo: patient, labs });
            dispatch({
              type: SET_CURRENT_PATIENT_LAB_INFO,
              payload: patientLab,
            });
            // console.log(patientLab);
            cb();
          }),
        );
      })
      .catch((err) => {
        cb();
        console.log(err);
      });
  };
}

export function getFacilityPendingLabList(cb = (f) => f) {
  return (dispatch) => {
    const userFacilityId = store.getState().auth.user.facilityId;

    lab_db
      .find({
        selector: {
          _id: { $gt: null },
          facilityId: { $eq: userFacilityId.toString() },
          //   status: {$eq: 'request'}
        },
      })
      .then((data) => {
        // console.log(data);
        cb(data.docs);
        // dispatch({ type: GET_LAB_LIST, payload: data.docs });
      })
      .catch((err) => {
        cb();
        console.log(err);
      });
  };
}

export function getFacilityPendingLabListByPatient(cb = (f) => f) {
  return (dispatch) => {
    const userFacilityId = store.getState().auth.user.facilityId;

    lab_db
      .find({
        selector: {
          _id: { $gt: null },
          facilityId: { $eq: userFacilityId.toString() },
        },
      })
      .then(({ docs }) => {
        // console.log(data);
        cb(docs);
        dispatch({ type: GET_FACILITY_PENDING_LABS, payload: docs });
      })
      .catch((err) => {
        cb();
        console.log(err);
      });
  };
}

export function getLabDetails(labId = '', cb = (f) => f) {
  return (dispatch) => {
    const userId = store.getState().auth.user.id;

    lab_db
      .find({
        selector: {
          _id: {
            $eq: labId,
          },
          userId: {
            $eq: userId.toString(),
          },
        },
      })
      .then(({ docs }) => {
        // console.log(docs);
        if (docs.length) {
          // console.log(docs[0])
          dispatch({ type: SET_SELECTED_LAB, payload: docs[0] });
          cb(docs[0]);
          dispatch(getPatient(docs[0].patient_id));
        }
      })
      .catch((err) => {
        cb();
        console.log(err);
      });
  };
}

export const cancelLabTest = (labId = '', cb = (f) => f) => {
  return (dispatch) => {
    let user = store.getState().auth.user;
    lab_db
      .get(labId)
      .then((test) => {
        test.status = 'cancelled';
        test.updatedAt = new Date().toISOString();
        test.updatedBy = `${user.firstname} ${user.lastname}`;
        lab_db
          .put(test)
          .then(() => {
            cb();
            dispatch(getLabDetails(labId));
            dispatch(getFacilityPendingLabList());
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
};

export const completeLabTest = (labId = '', data = {}, cb = (f) => f) => {
  return (dispatch) => {
    let user = store.getState().auth.user;
    lab_db
      .get(labId)
      .then((test) => {
        test = {
          ...test,
          ...data,
          status: 'completed',
          updatedAt: new Date().toISOString(),
          updatedBy: `${user.firstname} ${user.lastname}`,
        };
        lab_db
          .put(test)
          .then(() => {
            cb();
            dispatch(getLabDetails(labId));
            dispatch(getFacilityPendingLabList());
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
};

export const updateLabTest = (labId = '', data = {}, cb = (f) => f) => {
  return (dispatch) => {
    let user = store.getState().auth.user;
    lab_db
      .get(labId)
      .then((test) => {
        test = {
          ...test,
          ...data,
          updatedAt: new Date().toISOString(),
          updatedBy: `${user.firstname} ${user.lastname}`,
        };
        lab_db
          .put(test)
          .then(() => {
            cb();
            dispatch(getLabDetails(labId));
            dispatch(getFacilityPendingLabList());
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
};
