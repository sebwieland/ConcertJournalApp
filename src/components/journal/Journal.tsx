import DefaultLayout from "../../theme/DefaultLayout";
import * as React from "react";
import DataCollector from "./DataCollector";
import DataTable from "./DataTable";
import {ConfirmProvider} from "material-ui-confirm";
import {
    Card,
    CardContent,
    Grid2,
    useMediaQuery,
    useTheme,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material";
import Typography from "@mui/material/Typography";
import RatingStars from "../utilities/RatingStars";

export default function Journal() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [sortCriteria, setSortCriteria] = React.useState('date');
    const [sortOrder, setSortOrder] = React.useState('desc');

    if (isMobile) {
        return (
            <DefaultLayout>
                <ConfirmProvider>
                    <DataCollector>
                        {({data}) => (
                            <Grid2 container spacing={2}>
                                <Grid2 size={{xs: 12}}>
                                    <FormControl fullWidth>
                                        <InputLabel id="sort-criteria-label">Sort by</InputLabel>
                                        <Select
                                            labelId="sort-criteria-label"
                                            id="sort-criteria"
                                            value={sortCriteria}
                                            label="Sort by"
                                            onChange={(e) => setSortCriteria(e.target.value)}
                                        >
                                            <MenuItem value="date">Date</MenuItem>
                                            <MenuItem value="rating">Rating</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid2>
                                <Grid2 size={{xs: 12}}>
                                    <FormControl fullWidth>
                                        <InputLabel id="sort-order-label">Sort order</InputLabel>
                                        <Select
                                            labelId="sort-order-label"
                                            id="sort-order"
                                            value={sortOrder}
                                            label="Sort order"
                                            onChange={(e) => setSortOrder(e.target.value)}
                                        >
                                            <MenuItem value="asc">Ascending</MenuItem>
                                            <MenuItem value="desc">Descending</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid2>
                                <Grid2 container spacing={2}>
                                    {data.sort((a, b) => {
                                        if (sortCriteria === 'date') {
                                            const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
                                            return sortOrder === 'asc' ? dateDiff : -dateDiff;
                                        } else {
                                            const ratingDiff = b.rating - a.rating;
                                            return sortOrder === 'asc' ? ratingDiff : -ratingDiff;
                                        }
                                    }).map((item) => (
                                        <Grid2 key={item.id} size={{xs: 12, sm: 6, md: 4, lg: 3}}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h5" component="div">
                                                        {item.bandName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.place}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {new Date(item.date).toLocaleDateString()}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.comment}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <RatingStars rating={item.rating}/>
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid2>
                                    ))}
                                </Grid2>
                            </Grid2>
                        )}
                    </DataCollector>
                </ConfirmProvider>
            </DefaultLayout>
        );
    } else {
        return (
            <DefaultLayout>
                <ConfirmProvider>
                    <DataCollector>
                        {({data, onEdit, onDelete}) => (
                            <DataTable data={data} onEdit={onEdit} onDelete={onDelete}/>
                        )}
                    </DataCollector>
                </ConfirmProvider>
            </DefaultLayout>
        )
    }
}