import React, {useState} from 'react';
import dayjs from "dayjs";
import useEvents from "../../hooks/useEvents";
import EntryForm from "./EntryForm";

const CreateNewEntryFormPage = () => {
    const {data, createEvent} = useEvents();
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [bandName, setBandName] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState(dayjs());
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

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
        await createEvent({
            bandName: data.bandName,
            place: data.place,
            date: data.date,
            rating: data.rating,
            comment: data.comment
        }, {
            onSuccess: () => {
                setMessage('New entry created successfully!');
                setIsSuccess(true);
                setPlace('');
                setBandName('');
                setDate(dayjs());
                setRating(0);
                setComment('');
            },
            onError: (error) => {
                setMessage(`Error creating new entry: ${(error as Error).message}`);
                setIsSuccess(false);
            }
        })
    }

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
        />
    );
};

export default CreateNewEntryFormPage;