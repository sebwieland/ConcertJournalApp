import React, {useEffect, useState} from 'react';
import {Alert, Autocomplete, Container, Grid, Rating, TextField, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import DefaultLayout from "../../theme/DefaultLayout";
import {useNavigate} from "react-router-dom";
import {mbApi} from "../../api/musicBrainzApi";

declare module 'musicbrainz-api' {
    interface IArtist {
        tags?: Array<{
            count: number;
            name: string;
        }>;
    }

    interface IArtistMatch extends IArtist {}
}

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

interface ArtistTag {
    count: number;
    name: string;
}

interface ArtistDetails {
    type?: string;
    genre?: string;
    formationYear?: string;
    country?: string;
    tags?: ArtistTag[];  // Add this to your interface
}

async function queryArtistSuggestions(artist: string) {
    const artistsQueryResult = await mbApi.search("artist", {query: artist, limit: 5})
    // console.log(artistsQueryResult)
    return artistsQueryResult.artists.map(value => value.name);
}

async function fetchArtistDetails(name: string): Promise<ArtistDetails> {
    const result = await mbApi.search("artist", {query: name, limit: 1});
    const artist = result.artists[0];
    if (!artist) return {};

    const tags = artist.tags ?? [];
    const sortedTags = [...tags].sort((a, b) => b.count - a.count);
    const topGenre = sortedTags[0]?.name;

    return {
        type: artist.type,
        genre: topGenre,
        formationYear: artist["life-span"]?.begin,
        country: artist.country
    };
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
    const [artistDetails, setArtistDetails] = useState<ArtistDetails | null>(null);
    const [showArtistDetails, setShowArtistDetails] = useState(false);
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
                            onChange={async (event, newValue) => {
                                setBandName(newValue ?? '');
                                setShowArtistDetails(false);
                                if (newValue) {
                                    try {
                                        const details = await fetchArtistDetails(newValue);
                                        setArtistDetails(details);
                                    } catch (error) {
                                        setArtistDetails(null);
                                        console.error("Failed to fetch artist details", error);
                                    }
                                }
                            }
                            }
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
                        <Button
                            size="small"
                            onClick={() => setShowArtistDetails(!showArtistDetails)}
                            sx={{mb: 1}}
                        >
                            {showArtistDetails ? 'Hide artist details' : 'Show artist details'}
                        </Button>
                        {artistDetails && showArtistDetails && (
                            <Grid sx={{mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1}}>
                                <Typography variant="body2">Type: {artistDetails.type || 'Unknown'}</Typography>
                                <Typography variant="body2">Genre: {artistDetails.genre || 'Unknown'}</Typography>
                                <Typography
                                    variant="body2">Formed: {artistDetails.formationYear || 'Unknown'}</Typography>
                                <Typography variant="body2">Country: {artistDetails.country || 'Unknown'}</Typography>
                            </Grid>
                        )}

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