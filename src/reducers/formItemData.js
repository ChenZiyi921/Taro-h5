const INITIAL_STATE = {};

export default function formItemData(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case "SET_DATA":
      return {
        // ...state,
        ...payload
      };
    default:
      return state;
  }
}
