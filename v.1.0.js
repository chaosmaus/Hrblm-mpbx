
mapboxgl.accessToken = 'pk.eyJ1IjoiYXJ0aHVyY2hhb3NtYXVzIiwiYSI6ImNsazdlYjl6bjA3YjEzZW1ybXZvcHBvancifQ.ZnFzQXq2ZhoR49GIz8lR5Q';

let defaultZoom = 2.00;
if ($(window).width() < 768) {
  defaultZoom = 1;
}

const defaultCenter = [-9.260029, 20.910134];

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/arthurchaosmaus/clk7aq90f02o101qgcmu96vso', // style URL
  center: defaultCenter, // starting position [lng, lat]
  zoom: defaultZoom, // starting zoom
  projection: 'mercator',
  antialias: true,
  interactive: true,
  attributionControl: false
});

map.scrollZoom.disable(); //prevent scrolling zoom

const mapPopover = document.querySelector('.map-popover');
const sectionHeadingAndSubtitleContainer = document.querySelector('.map-heading_container');

mapPopover.style.opacity = 0;

map.on('movestart', function (e) {
  if (e.originalEvent) {
    mapPopover.style.opacity = 0;

    setTimeout(function () {
      mapPopover.style.display = 'none';
    }, 300);
  }
});

map.on('click', function (e) {
  map.flyTo({
    zoom: defaultZoom,
    duration: 1500,
    center: defaultCenter,
    essential: true
  });

  mapPopover.style.opacity = 0;

  setTimeout(function () {
    mapPopover.style.display = 'none';
    sectionHeadingAndSubtitleContainer.style.opacity = 1;
  }, 300);
});

// initialize the geojson object
const highlightedPins = {
  "features": []
};

// get all elements with the class 'map-popover_cms-item'
let elements = document.querySelectorAll('.map-popover-cms');

// iterate over each element
elements.forEach(element => {
  // extract the necessary information from each element
  let name = element.querySelector('.map-popover_cms-name').innerText;
  let location = element.querySelector('.map-popover_cms-location').innerText;
  let avatar = element.querySelector('.map-popover_cms-avatar').src;
  let thumbnail = element.querySelector('.map-popover_cms-thumbnail').src;
  let membersince = parseInt(element.querySelector('.map-popover_cms-member-since').innerText, 10);
  let quote = element.querySelector('.map-popover_cms-quote').innerText;
  let coordinatesText = element.querySelector('.map-popover_cms-coordinates').innerText;
  let coordinates = coordinatesText.split(',').map(Number);

  // create a new geojson feature for each element
  let feature = {
    "type": "Feature",
    "properties": {
      "name": name,
      "location": location,
      "avatar": avatar,
      "thumbnail": thumbnail,
      "memberSince": membersince,
      "quote": quote
    },
    "geometry": {
      "coordinates": coordinates,
      "type": "Point"
    }
  };

  // add the new feature to the geojson object
  highlightedPins.features.push(feature);
});

console.log(highlightedPins);

for (const feature of highlightedPins.features) {
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.backgroundImage = `url(${feature.properties.avatar})`;

  el.addEventListener('click', (e) => {
    const coordinates = feature.geometry.coordinates;
    const name = feature.properties.name;
    const location = feature.properties.location;
    const avatar = feature.properties.avatar;
    const thumbnail = feature.properties.thumbnail;
    const memberSince = feature.properties.memberSince;
    const quote = feature.properties.quote;
    console.log(quote);
    map.flyTo({
      zoom: 3.0,
      duration: 1500,
      center: [coordinates[0] + 50, coordinates[1]],
      essential: true
    });


    const mapPopoverThumbnail = document.querySelector('.map-popover_thumbnail');
    const mapPopoverTitle = document.querySelector('.map-popover_heading');
    const mapPopoverSubtitle = document.querySelector('.map-popover_member-since');
    const mapPopoverQuote = document.querySelector('.map-popover_quote');


    sectionHeadingAndSubtitleContainer.style.opacity = 0;

    mapPopoverThumbnail.setAttribute('src', '');
    mapPopoverThumbnail.setAttribute('srcset', '');

    mapPopoverThumbnail.setAttribute('src', thumbnail);
    mapPopoverThumbnail.setAttribute('srcset', thumbnail);

    mapPopoverTitle.innerHTML = name + ' in ' + location;
    mapPopoverSubtitle.innerHTML = 'Hirebloom member since ' + memberSince;

    mapPopoverQuote.innerHTML = quote;

    mapPopover.style.display = 'flex';

    setTimeout(function () {
      mapPopover.style.opacity = 1;
    }, 300);

    e.stopPropagation();
  });

  new mapboxgl.Marker(el)
    .setLngLat(feature.geometry.coordinates)
    .addTo(map);
};
