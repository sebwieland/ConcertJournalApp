import * as React from "react";
import {FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

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

interface SortFormProps {
    sortOrder: { column: string; order: string };
    onSortOrderChange: (newSortOrder: { column: string; order: string }) => void;
}

const SortForm = ({ sortOrder, onSortOrderChange }: SortFormProps) => {
    const handleSortCriteriaChange = (event: SelectChangeEvent<string>) => {
        onSortOrderChange({ column: event.target.value as string, order: sortOrder.order });
    };

    const handleSortOrderChange = (event: SelectChangeEvent<string>) => {
        onSortOrderChange({ column: sortOrder.column, order: event.target.value as string });
    };

    return (
        <Grid container spacing={2}>
            <Grid size={{xs: 12}}>
                <FormControl fullWidth>
                    <InputLabel id="sort-criteria-label">Sort by</InputLabel>
                    <Select
                        labelId="sort-criteria-label"
                        id="sort-criteria"
                        value={sortOrder.column}
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
            </Grid>
            <Grid size={{xs: 12}}>
                <FormControl fullWidth>
                    <InputLabel id="sort-order-label">Sort order</InputLabel>
                    <Select
                        labelId="sort-order-label"
                        id="sort-order"
                        value={sortOrder.order}
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
            </Grid>
        </Grid>
    );
};

export default SortForm;