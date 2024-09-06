import { facultyAction } from "./faculty-slice";

export const getFaculty = () => async (dispatch) => {
    try {
        dispatch(facultyAction.getRequest());
        const response = await fetch('/api/Faculty');
        const data = await response.json();
        dispatch(facultyAction.setDetails(data));
        console.log("Called",data.data) // fetching all the data from the database
    } catch (error) {
        dispatch(facultyAction.getErrors(error.message));
    }
};

export const addFaculty = (key, row) => async (dispatch) => {
    try {
        dispatch(facultyAction.getRequest());
        const response = await fetch(`/api/Faculty/${key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(row),
        });

        if (response.ok) {
          dispatch(getFaculty()); 
          console.log("Called getFaculty from add")// fetching all the data after adding a row and setting it to setDetails
        } else {
            const data = await response.json();
            dispatch(facultyAction.getErrors(data.message));
        }
    } catch (error) {
        dispatch(facultyAction.getErrors(error.message));
    }
};

export const updateFaculty = (key, row) => async (dispatch) => {
    try {
        dispatch(facultyAction.getRequest());
        const response = await fetch(`/api/Faculty/${key}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(row),
        });

        if (response.ok) {
          dispatch(getFaculty());
          console.log("Called getFaculty from update")// fetching all the data after updating a row and setting it to setDetails
        } else {
            const data = await response.json();
            dispatch(facultyAction.getErrors(data.message));
        }
    } catch (error) {
        dispatch(facultyAction.getErrors(error.message));
    }
};

export const deleteFaculty = (key) => async (dispatch) => {
    try {
        dispatch(facultyAction.getRequest());
        const response = await fetch(`/api/Faculty/${key}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          }
      });

        if (response.ok) {
          dispatch(getFaculty());// fetching all the data after updating a row and setting it to setDetails
        } else {
            const data = await response.json();
            dispatch(facultyAction.getErrors(data.message));
        }
    } catch (error) {
        dispatch(facultyAction.getErrors(error.message));
    }
};

export const getExamDates = () => async (dispatch) => {
    try {
        dispatch(facultyAction.getRequest());
        const response = await fetch('/api/timetable');
        const data = await response.json();

        dispatch(facultyAction.setExamDates(data)); // fetching all the data from the database
    } catch (error) {
        dispatch(facultyAction.getErrors(error.message));
    }
};
export const saveExamDates = (examDates) => async (dispatch) => {
    try {
        dispatch(facultyAction.getRequest());
        await fetch('/api/timetable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dates: examDates }),
        });
        if (response.ok) {
            dispatch(getExamDates());// fetching all the data after updating a row and setting it to setDetails
          } else {
              const data = await response.json();
              dispatch(facultyAction.getErrors(data.message));
          }
    } catch (error) {
        dispatch(facultyAction.getErrors(error.message));
    }
};

export const getCounts = () => async (dispatch) => {
    try {
        dispatch(facultyAction.getRequest());
        const response = await fetch('/api/counts');
        const data = await response.json();
        dispatch(facultyAction.setFacultyCounts(data)); // fetching all the data from the database
    } catch (error) {
        dispatch(facultyAction.getErrors(error.message));
    }
};

export const saveCounts = (selectedCounts) => async (dispatch) => {
    try {
        dispatch(facultyAction.getRequest());
        await fetch('/api/counts', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ counts: selectedCounts }),
        });
        if (response.ok) {
            dispatch(getCounts());// fetching all the data after updating a row and setting it to setDetails
          } else {
              const data = await response.json();
              dispatch(facultyAction.getErrors(data.message));
          }
    } catch (error) {
        dispatch(facultyAction.getErrors(error.message));
    }
};

