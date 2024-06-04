export const formatTime = (time) => {
    if (!time || typeof time !== 'string' || !time.includes(':')) {
        throw new Error('Invalid time format. Expected a string in HH:MM format.');
    }

    const [hoursString, minutes] = time.split(':');
    const hours = parseInt(hoursString, 10);

    if (isNaN(hours) || isNaN(parseInt(minutes, 10))) {
        throw new Error('Invalid time format. Hours and minutes should be numbers.');
    }

    const hour = (hours % 12) || 12;
    const period = hours >= 12 ? 'pm' : 'am';
    const formattedTime = `${hour}:${minutes} ${period}`;

    return formattedTime;
}

export const formatDate = (date) => {
    const dt = new Date(date);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[dt.getMonth()];

    const day = dt.getDate();
    const daySuffix = (() => {
        if (day % 10 === 1 && day !== 11) return "st";
        if (day % 10 === 2 && day !== 12) return "nd";
        if (day % 10 === 3 && day !== 13) return "rd";
        return "th";
    })();

    const year = dt.getFullYear();
    const formattedDate = `${monthName} ${day}${daySuffix} ${year}`;
    return formattedDate;
}