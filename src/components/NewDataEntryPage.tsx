import React from 'react';
import {Container, Grid2, TextField} from "@mui/material";
import Button from "@mui/material/Button";

const CreateNewEntryFormPage = () => {
    return (

        <Container
            maxWidth="sm"
            style={{marginTop: "10vh"}}
        >
            <Grid2 spacing={1}>
                <Grid2>
                    <TextField label="Band" variant="outlined" fullWidth/>
                </Grid2>
                <Grid2>
                    <TextField label="Place" variant="outlined" fullWidth/>
                </Grid2>
                <Grid2>
                    <Button variant="contained" color="primary" fullWidth>
                        Create New Entry
                    </Button>
                </Grid2>
            </Grid2>
        </Container>
    );
};

export default CreateNewEntryFormPage;
