const INITIAL_STATE = {};

export default function formsData(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case "SET_FORMS_DATA":
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
}
