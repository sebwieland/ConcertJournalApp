import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useEvents from '../../hooks/useEvents';
import EventsApi from '../../api/apiEvents';
import useAuth from '../../hooks/useAuth';
import dayjs from "dayjs";
import EntryForm from "./EntryForm";


const EditEntryFormPage = () => {
    const eventsApi = EventsApi();

    const { id } = useParams();
    const { data, refetch } = useEvents();
    const { token } = useAuth();
    const [bandName, setBandName] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState(dayjs());
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id ||!data) {
                return;
            }
            try {
                const event = data.find((event: any) => event.id === parseInt(id));
                if (!event) {
                    return;
                }
                setBandName(event.bandName);
                setPlace(event.place);
                // console.log("Edit date: ", event.date)
                // console.log("Edit date corrected: ", dayjs(new Date(event.date[0], event.date[1]-1, event.date[2])))
                setDate(dayjs(new Date(event.date[0], event.date[1]-1, event.date[2])));
                setRating(event.rating);
                setComment(event.comment);
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        };
        fetchEvent();
    }, [id, data]);

    const handleSubmit = async (data: {
        bandName: string;
        place: string;
        date: dayjs.Dayjs;
        rating: number;
        comment: string;
    }) => {
        if (!data.bandName.trim()) {
            setMessage('Please enter a band name');
            setIsSuccess(false);
            return;
        }
        try {
            await eventsApi.updateEvent(parseInt(id!), {
                bandName,
                place,
                date,
                rating,
                comment,
            }, token);
            refetch();
            setMessage('Entry updated successfully!');
            setIsSuccess(true);
        } catch (error) {
            setMessage(`Error updating entry: ${(error as Error).message}`);
            setIsSuccess(false);
        }
    };

    return (
        <EntryForm
            onSubmit={handleSubmit}
            bandName={bandName}
            setBandName={setBandName}
            place={place}
            setPlace={setPlace}
            date={date}
            setDate={setDate}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            message={message}
            isSuccess={isSuccess}
            data={data}
            isUpdate={true}
            showArtistDetailsButton={false}
        />
    );
};

export default EditEntryFormPage;