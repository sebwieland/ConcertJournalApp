import React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import dayjs from "dayjs";

interface DataTableProps {
    data: any[];
}

class DataTable extends React.Component<DataTableProps, {}> {
    columns = [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'bandName', headerName: 'Band', width: 130},
        {field: 'place', headerName: 'Place', width: 130},
        {field: 'date', headerName: 'Date', width: 130,
            valueFormatter: (params: any)  => {
                return dayjs(params.value).format('DD/MM/YYYY');
            }
        },
        {field: 'comment', headerName: 'comment', width: 130},
        {field: 'rating', headerName: 'rating', width: 130},
        {
            field: 'appUser',
            headerName: 'Username',
            width: 130,
            valueGetter: (params: any) => params.username,
        },
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
