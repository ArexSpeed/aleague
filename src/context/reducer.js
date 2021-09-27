export const initialState = {
  url: "https://aleague.herokuapp.com",
  mobileSidebar: false,
  darkTheme: false,
};

export const actions = {
  toggleMobileSidebar: "TOGGLE_MOBILE_SIDEBAR",
  toggleTheme: "TOGGLE_THEME",
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case actions.toggleMobileSidebar:
      return {
        ...state,
        mobileSidebar: !state.mobileSidebar,
      };
    case actions.toggleTheme:
      return {
        ...state,
        darkTheme: !state.darkTheme,
      };

    default:
      return state;
  }
};

export default reducer;
