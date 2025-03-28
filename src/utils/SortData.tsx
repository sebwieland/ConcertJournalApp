export const sortData = (data: any[], sortCriteria: string, sortOrder: string) => {
    if (sortCriteria === 'date') {
        return data.sort((a, b) => {
            const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
            return sortOrder === 'asc' ? dateDiff : -dateDiff;
        });
    } else {
        return data.sort((a, b) => {
            const ratingDiff = a.rating - b.rating;
            return sortOrder === 'asc' ? ratingDiff : -ratingDiff;
        });
    }
};