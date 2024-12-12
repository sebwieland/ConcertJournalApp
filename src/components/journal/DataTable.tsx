import React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import RatingStars from "../utilities/RatingStars";

interface DataTableProps {
    data: any[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

class DataTable extends React.Component<DataTableProps, {}> {
    columns = [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'bandName', headerName: 'Band', width: 130},
        {field: 'place', headerName: 'Place', width: 130},
        {
            field: 'date', headerName: 'Date', width: 130,
            type: 'date' as const, sortType: 'date',
            valueFormatter: (params: any) => {
                const date = dayjs(params);
                return date.format('DD/MM/YYYY');
            }
        },
        {field: 'comment', headerName: 'comment', width: 130},
        {
            field: 'rating', headerName: 'rating', width: 130,
            renderCell: (params: any) => (
                <RatingStars rating={params.value} />
            ),
        },
        {
            field: 'appUser',
            headerName: 'Username',
            width: 130,
            valueGetter: (params: any) => params.username,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params: any) => (
                <div>
                    <Button variant="contained" color="primary"
                            onClick={() => this.props.onEdit(params.id)}>Edit</Button>
                    <Button variant="contained" color="error" style={{marginLeft: 10}}
                            onClick={() => this.props.onDelete(params.id)}>Delete</Button>
                </div>
            )
        }
    ];

    render() {
        const {data} = this.props;
        return (
            <div style={{height: 600, width: '100%'}}>
                <DataGrid
                    autoHeight={true}
                    rows={data}
                    columns={this.columns}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: {paginationModel: {pageSize: 10}},
                    }}
                    // paginationMode="server"
                    // checkboxSelection
                />
            </div>
        );
    }
}

export default DataTable;
