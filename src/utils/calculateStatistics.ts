import dayjs from "dayjs";

interface Statistics {
    mostSeenArtist: string;
    mostArtistsOnASingleDay: number;
    mostVisitedLocation: string;
}

interface ConcertData {
    id: number;
    bandName: string;
    place: string;
    date: string[];
    comment: string;
    rating: number;
    appUser: {
        firstName: string;
        lastName: string;
        username: string;
    };
}

const calculateStatistics = (entries: ConcertData[] = []): Statistics => {
    if (entries.length === 0) {
        return {
            mostSeenArtist: "",
            mostArtistsOnASingleDay: 0,
            mostVisitedLocation: "",
        };
    }
    const bandCount: { [bandName: string]: number } = {};
    const locationCount: { [location: string]: number } = {};
    const dailyBandCount: { [date: string]: number } = {};

    entries.forEach((item) => {
        const date = dayjs(item.date[0], item.date[1], item.date[2]);
        const dateString = date.toISOString().split('T')[0];
        bandCount[item.bandName] = (bandCount[item.bandName] || 0) + 1;
        locationCount[item.place] = (locationCount[item.place] || 0) + 1;
        dailyBandCount[dateString] = (dailyBandCount[dateString] || 0) + 1;
    });


    const mostSeenArtist = Object.keys(bandCount).reduce((a, b) => bandCount[a] > bandCount[b] ? a : b);
    const mostVisitedLocation = Object.keys(locationCount).reduce((a, b) => locationCount[a] > locationCount[b] ? a : b);
    const mostArtistsOnASingleDay = Math.max(...Object.values(dailyBandCount));

    return {
        mostSeenArtist: mostSeenArtist,
        mostArtistsOnASingleDay: mostArtistsOnASingleDay,
        mostVisitedLocation: mostVisitedLocation
    };
}

export default calculateStatistics;

