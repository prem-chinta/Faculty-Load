import { createSlice } from "@reduxjs/toolkit";

const CounterSlice=createSlice({
    //slice name:
    name:"counter",
    //initial state for the property slice

    initialState:{
        value:0,
    },


    //reducers function to handlee different functions
    reducers:{
       increment: (state => {state.value +=1}),
       decrement: (state => {state.value -=1}),
       incrementByAmount: (state,action) => {state.value +=action.payload},
       decrementByAmount: (state,action) => {state.value -=action.payload},
       reset: (state => {state.value = 0}),
    },
});

export const CounterActions =CounterSlice.actions;
export default CounterSlice;
