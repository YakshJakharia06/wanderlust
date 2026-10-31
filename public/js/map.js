mapboxgl.accessToken = mapToken;

const coordinates = listing.geometry.coordinates;

if (
	!Array.isArray(coordinates) ||
	coordinates.length !== 2 ||
	!coordinates.every(Number.isFinite)
) {
	console.error("Invalid map coordinates:", coordinates);

} else {

	const map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/streets-v12",
		center: coordinates,
		zoom: 13,
	});

	const popup = new mapboxgl.Popup({
		offset: 25,
		className: "my-class"
	})
		.setHTML(`
      <h5>${listing.location}</h5>
      <p><b>Exact Location will be provided after booking</b></p>
    `)
		.setMaxWidth("300px");

	const markerElement = document.createElement("div");

	markerElement.className = "hover-map-marker";

	markerElement.innerHTML = `
    <i class="fa-solid fa-location-dot location-icon"></i>
    <i class="fa-solid fa-compass fa-flip compass-icon"></i>
`;

	const marker = new mapboxgl.Marker({
		element: markerElement,
		anchor: "bottom"
	})
		.setLngLat(listing.geometry.coordinates)
		.setPopup(popup)
		.addTo(map);



}