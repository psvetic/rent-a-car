import styles from "../styles/Home.module.css";
import Head from "next/head";
import {PrismaClient} from "@prisma/client";
import {useState} from "react";
import EditClientForm from "./forms/edit-client";

export default function Home(props) {
    const [editedClient, setEditedClient] = useState(null)
    const [clients, setClients] = useState(props.data)

    const deleteFromDatabase = async (values) => {
        const res = await fetch('api/delete-client', {
            method: 'DELETE',
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();

        setClients(clients.filter(client => client.id !== data.id));
    };

    function renderTableData() {
        return props.data.map((client, index) => {
            const { id, firstName, lastName, email, address, phoneNumber } = client
            return (
                <tr key={id}>
                    <td className={styles.tabletd}>{firstName}</td>
                    <td className={styles.tabletd}>{lastName}</td>
                    <td className={styles.tabletd}>{email}</td>
                    <td className={styles.tabletd}>{address}</td>
                    <td className={styles.tabletd}>{phoneNumber}</td>
                    <td><button onClick={() => setEditedClient(client)}>Edit</button></td>
                    <td><button onClick={() => deleteFromDatabase({id: id})}>Delete</button></td>
                </tr>
            )
        })
    }

    if (editedClient) {
        return <EditClientForm onCancel={() => setEditedClient(null)} data={editedClient}/>
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Vertigo</title>
                <meta name="description" content="Rent a car" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className="">Klijenti</h1>

                <div>
                    <table>
                        <tbody>
                        <tr >
                            <td className={styles.tablefirst}>first name</td>
                            <td className={styles.tablefirst}>last name</td>
                            <td className={styles.tablefirst}>email</td>
                            <td className={styles.tablefirst}>address</td>
                            <td className={styles.tablefirst}>phone nsumber</td>
                        </tr>
                        {renderTableData()}
                        </tbody>
                    </table>
                </div>

                <div>
                    <button onClick={() => setEditedClient('w')} className={styles.button}>Add new</button>
                    <button className={styles.button}><a href="/home">Home page</a></button>
                </div>


            </main>

        </div>
    )
}

export async function getServerSideProps() {
    const prisma = new PrismaClient()
    const allClients = await prisma.client.findMany()
    const data = JSON.parse(JSON.stringify(allClients))
    return {
        props : { data }
    }
}