import React, {useState} from 'react';
import {Alert, Container, Grid2, Rating, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import DefaultLayout from "../theme/DefaultLayout";
import useEvents from "../hooks/useEvents";

const CreateNewEntryFormPage = () => {
    const [bandName, setBandName] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState(dayjs());
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate()
    const {createEvent} = useEvents();

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!bandName.trim()) {
            setMessage('Please enter a band name');
            setIsSuccess(false);
            return;
        }
        await createEvent({
            bandName,
            place,
            date,
            rating,
            comment
        }, {
            onSuccess: () => {
                setMessage('New entry created successfully!');
                setIsSuccess(true);
            },
            onError: (error) => {
                setMessage(`Error creating new entry: ${(error as Error).message}`);
                setIsSuccess(false);
            }
        })
    }

    return (
        <DefaultLayout>
            <Container
                maxWidth="sm"
                sx={{marginTop: "10vh", width: '400px', maxWidth: "500px"}}
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

                    <Grid2 sx={{textAlign: 'center', marginBottom: 2}}>
                        <Rating
                            name="Rating"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue ?? 0);
                            }}
                        />
                    </Grid2>
                    <Grid2>
                        <TextField
                            label="Comment"
                            variant="outlined"
                            fullWidth
                            value={comment}
                            sx={{marginBottom: 2}}
                            onChange={(event) => setComment(event.target.value)}
                        />
                    </Grid2>
                    <Grid2>
                        <DatePicker
                            label="Date"
                            value={date}
                            sx={{marginBottom: 2, width: '100%'}}
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
                    <Grid2>
                        {message &&
                            <Alert
                                severity={isSuccess ? 'success' : 'error'} sx={{maxWidth: '100%'}}>
                                {message}
                            </Alert>}
                    </Grid2>
                </Grid2>
            </Container>
        </DefaultLayout>
    );
};


export default CreateNewEntryFormPage;
