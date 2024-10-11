import React from 'react';
import type {} from '@mui/x-data-grid/themeAugmentation';
import {DataGrid} from '@mui/x-data-grid';

interface DataTableProps {
    data: any[];
}

class DataTable extends React.Component<DataTableProps, {}> {
    columns = [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'bandName', headerName: 'Band', width: 130},
        {field: 'place', headerName: 'Place', width: 130},
        {field: 'date', headerName: 'date', width: 130},
        {field: 'comment', headerName: 'comment', width: 130},
        {field: 'rating', headerName: 'rating', width: 130},
        {
            field: 'appUser',
            headerName: 'Username',
            width: 130,
            valueGetter: (params: any) => params.username,
        },
        // Add more columns as needed
    ];

    render() {
        const {data} = this.props;
        console.log("data: ", data)
        console.log("DataTable Rendering table")

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
