(function() {
    // safeguard against qualtrices loading this file multiple times, which might cause issues
    if (window.dfdLoaded) {
        return;
    }

    const AUDIO_ROOT = 'http://localhost:8000/';
    const KM_THRESHOLD = 5;
    const FRIESLAND_POLYGON = [[4.8183758,53.2142748],[5.0509526,53.1432657],[5.164249,53.0010037],[5.1691346,52.9976124],[5.2386819,52.874061],[5.3772598,52.7648052],[5.6313527,52.8030546],[5.6602961,52.8312504],[5.709636,52.8348167],[5.7147217,52.837375],[5.7273198,52.8367476],[5.7246821,52.8439822],[5.7488074,52.8396796],[5.7843822,52.8174758],[5.7898067,52.8036915],[5.8098424,52.8138018],[5.8194968,52.8172509],[5.8249877,52.8131645],[5.8336295,52.8116558],[5.8392801,52.8062398],[5.8651542,52.8047227],[5.8787627,52.8008488],[5.8831096,52.8041097],[5.8978815,52.8078033],[5.9088758,52.8138254],[5.9145943,52.819197],[5.9243402,52.8239917],[5.9233232,52.8311603],[5.9326309,52.8354308],[5.9560846,52.8378247],[5.9724382,52.8419167],[5.9864791,52.8216933],[5.9966432,52.8166213],[6.0074835,52.8200465],[6.024559,52.8225447],[6.0311685,52.8149907],[6.0599511,52.8261185],[6.0526074,52.8373391],[6.0615004,52.8392966],[6.0810003,52.8387323],[6.0923626,52.8442818],[6.1209948,52.8546498],[6.1659932,52.8750266],[6.2069001,52.8907439],[6.2322911,52.9134382],[6.2448297,52.919587],[6.247553,52.9236917],[6.2565931,52.9276412],[6.3029853,52.9249724],[6.3332806,52.9063561],[6.3934358,52.9328434],[6.4276147,52.9718154],[6.3625214,53.033969],[6.3677865,53.0673777],[6.3052738,53.0811896],[6.3151575,53.0940528],[6.2905657,53.0998291],[6.2830504,53.1068631],[6.2741389,53.1111612],[6.2583724,53.1143713],[6.2345469,53.1134648],[6.2050483,53.1154842],[6.1752349,53.1359026],[6.1772507,53.1667672],[6.1813755,53.1705567],[6.1881344,53.1827497],[6.1995423,53.1981639],[6.2092338,53.199827],[6.219504,53.2063754],[6.2299901,53.2178387],[6.2250055,53.2296148],[6.2181748,53.2316157],[6.2155426,53.2369852],[6.2179783,53.2419321],[6.2319658,53.2469318],[6.2388436,53.2628067],[6.2452155,53.2676283],[6.2558035,53.2705528],[6.2514317,53.277106],[6.253187,53.2878592],[6.2578899,53.2906161],[6.2707231,53.2916461],[6.2783072,53.3027309],[6.2890741,53.3049083],[6.2924623,53.310288],[6.2805047,53.3126059],[6.2869808,53.3413818],[6.2736804,53.3452715],[6.2556596,53.3483881],[6.2465388,53.3469828],[6.2379178,53.3427805],[6.2324189,53.3434394],[6.2240025,53.3551051],[6.2150371,53.3583975],[6.1877139,53.3620783],[6.1785885,53.3648278],[6.1695791,53.3768505],[6.1679447,53.3907591],[6.1940203,53.4132888],[6.3504262,53.4462685],[6.3515669,53.4970416],[6.3666329,53.4969201],[6.4022099,53.4940082],[6.4089911,53.4948528],[6.4177514,53.5002954],[6.4160097,53.5129892],[6.4044491,53.5208856],[6.3822724,53.5215014],[6.3672492,53.5238708],[6.3521231,53.5217464],[6.3525281,53.5397134],[6.3220716,53.5264757],[6.1861282,53.5139753],[6.1259923,53.5233436],[6.1104612,53.496483],[6.0501248,53.4923374],[6.0049286,53.4925775],[5.9596119,53.4838163],[5.8390154,53.4753439],[5.7034426,53.4712836],[5.6132093,53.4939486],[5.5528559,53.4715849],[5.4925875,53.4581756],[5.357119,53.4312636],[5.1766933,53.4086213],[5.1617743,53.3861317],[5.1017784,53.3680343],[5.087069,53.3230725],[5.0271173,53.3139226],[4.9076899,53.2595929],[4.8406016,53.2323495],[4.8183758,53.2142748]];


    if (typeof google === 'undefined') {
        // Qualtrics includes a copy of prototype.js, which by default overrides Array.from.
        // Google Maps doesn't like it, so I looked for way to restore the original function,
        // and the following is the only way I could think of.
        let iframe = document.createElement('iframe');
        iframe.src = '';
        iframe.style.display = 'none';
        // iframe has to be added to the document to get a contentWindow
        document.body.appendChild(iframe);
        Array.from = iframe.contentWindow.Array.from;
        iframe.remove();

        let script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + MAPS_API_KEY;
        document.head.appendChild(script);
    }

    const MAP_OPTIONS = {
        center: {
            lat: 53.1836,
            lng: 5.6229,
        },
        restriction: {
            latLngBounds: {
                south: 52.5648052,
                north: 53.7397134,
                west: 4.6183758,
                east: 6.6276147
            },
            strictBounds: false,
        },
        zoom: 8.5,
        disableDefaultUI: true,
        zoomControl: true
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
        let map = insertMap(id, container);

        let dataBox = document.getElementById(`QR~${id}`);
        dataBox.style.display = 'none';

        let played = false;
        document.querySelector('#fragment_audio').addEventListener('play', (event) => {
            document.querySelector('.listen-first').style.opacity = 0;
            played = true;
        });

        let marker = null;
        google.maps.event.addListener(map, 'click', (event) => {
            if (!played) {
                document.querySelector('.listen-first').style.opacity = 1;
                return;
            }
            if (marker === null) {
                marker = new google.maps.Marker({map: map});
            }
            marker.setPosition(event.latLng);
            updateValue(dataBox, event.latLng);

            let next = document.querySelector('#NextButton');
            next.classList.remove('hidden');
        });

        // draw polygon with hole around Friesland
        let outer = [
            {lat:0, lng:0},
            {lat:180, lng:0},
            {lat:180, lng:100},
            {lat:0, lng:100},
        ];
        let inner = FRIESLAND_POLYGON.map((coord) => {return {lat: coord[1], lng: coord[0]}});
        let poly = new google.maps.Polygon({
            paths: [outer, inner],
            strokeColor: "#000000",
            strokeOpacity: 0.2,
            strokeWeight: 2,
            fillColor: "#000000",
            fillOpacity: 0.35,
        });

        poly.setMap(map);
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
        return km <= KM_THRESHOLD ? 5 : 0;
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
