const INITIAL_STATE = {};

export default function library(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case "SAVE":
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
}
