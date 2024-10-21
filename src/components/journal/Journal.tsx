import DefaultLayout from "../../theme/DefaultLayout";
import * as React from "react";
import DataCollector, {DataCollectorState} from "./DataCollector";
import DataTable from "./DataTable";

export default function SignInSide() {
    return (
        <DefaultLayout>
            <DataCollector>
                {({data}: DataCollectorState) => (
                    <DataTable data={data}/>
                )}
            </DataCollector>
        </DefaultLayout>
    );
}