import {
  CHANGE_HEMATOLOGY,
  CHANGE_MICROBIOLOGY,
  CHANGE_PATHOLOGY,
  CHANGE_PATIENT_INFO,
  RESET_FORM,
  CHANGE_RADIOLOGY,
  UPDATE_PENDING_LIST,
  UPDATE_LAB_HISTORY,
} from "./types";

const initialState = {
  hematology: [],
  microbiology: [],
  radiology: [],
  pathology: {},
  patientInfo: {},
  pending: [],
  history: [],
};

const labServicesReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_HEMATOLOGY:
      return {
        ...state,
        hematology: action.payload,
      };
    case CHANGE_MICROBIOLOGY:
      return {
        ...state,
        microbiology: action.payload,
      };
    case CHANGE_RADIOLOGY:
      return {
        ...state,
        radiology: action.payload,
      };
    case CHANGE_PATHOLOGY:
      return {
        ...state,
        pathology: action.payload,
      };
    case CHANGE_PATIENT_INFO:
      return {
        ...state,
        patientInfo: action.payload,
      };
    case RESET_FORM:
      return initialState;
    case UPDATE_PENDING_LIST:
      return {
        ...state,
        pending: action.payload,
      };
    case UPDATE_LAB_HISTORY:
      return {
        ...state,
        history: action.payload,
      };

    default:
      return state;
  }
};

export default labServicesReducer;
