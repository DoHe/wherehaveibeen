if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(() => {
            console.log('Service Worker Registered')
        })
    })
}

const worldPoly = [
    [150, 70],
    [150, -70],
    [-150, -70],
    [-150, 70],
    [150, 70],
];

let map;

function initMap(locs) {
    const { longitude, latitude } = locs[0]
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGVyZG90IiwiYSI6ImNrZGZweDlmNTJjZDMycXBjc2Ztb2R6OW8ifQ.OAQQArXQJvvoV1PHxhe1eA';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: 15
    });
    map.addControl(new mapboxgl.NavigationControl());
    map.on('load', () => {
        addLocations(locs);
    });
}

function addLocations(locs) {
    polys = locs.map((loc) => [
        [loc.longitude + 0.0005, loc.latitude + 0.00025],
        [loc.longitude - 0.0005, loc.latitude + 0.00025],
        [loc.longitude - 0.0005, loc.latitude - 0.00025],
        [loc.longitude + 0.0005, loc.latitude - 0.00025],
        [loc.longitude + 0.0005, loc.latitude + 0.00025],
    ])
    map.addSource('visited-data', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [
                    worldPoly,
                    ...polys
                ]
            }
        }
    });
    map.addLayer({
        'id': 'maine',
        'type': 'fill',
        'source': 'visited-data',
        'layout': {},
        'paint': {
            'fill-color': '#444444',
            'fill-opacity': 0.85
        }
    });
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
    if (!map) {
        initMap(allCoords);
    }
}

navigator.geolocation.watchPosition(gotLocation, (err) => console.error(err));