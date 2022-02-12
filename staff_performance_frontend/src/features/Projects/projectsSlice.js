import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getProjectsList} from './projectsService';
// import {history} from '../../helper/history';

export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (query) => {
        let result = {};
        await getProjectsList(query)
            .then(response => {
                    let projectsList = response.data.projectsList;
                    result = {data: projectsList.data, pageCount: projectsList.last_page};
                }
            ).catch();
        return result;
    }
)
const initialState = {data: [], pageCount: 0, query: {page: 1, q: '', by: 'id', order: 'desc'}};
const projectsSlice = createSlice({
    name: 'projects',
    initialState: initialState,
    reducers: {
        changeSort(state, action) {
            state.query.by = action.payload.by;
            state.query.order = action.payload.order;
        },
        changePage(state, action) {
            state.query.page = action.payload.page;
        },
        changeFilter(state, action) {
            state.query.q = action.payload.q;
        },
    },
    extraReducers: {
        [fetchProjects.fulfilled]: (state, action) => {
            state.data = action.payload.data;
            state.pageCount = action.payload.pageCount;
        },
    }
})

export const {changeSort, changePage, changeFilter} = projectsSlice.actions;
export default projectsSlice.reducer;
