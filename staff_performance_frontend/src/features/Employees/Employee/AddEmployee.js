import React, {useEffect, useRef} from "react";
import Header from "../../../components/Headers/Header";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Container,
    Form,
    FormGroup,
    Input, InputGroup, InputGroupAddon, InputGroupText,
    Label, Media, Row
} from "reactstrap";
import TextAlert from "../../../components/TextAlert/TextAlert";
import {useFormik} from "formik";
import * as Yup from "yup";
import {history} from "../../../helper/history";
import DateTime from "react-datetime";

//Services
import {fetchAddUser, fetchGroupRole} from "./EmployeeService";
import {useDispatch, useSelector} from "react-redux";
import {
    addUserFail,
    getGroupRoleFail,
    setGroupRole,
    addUserSuccess,
    setPreview, endRequest
} from "./EmployeeSlice";
import {getPreview} from "../../../helper/images";
import MASTER from "../../../constants/master";
import Overlay from "../../../components/Overlay/Overlay";
import {isValid, format} from "date-fns";

export default function AddEmployee() {

    const employee = useSelector(state => state.employee);
    const isLoading = useSelector(state => state.app.isLoading);
    const dispatch = useDispatch();
    const default_avatar = require("../../../assets/img/theme/team-1-800x800.jpg").default;
    const avatarUpload = useRef();

    const formik = useFormik({
        initialValues: {
            full_name: '',
            email: '',
            password: '',
            confirm: '',
            dob: '',
            phone: '',
            salary: '',
            pay_per_hour: '',
            group_id: '',
            role_id: '',
            avatar: '',
        },
        validationSchema: Yup.object({
            full_name: Yup.string()
                .max(255, "Maximum 255 characters.")
                .required("This field is required."),
            email: Yup.string()
                .email("Email is invalid.")
                .required("This field is required."),
            password: Yup.string()
                .min(8, "Password required minimum 8 characters.")
                .max(32, "Password required maximum 32 characters.")
                .required("This field is required."),
            confirm: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required("This field is required."),
            dob: Yup.date()
                .required("This field is required.")
                .typeError("This field require date value."),
            phone: Yup.string()
                .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Phone number invalid format.")
                .required("This field is required."),
            salary: Yup.number("Invalid value.")
                .min(0, "Invalid value.")
                .required("This field is required.")
                .typeError("This field require number value."),
            pay_per_hour: Yup.number()
                .min(0, "Invalid value.")
                .required("This field is required.")
                .typeError("This field require number value."),
            group_id: Yup.number()
                .required("This field is required.")
                .typeError("This field is invalid value."),
            role_id: Yup.number()
                .required("This field is required.")
                .typeError("This field is invalid value."),
            avatar: Yup.mixed()
                .test('fileSize', 'The size of this file too large.', value => {
                    if (value === undefined) {
                        return true;
                    } else {
                        return (value.size / 1048576) <= MASTER.AVATAR.FILE_SIZE;
                    }
                })
                .test('fileMimes', 'Only allow these file type: ' + MASTER.AVATAR.FILE_MIMES, value => {
                    if (value === undefined) {
                        return true;
                    } else {
                        return MASTER.AVATAR.FILE_MIMES.includes(value.name.split('.').pop());
                    }
                }),
        }),
        onSubmit: values => {
            fetchAddUser(values)
                .then(response => {
                    if (response.data.status === 201) {
                        dispatch(addUserSuccess());
                        formik.resetForm();
                        avatarUpload.current.value = "";
                        dispatch(setPreview({preview: default_avatar}))
                        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                    }
                })
                .catch((error) => {
                    if(error && error.response) {
                        dispatch(addUserFail());
                        if (error.response.data.status === 422) {
                            for (const [field, error] of Object.entries(error.response.data.errors)) {
                                formik.setFieldError(field, error[0]);
                            }
                        }
                    }
                });
        },
    });

    useEffect(() => {
        dispatch(setPreview({preview: default_avatar}));
        fetchGroupRole()
            .then(response => {
                if (response.data.status === 200) {
                    dispatch(setGroupRole({groups: response.data.data.groups, roles: response.data.data.roles}));
                } else {
                    dispatch(getGroupRoleFail())
                }
            });
    }, []);

    function handlePreview(fileUpload) {
        let src = getPreview(fileUpload);
        if (src !== null) {
            dispatch(setPreview({preview: src}));
        }
    }

    return (
        <>
            <Header isShowCard={0}/>
            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <Col className="col">
                        {isLoading && <Overlay/>}
                        <Card className="shadow">
                            <Form role="form" onSubmit={formik.handleSubmit}>
                                <CardHeader className="border-0">
                                    <h3 className="mb-0">Add Employee</h3>
                                </CardHeader>
                                <CardBody>
                                    <Row className="col-12">
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="full_name">Full Name:</Label>
                                                <Input
                                                    autoFocus={true}
                                                    id="full_name"
                                                    className="form-control-alternative"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.full_name}/>
                                                {formik.errors.full_name && formik.touched.full_name && (
                                                    <TextAlert text={formik.errors.full_name}/>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="email">Email:</Label>
                                                <Input
                                                    id="email"
                                                    className="form-control-alternative"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.email}/>
                                                {formik.errors.email && formik.touched.email && (
                                                    <TextAlert text={formik.errors.email}/>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="password">Password:</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    className="form-control-alternative"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.password}/>
                                                {formik.errors.password && formik.touched.password && (
                                                    <TextAlert text={formik.errors.password}/>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="confirm">Confirm Password:</Label>
                                                <Input
                                                    id="confirm"
                                                    type="password"
                                                    className="form-control-alternative"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.confirm}/>
                                                {formik.errors.confirm && formik.touched.confirm && (
                                                    <TextAlert text={formik.errors.confirm}/>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="dob">Birthday</Label>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58"/>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <DateTime
                                                        closeOnSelect={true}
                                                        timeFormat={false}
                                                        id="dob"
                                                        dateFormat="YYYY-MM-DD"
                                                        className="form-control-alternative"
                                                        onChange={(date) => {
                                                            let dob = date;
                                                            if (isValid(date)) {
                                                                dob = format(date, 'yyyy-MM-dd');
                                                            }
                                                            formik.setFieldValue('dob', dob);
                                                            formik.setFieldTouched('dob', true, false);
                                                        }}
                                                        value={formik.values.dob}
                                                    />
                                                </InputGroup>
                                                {formik.errors.dob && formik.touched.dob && (
                                                    <TextAlert text={formik.errors.dob}/>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="phone">Phone number:</Label>
                                                <Input
                                                    id="phone"
                                                    className="form-control-alternative"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.phone}/>
                                                {formik.errors.phone && formik.touched.phone && (
                                                    <TextAlert text={formik.errors.phone}/>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="salary">Salary:</Label>
                                                <Input
                                                    id="salary"
                                                    className="form-control-alternative"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.salary}/>
                                                {formik.errors.salary && formik.touched.salary && (
                                                    <TextAlert text={formik.errors.salary}/>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="pay_per_hour">Pay per hour:</Label>
                                                <Input
                                                    id="pay_per_hour"
                                                    className="form-control-alternative"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.pay_per_hour}/>
                                                {formik.errors.pay_per_hour && formik.touched.pay_per_hour && (
                                                    <TextAlert text={formik.errors.pay_per_hour}/>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="group_id">Group:</Label>
                                                <Input
                                                    type="select"
                                                    id="group_id"
                                                    className="form-control-alternative"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.group_id}>
                                                    <option value="" disabled={true}></option>
                                                    {
                                                        employee.groups.map(group => {
                                                            return (<option key={group.id}
                                                                            value={group.id}>{group.name}</option>);
                                                        })
                                                    }
                                                </Input>
                                                {formik.errors.group_id && formik.touched.group_id && (
                                                    <TextAlert text={formik.errors.group_id}/>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="role_id">Role:</Label>
                                                <Input
                                                    type="select"
                                                    id="role_id"
                                                    className="form-control-alternative"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.role_id}>
                                                    <option value="" disabled={true}></option>
                                                    {
                                                        employee.roles.map(role => {
                                                            return (<option key={role.id}
                                                                            value={role.id}>{role.name}</option>);
                                                        })
                                                    }
                                                </Input>
                                                {formik.errors.role_id && formik.touched.role_id && (
                                                    <TextAlert text={formik.errors.role_id}/>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <Row>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="avatar">Avatar:</Label>
                                                        <Input
                                                            innerRef={avatarUpload}
                                                            accept=".png, .jpg, .jpeg"
                                                            type="file"
                                                            id="avatar"
                                                            onChange={(e) => {
                                                                formik.setFieldValue('avatar', e.currentTarget.files[0]);
                                                                formik.setFieldTouched('avatar', true, false);
                                                                handlePreview(e.target);
                                                            }}>
                                                        </Input>
                                                        {formik.errors.avatar && formik.touched.avatar && (
                                                            <TextAlert text={formik.errors.avatar}/>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <Media>
                                                        <img className="preview-avatar rounded-circle" alt="Avatar"
                                                             src={employee.preview}/>
                                                    </Media>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Button disabled={employee.is_loading} color="primary" type="submit">
                                        Save
                                    </Button>
                                    <Button onClick={() => {
                                        history.goBack()
                                    }} className="float-right" color="danger" type="button">
                                        Cancel
                                    </Button>
                                </CardFooter>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
