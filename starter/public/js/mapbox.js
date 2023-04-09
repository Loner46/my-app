/* eslint-disable */
export const displayMap = locations => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoiYWx5b3NoOTYiLCJhIjoiY2xmNTExaHN2MGd1bzQ2cjBlMGZ6bWd5YiJ9.r3508IDZEz3vOdk814MSGg';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/alyosh96/clf516g2z000h01jvj2jhjmlq',
        scrollZoom: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Add(Create) a marker
        const el = document.createElement('div');
        el.className = 'marker';

        new mapboxgl.Marker({
                element: el,
                anchor: 'bottom'
            })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add popup
        new mapboxgl.Popup({
                offset: 30
            })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map)

        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
}