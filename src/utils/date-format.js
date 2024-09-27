exports.dateFormat = (date) => {
    const formatter = new Intl.DateTimeFormat('en-US');
    return formatter.format(new Date(date));
}

exports.specialDateFormat = (date) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: "numeric",
        day: 'numeric'
    })
    let d = formatter.format(new Date(date));
    d = d.split(' ');
    let day = parseInt(d[1]);
    if (day > 3 && day < 21) day = `${day}th`
    else {
        switch (day % 10) {
            case 1: day = `${day}st`;
            case 2: day = `${day}nd`;
            case 2: day = `${day}rd`;
            default: day = `${day}th`;
        }
    }

    return `${d[0]} ${day} ${d[2]}`
}