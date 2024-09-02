import React from 'react';
import DataCollector, {DataCollectorState} from './components/DataCollector';
import DataTable from './components/DataTable';
// import {DataCollectorState } from './components/DataCollector'

interface AppProps {
    // No props needed for this component
}

class App extends React.Component<AppProps, {}> {
    render() {
        return (
            <DataCollector>
                {({ data }: DataCollectorState) => (
                    <DataTable data={data} />
                )}
            </DataCollector>
        );
    }
}

export default App;
