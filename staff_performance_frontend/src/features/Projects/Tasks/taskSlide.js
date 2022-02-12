import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getTaskList } from './taskService';

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (query) => {
        let result = {};
        await getTaskList(query)
        .then(
            (response) => {
            result = {data:response.data.tasks.data,pageCount: response.data.tasks.last_page };
            }
        ).catch(errors => {});
        return result;
    }
)
const initialState = {data:[], pageCount: 0 ,query: {page: 1, q:''} };
const tasksSlice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        changePage(state, action){
            state.query.page = action.payload.page;
        },
        changeFilter(state, action){
            state.query.q = action.payload.q;
        },
    },
    extraReducers: {
        [fetchTasks.fulfilled]: (state, action) => {
            state.data = action.payload.data;
            state.pageCount =  action.payload.pageCount;
        },
    }
})

export const {changePage ,changeFilter} = tasksSlice.actions;
export default tasksSlice.reducer;
