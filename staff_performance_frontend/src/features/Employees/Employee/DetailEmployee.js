import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Header from "../../../components/Headers/Header";
import {
    Button,
    Card,
    CardBody, CardFooter,
    CardHeader, CardImg,
    Col,
    Container,
    Media,
    Row
} from "reactstrap";
import ENV from "../../../env";
import MASTER from "../../../constants/master";
import Role from "../../../components/Role/Role";
import Group from "../../../components/Group/Group";
import {fetchEffortData, fetchTasksData, fetchUserData, changeFilter, changePage, changeSort} from "./EmployeeSlice";
import Overlay from "../../../components/Overlay/Overlay";
import {history} from "../../../helper/history";
import NoDataFound from "../../../components/NoDataFound/NoDataFound";
import DataTable from "../../../components/DataTable/DataTable";
import Status from "../../../components/Status/Status";
import Chart from "react-apexcharts";

export default function DetailEmployee() {

    const {id} = useParams();
    const dispatch = useDispatch();
    const employee = useSelector(state => state.employee);
    const isLoading = useSelector(state => state.app.isLoading);
    const effortData = {
        labels: employee.efforts.map((item) => {
            return item.name;
        }),
        datasets: [
            {
                name: "Efforts",
                data: employee.efforts.map((item) => {
                    return item.user_effort;
                }),
            },
            {
                name: "Efforts OT",
                data: employee.efforts.map((item) => {
                    return item.user_effort_ot;
                }),
            },
            {
                name: "AVG Efforts",
                data: employee.efforts.map((item) => {
                    return item.avg_effort;
                }),
            },
            {
                name: "Total Efforts",
                data: employee.efforts.map((item) => {
                    return item.total_effort;
                }),
            }
        ]
    };
    const options = {
        chart: {
            id: 'chart',
        },
        xaxis: {
            categories: effortData.labels,
            labels: {
                trim: true,
            },
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return parseFloat(value).toLocaleString();
                },
            },
        },
        markers: {
            size: 4,
        },
        stroke: {
            width: 3,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
        },
    };
    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Project',
                accessor: 'project.name',
                disableSortBy: true,
            },
            {
                Header: 'Effort',
                accessor: 'effort_task',
            },
            {
                Header: 'Effort OT',
                accessor: 'effort_OT',
            },
            {
                Header: 'Estimate',
                accessor: 'project.estimate',
                disableSortBy: true,
            },
            {
                Header: 'Task Status',
                accessor: 'status',
                Cell: props => <Status name={props.row.original.status} status={props.row.original.status}/>,
            },
        ],
    );

    useEffect(() => {
        dispatch(fetchUserData(id));
        dispatch(fetchEffortData(id))
    }, []);

    useEffect(() => {
        fetchTaskList(id);
    }, [employee.detail.query]);

    function fetchTaskList(id) {
        dispatch(fetchTasksData({id: id, params: employee.detail.query}))
    }

    function handleSort(sortData) {
        if (sortData.length > 0) {
            const {id, desc} = sortData[0];
            dispatch(changeSort({by: id, order: desc ? 'desc' : 'asc'}));
        }
    }

    function handlePaging(page = 0) {
        if (!isNaN(page)) {
            if (parseInt(page) + 1 !== employee.detail.query.page) {
                dispatch(changePage({page: parseInt(page) + 1}));
            }
        }
    }

    function handleFilter(q) {
        dispatch(changeFilter({q: q === undefined ? '' : q}));
    }

    return (
        <>
            <Header isShowCard={0}/>
            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <Col className={'col'}>
                        {isLoading && <Overlay/>}
                        <Card className="shadow">
                            <CardHeader className="border-bottom-1 d-lg-flex align-items-lg-center">
                                <h3 className="mb-0 ">Employee Detail</h3>
                            </CardHeader>
                            <CardBody>
                                <Card>
                                    <CardHeader className={'bg-primary'}><h4 className={'text-white m-0'}>Profile</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col lg={8}>
                                                <div className='text-muted'>
                                                    <p className='text-sm'>
                                                        Full Name:
                                                        <b className='ml-2'>{employee.user?.full_name ?? ''}</b>
                                                    </p>
                                                    <p className='text-sm'>
                                                        Email:
                                                        <b className='ml-2'><a
                                                            href={'mailto:' + employee.user?.email ?? ''}>{employee.user?.email ?? ''}</a></b>
                                                    </p>
                                                    <p className='text-sm'>
                                                        Birthday:
                                                        <b className='text-capitalize ml-2'>{employee.user?.dob ?? ''}</b>
                                                    </p>
                                                    <p className='text-sm'>
                                                        Phone number:
                                                        <b className='text-capitalize ml-2'>{employee.user?.phone ?? ''}</b>
                                                    </p>
                                                    <p className='text-sm'>
                                                        Salary:
                                                        <b className='text-capitalize ml-2 font-weight-600'>{employee.user?.salary ? parseFloat(employee.user?.salary).toLocaleString(navigator.language, {
                                                            minimumFractionDigits: 0,
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }) : ''}</b>
                                                    </p>
                                                    <p className='text-sm'>
                                                        Pay per hour:
                                                        <b className='text-capitalize ml-2 font-weight-600'>{employee.user?.pay_per_hour ? parseFloat(employee.user?.pay_per_hour).toLocaleString(navigator.language, {
                                                            minimumFractionDigits: 0,
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }) : ''}</b>
                                                    </p>
                                                    <p className='text-sm'>
                                                        Role:
                                                        <b className='text-capitalize ml-2'><Role
                                                            role={employee.user?.role ? employee.user?.role.slug : ''}
                                                            name={employee.user?.role ? employee.user?.role.name : ''}/></b>
                                                    </p>
                                                    <p className='text-sm'>
                                                        Group:
                                                        <b className='text-capitalize ml-2'><Group
                                                            group={employee.user?.group ? employee.user?.group.slug : ''}
                                                            name={employee.user?.group ? employee.user?.group.name : ''}/></b>
                                                    </p>
                                                </div>
                                            </Col>
                                            <Col lg={4}>
                                                <Media>
                                                    <CardImg alt={employee.user?.full_name ?? ''} src={
                                                        employee.user?.avatar
                                                            ?
                                                            (ENV.DOMAIN + MASTER.STORAGE_PATH + employee.user?.avatar)
                                                            :
                                                            require("assets/img/theme/team-1-800x800.jpg")
                                                                .default
                                                    }/>
                                                </Media>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card className={'mt-3'}>
                                    <CardHeader className={'bg-success'}><h4
                                        className={'text-white m-0'}>Performance</h4></CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col xl={12}>
                                                {
                                                    employee.efforts.length > 0
                                                        ?
                                                        <Chart
                                                            options={options}
                                                            series={effortData.datasets}
                                                            type="line"
                                                            height="450"
                                                        />
                                                        :
                                                        <NoDataFound/>
                                                }
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card className={'mt-3'}>
                                    <CardHeader className={'bg-dark'}><h4 className={'text-white m-0'}>Tasks</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col xl={12}>
                                                <DataTable
                                                    showAddBtn={false}
                                                    showFilter={true}
                                                    showPageInfo={true}
                                                    currentPage={employee.detail.query.page}
                                                    onChange={(q) => handleFilter(q)}
                                                    onSort={(sortData) => handleSort(sortData)}
                                                    onPaging={(pagingData) => handlePaging(pagingData)}
                                                    columns={columns}
                                                    data={employee.detail.tasks}
                                                    pageCount={employee.detail.page_count}
                                                    showCard={false}
                                                    textSmall={true}/>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </CardBody>
                            <CardFooter className='d-flex align-items-center justify-content-between'>
                                <Button color={'danger'} onClick={() => history.goBack()}>Back</Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
