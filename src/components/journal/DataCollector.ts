import {useState, useEffect} from 'react';
import useEvents from "../../hooks/useEvents";
import {useConfirm} from "material-ui-confirm";
import eventsApi from "../../api/apiEvents";
import useAuth from "../../hooks/useAuth";
import {useNavigate} from "react-router-dom";

interface DataCollectorProps {
    children: (state: DataCollectorState) => JSX.Element;
}

export interface DataCollectorState {
    data: {
        id: number,
        bandName: string,
        place: string,
        date: Date
        comment: string,
        rating: number,
        appUser: {
            firstName: string,
            lastName: string,
            username: string
        }
    }[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const DataCollector = ({children}: DataCollectorProps) => {
    const {data, refetch} = useEvents();
    const [localData, setLocalData] = useState(data);
    const confirm = useConfirm();
    const { token } = useAuth();
    const navigate = useNavigate()

    const handleEdit = (id: number) => {
        navigate(`/edit-entry/${id}`);
    };

    const handleDelete = async (id: number) => {
        try {

            await confirm({description: "This action is permanent!"});
            await eventsApi.deleteEvent(id, token);
            refetch();
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        setLocalData(data);
    }, [data]);

    return children({
        data: localData,
        onEdit: handleEdit,
        onDelete: handleDelete
    });
};

export default DataCollector;