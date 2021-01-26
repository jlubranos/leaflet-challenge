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
      var div = L.DomUtil.create('div', 'legend'),
      depth = [".10", "10", "30", "50", "70", "90"],
      labels=["<strong>EQ Depths</strong>"];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < depth.length; i++) {
        labels.push(
          '<i style="background:' + getColor(parseFloat(depth[i])) + '"></i> ' + "<span>" + depth[i] + (depth[i+1] ? '&ndash;' + depth[i+1] : '+') + "</span>"
        );
      }
      div.innerHTML=labels.join("<br>");
      return div;
    };
    legend.addTo(myMap);
  }
  
  function createMap(earthquakes,tplates) {
    
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id:"mapbox/satellite-streets-v11",
      accessToken: API_KEY
    });
  
    var baseMaps = {
      "Light Map": lightmap
    };
  
    var overlayMaps = {
      "Earthquakes": earthquakes,
      "Techtonic :": tplates
    };
  
    var myMap = L.map("mapid", {
      center: [50.09, -95.71],
      zoom: 3,
      layers: [lightmap, earthquakes, tplates]
    });

    L.control.layers(baseMaps, overlayMaps, {
      collapsed:false
    }).addTo(myMap);
  
    createLegend(myMap);
  }
    
  function createMarkers(eqdata, tplates)  {
    var locations=eqdata.features;
    var tpoints=tplates.features;
    var earthquakeMarkers=[];
    var tpointlocations=[];
  
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
      }).bindPopup(`<h3>${place}<hr>Magnitude: ${magnitude}<br>Depth: ${depth}`);
      earthquakeMarkers.push(earthquakeMarker);
    }

    for (var index = 0; index<tpoints.length; index++) {
      var points=tpoints[index].geometry.coordinates[0];
      var polygon=L.polygon(points, {
        color: "yellow",
        fillColor: "Transparent",
        fillOpacity: 0
      });
      tpointlocations.push(polygon);
    }
    console.log("tpoint :",tpointlocations);
    createMap(L.layerGroup(earthquakeMarkers),L.layerGroup(tpointlocations));
  }
    

var eqdata="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var geoData="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

d3.json(eqdata, function(eqdata) {
    d3.json(geoData, function(tplates) {
        console.log(tplates);
        console.log("Feature :",tplates.features[0].geometry.coordinates[0])
        console.log("Feature :",tplates.features[1].geometry.coordinates[0])
        console.log("Feature :",tplates.features[0].geometry.coordinates[0][1])
        console.log("Feature :",tplates.features[0].geometry.coordinates[0][1][0])
        console.log("Feature :",tplates.features[0].geometry.coordinates[0][1][1])
        createMarkers(eqdata, tplates);
    });
});