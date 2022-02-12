import {combineReducers} from 'redux';
import authReducer from '../features/Auth/authSlice';
import employeesReducer from '../features/Employees/employeesSlice';
import projectReducer from '../features/Projects/projectsSlice';
import employeeReducer from "../features/Employees/Employee/EmployeeSlice";
import profileReducer from "../features/Profile/profileSlice";
import headerReducer from "../components/Headers/headerSlice";
import taskReducer from '../features/Projects/Tasks/taskSlide';
import reportReducer from '../features/Reports/reportSlice';
import appReducer from '../helper/appSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    employees: employeesReducer,
    project: projectReducer,
    employee: employeeReducer,
    profile: profileReducer,
    header: headerReducer,
    task: taskReducer,
    report: reportReducer,
    app: appReducer,
});

export default rootReducer;
