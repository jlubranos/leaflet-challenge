function getColor(depth) {

  if (depth<10) {
    return "#80ff00";
  }
  else if (depth<30) {
    return "#bfff00";
  }
  else if (depth<50) {
    return "#ffbf00";
  }
  else if (depth<70) {
    return "#ff8000";
  }
  else if (depth<90) {
    return "#ff4000";
  }
  else {
    return "#ff0000";
  }
}

function createLegend(myMap) {

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend'),
    depth = [.10, 10, 30, 50, 70, 90],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(depth[i])  + '"></i> ' +
          depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
}

function createMap(earthquakes) {

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Light Map": lightmap
  };

  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  var myMap = L.map("mapid", {
    center: [50.09, -95.71],
    zoom: 3,
    layers: [lightmap, earthquakes]
  });
    
  L.control.layers(baseMaps, overlayMaps, {
    collapsed:false
  }).addTo(myMap);

  createLegend(myMap);
}
  
function createMarkers(response)  {
  var locations=response.features;
  var earthquakeMarkers=[];

  for (var index = 0; index<locations.length;index++) {
    var location=locations[index];
    var longitude=location.geometry.coordinates[0];
    var latitude=location.geometry.coordinates[1];
    var depth=location.geometry.coordinates[2];
    var place=location.properties.place;
    var magnitude=location.properties.mag;

    var color=getColor(depth);

    var earthquakeMarker = L.circle([latitude,longitude], {
      fillOpacity:0.75,
      color: color,
      fillColor: color,
      radius: magnitude*5000
    }).bindPopup("<h3>" + place + "<h3><h3>Magnitude: " + magnitude);

    earthquakeMarkers.push(earthquakeMarker);
  }
  createMap(L.layerGroup(earthquakeMarkers));
}
  
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);