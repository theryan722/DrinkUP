function removeSkeletonTextEffect(element: string) {
    $$(element).removeClass('skeleton-text skeleton-effect-fade');
}

function applySkeletonTextEffect(element: string) {
    $$(element).addClass('skeleton-text skeleton-effect-fade');
}

//Returns current locale/language
function getLocale() {
    //For some reason typescript doesn't have userLanguage as a property of navigator
    //See: https://techoverflow.net/2018/02/06/how-to-fix-error-ts2339-property-userlanguage-does-not-exist-on-type-navigator/
    //@ts-ignore
    return navigator.language || navigator.userLanguage;
}

//Converts epoch time to proper format in users local time
function formatTimeStamp(time: any, format = 'full') {
    let res: string;
    if (format === 'full') {
        res = new Date(parseFloat(time)).toLocaleDateString(getLocale(), {
            hour: "2-digit",
            minute: "2-digit"
        });
    } else if (format === 'date') {
        res = new Date(parseFloat(time)).toLocaleDateString(getLocale(), {
            hour: "2-digit",
            minute: "2-digit"
        }).split(', ')[0];
    } else if (format === 'time') {
        res = new Date(parseFloat(time)).toLocaleDateString(getLocale(), {
            hour: "2-digit",
            minute: "2-digit"
        }).split(', ')[1];
    } else if (format === 'chart') {
        let d = new Date(time),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        res = [year, month, day].join('-');
    }
    return res;
}

function convertTimestampToDate(timestamp: any): string {
   return timestamp.getFullYear() + '-' + timestamp.getMonth() + '-' + timestamp.getDate();
}