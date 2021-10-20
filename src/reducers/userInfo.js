const INITIAL_STATE = {};

export default function userInfo(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SAVEUSER":
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
