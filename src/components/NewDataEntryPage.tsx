import React, {useState} from 'react';
import {Container, Grid2, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const CreateNewEntryFormPage = () => {
    const [band, setBand] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post('/BandTracker/events', { band, place });
            setMessage('New entry created successfully!');
            setTimeout(() => {
                navigate('')
            }, 2000); // redirect after 2 seconds
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
                        value={band}
                        onChange={(event) => setBand(event.target.value)}
                    />
                </Grid2>
                <Grid2>
                    <TextField
                        label="Place"
                        variant="outlined"
                        fullWidth
                        value={place}
                        onChange={(event) => setPlace(event.target.value)}
                    />
                </Grid2>
                <Grid2>
                    <TextField
                        label="Date"
                        variant="outlined"
                        fullWidth
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                    />
                </Grid2>
                <Grid2>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                    >
                        Create New Entry
                    </Button>
                </Grid2>
                {message && <div>{message}</div>}
            </Grid2>
        </Container>
    );
};



export default CreateNewEntryFormPage;
