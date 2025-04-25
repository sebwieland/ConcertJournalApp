import React, {useEffect, useState} from 'react';
import {Alert, Autocomplete, Container, Grid, Rating, TextField, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import DefaultLayout from "../../theme/DefaultLayout";
import {useNavigate} from "react-router-dom";
import {mbApi} from "../../api/musicBrainzApi";


interface EntryFormProps {
    onSubmit: (data: {
        bandName: string;
        place: string;
        date: dayjs.Dayjs;
        rating: number;
        comment: string;
    }) => Promise<void>;
    bandName: string;
    setBandName: (bandName: string) => void;
    place: string;
    setPlace: (place: string) => void;
    date: dayjs.Dayjs;
    setDate: (date: dayjs.Dayjs) => void;
    rating: number;
    setRating: (rating: number) => void;
    comment: string;
    setComment: (comment: string) => void;
    message: string;
    isSuccess: boolean;
    data: any[];
    isUpdate?: boolean;
}

async function queryArtistSuggestions(artist: string) {
    const artistsQueryResult = await mbApi.search("artist", {query: artist, limit: 5})
    return artistsQueryResult.artists.map(value => value.name);
}


const EntryForm: React.FC<EntryFormProps> = ({
                                                 onSubmit,
                                                 bandName,
                                                 setBandName,
                                                 place,
                                                 setPlace,
                                                 date,
                                                 setDate,
                                                 rating,
                                                 setRating,
                                                 comment,
                                                 setComment,
                                                 message,
                                                 isSuccess,
                                                 data,
                                                 isUpdate
                                             }) => {
    const [bandSuggestions, setBandSuggestions] = useState<string[]>([]);
    const [bandInputValue, setBandInputValue] = useState('');
    const [placeSuggestions, setPlaceSuggestions] = useState<string[]>([]);
    const [placeInputValue, setPlaceInputValue] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!data) return;
            // Get unique local suggestions
            const uniqueLocalNames = Array.from(new Set(
                data.map(event => event.bandName)
                    .filter(name => name.toLowerCase().includes(bandInputValue.toLowerCase()))
            ));

            try {
                // Get API suggestions
                if (bandInputValue != '') {
                    const apiSuggestions = await queryArtistSuggestions(bandInputValue);

                    // Combine and deduplicate
                    const allSuggestions = [...uniqueLocalNames, ...apiSuggestions];
                    const uniqueSuggestions = Array.from(new Set(allSuggestions));

                    setBandSuggestions(uniqueSuggestions);
                }
            } catch (error) {
                setBandSuggestions(uniqueLocalNames);
            }
        };

        fetchSuggestions();
    }, [bandInputValue, data]);

    useEffect(() => {
        const fetchSuggestions = () => {
            if (!data) return;
            const uniquePlaces: string[] = Array.from(new Set(data.map((event: { place: string }) => event.place)));
            const suggestions: string[] = uniquePlaces.filter(s => s.toLowerCase().includes(placeInputValue.toLowerCase()));
            setPlaceSuggestions(suggestions);
        };
        fetchSuggestions();
    }, [placeInputValue, data]);

    const handleSubmit = async () => {
        await onSubmit({bandName, place, date, rating, comment});
    };


    return (
        <DefaultLayout>
            <Container maxWidth="sm" sx={{marginTop: "10vh"}} component="form">
                <Typography variant="h4" component="h1" sx={{mb: 4, textAlign: 'center'}}>
                    {isUpdate ? 'Update Entry' : 'Create New Entry'}
                </Typography>
                <Grid spacing={1}>
                    <Grid spacing={1}>
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

                        <Grid>
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
                        </Grid>

                        <Grid sx={{textAlign: 'center', marginBottom: 2}}>
                            <Rating
                                name="Rating"
                                value={rating}
                                onChange={(event, newValue) => {
                                    setRating(newValue ?? 0);
                                }}
                            />
                        </Grid>
                        <Grid>
                            <TextField
                                label="Comment"
                                variant="outlined"
                                fullWidth
                                value={comment}
                                sx={{marginBottom: 2}}
                                onChange={(event) => setComment(event.target.value)}
                            />
                        </Grid>
                        <Grid>
                            <DatePicker
                                label="Date"
                                value={date}
                                sx={{marginBottom: 2, width: '100%'}}
                                onChange={(newValue) => setDate(newValue ? newValue : dayjs())}
                            />
                        </Grid>
                        <Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{marginBottom: 2}}
                                onClick={handleSubmit}
                            >
                                {isUpdate ? 'Update Entry' : 'Create New Entry'}
                            </Button>
                        </Grid>
                        <Grid>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                onClick={() => navigate(-1)}
                            >
                                Go Back
                            </Button>
                        </Grid>
                        <Grid>
                            {message &&
                                <Alert
                                    severity={isSuccess ? 'success' : 'error'} sx={{maxWidth: '100%'}}>
                                    {message}
                                </Alert>}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </DefaultLayout>
    );
};

export default EntryForm;