import styles from "../../styles/Home.module.css";
import Head from "next/head";
import React, {useState} from 'react';
import { useFormik } from 'formik';

export default function EditWorkerForm({onCancel, data}) {
    const [selected, setSelected] = useState(data)

    const createNewEntry = async (values) => {
        const res = await fetch('/api/new-worker', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();
    };

    const saveChanges = async (values) => {
        const res = await fetch('/api/edit-worker', {
            method: 'PUT',
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();
    };

    const validate = values => {
        const errors = {};

        if (!values.role) {
            errors.role = 'Required';
        }

        if (!values.username) {
            errors.username = 'Required';
        } else if (values.username.length < 8) {
            errors.username = 'Must be 8 characters or more';
        }

        if (!values.email) {
            errors.email = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }

        if (!values.password) {
            errors.password = 'Required';
        } else if (values.password.length < 8) {
            errors.password = 'Must be 8 characters or more';
        }

        return errors;
    };
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            id: selected.id ? selected.id : '',
            role: selected.role ? selected.role : '',
            username: selected.username ? selected.username : '',
            email: selected.email ? selected.email : '',
            password: selected.password ? selected.password : '',
            firstName: selected.firstName ? selected.firstName : '',
            lastName: selected.lastName ? selected.lastName : '',
            oib: selected.oib ? selected.oib : '',
            address: selected.address ? selected.address : '',
            phoneNumber: selected.phoneNumber ? selected.phoneNumber : '',
            dateOfBirth: selected.dateOfBirth ? selected.dateOfBirth : '',
            pay: selected.pay ? selected.pay : ''
        },
        validate,
        onSubmit: values => {
            //alert(JSON.stringify(values, null, 2));
            if (selected !== 'w') {
                saveChanges(values);
            } else {
                createNewEntry(values);
            }
        },
    });
    return (
        <div className={styles.container}>
            <Head>
                <title>Vertigo</title>
                <meta name="description" content="Rent a car" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className="">Podaci o zaposleniku</h1>

                <form onSubmit={formik.handleSubmit}>

                    <div className={styles.forms}>
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            onChange={formik.handleChange}
                            value={formik.values.role}
                            className={styles.input} >
                            <option value=""/>
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>
                    {formik.errors.role ? <div className={styles.error}>{formik.errors.role}</div> : null}

                    <div className={styles.forms}>
                        <label htmlFor="username">Username</label>
                        <input
                            className={styles.input}
                            id="username"
                            name="username"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                        />
                    </div>
                    {formik.errors.username ? <div className={styles.error}>{formik.errors.username}</div> : null}

                    <div className={styles.forms}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            className={styles.input}
                            id="email"
                            name="email"
                            type="email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                        />
                    </div>
                    {formik.errors.email ? <div className={styles.error}>{formik.errors.email}</div> : null}

                    <div className={styles.forms}>
                        <label htmlFor="password">Password</label>
                        <input
                            className={styles.input}
                            id="password"
                            name="password"
                            type="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                        />
                    </div>
                    {formik.errors.password ? <div className={styles.error}>{formik.errors.password}</div> : null}

                    <div className={styles.forms}>
                        <label htmlFor="firstName">First Name</label>
                        <input
                            className={styles.input}
                            id="firstName"
                            name="firstName"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.firstName}
                        />
                    </div>

                    <div className={styles.forms}>
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            className={styles.input}
                            id="lastName"
                            name="lastName"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.lastName}
                        />
                    </div>

                    <div className={styles.forms}>
                        <label htmlFor="oib">OIB</label>
                        <input
                            className={styles.input}
                            id="oib"
                            name="oib"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.oib}
                        />
                    </div>

                    <div className={styles.forms}>
                        <label htmlFor="address">Address</label>
                        <input
                            className={styles.input}
                            id="address"
                            name="address"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.address}
                        />
                    </div>

                    <div className={styles.forms}>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            className={styles.input}
                            id="phoneNumber"
                            name="phoneNumber"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.phoneNumber}
                        />
                    </div>

                    <div className={styles.forms}>
                        <label htmlFor="dateOfBirth">Date of birth</label>
                        <input
                            className={styles.input}
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            onChange={formik.handleChange}
                            value={formik.values.dateOfBirth}
                        />
                    </div>

                    <div className={styles.forms}>
                        <label htmlFor="pay">Pay</label>
                        <input
                            className={styles.input}
                            id="pay"
                            name="pay"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.pay}
                        />
                    </div>

                    <button className={styles.button} type="submit">Submit</button>
                    <button className={styles.button} onClick={() => onCancel()}>Cancel</button>

                </form>
            </main>
        </div>
    );
};

