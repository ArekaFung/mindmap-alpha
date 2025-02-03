//noticed 20240608

-   existing overlapped nodes not moved when adding child at that height
-   change firebase structure such that board data is not 1:1 to user
    -   currently board data is enclosed UID
    -   should change to owner/writer/reader/accessor in board info
-   maybe add the listener for firebase data change to allow WS like features

//before 20240608

-   validation between unique nodes and spawned nodes
    -   foreach spawned nodes, if contains child not in the unique node's children array
        -   add child to "prune list"
        -   recursion add all of its child to "prune list"
        -   remove all the nodes in "prune list" from spawned nodes
    -   foreach spawned nodes, if missing child not in the unique node's children array
        -   add unique node's parent and child id to "add list"
        -   run normal add child logics for the "add list"
    -   check spawned nodes ids
        -   find any that is not referenced as a child by another node (except the root) -> simply remove the spawned node
        -   find any duplicate references
            -   keep one reference only
            -   all the others -> do "add list" and run normal add child logics like above
-   use immer in zustand stores?
    -   https://dev.to/franciscomendes10866/zustand-and-immer-with-react-5ajh
    -   https://github.com/pmndrs/zustand
-   chagne to use subscribeWithSelector in listeners instead of useEffect
-   track last update time of board
    -   allow download nodes once and maintain at local (instead of read from database each time change board)
-   offline mode

    -   limited feature?
        -   eg only one VS same functionality as online multiple
    -   maintain the state before sign in (if any)

-   if node move pass x = 0 (ie from right to left or vice-versa)
    -   rescursively change all child nodes' x to -x (or vice-versa)



// 20250203
Google Maps API
https://developers.google.com/maps/documentation/javascript/places
Google Maps API (example)
https://developers.google.com/maps/documentation/javascript/examples/place-search

//sample code from POE for Google Maps API
//html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Maps Example</title>
    <style>
        #map {
            height: 400px; /* Set the height of the map */
            display: none; /* Initially hidden */
        }
    </style>
</head>
<body>
    <h1>Click to Show Map</h1>
    <button id="showMapButton">Show Map</button>
    <div id="map"></div>

    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
    <script src="app.js"></script>
</body>
</html>

//ts
// Define the coordinates
const coordinates = { lat: 22.3964, lng: 114.1099 }; // Example: Central, Hong Kong

// Function to initialize the map
function initMap(): void {
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: coordinates,
        zoom: 14,
    });

    // Add a marker at the coordinates
    new google.maps.Marker({
        position: coordinates,
        map: map,
        title: "Central, Hong Kong",
    });
}

// Set up the button click event to show the map
document.getElementById("showMapButton")?.addEventListener("click", () => {
    const mapDiv = document.getElementById("map") as HTMLElement;
    mapDiv.style.display = "block"; // Show the map div
    initMap(); // Initialize the map
});