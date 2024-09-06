"use client"

import {configureStore} from "@reduxjs/toolkit";
import CounterSlice from "./counter/counterSlice";
import facultySlice from "./faculty/faculty-slice";

const store=configureStore({
    reducer:{
counter:CounterSlice.reducer,
faculty:facultySlice.reducer
    },
});

export default store;