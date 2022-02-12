import React, {useEffect} from "react";

// reactstrap components
import {
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Container,
    Row,
    Badge,
} from "reactstrap";

// core components
import Header from "components/Headers/Header.js";
import DataTable from "components/DataTable/DataTable";
import {changeSort, changeFilter, changePage, fetchProjects} from "./projectsSlice";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {history} from '../../helper/history'
import {destroyProject} from "./projectsService";
import {confirmAlert} from "helper/alerts";
import {successAlert} from "helper/alerts";
import {errorAlert} from "helper/alerts";
import Overlay from "../../components/Overlay/Overlay";
import useAuth from "../../helper/authHelper";
import jwt_decode from "jwt-decode";

export default function Projects() {

    const dispatch = useDispatch();
    const PROJECTS = useSelector(state => state.project);
    const isLoading = useSelector(state => state.app.isLoading);
    const {isAdmin} = useAuth();
    useEffect(() => {
        const fetchData = () => {
            dispatch(fetchProjects(PROJECTS.query));
        }
        fetchData();
    }, [PROJECTS.query])

    const deleteAction = (project_id) => {
        if (isAdmin) {
            confirmAlert({
                title: "Are you sure want to delete this project?",
                closeOnConfirm: false,
            }).then((confirm) => {
                if (confirm) {
                    return destroyProject(project_id);
                } else {
                    throw null;
                }
            })
                .then(response => {
                    if (response.data.status === 200) {
                        successAlert("The project deleted successfully.");
                        dispatch(fetchProjects(PROJECTS.query));
                    } else {
                        errorAlert("Can not deleted project. Please try again.");
                    }
                })
                .catch((error) => {
                    if (error !== null) {
                        errorAlert("Unable to send request. Please try again later.");
                    }
                });
        }
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id'
            },
            {
                Header: 'Action',
                accessor: 'action',
                Cell: (props) => {
                    const rowIdx = props.row.original.id;
                    return (
                        <UncontrolledDropdown>
                            <DropdownToggle
                                className="btn-icon-only text-light"
                                href="#pablo"
                                role="button"
                                size="sm"
                                color=""
                                onClick={(e) => e.preventDefault()}
                            >
                                <i className="fas fa-ellipsis-v"/>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                                <DropdownItem
                                    className='text-success'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        history.push(`/admin/projects-management/${rowIdx}/edit`)
                                    }}>
                                    <i className="fas fa-edit"></i> Edit
                                </DropdownItem>
                                <DropdownItem
                                    className='text-info'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        history.push(`/admin/projects-management/${rowIdx}/detail`)
                                    }}>
                                    <i className="fas fa-info-circle"></i> Detail
                                </DropdownItem>
                                {
                                    isAdmin && (
                                        <>
                                            <DropdownItem
                                                className='text-danger'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    deleteAction(rowIdx)
                                                }}>
                                                <i className="fas fa-trash"></i> Remove
                                            </DropdownItem>
                                        </>
                                    )
                                }
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    );
                }
            },
            {
                Header: 'Name Project',
                accessor: 'name'
            },
            {
                Header: 'Estimate',
                accessor: 'estimate'
            },
            {
                Header: 'Start Date',
                accessor: 'start_date'
            },
            {
                Header: 'End Date',
                accessor: 'end_date'
            },
            {
                Header: 'Status',
                accessor: 'status',
                Cell: (props) => {
                    const status_name = props.row.original.status;
                    return <Badge color={status_name === 'pending' ? "primary" :
                        (status_name === 'completed' ? 'success' :
                            'danger')}>
                        {status_name}</Badge>
                }
            },
        ],
        [isAdmin]
    )

    const handleFilter = (q) => {
        let param = q === undefined ? '' : q
        if (PROJECTS.query.q !== param) {
            dispatch(changeFilter({q: param}));
        }
    };

    const handleSort = (sortData) => {
        if (sortData.length > 0) {
            const {id, desc} = sortData[0];
            dispatch(changeSort({by: id, order: desc ? 'desc' : 'asc'}));
        }
    };

    const handlePaging = (page = 0) => {
        if (!isNaN(page)) {
            if (parseInt(page) + 1 !== PROJECTS.query.page) {
                dispatch(changePage({page: parseInt(page) + 1}));
            }
        }
    };

    return (
        <>
            <Header isShowCard='0'/>
            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <div className="col">
                        {isLoading && <Overlay/>}
                        <DataTable
                            showFilter={true}
                            showPageInfo={true}
                            showAddBtn={true}
                            DOMBtnAdd={Projects.BtnAdd}
                            currentPage={PROJECTS.query.page}
                            onChange={(q) => handleFilter(q)}
                            onSort={(sortData) => handleSort(sortData)}
                            onPaging={(pagingData) => handlePaging(pagingData)}
                            name="List of Projects"
                            columns={columns}
                            data={PROJECTS.data}
                            pageCount={PROJECTS.pageCount}
                        />
                    </div>
                </Row>
            </Container>
        </>
    );
}

Projects.BtnAdd = function ProjectsBtnAdd() {
    return (
        <Link to="/admin/projects-management/add" className="btn btn-primary"><i className="fas fa-plus-circle"></i> Add
            Project</Link>);
}
