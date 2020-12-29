import React, { Component } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZWJpYW0iLCJhIjoiY2tkNzFuY3F2MDFtczM0azZiN3libXd1MSJ9.oIxVbKvhmqhQKJASb6iXag";
mapboxgl.setRTLTextPlugin(
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.2/mapbox-gl-rtl-text.js",
  null,
  true // Lazy load the plugin
);
export class MapBox extends Component {
  static displayName = MapBox.name;

  constructor(props) {
    super(props);
    this.mapContainer = React.createRef();
    this.state = {
      lng: -87.61694,
      lat: 41.86625,
      zoom: 3,
    };
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      // center: [-87.61694, 41.86625],
      center: [59.52693627853786, 36.321002170352443],
      zoom: 18,
      pitch: 0,
      bearing: 50,
      antialias: true,
    });

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on("click", "room-extrusion", function (e, v) {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseenter", "room-extrusion", function (e) {
      map.getCanvas().style.cursor = "pointer";
      const description = e.features[0].properties.Layer;

      popup.setLngLat(e.lngLat).setHTML(description).addTo(map);
    });

    map.on("mouseleave", "room-extrusion", function () {
      map.getCanvas().style.cursor = "grab";
      popup.remove();
    });

    map.on("mousedown", function () {
      map.getCanvas().style.cursor = "grabbing";
    });

    map.on("mouseup", function () {
      map.getCanvas().style.cursor = "grab";
    });

    map.on("load", function () {
      map.addSource("floorplan", {
        type: "geojson",
        // data: "/geojson/indoor-3d-map.geojson",
        data: "/maps/mycompany.geojson",
      });
      
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-4">
          <div
            className="box-shadow"
            style={{ height: "50%", backgroundColor: "white" }}
          ></div>
        </div>
        <div className="col-8">
          <div
            className="box-shadow"
            style={{ height: 800, minHeight: "100%", maxHeight: "100%" }}
          >
            <div
              ref={(el) => (this.mapContainer = el)}
              className="mapContainer"
            />
          </div>
        </div>
      </div>
    );
  }
}
