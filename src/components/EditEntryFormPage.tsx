import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useEvents from '../hooks/useEvents';
import eventsApi from '../api/apiEvents';
import useAuth from '../hooks/useAuth';
import dayjs from "dayjs";
import DefaultLayout from "../theme/DefaultLayout";
import {Alert, Autocomplete, Container, Grid2, Rating, TextField} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import Button from "@mui/material/Button";

const EditEntryFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, refetch } = useEvents();
    const { token } = useAuth();
    const [bandName, setBandName] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState(dayjs());
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [bandSuggestions, setBandSuggestions] = useState<string[]>([]);
    const [bandInputValue, setBandInputValue] = useState('');
    const [placeSuggestions, setPlaceSuggestions] = useState<string[]>([]);
    const [placeInputValue, setPlaceInputValue] = useState('');
    const [message, setMessage] = useState('');

    console.log("Editentryfrompage: ", id)

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id ||!data) {
                return;
            }
            try {
                const event = data.find((event: any) => event.id === parseInt(id));
                if (!event) {
                    console.log('No event found with id', id);
                    return;
                }
                console.log('Found event:', event);
                setBandName(event.bandName);
                setPlace(event.place);
                setDate(dayjs(event.date));
                setRating(event.rating);
                setComment(event.comment);
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        };
        fetchEvent();
    }, [id, data]);

    useEffect(() => {
        const fetchSuggestions = () => {
            if (!data) return;
            const uniqueBandNames: string[] = Array.from(new Set(data.map((event: { bandName: string }) => event.bandName)));
            const suggestions: string[] = uniqueBandNames.filter((s) => s.toLowerCase().includes(bandInputValue.toLowerCase()));
            setBandSuggestions(suggestions);
        };
        fetchSuggestions();
    }, [bandInputValue]);

    useEffect(() => {
        const fetchSuggestions = () => {
            if (!data) return;
            const uniquePlaces: string[] = Array.from(new Set(data.map((event: { place: string }) => event.place)));
            const suggestions: string[] = uniquePlaces.filter((s) => s.toLowerCase().includes(placeInputValue.toLowerCase()));
            setPlaceSuggestions(suggestions);
        };
        fetchSuggestions();
    }, [placeInputValue]);

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!bandName.trim()) {
            setMessage('Please enter a band name');
            setIsSuccess(false);
            return;
        }
        try {
            await eventsApi.updateEvent(parseInt(id!), {
                bandName,
                place,
                date,
                rating,
                comment,
            }, token);
            refetch();
            setMessage('Entry updated successfully!');
            setIsSuccess(true);
        } catch (error) {
            setMessage(`Error updating entry: ${(error as Error).message}`);
            setIsSuccess(false);
        }
    };

    return (
        // Render the form with the existing code
        <DefaultLayout>
            <Container
                maxWidth="sm"
                sx={{ marginTop: '10vh', width: '400px', maxWidth: '500px' }}
                component="form"
            >
                <Grid2 spacing={1}>
                    <Autocomplete
                        options={bandSuggestions}
                        value={bandName}
                        onChange={(event, newValue) => setBandName(newValue ?? '')}
                        inputValue={bandInputValue}
                        onInputChange={(event, newInputValue) => {
                            setBandInputValue(newInputValue);
                            setBandName(newInputValue);
                        }}
                        autoComplete
                        freeSolo
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Band"
                                variant="outlined"
                                fullWidth
                                sx={{marginBottom: 2}}
                            />
                        )}
                    />

                    <Grid2>
                        <Autocomplete
                            options={placeSuggestions}
                            value={place}
                            onChange={(event, newValue) => setPlace(newValue ?? '')}
                            inputValue={placeInputValue}
                            onInputChange={(event, newInputValue) => {
                                setPlaceInputValue(newInputValue);
                                setPlace(newInputValue);
                            }}
                            autoComplete
                            freeSolo
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Place"
                                    variant="outlined"
                                    fullWidth
                                    sx={{marginBottom: 2}}
                                />
                            )}
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
                            Update Entry
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

export default EditEntryFormPage;