import React, {useState} from 'react';
import {Container, Grid2, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";

const CreateNewEntryFormPage = () => {
    const [bandName, setBandName] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState(dayjs());
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/ConcertJournalAPI/events',
                {bandName, place, date});
            setMessage('New entry created successfully!');
        } catch (error) {
            setMessage(`Error creating new entry: ${(error as Error).message}`);
        }
    };


    return (
        <Container
            maxWidth="sm"
            style={{marginTop: "10vh"}}
            component="form"
        >
            <Grid2 spacing={1}>
                <Grid2>
                    <TextField
                        label="Band"
                        variant="outlined"
                        fullWidth
                        value={bandName}
                        sx={{marginBottom: 2}}
                        onChange={(event) => setBandName(event.target.value)}
                    />
                </Grid2>
                <Grid2>
                    <TextField
                        label="Place"
                        variant="outlined"
                        fullWidth
                        value={place}
                        sx={{marginBottom: 2}}
                        onChange={(event) => setPlace(event.target.value)}
                    />
                </Grid2>
                <Grid2>
                    <DatePicker
                        label="Date"
                        value={date}
                        sx={{marginBottom: 2}}
                        onChange={(newValue) => setDate(newValue ? newValue : dayjs())}
                    />
                </Grid2>
                <Grid2>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{marginBottom: 2}}
                        onClick={handleSubmit}
                    >
                        Create New Entry
                    </Button>
                </Grid2>
                <Grid2>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                </Grid2>
                {message && <div>{message}</div>}
            </Grid2>
        </Container>
    );
};


export default CreateNewEntryFormPage;
