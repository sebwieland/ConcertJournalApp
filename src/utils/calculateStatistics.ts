interface Statistics {
    mostSeenBand: string;
    mostBandsOnASingleDay: number;
    mostVisitedLocation: string;
}

interface ConcertData {
    id: number;
    bandName: string;
    place: string;
    date: Date;
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
            mostSeenBand: "",
            mostBandsOnASingleDay: 0,
            mostVisitedLocation: "",
        };
    }
    const bandCount: { [bandName: string]: number } = {};
    const locationCount: { [location: string]: number } = {};
    const dailyBandCount: { [date: string]: number } = {};

    entries.forEach((item) => {
        const date = new Date(item.date); // assuming item.date is a valid Date object
        const dateString = date.toISOString().split('T')[0];
        bandCount[item.bandName] = (bandCount[item.bandName] || 0) + 1;
        locationCount[item.place] = (locationCount[item.place] || 0) + 1;
        dailyBandCount[dateString] = (dailyBandCount[dateString] || 0) + 1;
    });


    const mostSeenBand = Object.keys(bandCount).reduce((a, b) => bandCount[a] > bandCount[b] ? a : b);
    const mostVisitedLocation = Object.keys(locationCount).reduce((a, b) => locationCount[a] > locationCount[b] ? a : b);
    const mostBandsOnASingleDay = Math.max(...Object.values(dailyBandCount));

    return {mostSeenBand, mostBandsOnASingleDay, mostVisitedLocation};
}

export default calculateStatistics;
