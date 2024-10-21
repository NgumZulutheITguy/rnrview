import axios from 'axios';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';  // Ensure DatePicker styling is available

function HomePage() {
    const [id, setId] = useState('');
    const [BreakdownReference, setReference] = useState('');
    const [CompanyName, setCompany] = useState('');
    const [DriverName, setDriver] = useState('');
    const [RegistrationNumber, setNumber] = useState('');
    const [BreakdownDate, setBreakdownDate] = useState(new Date());
    const [clients, setClients] = useState([]);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        const result = await axios.get("https://localhost:7205/api/Breakdown/GetBreakdown");
        setClients(result.data);
    };

    const save = async (event) => {
        event.preventDefault();
        try {
            await axios.post("https://localhost:7205/api/Breakdown/BreakdownPost", {
                BreakdownReference,
                CompanyName,
                DriverName,
                RegistrationNumber,
                BreakdownDate
            });
            alert("Breakdown Created Successfully");
            clearFields();
            loadClients();
        } catch (err) {
            alert(err.message);
        }
    };

    const update = async (event) => {
        event.preventDefault();
        try {
            await axios.patch(`https://localhost:7205/api/Breakdown/updateBreakdown/${id}`, {
                BreakdownReference,
                CompanyName,
                DriverName,
                RegistrationNumber,
                BreakdownDate
            });
            alert("Breakdown Updated");
            clearFields();
            loadClients();
        } catch (err) {
            alert(err.message);
        }
    };

    const editClient = (client) => {
        setId(client.id);
        setReference(client.BreakdownReference);
        setCompany(client.CompanyName);
        setDriver(client.DriverName);
        setNumber(client.RegistrationNumber);
        setBreakdownDate(new Date(client.BreakdownDate));
    };

    const clearFields = () => {
        setId("");
        setReference("");
        setCompany("");
        setDriver("");
        setNumber("");
        setBreakdownDate(new Date());
    };

    return (
        <div>
            <h1>Create A Breakdown</h1>
            <div className="container mt-4">
                <form onSubmit={event => event.preventDefault()}>
                    {/* Input fields */}
                    <div className="form-group">
                        <label>Breakdown Reference:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={BreakdownReference}
                            onChange={(e) => setReference(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Company Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={CompanyName}
                            onChange={(e) => setCompany(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Driver Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={DriverName}
                            onChange={(e) => setDriver(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Registration Number:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={RegistrationNumber}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Breakdown Date:</label>
                        <DatePicker
                            selected={BreakdownDate}
                            onChange={date => setBreakdownDate(date)}
                            className="form-control"
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            timeCaption="Time"
                        />
                    </div>
                    <button type="button" className="btn btn-success" onClick={save}>Create</button>
                    {id && <button type="button" className="btn btn-primary" onClick={update}>Update</button>}
                </form>
            </div>
            <div className="table-responsive">
                <table className="table table-dark">
                    <thead>
                        <tr>
                            <th>Breakdown Reference</th>
                            <th>Company Name</th>
                            <th>Driver Name</th>
                            <th>Registration Number</th>
                            <th>Breakdown Date</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>{client.BreakdownReference}</td>
                                <td>{client.CompanyName}</td>
                                <td>{client.DriverName}</td>
                                <td>{client.RegistrationNumber}</td>
                                <td>{new Date(client.BreakdownDate).toLocaleString()}</td>
                                <td>
                                    <button type="button" className="btn btn-warning" onClick={() => editClient(client)}>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HomePage;
