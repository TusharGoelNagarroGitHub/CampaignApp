import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'react-bootstrap';

function CampaignList() {
    const campaignarr = useRef([
        { id: 1, name: "Divavu", startDate: "9/19/2017", endDate: "9/9/2024", Budget: 88377, userId: 3 },
        { id: 2, name: "Jaxspan", startDate: "11/21/2017", endDate: "2/21/2024", Budget: 608715, userId: 6 },
        { id: 3, name: "Miboo", startDate: "11/1/2017", endDate: "6/20/2024", Budget: 239507, userId: 7 },
        { id: 4, name: "Trilith", startDate: "8/25/2024", endDate: "11/30/2027", Budget: 179838, userId: 1 },
        { id: 5, name: "Layo", startDate: "11/28/2017", endDate: "3/10/2018", Budget: 837850, userId: 9 },
        { id: 6, name: "Photojam", startDate: "7/25/2017", endDate: "6/23/2017", Budget: 858131, userId: 3 },
        { id: 7, name: "Blogtag", startDate: "6/27/2017", endDate: "1/15/2018", Budget: 109078, userId: 2 },
        { id: 8, name: "Rhyzio", startDate: "10/13/2017", endDate: "1/25/2018", Budget: 272552, userId: 4 },
        { id: 9, name: "Zoomcast", startDate: "9/6/2017", endDate: "11/10/2017", Budget: 301919, userId: 8 },
        { id: 10, name: "Realbridge", startDate: "3/5/2018", endDate: "10/2/2017", Budget: 505602, userId: 5 }
    ]);

    const [data, setData] = useState([]);
    const [inputStartDate, setInputStartDate] = useState('');
    const [inputEndDate, setInputEndDate] = useState('');
    const [inputName, setInputName] = useState('');
    const [filteredCampaigns, setFilteredCampaigns] = useState(campaignarr.current);

    useEffect(() => {
        const fetchData = async () => {
            try{
            const userapi = 'https://jsonplaceholder.typicode.com/users';
            let result = await fetch(userapi);
            result = await result.json();
            setData(result);}
            catch(error)
            {
                alert('Error from api')
            }
        };

        fetchData();
        window.AddCampaigns = (obj) => {
            console.log('Received object:', obj);
            campaignarr.current.push(obj);
            setFilteredCampaigns([...campaignarr.current]);
        };

        return () => {
            delete window.AddCampaigns;
        };
    }, []);

    const search = () => {
        
        if (!inputStartDate && !inputEndDate && !inputName) {
            setFilteredCampaigns(campaignarr.current); 
            return; 
        }

        const startDate = inputStartDate ? new Date(inputStartDate) : null;
        const endDate = inputEndDate ? new Date(inputEndDate) : null;

        if (startDate && endDate && endDate < startDate) {
            alert("End date cannot be less than Start Date");
            return;
        }

        if ((startDate || endDate) && !inputName) {
            alert("Enter both dates if name search is empty");
            return;
        }

        const filtered = campaignarr.current.filter((item) => {
            const itemStartDate = new Date(item.startDate);
            const itemEndDate = new Date(item.endDate);
            const withinDateRange =
                (startDate && itemStartDate >= startDate && itemStartDate <= endDate) ||
                (endDate && itemEndDate >= startDate && itemEndDate <= endDate);
            const matchesName = inputName ? item.name.toLowerCase().includes(inputName.toLowerCase()) : false;

            return withinDateRange || matchesName;
        });

        setFilteredCampaigns(filtered);
        setInputStartDate('');
        setInputEndDate('');
        setInputName('');
    };

    return (
        <div>
            <input 
                type='date' 
                value={inputStartDate}
                onChange={(event) => setInputStartDate(event.target.value)} 
            />
            <input 
                type='date' 
                value={inputEndDate}
                onChange={(event) => setInputEndDate(event.target.value)} 
            />
            <input 
                type='text'  
                value={inputName}
                onChange={(event) => setInputName(event.target.value)} 
                placeholder='Enter Campaign Name' 
            />
            <button onClick={search}>Search</button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>User Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Active</th>
                        <th>Budget</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        filteredCampaigns.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{(data.find(user => user.id === item.userId)?.username) || 'UnknownUser'}</td>
                                <td>{item.startDate}</td>
                                <td>{item.endDate}</td>
                                <td>{new Date(item.endDate) > new Date() ? "Active" : "Inactive"}</td>
                                <td>{item.Budget}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>
    );
}

export default CampaignList;
