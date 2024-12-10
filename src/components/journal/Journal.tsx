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
    InputLabel, SelectChangeEvent
} from "@mui/material";
import Typography from "@mui/material/Typography";
import RatingStars from "../utilities/RatingStars";
import {LeadingActions, SwipeableList, SwipeableListItem, SwipeAction, TrailingActions} from 'react-swipeable-list';
import {styled} from "@mui/material/styles";
import 'react-swipeable-list/dist/styles.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface SortCriteria {
    value: string;
    label: string;
}

const sortCriteriaOptions: SortCriteria[] = [
    {value: 'date', label: 'Date'},
    {value: 'rating', label: 'Rating'}
];

const sortOrderOptions: SortCriteria[] = [
    {value: 'asc', label: 'Ascending'},
    {value: 'desc', label: 'Descending'}
];

const StyledSwipeAction = styled(SwipeAction)(({theme}) => ({
    padding: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '80px', // Limit width to show only when swiped
    zIndex: 0,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const StyledSwipeActionDelete = styled(SwipeAction)(({theme}) => ({
    padding: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '80px', // Limit width to show only when swiped
    zIndex: 0,
    '&:hover': {
        backgroundColor: theme.palette.error.dark,
    },
}));

const StyledSwipeableListItem = styled(SwipeableListItem)(() => ({
    width: '100%',
    position: 'relative',
}));


const SortForm = () => {
    const [sortCriteria, setSortCriteria] = React.useState('date');
    const [sortOrder, setSortOrder] = React.useState('desc');

    const handleSortCriteriaChange = (event: SelectChangeEvent<string>) => {
        setSortCriteria(event.target.value as string);
    };

    const handleSortOrderChange = (event: SelectChangeEvent<string>) => {
        setSortOrder(event.target.value as string);
    };

    return (
        <Grid2 container spacing={2}>
            <Grid2 size={{xs: 12}}>
                <FormControl fullWidth>
                    <InputLabel id="sort-criteria-label">Sort by</InputLabel>
                    <Select
                        labelId="sort-criteria-label"
                        id="sort-criteria"
                        value={sortCriteria}
                        label="Sort by"
                        onChange={handleSortCriteriaChange}
                    >
                        {sortCriteriaOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
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
                        onChange={handleSortOrderChange}
                    >
                        {sortOrderOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid2>
        </Grid2>
    );
};

const Journal = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const leadingActions = (action: any, id: number) => (
        <LeadingActions>
            <StyledSwipeActionDelete onClick={() => action(id)}>
                <DeleteIcon sx={{fontSize: 24}}/>
            </StyledSwipeActionDelete>
        </LeadingActions>
    );

    const trailingActions = (action: any, id: number) => (
        <TrailingActions>
            <StyledSwipeAction onClick={() => action(id)}>
                <EditIcon sx={{fontSize: 24}}/>
            </StyledSwipeAction>
        </TrailingActions>
    );

    const sortData = (data: any[], sortCriteria: string, sortOrder: string) => {
        if (sortCriteria === 'date') {
            return data.sort((a, b) => {
                const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
                return sortOrder === 'asc' ? dateDiff : -dateDiff;
            });
        } else {
            return data.sort((a, b) => {
                const ratingDiff = b.rating - a.rating;
                return sortOrder === 'asc' ? ratingDiff : -ratingDiff;
            });
        }
    };

    if (isMobile) {
        return (
            <DefaultLayout>
                <ConfirmProvider>
                    <DataCollector>
                        {({data, onEdit, onDelete}) => (
                            <Grid2 container spacing={2}>
                                <Grid2 style={{width: '100%'}}>
                                    <SortForm/>
                                </Grid2>
                                <Grid2 style={{width: '100%'}}>
                                    <SwipeableList style={{width: '100%'}}>
                                        {sortData(data, 'date', 'desc').map((item) => (
                                            <StyledSwipeableListItem
                                                key={item.id}
                                                leadingActions={leadingActions(onDelete, item.id)}
                                                trailingActions={trailingActions(onEdit, item.id)}
                                            >
                                                <Card sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    marginBottom: theme.spacing(1)
                                                }}>
                                                    <CardContent sx={{height: '100%'}}>
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
                                            </StyledSwipeableListItem>
                                        ))}
                                    </SwipeableList>
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
};

export default Journal;