import {combineReducers} from "@reduxjs/toolkit";

// import authReducer from "../slices/authSlice"
// import profileReducer from "../slices/profileSlice";
// import cartReducer from "../slices/cartSlice"
// import courseReducer from "../slices/courseSlice"
// import viewCourseReducer from "../slices/viewCourseSlice"
import authSlice from "../slices/authSlice";
import profileSlice from "../slices/profileSlice";
import cartSlice from "../slices/cartSlice";
import courseSlice from "../slices/courseSlice";
import viewCourseSlice from "../slices/viewCourseSlice";

const rootReducer  = combineReducers({
    //key:value => helps in adding the slice - reducers to the store
    auth: authSlice,
    profile:profileSlice,
    cart:cartSlice,
    course:courseSlice,
    viewCourse:viewCourseSlice,
})

export default rootReducer