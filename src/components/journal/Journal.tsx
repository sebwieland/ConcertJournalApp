import DefaultLayout from "../../theme/DefaultLayout";
import * as React from "react";
import {useState} from "react";
import DataCollector from "./DataCollector";
import DataTable from "./DataTable";
import {ConfirmProvider} from "material-ui-confirm";
import {Card, CardContent, Grid, useMediaQuery, useTheme,} from "@mui/material";
import Typography from "@mui/material/Typography";
import RatingStars from "../utilities/RatingStars";
import {sortData} from "../../utils/SortData";
import {SwipeableList} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import SortForm from "./SortForm";
import {leadingActions, StyledSwipeableListItem, trailingActions} from "./SwipeableListItem"


const Journal = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [sortOrder, setSortOrder] = useState(() => {
        const saved = localStorage.getItem('journalSortOrder');
        return saved ? JSON.parse(saved) : {column: 'date', order: 'desc'}
    });

    const handleSortChange = (newSortOrder: any) => {
        setSortOrder(newSortOrder);
        localStorage.setItem('journalSortOrder', JSON.stringify(newSortOrder));

    }

    if (isMobile) {
        return (
            <DefaultLayout>
                <ConfirmProvider>
                    <DataCollector>
                        {({data, onEdit, onDelete}) => (
                            <Grid container spacing={2}>
                                <Grid style={{width: '100%'}}>
                                    <SortForm
                                        sortOrder={sortOrder}
                                        onSortOrderChange={handleSortChange}
                                    />
                                </Grid>
                                <Grid style={{width: '100%'}}>
                                    <SwipeableList style={{width: '100%'}}>
                                        {sortData(data, sortOrder.column, sortOrder.order).map((item) => (
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
                                </Grid>
                            </Grid>
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