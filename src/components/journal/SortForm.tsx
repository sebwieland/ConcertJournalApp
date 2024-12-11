import * as React from "react";
import {FormControl, Grid2, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

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

export default SortForm;