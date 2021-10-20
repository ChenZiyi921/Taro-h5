export const setCase = item => {
  return {
    type: "SET_CASE",
    payload: item
  };
};

export const setAllEvent = item => {
  return {
    type: "SET_All_EVENT",
    payload: item
  };
};

export const setCurrentEvent = item => {
  return {
    type: "SET_CURRENT_EVENT",
    payload: item
  };
};

export const setCurrentForm = item => {
  return {
    type: "SET_CURRENT_FORM",
    payload: item
  };
};

export const setCurrentFormStatus = item => {
  return {
    type: "SET_CURRENT_FORM_STATUS",
    payload: item
  };
};

export const setCurrentFormList = (item, formInstanceList) => {
  return {
    type: "SET_CURRENT_FORMLIST",
    payload: { item, formInstanceList }
  };
};
