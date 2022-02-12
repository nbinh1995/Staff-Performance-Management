import React, {useEffect} from 'react'

// reactstrap components
import {
    Card, CardBody,
    Container, Nav, NavItem,
    Row, TabContent, TabPane,
    NavLink, FormGroup, Col, Label, Form, Button,
} from "reactstrap";
import Header from "../../components/Headers/Header";
import {useDispatch, useSelector} from "react-redux";
import {fetchGroupEffort, fetchProjectEffort, setActiveTab} from "./reportSlice";
import classnames from "classnames";
import DateTime from "react-datetime";
import {useFormik} from "formik";
import * as Yup from "yup";
import TextAlert from "../../components/TextAlert/TextAlert";
import Overlay from "../../components/Overlay/Overlay";
import Chart from "react-apexcharts";
import {format, isValid} from "date-fns";
import useAuth from  "../../helper/authHelper";


const Reports = () => {

    const report = useSelector(state => state.report);
    const {isBackend, isFrontend} = useAuth();
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.app.isLoading);
    const validate = {
        from: Yup.date()
            .required("This field is required.")
            .typeError("This field require date value."),
        to: Yup.date()
            .required("This field is required.")
            .typeError("This field require date value."),
    };

    const currentDate = new Date();
    const from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const to = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const initialValues = {
        from: from,
        to: to,
    };


    const projectFormik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object(validate),
        onSubmit: values => {
            fetchData();
        },
    });

    const frontendFormik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object(validate),
        onSubmit: values => {
            fetchData();
        },
    });

    const backendFormik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object(validate),
        onSubmit: values => {
            fetchData();
        },
    });

    const projectEffort = {
        options: {
            title: {
                text: 'Projects Effort Chart',
            },
            chart: {
                id: 'projectChart',
                width: '100%',
            },
            xaxis: {
                categories: report.project_effort.map((project) => {
                    return project.name;
                }),
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
        },
        datasets: [
            {
                name: "OnGoing Projects Effort",
                data: report.project_effort.map((project) => {
                    return project.users.reduce((acc, user) => {
                        return acc + user.tasks.reduce((acc, task) => {
                            return acc + +task.effort_task;
                        }, 0);
                    }, 0);
                }),
            },
            {
                name: "Estimate Projects Effort",
                data: report.project_effort.map((project) => {
                    return project.estimate;
                }),
            },
        ]
    };
    const frontendEffort = {
        options: {
            title: {
                text: 'Frontend Employee Effort Chart',
            },
            chart: {
                id: 'frontendChart',
                width: '100%',
            },
            xaxis: {
                categories: report.frontend_effort.map((user) => {
                    return user.full_name;
                }),
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
        },
        datasets: [
            {
                name: "Efforts",
                data: report.frontend_effort.map((users) => {
                    return users.tasks.reduce((acc, task) => {
                        return task.effort_task;
                    }, 0);
                }),
            },
        ],
    };

    const backendEffort = {
        options: {
            title: {
                text: 'Backend Employee Effort Chart',
            },
            chart: {
                id: 'backendChart',
            },
            xaxis: {
                categories: report.backend_effort.map((user) => {
                    return user.full_name;
                }),
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
        },
        datasets: [
            {
                name: "Efforts",
                data: report.backend_effort.map((users) => {
                    return users.tasks.reduce((acc, task) => {
                        return task.effort_task;
                    }, 0);
                }),
            },
        ],
    };

    useEffect(() => {
        fetchData();
    }, [report.active_tab]);

    const fetchData = () => {
        switch (report.active_tab) {
            case 0:
                fetchProjectData();
                break;
            case 1:
                fetchGroupData('frontend');
                break;
            case 2:
                fetchGroupData('backend');
                break;
            default:
                fetchProjectData();
                break;
        }
    }

    const fetchProjectData = () => {
        dispatch(fetchProjectEffort({
            from: format(new Date(projectFormik.values.from), 'yyyy-MM-dd'),
            to: format(new Date(projectFormik.values.to), 'yyyy-MM-dd'),
        }));
    };

    const fetchGroupData = (groupName) => {
        let from = groupName === 'backend' ? backendFormik.values.from : frontendFormik.values.from;
        let to = groupName === 'backend' ? backendFormik.values.to : frontendFormik.values.to;
        dispatch(fetchGroupEffort({
            group: groupName,
            from: format(new Date(from), 'yyyy-MM-dd'),
            to: format(new Date(to), 'yyyy-MM-dd')
        }));
    };

    function toggleTab(tabId) {
        dispatch(setActiveTab({active_tab: tabId}));
    }

    return (
        <>
            <Header isShowCard='0'/>
            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <Col>
                        {isLoading && <Overlay/>}
                        <Card>
                            <CardBody>
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            style={{cursor: 'pointer'}}
                                            className={classnames({active: report.active_tab === 0})}
                                            onClick={(e) => {
                                                toggleTab(0);
                                            }}
                                        >
                                            Projects
                                        </NavLink>
                                    </NavItem>
                                    {
                                        !isBackend && (
                                            <>
                                                <NavItem>
                                                    <NavLink
                                                        style={{cursor: 'pointer'}}
                                                        className={classnames({active: report.active_tab === 1})}
                                                        onClick={() => {
                                                            toggleTab(1);
                                                        }}
                                                    >
                                                        Frontends
                                                    </NavLink>
                                                </NavItem>
                                            </>
                                        )
                                    }
                                    {
                                        !isFrontend && (
                                            <>
                                                <NavItem>
                                                    <NavLink
                                                        style={{cursor: 'pointer'}}
                                                        className={classnames({active: report.active_tab === 2})}
                                                        onClick={() => {
                                                            toggleTab(2);
                                                        }}
                                                    >
                                                        Backends
                                                    </NavLink>
                                                </NavItem>
                                            </>
                                        )
                                    }
                                </Nav>
                                <TabContent activeTab={report.active_tab}>
                                    <TabPane tabId={0}>
                                        <Reports.ProjectTab data={projectEffort.datasets}
                                                            options={projectEffort.options}
                                                            formik={projectFormik}/>
                                    </TabPane>
                                    {
                                        !isBackend && (
                                            <>
                                                <TabPane tabId={1}>
                                                    <Reports.FrontendTab data={frontendEffort.datasets}
                                                                         options={frontendEffort.options}
                                                                         formik={frontendFormik}/>
                                                </TabPane>
                                            </>
                                        )
                                    }
                                    {
                                        !isFrontend && (
                                            <>
                                                <TabPane tabId={2}>
                                                    <Reports.BackendTab data={backendEffort.datasets}
                                                                        options={backendEffort.options}
                                                                        formik={backendFormik}/>
                                                </TabPane>
                                            </>
                                        )
                                    }
                                </TabContent>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Reports;

Reports.ProjectTab = (props) => {

    const {formik, data, options} = props;

    return (
        <>
            <Row className={'mt-3'}>
                <Col md={{offset: 4, size: 8,}}>
                    <Form role="form" onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col md={5}>
                                <FormGroup inline={true}>
                                    <Label className={'text-sm'}>From: </Label>
                                    <DateTime
                                        value={formik.values.from}
                                        closeOnSelect={true}
                                        timeFormat={false}
                                        dateFormat="YYYY-MM-DD"
                                        className="w-100"
                                        inputProps={{className: 'form-control-sm form-control-alternative w-100'}}
                                        onChange={(date) => {
                                            let from = date;
                                            if (isValid(date)) {
                                                from = format(new Date(date), 'yyyy-MM-dd');
                                            }
                                            formik.setFieldValue('from', from);
                                            formik.setFieldTouched('from', true, false);
                                        }}
                                    />
                                    {formik.errors.from && formik.touched.from && (
                                        <TextAlert text={formik.errors.from}/>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={5}>
                                <FormGroup inline={true}>
                                    <Label className={'text-sm'}>To: </Label>
                                    <DateTime
                                        value={formik.values.to}
                                        closeOnSelect={true}
                                        timeFormat={false}
                                        dateFormat="YYYY-MM-DD"
                                        className="w-100"
                                        inputProps={{className: 'form-control-sm form-control-alternative w-100'}}
                                        onChange={(date) => {
                                            let to = date;
                                            if (isValid(date)) {
                                                to = format(new Date(date), 'yyyy-MM-dd');
                                            }
                                            formik.setFieldValue('to', to);
                                            formik.setFieldTouched('to', true, false);
                                        }}
                                    />
                                    {formik.errors.to && formik.touched.to && (
                                        <TextAlert text={formik.errors.to}/>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <FormGroup inline={true}>
                                    <Button type={'submit'} size={'sm'}><i className="fas fa-search"/></Button>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Chart
                        options={options}
                        series={data}
                        type="line"
                        height="450"
                    />
                </Col>
            </Row>
        </>
    );
};

Reports.FrontendTab = (props) => {

    const {formik, data, options} = props;

    return (
        <>
            <Row className={'mt-3'}>
                <Col md={{offset: 4, size: 8,}}>
                    <Form role="form" onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col md={5}>
                                <FormGroup inline={true}>
                                    <Label className={'text-sm'}>From: </Label>
                                    <DateTime
                                        value={formik.values.from}
                                        closeOnSelect={true}
                                        timeFormat={false}
                                        dateFormat="YYYY-MM-DD"
                                        className="w-100"
                                        inputProps={{className: 'form-control-sm form-control-alternative w-100'}}
                                        onChange={(date) => {
                                            let from = date;
                                            if (isValid(date)) {
                                                from = format(new Date(date), 'yyyy-MM-dd');
                                            }
                                            formik.setFieldValue('from', from);
                                            formik.setFieldTouched('from', true, false);
                                        }}
                                    />
                                    {formik.errors.from && formik.touched.from && (
                                        <TextAlert text={formik.errors.from}/>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={5}>
                                <FormGroup inline={true}>
                                    <Label className={'text-sm'}>To: </Label>
                                    <DateTime
                                        value={formik.values.to}
                                        closeOnSelect={true}
                                        timeFormat={false}
                                        dateFormat="YYYY-MM-DD"
                                        className="w-100"
                                        inputProps={{className: 'form-control-sm form-control-alternative w-100'}}
                                        onChange={(date) => {
                                            let to = date;
                                            if (isValid(date)) {
                                                to = format(new Date(date), 'yyyy-MM-dd');
                                            }
                                            formik.setFieldValue('to', to);
                                            formik.setFieldTouched('to', true, false);
                                        }}
                                    />
                                    {formik.errors.to && formik.touched.to && (
                                        <TextAlert text={formik.errors.to}/>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <FormGroup inline={true}>
                                    <Button type={'submit'} size={'sm'}><i className="fas fa-search"/></Button>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Chart
                        options={options}
                        series={data}
                        type="line"
                        height="450"
                    />
                </Col>
            </Row>
        </>
    );
};

Reports.BackendTab = (props) => {

    const {formik, data, options} = props;

    return (
        <>
            <Row className={'mt-3'}>
                <Col md={{offset: 4, size: 8,}}>
                    <Form role="form" onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col md={5}>
                                <FormGroup inline={true}>
                                    <Label className={'text-sm'}>From: </Label>
                                    <DateTime
                                        value={formik.values.from}
                                        closeOnSelect={true}
                                        timeFormat={false}
                                        dateFormat="YYYY-MM-DD"
                                        className="w-100"
                                        inputProps={{className: 'form-control-sm form-control-alternative w-100'}}
                                        onChange={(date) => {
                                            let from = date;
                                            if (isValid(date)) {
                                                from = format(new Date(date), 'yyyy-MM-dd');
                                            }
                                            formik.setFieldValue('from', from);
                                            formik.setFieldTouched('from', true, false);
                                        }}
                                    />
                                    {formik.errors.from && formik.touched.from && (
                                        <TextAlert text={formik.errors.from}/>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={5}>
                                <FormGroup inline={true}>
                                    <Label className={'text-sm'}>To: </Label>
                                    <DateTime
                                        value={formik.values.to}
                                        closeOnSelect={true}
                                        timeFormat={false}
                                        dateFormat="YYYY-MM-DD"
                                        className="w-100"
                                        inputProps={{className: 'form-control-sm form-control-alternative w-100'}}
                                        onChange={(date) => {
                                            let to = date;
                                            if (isValid(date)) {
                                                to = format(new Date(date), 'yyyy-MM-dd');
                                            }
                                            formik.setFieldValue('to', to);
                                            formik.setFieldTouched('to', true, false);
                                        }}
                                    />
                                    {formik.errors.to && formik.touched.to && (
                                        <TextAlert text={formik.errors.to}/>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <FormGroup inline={true}>
                                    <Button type={'submit'} size={'sm'}><i className="fas fa-search"/></Button>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Chart
                        options={options}
                        series={data}
                        type="line"
                        height="450"
                    />
                </Col>
            </Row>
        </>
    );
};
