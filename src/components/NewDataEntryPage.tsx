import React, {useContext, useEffect, useState} from 'react';
import {Alert, Autocomplete, Container, Grid2, Rating, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import DefaultLayout from "../theme/DefaultLayout";
import useEvents from "../hooks/useEvents";
import {AuthContext} from "../contexts/AuthContext";
import SignInSide from "./sign-in/SignInSide";

const CreateNewEntryFormPage = () => {
    const [bandName, setBandName] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState(dayjs());
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [bandSuggestions, setBandSuggestions] = useState<string[]>([]);
    const [bandInputValue, setBandInputValue] = useState('');
    const [placeSuggestions, setPlaceSuggestions] = useState<string[]>([]);
    const [placeInputValue, setPlaceInputValue] = useState('');
    const navigate = useNavigate()
    const {data, createEvent} = useEvents();
    const isLoggedIn = useContext(AuthContext)?.isLoggedIn;

    useEffect(() => {
        const fetchSuggestions =  () => {
            if (!data) return;
            const uniqueBandNames: string[] = Array.from(new Set(data.map((event: { bandName: string }) => event.bandName)));
            const suggestions: string[] = uniqueBandNames.filter(s => s.toLowerCase().includes(bandInputValue.toLowerCase()));
            setBandSuggestions(suggestions);
        };
        fetchSuggestions();
    }, [bandInputValue]);

    useEffect(() => {
        const fetchSuggestions =  () => {
            if (!data) return;
            const uniquePlaces: string[] = Array.from(new Set(data.map((event: { place: string }) => event.place)));
            const suggestions: string[] = uniquePlaces.filter(s => s.toLowerCase().includes(placeInputValue.toLowerCase()));
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
                setPlace('');
                setBandName('');
                setDate(dayjs());
                setRating(0);
                setComment('');
            },
            onError: (error) => {
                setMessage(`Error creating new entry: ${(error as Error).message}`);
                setIsSuccess(false);
            }
        })
    }

    if (!isLoggedIn) {
        return <SignInSide/>;
    }

    return (
        <DefaultLayout>
            <Container
                maxWidth="sm"
                sx={{marginTop: "10vh", width: '400px', maxWidth: "500px"}}
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
