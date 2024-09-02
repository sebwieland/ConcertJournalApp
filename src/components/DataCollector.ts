import React from 'react';

interface DataCollectorProps {
    children: (state: DataCollectorState) => JSX.Element;
}

export interface DataCollectorState {
    data: {id: number, bandName: string, place: string, date: Date}[];
}

class DataCollector extends React.Component<DataCollectorProps, DataCollectorState> {
    constructor(props: DataCollectorProps) {
        super(props);
        this.state = {
            data: [],
        };
    }

    fetchData = () => {
        fetch('http://localhost:8080/BandTracker/events')
            .then(response => response.json())
            .then(data => this.setState({ data }));
    };

    componentDidMount() {
        this.fetchData();
    }

    render() {
        console.log('DataCollector render method called');
        return this.props.children({data: this.state.data});
    }
}

export default DataCollector;
