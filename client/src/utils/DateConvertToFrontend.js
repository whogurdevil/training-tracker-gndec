import dayjs from 'dayjs';

export const convertBackendDateToPickerFormat = (backendDate) => {
    if (!backendDate) return null;

    // Extract year, month, and day from the backend date string
    const [datePart, timePart] = backendDate.split(' ');
    const [year, month, day] = datePart.split('-');

    // Create a new Day.js object with the extracted date parts
    const formattedDate = dayjs(`${year}-${month}-${day}`);

    return formattedDate.isValid() ? formattedDate : null;
};
export const convertBatchToDate = (backendDate) => {
    if (!backendDate) return null;

    // Extract year, month, and day from the backend date string
    const [datePart, timePart] = backendDate.split(' ');
    const [year] = datePart.split('-');
    
    // Create a new Day.js object with the extracted date parts
    const formattedDate = dayjs(year);

    return formattedDate.isValid() ? formattedDate : null;
};