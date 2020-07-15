if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(() => {
            console.log('Service Worker Registered')
        })
    })
}

function gotLocation(geo) {
    if (!geo) {
        return
    }
    const { coords } = geo
    const { longitude, latitude } = coords;
    if (longitude === undefined || latitude === undefined) {
        return
    }
    const past = localStorage.getItem('geolocations');
    let allCoords = [];
    if (past) {
        allCoords = JSON.parse(past);
    }
    allCoords.push({ longitude, latitude });
    allCoords = _.uniqWith(allCoords, _.isEqual)
    localStorage.setItem('geolocations', JSON.stringify(allCoords));
}

navigator.geolocation.watchPosition(gotLocation, (err) => console.error(err));