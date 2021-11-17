const INITIAL_STATE = {};

export default function userInfo(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case "SAVEUSER":
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
}
