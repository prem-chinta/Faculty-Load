import { createSlice } from "@reduxjs/toolkit";

const facultySlice=createSlice({

    //slice name:
    name:"faculty",
    //initial state for the property slice

    initialState:{
        facultyDetails:[],
        examdates:{},
        facultyCounts:{},// array to hold all the fetched details
        error:null,//error state
        loading:false, //loading state

    },


    //reducers function to handlee different functions
    reducers:{
        getRequest(state){
            state.loading=true;
        },
        //action to update properties state with fetch data

        setDetails(state,action){
            state.facultyDetails=action.payload.data;  //update the properties of your field
            state.loading=false;
            console.log("actiondata",action.payload.data);
            console.log("faculty",state.facultyDetails);
        },
        setExamDates(state,action){
            state.examdates=action.payload.data;  //update the properties of your field
            state.loading=false;
        },
        setFacultyCounts(state,action){
            state.facultyCounts=action.payload.data.counts;  //update the properties of your field
            state.loading=false;
        },

        //action to update error state
        getErrors(state,action) {
            state.error= action.payload;
        },

    },
});

export const facultyAction =facultySlice.actions;
export default facultySlice;
