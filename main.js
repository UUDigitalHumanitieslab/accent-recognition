
function updateValue(dataBox, loc) {
    let value = JSON.stringify({
        source: document.querySelector('#fragment_location').value,
        response: loc
    });
    let escaped = value.replace(/"/g, '&quot;');
    dataBox.value = escaped;
}

function insertMap(id, container) {
    let map = {};
    map.options = {
        center: {
            lat: 53.1145,
            lng: 5.675
        },
        zoom: 9,
        disableDefaultUI: true
    };

    // css overrides
    document.querySelector('#HeaderContainer').remove();


    const questionBody = container.querySelector('.QuestionBody');
    questionBody.style.setProperty('padding', '0', 'important');

    const styles = document.createElement('style');
    document.head.appendChild(styles);

    const mapObject = document.createElement('div');
    mapObject.setAttribute('id', `${id}-map`);
    styles.innerText += `#${id}-map {height: 600px;}`;

    questionBody.appendChild(mapObject);
    const googleMap = new google.maps.Map(mapObject, map.options);

    return googleMap;
}

function initGoogleMapsQuestion(id, container) {
    let googleMap = insertMap(id, container);

    let dataBox = document.getElementById(`QR~${id}`);
    dataBox.style.display = 'none';

    let marker = null;
    google.maps.event.addListener(googleMap, 'click', (event) => {
        if (marker === null) {
            marker = new google.maps.Marker({map: googleMap});
        }
        marker.setPosition(event.latLng);
        updateValue(dataBox, event.latLng);

        let next = document.querySelector('#NextButton');
        next.style.display = 'block';
    });
}

function showFeedback(id, container) {
    let map = insertMap(id, container);
    let data = JSON.parse(document.querySelector('#response_json').value);
    let srcLatLng = {
        lat: parseFloat(data.source.split(',')[0]),
        lng: parseFloat(data.source.split(',')[1])
    };

    let sourceMarker = new google.maps.Marker({
        map: map,
        position: srcLatLng
    });

    let responseMarker = new google.maps.Marker({
        map: map,
        position: data.response
    });

    let line = new google.maps.Polyline({
        map: map,
        strokeColor: '#1f1',
        strokeOpacity: 0.6,
        path: [srcLatLng, data.response],
    });

    let bounds = new google.maps.LatLngBounds();
    bounds.extend(sourceMarker.position);
    bounds.extend(responseMarker.position);

    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
}

function onReadyHandler() {
    let next = document.querySelector('#NextButton');
    next.style.display = 'none'; // hide until participant responds
    next.style.position = 'fixed';
    next.style.right = '10%';
    next.style.bottom = '5%';
    next.style.fontSize = '35px';
    next.style.borderRadius = '30px';
    next.style.width = next.style.height = '60px';
    next.style.padding = '0';
}
