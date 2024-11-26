import DefaultLayout from "../../theme/DefaultLayout";
import * as React from "react";
import DataCollector from "./DataCollector";
import DataTable from "./DataTable";
import {ConfirmProvider} from "material-ui-confirm";

export default function Journal() {
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
    );
}