import useEvents from "../../hooks/useEvents";
import {useConfirm} from "material-ui-confirm";
import EventsApi from "../../api/apiEvents";
import useAuth from "../../hooks/useAuth";
import {useNavigate} from "react-router-dom";
import {JSX} from "react";

interface DataCollectorProps {
    children: (state: DataCollectorState) => JSX.Element;
}

export interface DataCollectorState {
    data: {
        id: number,
        bandName: string,
        place: string,
        date: string[]
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
    const eventsApi = EventsApi();
    const {data, refetch} = useEvents();
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

    return children({
        data,
        onEdit: handleEdit,
        onDelete: handleDelete
    });
};

export default DataCollector;