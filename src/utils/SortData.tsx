export const sortData = (data: any[], sortCriteria: string, sortOrder: string) => {
    if (sortCriteria === 'date') {
        return data.sort((a, b) => {
            const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
            return sortOrder === 'asc' ? dateDiff : -dateDiff;
        });
    } else {
        return data.sort((a, b) => {
            const ratingDiff = b.rating - a.rating;
            return sortOrder === 'asc' ? ratingDiff : -ratingDiff;
        });
    }
};