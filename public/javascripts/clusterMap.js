mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'cluster-map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [77.2088, 28.6139],
        zoom: 4
    });

    map.on('load', () => {
        map.addSource('campgrounds', {
            type: 'geojson',
            data: campgrounds,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50 
        });

        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'campgrounds',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#448AFF',
                    20,
                    '#00B8D4',
                    50,
                    '#00C853'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    20,
                    30,
                    50,
                    40
                ]
            }
        });

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'campgrounds',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'campgrounds',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 10,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
        });

        // inspect a cluster on click
        map.on('click', 'clusters', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            const clusterId = features[0].properties.cluster_id;
            map.getSource('campgrounds').getClusterExpansionZoom(
                clusterId,
                (err, zoom) => {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });

        map.on('click', 'unclustered-point', (e) => {
         const text = e.features[0].properties.popUpMarkup;
            const coordinates = e.features[0].geometry.coordinates.slice();

            if (['mercator', 'equirectangular'].includes(map.getProjection().name)) {
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(
                    text
                )
                .addTo(map);
        });

        map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
        });

        map.addControl(new mapboxgl.NavigationControl());
    });