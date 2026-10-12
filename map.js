var Main;

// Assuming you're using a bundler or ES module-compatible environment

import Map from "https://js.arcgis.com/5.1/@arcgis/core/Map.js";
import Graphic from "https://js.arcgis.com/5.1/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/5.1/@arcgis/core/layers/GraphicsLayer.js";
import ElevationLayer from "https://js.arcgis.com/5.1/@arcgis/core/layers/ElevationLayer.js";
import SceneView from "https://js.arcgis.com/5.1/@arcgis/core/views/SceneView.js";
import Home from "https://js.arcgis.com/5.1/@arcgis/core/widgets/Home.js";
import Search from "https://js.arcgis.com/5.1/@arcgis/core/widgets/Search.js";

Main = (function() {

    const layer = new ElevationLayer({
        url: "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
    });

    const map = new Map({
        basemap: "hybrid",
        ground: {
            layers: [layer]
        }
    });

    const view = new SceneView({
        container: "map",
        viewingMode: "global",
        map: map,

        camera: {
            position: {
                x: -105,
                y: 44,
                z: 8000000,
                spatialReference: {
                    wkid: 4326
                }
            },
            heading: 0,
            tilt: 0
        },

        popup: {
            dockEnabled: true,
            dockOptions: {
                breakpoint: false
            }
        },

        environment: {
            lighting: {
                directShadowsEnabled: true
            }
        }
    });
    const searchWidget = new Search({
    view: view,
    includeDefaultSources: false,

    sources: [{
        name: "My Locations",

        getResults: function(params) {

            const places = [
                {
                    name: "Laramie",
                    coordinates: [-105.5800, 41.3114]
                },
                {
                    name: "Cortland",
                    coordinates: [-76.1805, 42.6012]
                },
                {
                    name: "Polson",
                    coordinates: [-114.1632, 47.6936]
                },
                {
                    name: "Patchogue",
                    coordinates: [-73.0151, 40.7657]
                }
            ];

            return places
                .filter(place =>
                    place.name.toLowerCase().includes(
                        params.suggestTerm.toLowerCase()
                    )
                )
                .map(place => ({
                    name: place.name,
                    feature: {
                        geometry: {
                            type: "point",
                            longitude: place.coordinates[0],
                            latitude: place.coordinates[1]
                        }
                    }
                }));
        }
    }]
});

view.ui.add(searchWidget, "top-right");

const homeBtn = new Home({
    view: view
});

view.ui.add(homeBtn, "top-left");;

    const initMap = function () {

        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        for (const [key, value] of Object.entries(myStuff)) {

            console.log(key, value);

            const point = {
                type: "point",
                x: value.coord[0],
                y: value.coord[1],
                z: 10000
            };

            const markerSymbol = {
                type: "simple-marker",
                color: [255, 140, 0],
                size: 14,
                outline: {
                    color: [255, 255, 255],
                    width: 2
                }
            };

            const pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                popupTemplate: {
                    title: key,
                    content:
                        "<b>City:</b> " + value.city +
                        "<br><b>State:</b> " + value.state
                }
            });

            graphicsLayer.add(pointGraphic);
        }
    };

    initMap();

    // Zoom to point when clicked
    view.on("click", function(event) {

        view.hitTest(event).then(function(response) {

            if (response.results.length > 0) {

                const graphic = response.results[0].graphic;

                view.goTo({
                    target: graphic.geometry,
                    scale: 50000
                });

            }

        });

    });
    

    return {};

})();