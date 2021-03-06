import styles from "../../styles/Home.module.css";
import Head from "next/head";
import React, {useEffect, useState} from 'react';
import { useFormik } from 'formik';
import {PrismaClient} from "@prisma/client";
import useError from "../../context/error/error";

export default function EditContractForm({onCancel, data}) {
    const [selected, setSelected] = useState(null)
    const [clients, setClients] = useState(null)
    const [vehicles, setVehicles] = useState(null)
    const [workers, setWorkers] = useState(null)
    const [price, setPrice] = useState(0)

    const {setErrorMessage, setErrorVisible} = useError();

    useEffect(() => {
        if (data) {
            setSelected(data.validated)
            setClients(data.clients)
            setVehicles(data.vehicles)
            setWorkers(data.workers)
        }
    }, [data])

    const createNewEntry = async (values) => {
        return new Promise(((resolve, reject) => {
            fetch('/api/new-contract', {
                method: 'POST',
                body: JSON.stringify({...values, price: price}),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
                .then(data => resolve(data))
                .catch(e => reject(e))
        }))
    };

    const saveChanges = async (values) => {
        return new Promise(((resolve, reject) => {
            fetch('/api/edit-contract', {
                method: 'PUT',
                body: JSON.stringify({...values, price: price}),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
                .then(data => resolve(data))
                .catch(e => reject(e))
        }))
    };

    const modifyVehicle = async (values) => {
        const res = await fetch('/api/edit-vehicle-rented', {
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

        if (!values.clientId) {
            errors.clientId = 'Required';
        }

        if (!values.vehicleId) {
            errors.vehicleId = 'Required';
        }

        if (!values.workerId) {
            errors.workerId = 'Required';
        }

        if (!values.rentedFrom) {
            errors.rentedFrom = 'Required';
        }

        if (!values.rentedUntil) {
            errors.rentedUntil = 'Required';
        }

        // dates
        let dateRentedFrom = new Date(values.rentedFrom)
        dateRentedFrom = dateRentedFrom.getTime()
        let dateRentedUntil = new Date(values.rentedUntil)
        dateRentedUntil = dateRentedUntil.getTime()

        if (dateRentedFrom > dateRentedUntil) {
            errors.rentedFrom = 'Datum "od" mora biti prije datuma "do"';
            errors.rentedUntil = 'Datum "do" mora biti nakon datuma "od"';
        }

        return errors;
    };
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: selected && selected.id ? selected.id : '',
            clientId: selected && selected.clientId ? selected.clientId : '',
            vehicleId: selected && selected.vehicleId ? selected.vehicleId : '',
            workerId: selected && selected.workerId ? selected.workerId : '',
            rentedFrom: selected && selected.rentedFrom ? selected.rentedFrom.substr(0,10) : '',
            rentedUntil: selected && selected.rentedUntil ? selected.rentedUntil.substr(0,10) : '',
            openReturn: selected && selected.openReturn ? selected.openReturn : false,
            insurance: selected && selected.insurance ? selected.insurance : false,
            price: selected && selected.price ? selected.price : 0
        },
        validate,
        onSubmit: values => {
            //alert(JSON.stringify(values, null, 2));
            if (selected !== 'w') {
                formik.values.price = price
                saveChanges(values).then(r => {
                    setErrorMessage("Uspjesno napravljeno")
                    setErrorVisible(true)
                    setTimeout(() => {window.location.reload()}, 1000);
                }).catch(e => {
                    setErrorMessage(e.message)
                    setErrorVisible(true)
                });
            } else {
                createNewEntry(values).then(r => {
                    setErrorMessage("Uspjesno napravljeno")
                    setErrorVisible(true)
                    setTimeout(() => {window.location.reload()}, 1000);
                }).catch(e => {
                    setErrorMessage(e.message)
                    setErrorVisible(true)
                });
            }
        },
    });



    useEffect(() => {
        calculatePrice()
    }, [formik.values && JSON.stringify(formik.values)])

    const disablePastDate = () => {
        const today = new Date();
        const dd = String(today.getDate() + 1).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        const yyyy = today.getFullYear();
        return yyyy + "-" + mm + "-" + dd;
    };

    function calculatePrice() {
        if(!vehicles || !formik) {
            return
        }

        let vehiclePricePerDay = 0

        for (let i=0; i<vehicles.length; i++) {
            if (vehicles[i].id == formik.values.vehicleId) {
                vehiclePricePerDay = vehicles[i].price
            }
        }

        let dateFrom = new Date(formik.values.rentedFrom).getTime()
        let dateUntil = new Date(formik.values.rentedUntil).getTime()
        let diff = dateUntil - dateFrom
        let diffInH = diff  / 3600000
        let diffInDays = diffInH / 24

        let premiumInsurance = 0
        let openReturn = 0
        let discount = 1

        if (diffInDays > 7) {
            discount = 0.9
        }

        if (formik.values.insurance) {
            premiumInsurance = 300
        }
        if (formik.values.openReturn) {
            openReturn = 100
        }

        setPrice(diffInDays * (vehiclePricePerDay * discount) + premiumInsurance + openReturn)
        formik.values.price = price
    };

    function renderClientData() {

        return clients && clients.map((client, i) => {
            const { id, firstName, lastName } = client
            return (
                <option key={id} value={id}>{firstName} {lastName}</option>
            )
        })
    }

    function renderVehicleData() {

        return vehicles && vehicles.map((vehicle, i) => {
            const { id, make, model, year, plates } = vehicle
            return (
                <option key={id} value={id}>{make} {model} {year}</option>
            )
        })
    }

    function renderWorkerData() {

        return workers && workers.map((worker, i) => {
            const { id, firstName, lastName } = worker
            return (
                <option key={id} value={id}>{firstName} {lastName}</option>
            )
        })
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Vertigo</title>
                <meta name="description" content="Rent a car" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.titles}>Podaci ugovora</h1>

                <form onSubmit={formik.handleSubmit}>

                    <div className={styles.forms}>
                        <label htmlFor="clientId">Klijent</label>
                        <select
                            id="clientId"
                            name="clientId"
                            onChange={formik.handleChange}
                            value={formik.values.clientId}
                            className={styles.input} >
                            <option value=""/>
                            {renderClientData()}
                        </select>
                    </div>
                    {formik.errors.clientId ? <div className={styles.error}>{formik.errors.clientId}</div> : null}

                    <div className={styles.forms}>
                        <label htmlFor="vehicleId">Vozilo</label>
                        <select
                            id="vehicleId"
                            name="vehicleId"
                            onChange={formik.handleChange}
                            value={formik.values.vehicleId}
                            className={styles.input} >
                            <option value=""/>
                            {renderVehicleData()}
                        </select>
                    </div>
                    {formik.errors.vehicleId ? <div className={styles.error}>{formik.errors.vehicleId}</div> : null}

                    <div className={styles.forms}>
                        <label htmlFor="workerId">Zaposlenik</label>
                        <select
                            id="workerId"
                            name="workerId"
                            onChange={formik.handleChange}
                            value={formik.values.workerId}
                            className={styles.input} >
                            <option value=""/>
                            {renderWorkerData()}
                        </select>
                    </div>
                    {formik.errors.workerId ? <div className={styles.error}>{formik.errors.workerId}</div> : null}



                    <div className={styles.forms}>
                        <label htmlFor="rentedFrom">Iznajmljeno od</label>
                        <input
                            className={styles.input}
                            id="rentedFrom"
                            name="rentedFrom"
                            type="date"
                            min={disablePastDate()}
                            onChange={formik.handleChange}
                            value={formik.values.rentedFrom}
                        />
                    </div>
                    {formik.errors.rentedFrom ? <div className={styles.error}>{formik.errors.rentedFrom}</div> : null}

                    <div className={styles.forms}>
                        <label htmlFor="rentedUntil">Iznajmljeno do</label>
                        <input
                            className={styles.input}
                            id="rentedUntil"
                            name="rentedUntil"
                            type="date"
                            min={disablePastDate()}
                            onChange={formik.handleChange}
                            value={formik.values.rentedUntil}
                        />
                    </div>
                    {formik.errors.rentedUntil ? <div className={styles.error}>{formik.errors.rentedUntil}</div> : null}

                    <div className={styles.forms}>
                        <label htmlFor="openReturn">Povrat izvan poslovnice</label>
                        <input
                            className={styles.formCheckbox}
                            id="openReturn"
                            name="openReturn"
                            type="checkbox"
                            onChange={formik.handleChange}
                            value={formik.values.openReturn}
                            checked={formik.values.openReturn}
                        />
                    </div>
                    {formik.errors.openReturn ? <div className={styles.error}>{formik.errors.openReturn}</div> : null}

                    <div className={styles.forms}>
                        <label htmlFor="insurance">Dodatno osiguranje</label>
                        <input
                            className={styles.formCheckbox}
                            id="insurance"
                            name="insurance"
                            type="checkbox"
                            onChange={formik.handleChange}
                            value={formik.values.insurance}
                            checked={formik.values.insurance}
                        />
                    </div>
                    {formik.errors.insurance ? <div className={styles.error}>{formik.errors.insurance}</div> : null}

                    <div className={styles.forms}>
                        <label htmlFor="price">Cijena najma</label>
                        <input
                            className={styles.input}
                            id="price"
                            name="price"
                            type="text"
                            disabled={true}
                            value={price}
                        />
                    </div>
                    {formik.errors.price ? <div className={styles.error}>{formik.errors.price}</div> : null}

                    <button className={styles.button} type="submit">OK</button>
                    <button className={styles.buttonCancel} onClick={() => onCancel()}>Odustani</button>

                </form>
            </main>
        </div>
    );
};

