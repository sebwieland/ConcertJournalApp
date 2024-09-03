import React, {useState} from 'react';
import DataTable from "./DataTable";
import DataCollector, {DataCollectorState} from "./DataCollector";
import Button from '@mui/material/Button';
import {SpeedDial, SpeedDialAction, SpeedDialIcon} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {useNavigate} from "react-router-dom";


const LandingPage = () => {
    const [showTable, setShowTable] = useState(false);
    const [createNewEntry, setCreateNewEntry] = useState(false);
    const navigate = useNavigate()

    const handleToggleTable = () => {
        setShowTable(!showTable);
    };

    const handleCreateNewEntry = () => {
        navigate('/new-entry');
    };

    return (
        <div>
            <h1>Welcome to your Band Journal!</h1>
            <p>Choose an option:</p>
            <Button variant = "contained" onClick={handleToggleTable}>
                {showTable ? "Hide Table" : "Show Table"}
            </Button>

            {showTable &&
                <DataCollector>
                    {({data}: DataCollectorState) => (
                        <DataTable data={data}/>
                    )}
                </DataCollector>}

            {/*<SpeedDial*/}
            {/*    ariaLabel="SpeedDial example"*/}
            {/*    icon={<SpeedDialIcon />}*/}
            {/*    sx={{ position: 'absolute', bottom: 16, right: 16 }}*/}
            {/*    onClose={() => console.log('SpeedDial closed')}*/}
            {/*    onOpen={() => console.log('SpeedDial opened')}*/}
            {/*    open={false}*/}
            {/*>*/}
            {/*<SpeedDialAction*/}
            {/*        icon={<AddCircleIcon />}*/}
            {/*        tooltipTitle="Create New Entry"*/}
            {/*        onClick={handleCreateNewEntry}*/}
            {/*    />*/}
            {/*</SpeedDial>*/}
            {/*<br/>*/}

            <Button variant = "contained" onClick={handleCreateNewEntry}>
                {"Add Entry"}
            </Button>

        </div>
    );
};

export default LandingPage;
