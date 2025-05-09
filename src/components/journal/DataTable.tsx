import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowId } from '@mui/x-data-grid';
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import RatingStars from "../utilities/RatingStars";
import { Alert } from "@mui/material";

interface DataTableProps {
    data: any[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

class DataTable extends React.Component<DataTableProps, {}> {
    componentDidMount() {
        if (process.env.NODE_ENV === 'development') {
            console.log('DataTable component mounted');
        }
    }

    componentWillUnmount() {
        if (process.env.NODE_ENV === 'development') {
            console.log('DataTable component unmounted');
        }
    }

    columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'bandName', headerName: 'Band', width: 130 },
        { field: 'place', headerName: 'Place', width: 130 },
        {
            field: 'date', headerName: 'Date', width: 130,
            type: 'date' as const, sortComparator: (v1, v2) => dayjs(v1).diff(dayjs(v2)),
            valueFormatter: (params: any) => {
                // Add defensive check for date value
                if (!params || params.value === undefined || params.value === null) {
                    console.warn('Missing date value for row:', params);
                    return 'Unknown date';
                }
                const date = dayjs(params.value);
                return date.format('DD/MM/YYYY');
            }
        },
        { field: 'comment', headerName: 'Comment', width: 130 },
        {
            field: 'rating', headerName: 'Rating', width: 130,
            renderCell: (params: GridRenderCellParams) => {
                // Add defensive check for rating value
                if (params.value === undefined || params.value === null) {
                    console.warn('Missing rating value for row:', params);
                    return <RatingStars rating={0} />;
                }
                return <RatingStars rating={params.value} />;
            },
        },
        {
            field: 'appUser',
            headerName: 'Username',
            width: 130,
            valueGetter: (params: any) => {
                // Add defensive check to handle undefined params.row
                if (!params || !params.row || !params.row.appUser) {
                    console.warn('Missing appUser data for row:', params);
                    return 'Unknown';
                }
                return params.row.appUser.username;
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params: GridRenderCellParams) => {
                // Add defensive check for params.id
                if (params.id === undefined || params.id === null) {
                    console.warn('Missing id for row:', params);
                    return (
                        <div>
                            <Button variant="contained" color="primary" disabled>Edit</Button>
                            <Button variant="contained" color="error" style={{ marginLeft: 10 }} disabled>Delete</Button>
                        </div>
                    );
                }
                
                const id = typeof params.id === 'number' ? params.id : parseInt(params.id as string, 10);
                return (
                    <div>
                        <Button variant="contained" color="primary"
                                onClick={() => this.props.onEdit(id)}>Edit</Button>
                        <Button variant="contained" color="error" style={{ marginLeft: 10 }}
                                onClick={() => this.props.onDelete(id)}>Delete</Button>
                    </div>
                );
            }
        }
    ];

    render() {
        const { data } = this.props;
        return (
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    autoHeight={true}
                    rows={data}
                    columns={this.columns}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    // paginationMode="server"
                    // checkboxSelection
                />
            </div>
        );
    }
}

export default DataTable;
