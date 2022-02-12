import React, {useEffect, useState} from 'react'
import {
    Card,
    CardHeader,
    Form,
    FormGroup,
    Label,
    Input,
    Container,
    Row,
    Button,
    CardBody,
    Col,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import "react-datetime/css/react-datetime.css";
import Select from 'react-select'
import ReactDatetime from "react-datetime";
import {Link, useLocation, useParams} from 'react-router-dom';
import {editProject, getAllUser, storeProject, updateProject} from './projectsService';
import {useFormik} from 'formik';
import * as Yup from "yup";
import TextAlert from 'components/TextAlert/TextAlert';
import {history} from '../../helper/history';
import {STATUS} from 'constants/projectApi';
import {useSelector} from "react-redux";
import useAuth from "../../helper/authHelper";
import Overlay from "../../components/Overlay/Overlay";

export default function FormProject() {

    const {id} = useParams();
    const {isAdmin} = useAuth();
    const location = useLocation();
    const isLoading = useSelector(state => state.app.isLoading);
    const [optionUsers, setOptionUsers] = useState([]);
    const [projectEdit, setProjectEdit] = useState({
        name: '',
        estimate: '',
        start_date: '',
        end_date: '',
        leader_id: '',
        users_id: [],
    });
    let yupObject = {
        name: Yup.string()
            .required("Required Field!"),
        estimate: Yup.number()
            .min(0, "The value must be greater than 0")
            .required("Required Field!"),
        start_date: Yup.date()
            .required('Required Field!'),
        end_date: Yup.date()
            .required('Required Field!'),
        users_id: Yup.array()
            .min(1, 'Required Field!'),
    };
    if (isAdmin) {
        yupObject.leader_id = Yup.mixed().required('Required Field!');
    }
    const [YupProject, setYupProject] = useState(yupObject);
    // const [Leader, setLeader] = useState({});
    // const [Users, setUsers] = useState([]);

    useEffect(() => {
        let OPT_SELECTED = [];
        const fetchUser = () => {
            getAllUser()
                .then(response => {
                    response.data.data.forEach(item => {
                        OPT_SELECTED = [...OPT_SELECTED, ...item.options];
                    });
                    setOptionUsers(response.data.data);
                })
        }

        fetchUser();
        if (id !== undefined) {
            editProject(id)
                .then(
                    data_project => {
                        let validations = {
                            name: Yup.string()
                                .required("Required Field!"),
                            estimate: Yup.number()
                                .positive("The Value Must Positive Number!")
                                .required("Required Field!"),
                            start_date: Yup.date()
                                .required('Required Field!'),
                            end_date: Yup.date()
                                .required('Required Field!'),
                            users_id: Yup.array()
                                .required('Required Field!'),
                            status: Yup.string()
                                .required("Required Field!"),
                        };

                        let dataForm = {
                            ...data_project.data.data,
                        }
                        if (isAdmin) {
                            dataForm.leader_id = OPT_SELECTED.filter(item => item.value === data_project.data.data.leader_id)[0];
                            validations.leader_id = Yup.mixed()
                                .required('Required Field!');
                        }
                        dataForm.users_id = OPT_SELECTED.filter(item => data_project.data.data.users_id.indexOf(item.value) !== -1);
                        setProjectEdit(dataForm);
                        setYupProject(validations);
                    }
                ).catch(
                error => {

                }
            );
        }
    }, []);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: projectEdit,
        validationSchema: Yup.object(YupProject),
        onSubmit: values => {
            let dataObj = {
                ...values,
                users_id: values.users_id.map(item => item.value),
            }
            if (isAdmin) {
                dataObj.leader_id = values.leader_id.value;
            }
            if (id === undefined) {
                storeProject(dataObj)
                    .then(response => {
                        history.push('/admin/projects-management')
                    }).catch(errors => {
                });
            } else {
                updateProject(id, dataObj)
                    .then(response => {
                        let from = location.state ? location.state.from : '/admin/projects-management';
                        history.push(`${from}`)
                    }).catch(errors => {
                });
            }
        }
    });

    const startDate = {
        placeholder: 'Start Date',
        name: 'start_date',
        className: 'form-control-alternative form-control',
    };

    const endDate = {
        placeholder: 'End Date',
        name: 'end_date',
        className: 'form-control-alternative form-control',
    };

    const handleSelectLeader = (obj, actionMeta) => {
        formik.setFieldValue('leader_id', obj);
    }

    const handleSelectUser = (objs) => {
        formik.setFieldValue('users_id', objs);
    }

    return (
        <>
            <Header isShowCard='0'/>
            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                {isLoading && <Overlay/>}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-bottom-2 d-flex align-items-center">
                                <h3 className="mb-0">{id === undefined ? 'Add Project' : 'Edit Project'}</h3>
                            </CardHeader>
                            <CardBody>
                                <Form role="form" onSubmit={formik.handleSubmit}>
                                    <h6 className="heading-small text-muted mb-4">
                                        Project Information
                                    </h6>
                                    <FormGroup>
                                        <Label className="form-control-label">Name</Label>
                                        <Input className="form-control-alternative" type="text" name="name"
                                               placeholder="Name"
                                               onChange={formik.handleChange}
                                               value={formik.values.name}
                                        />
                                    </FormGroup>
                                    {formik.errors.name && formik.touched.name && (
                                        <TextAlert text={formik.errors.name}/>
                                    )}
                                    <FormGroup>
                                        <Label className="form-control-label">Estimate (hour)</Label>
                                        <Input className="form-control-alternative" type="number" name="estimate"
                                               placeholder="Estimate Project" min='0'
                                               onChange={formik.handleChange}
                                               value={formik.values.estimate}
                                        />
                                    </FormGroup>
                                    {formik.errors.estimate && formik.touched.estimate && (
                                        <TextAlert text={formik.errors.estimate}/>
                                    )}
                                    <Row form>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label className="form-control-label">Start Date</Label>
                                                <InputGroup className="input-group-alternative">
                                                    <ReactDatetime inputProps={startDate} closeOnSelect={true}
                                                                   dateFormat='YYYY-MM-DD' timeFormat={false}
                                                                   onChange={(date) => {
                                                                       formik.handleChange('start_date');
                                                                       formik.setFieldValue('start_date', date.format('YYYY-MM-DD'));
                                                                   }}
                                                                   value={formik.values.start_date}
                                                    />
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58"/>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </FormGroup>
                                            {formik.errors.start_date && formik.touched.start_date && (
                                                <TextAlert text={formik.errors.start_date}/>
                                            )}
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label className="form-control-label">End Date</Label>
                                                <InputGroup className="input-group-alternative">
                                                    <ReactDatetime inputProps={endDate} closeOnSelect={true}
                                                                   dateFormat='YYYY-MM-DD' timeFormat={false}
                                                                   onChange={(date) => {
                                                                       formik.handleChange('end_date');
                                                                       formik.setFieldValue('end_date', date.format('YYYY-MM-DD'));
                                                                   }}
                                                                   value={formik.values.end_date}
                                                    />
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58"/>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </FormGroup>
                                            {formik.errors.end_date && formik.touched.end_date && (
                                                <TextAlert text={formik.errors.end_date}/>
                                            )}
                                        </Col>
                                    </Row>
                                    {
                                        id !== undefined ? (
                                            <>
                                                <FormGroup>
                                                    <Label className="form-control-label">Status</Label>
                                                    <select name="status" onChange={formik.handleChange}
                                                            value={formik.values.status}
                                                            className='form-control-alternative form-control text-capitalize'>
                                                        {
                                                            STATUS.map((item, key) => {
                                                                return (<option value={item} key={key}>{item}</option>)
                                                            })
                                                        }
                                                    </select>
                                                </FormGroup>
                                                {formik.errors.status && formik.touched.status && (
                                                    <TextAlert text={formik.errors.status}/>
                                                )}
                                            </>
                                        ) : null
                                    }
                                    {
                                        isAdmin &&
                                        (
                                            <>
                                                <hr className="my-4"/>
                                                <h6 className="heading-small text-muted mb-4">
                                                    Member of Project
                                                </h6>
                                                <FormGroup>
                                                    <Label className="form-control-label">Project Leader</Label>
                                                    <Select name="leader_id" options={optionUsers}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            isOptionDisabled={(option) => ((formik.values.users_id.map((item) => item.value)).indexOf(option.value) !== -1)}
                                                            onChange={handleSelectLeader}
                                                            value={formik.values.leader_id}
                                                    />
                                                </FormGroup>
                                                {formik.errors.leader_id && formik.touched.leader_id && (
                                                    <TextAlert text={formik.errors.leader_id}/>
                                                )}
                                            </>
                                        )
                                    }
                                    <FormGroup>
                                        <Label className="form-control-label">Project Users</Label>
                                        <Select name="users_id" options={optionUsers} isMulti
                                                className="basic-multi-select" classNamePrefix="select"
                                                isOptionDisabled={(option) => {
                                                    return formik.values.leader_id.value ? formik.values.leader_id.value === option.value : false
                                                }} onChange={handleSelectUser}
                                                value={formik.values.users_id}
                                        />
                                    </FormGroup>
                                    {formik.errors.users_id && formik.touched.users_id && (
                                        <TextAlert text={formik.errors.users_id}/>
                                    )}
                                    <div className='d-flex justify-content-between '>
                                        <Button type="submit"
                                                color='primary'>{id === undefined ? 'Add Project' : 'Update Project'}</Button>
                                        <Link className='btn btn-danger'
                                              to={location.state ? location.state.from : '/admin/projects-management'}>Back</Link>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    )
}
