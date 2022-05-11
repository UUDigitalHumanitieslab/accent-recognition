
// load google maps
(function() {
    // safeguard against qualtrices loading this file multiple times, which might cause issues
    if (window.dfdLoaded) {
        return;
    }

    const AUDIO_ROOT = 'http://localhost:8000/';

    if (typeof google === 'undefined') {
        // restore Array.from (overriden by prototype.js) to avoid potential errors with google maps
        Array.from = top.Array.from;

        let script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + MAPS_API_KEY;
        document.head.appendChild(script);
    }

    const MAP_OPTIONS = {
        center: {
            lat: 53.1145,
            lng: 5.675
        },
        zoom: 9,
        disableDefaultUI: true
    };


    // from: https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
    function haversineDistance([lat1, lon1], [lat2, lon2]) {
        const toRadian = angle => (Math.PI / 180) * angle;
        const distance = (a, b) => (Math.PI / 180) * (a - b);
        const RADIUS_OF_EARTH_IN_KM = 6371;

        const dLat = distance(lat2, lat1);
        const dLon = distance(lon2, lon1);
        lat1 = toRadian(lat1);
        lat2 = toRadian(lat2);

        // Haversine Formula
        const a =
              Math.pow(Math.sin(dLat / 2), 2) +
              Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.asin(Math.sqrt(a));

        let finalDistance = RADIUS_OF_EARTH_IN_KM * c;

        return finalDistance;
    }

    function updateValue(dataBox, loc) {
        let value = JSON.stringify({
            source: document.querySelector('#fragment_location').value,
            response: loc
        });

        // quotes must be escaped because we embed the value using
        // Qualtrics' embedded strings, and that woulde the HTML code
        let escaped = value.replace(/"/g, '&quot;');
        dataBox.value = escaped;
    }

    function insertMap(id, container) {
        let map = {options: MAP_OPTIONS};

        const questionBody = container.querySelector('.QuestionBody');

        const styles = document.createElement('style');
        document.head.appendChild(styles);

        const mapObject = document.createElement('div');
        mapObject.classList.add('question-map');
        questionBody.appendChild(mapObject);

        const googleMap = new google.maps.Map(mapObject, map.options);
        return googleMap;
    }

    function initGoogleMapsQuestion(id, container) {
        let googleMap = insertMap(id, container);

        let dataBox = document.getElementById(`QR~${id}`);
        dataBox.style.display = 'none';

        let played = false;
        document.querySelector('#fragment_audio').addEventListener('play', (event) => {
            document.querySelector('.listen-first').style.opacity = 0;
            played = true;
        });

        let marker = null;
        google.maps.event.addListener(googleMap, 'click', (event) => {
            if (!played) {
                document.querySelector('.listen-first').style.opacity = 1;
                return;
            }
            if (marker === null) {
                marker = new google.maps.Marker({map: googleMap});
            }
            marker.setPosition(event.latLng);
            updateValue(dataBox, event.latLng);

            let next = document.querySelector('#NextButton');
            next.classList.remove('hidden');
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

        // calculate distance and score
        let km = haversineDistance([srcLatLng.lat, srcLatLng.lng],
                                   [data.response.lat, data.response.lng]);

        let score = parseFloat(document.querySelector('#score').value) || 0;
        let points = kmToPoints(km);
        score += points;

        Qualtrics.SurveyEngine.setEmbeddedData('score', score.toFixed(1));

        // present textual feedback
        let feedback = document.querySelector('#pp_feedback');
        feedback.innerHTML = `<p>Your guess was ${km.toFixed(1)}km away from the location of the speaker</p><p>You get ${points} points</p>`;
    }

    // placeholder score formula
    function kmToPoints(km) {
        return Math.floor(10 * Math.max(0, (4 - Math.log(km)) * 5)) / 10;
    }

    function onReadyHandler() {
        let next = document.querySelector('#NextButton');
        // hide the next button until participant responds
        next.classList.add('hidden');
    }

    function initSpeakerFragment(container, audioSrc, correctLocation) {
        // embed some necessary elements into the question html
        let questionBody = container.querySelector('.QuestionText');

        let audio = document.createElement('audio');
        audio.controls = true;
        audio.src = AUDIO_ROOT + audioSrc;
        audio.id = 'fragment_audio';
        questionBody.appendChild(audio);

        let listenFirst = document.createElement('div');
        listenFirst.classList.add('listen-first');
        listenFirst.innerHTML = '<span>Please listen to the speaker first</span>';
        questionBody.appendChild(listenFirst);

        let input = document.createElement('input');
        input.value = correctLocation;
        input.id = input.name = 'fragment_location';
        input.type = 'hidden';
        questionBody.appendChild(input);
    }

    // register global functions
    window.onReadyHandler = onReadyHandler;
    window.initGoogleMapsQuestion = initGoogleMapsQuestion;
    window.initSpeakerFragment = initSpeakerFragment;
    window.showFeedback = showFeedback;
})();
