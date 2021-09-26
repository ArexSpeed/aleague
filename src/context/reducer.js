export const initialState = {
  url: "https://aleague.herokuapp.com",
  mobileSidebar: false,
};

export const actions = {
  toggleMobileSidebar: "TOGGLE_MOBILE_SIDEBAR",
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case actions.toggleMobileSidebar:
      return {
        ...state,
        mobileSidebar: !state.mobileSidebar,
      };

    default:
      return state;
  }
};

export default reducer;
