import produce from "immer";

const INITIAL_STATE = {
  currentCase: {},
  allEvent: [],
  displayEvent: [],
  currentEvent: {},
  currentForm: {}
};

const patientCase = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case "SET_CASE":
      return {
        ...state,
        currentCase: payload
      };
    case "SET_All_EVENT":
      let filterEventList =
        payload.filter(item => {
          return item.eventInstanceList.length;
        }) || [];
      return {
        ...state,
        allEvent: payload,
        displayEvent: filterEventList
      };
    case "SET_CURRENT_EVENT":
      return {
        ...state,
        currentEvent: payload
      };
    case "SET_CURRENT_FORM":
      return {
        ...state,
        currentForm: payload
      };
    case "SET_CURRENT_FORM_STATUS":
      return produce(state, draft => {
        const {
          formEntryStatusId,
          formEntryStatusCode,
          formEntryStatusName
        } = payload;
        draft.currentForm.formInstanceList[0].formEntryStatusId = formEntryStatusId;
        draft.currentForm.formInstanceList[0].formEntryStatusCode = formEntryStatusCode;
        draft.currentForm.formInstanceList[0].formEntryStatusName = formEntryStatusName;
      });
    case "SET_CURRENT_FORMLIST":
      return produce(state, draft => {
        const { item, formInstanceList } = payload;
        draft.currentEvent.eventInstanceList[0].projectEventFormList = item;
        draft.currentForm.formInstanceList = formInstanceList;
      });
    default:
      return state;
  }
};

export default patientCase;
