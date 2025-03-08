
// let mapToken= mapToken;
// console.log(mapToken);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 8 // starting zoom
});

// console.log(listing.geometry.coordinates);

    

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.title}</h4><p>exact location will be provided after booking`))
    .addTo(map);

    // const marker2 = new mapboxgl.Marker({ color: "black" })
    // .setLngLat([73.5204,18.5204])
    // .setPopup(new mapboxgl.Popup({ offset: 25 })
    //     .setHTML(`<h4>${listing.price}</h4>`))
    // .addTo(map);

    // const marker1 = new mapboxgl.Marker({ color: "blue" })
    // .setLngLat([74.1607,17.6966])
    // .setPopup(new mapboxgl.Popup({ offset: 25 })
    //     .setHTML(`<h4>${listing.title}</h4><p>exact location will be provided after booking`))
    // .addTo(map);
