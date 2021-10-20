const INITIAL_STATE = {};

export default function library(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SAVE":
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
