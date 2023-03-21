(function() {
    // safeguard against qualtrices loading this file multiple times, which might cause issues
    if (top.window.dfdLoaded) {
        return;
    }
    top.window.dfdLoaded = true;

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
	window.doNothing = function() {}; // empty callback for maps API
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=doNothing&key=' + MAPS_API_KEY;
        document.head.appendChild(script);
    }

    const MAP_ZOOM = 8.5;
    const MAP_OPTIONS = {
        center: {
            lat: 53.1636,
            lng: 5.6329,
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
        zoom: MAP_ZOOM,
        disableDefaultUI: true,
        zoomControl: true
    };


    // const ROOT = 'http://localhost:8000/';
    const ROOT = 'https://dhstatic.hum.uu.nl/dialect-drongo-ii/';
    const AUDIO_ROOT = ROOT;

    let MAP_POLYGONS = {coords:[
        [[5.24345663,53.36611065],[5.25681242,53.37272799],[5.2781816,53.37336628],[5.29349793,53.37043935],[5.31291176,53.3803588],[5.32424853,53.37715296],[5.35679279,53.38776948],[5.37770936,53.40002643],[5.39715817,53.40414645],[5.4547521,53.40404829],[5.47509627,53.4095082],[5.44802182,53.41716721],[5.48642414,53.41234686],[5.46536681,53.42148445],[5.46424545,53.42543536],[5.48089208,53.41853818],[5.50934536,53.42843579],[5.5300402,53.43025356],[5.54378658,53.4339174],[5.55438229,53.44311729],[5.53619607,53.44743614],[5.51260456,53.44823893],[5.47895804,53.44331621],[5.41812786,53.43011456],[5.36474687,53.4204998],[5.31494339,53.41293268],[5.27588825,53.4081914],[5.20642346,53.39693826],[5.19439112,53.3939411],[5.1801173,53.38024033],[5.16452113,53.3705895],[5.15062926,53.35619641],[5.17408746,53.34724703],[5.18484409,53.34570181],[5.21245205,53.35604599],[5.22118443,53.36420917],[5.24345663,53.36611065],[5.24345663,53.36611065]],[[5.06187445,53.2930459],[5.07588632,53.29627303],[5.09048855,53.29500498],[5.09845213,53.30453222],[5.06409371,53.30785251],[5.02597514,53.2981594],[5.00363873,53.29001542],[4.96004835,53.2709888],[4.9246317,53.25132618],[4.86495287,53.22575645],[4.85366173,53.22296224],[4.84979969,53.21269116],[4.85615412,53.20510959],[4.87433907,53.21364353],[4.8883687,53.21564971],[4.90951974,53.21477266],[4.93436224,53.22751927],[4.93263825,53.23687381],[4.96419206,53.25249772],[4.9772279,53.25348746],[4.97211056,53.26486205],[4.9875349,53.27089734],[5.03206761,53.28064747],[5.06187445,53.2930459],[5.06187445,53.2930459]],[[5.15966926,53.29600171],[5.12798757,53.29924131],[5.11358835,53.2890667],[5.113491,53.28371417],[5.12928304,53.28549111],[5.14820829,53.29474332],[5.15966926,53.29600171],[5.15966926,53.29600171]],[[6.06074,53.4513042],[6.0546227,53.45712811],[6.0464827,53.45031012],[6.05209881,53.44667262],[6.06074,53.4513042],[6.06074,53.4513042]],[[6.04349574,53.48008251],[6.03029855,53.47413817],[6.03787981,53.47151442],[6.04349574,53.48008251],[6.04349574,53.48008251]],[[5.45541872,52.85226021],[5.45544265,52.85150902],[5.45918207,52.85165335],[5.45541872,52.85226021],[5.45541872,52.85226021]],[[5.37010978,53.0624989],[5.37531823,53.05598088],[5.39525986,53.05574584],[5.38094248,53.07257139],[5.36401286,53.07490089],[5.37010978,53.0624989],[5.37010978,53.0624989]],[[5.67429916,53.47009018],[5.6891946,53.46527715],[5.67830473,53.47058519],[5.67429916,53.47009018],[5.67429916,53.47009018]],[[5.73094291,53.45925518],[5.6883063,53.46024654],[5.66302951,53.46587349],[5.66172785,53.46976745],[5.64461806,53.46982451],[5.63029961,53.46500975],[5.61521428,53.45405737],[5.61226398,53.44772896],[5.62000555,53.43595382],[5.6500347,53.42426832],[5.66870577,53.42032782],[5.70328126,53.42977984],[5.73000688,53.4430248],[5.77647528,53.43843581],[5.80478236,53.43752276],[5.83480647,53.4432824],[5.89221303,53.45202771],[5.90583213,53.4571174],[5.95848687,53.45629783],[5.97121208,53.45901211],[5.972322,53.46503682],[5.94906378,53.46823847],[5.88361025,53.46678957],[5.7846554,53.46079659],[5.73094291,53.45925518],[5.73094291,53.45925518]],[[6.13256634,53.49268276],[6.12295896,53.48614008],[6.11671312,53.47341207],[6.12496406,53.47146204],[6.12573318,53.48799135],[6.13256634,53.49268276],[6.13256634,53.49268276]],[[6.3254309,53.50268189],[6.34225724,53.50111819],[6.36485523,53.50721047],[6.36348391,53.51113359],[6.33387606,53.51142568],[6.28849975,53.50670514],[6.25652372,53.50488285],[6.1810367,53.50258432],[6.14072624,53.50380692],[6.13834939,53.49995198],[6.15434677,53.49804774],[6.13594233,53.48938443],[6.12907451,53.47644763],[6.13442042,53.4665293],[6.12568815,53.46060757],[6.13227227,53.45193372],[6.15084324,53.45815283],[6.16100816,53.47205556],[6.19740411,53.4727725],[6.22748125,53.47695431],[6.24540343,53.47652341],[6.26919832,53.4837728],[6.27636466,53.48966617],[6.29809608,53.49311721],[6.3254309,53.50268189],[6.3254309,53.50268189]],[[6.24721295,52.92333152],[6.25661182,52.92765707],[6.30263033,52.92508211],[6.3333222,52.90639222],[6.39353787,52.93281756],[6.42764131,52.97179185],[6.36278984,53.03367509],[6.36769438,53.06732433],[6.30532645,53.08113075],[6.31523624,53.09405002],[6.2907375,53.09979773],[6.28304009,53.10684393],[6.26191997,53.11424604],[6.23935543,53.11342503],[6.20495801,53.11559334],[6.17568802,53.1350941],[6.17733799,53.16676099],[6.19969091,53.19842644],[6.21894415,53.20590935],[6.22987639,53.21765143],[6.22447536,53.2300266],[6.21449188,53.23376236],[6.2249268,53.23877254],[6.21845052,53.2416924],[6.23128049,53.24529581],[6.22945957,53.24978228],[6.24665027,53.26825903],[6.25497,53.26851816],[6.25145228,53.2771644],[6.2542381,53.28866737],[6.26840316,53.28977377],[6.27941329,53.30336658],[6.29407366,53.30840764],[6.28048983,53.31253858],[6.28689425,53.34102788],[6.25342071,53.34797375],[6.23596347,53.3414311],[6.22297906,53.34584327],[6.23531074,53.33715586],[6.22928894,53.33197835],[6.22135367,53.34229414],[6.21756338,53.35372374],[6.20487282,53.354004],[6.1974701,53.34425088],[6.19657748,53.35276618],[6.18111721,53.35726684],[6.1750498,53.34982043],[6.19239923,53.33321913],[6.17085066,53.34432359],[6.16216084,53.36498181],[6.16440281,53.37576181],[6.1555255,53.39241622],[6.15886094,53.40822158],[6.13882625,53.40343668],[6.09421054,53.4080564],[6.08548871,53.40441571],[6.06914931,53.40730882],[6.0241345,53.40365734],[5.92884483,53.38719078],[5.87999407,53.38805623],[5.86831331,53.38078067],[5.7996398,53.35993267],[5.78483523,53.35702833],[5.73016815,53.3398298],[5.71890688,53.33486325],[5.68154607,53.32434481],[5.65422799,53.32048479],[5.62575802,53.31106459],[5.58711642,53.30050933],[5.56077772,53.28454674],[5.55474527,53.27447814],[5.54594797,53.27095258],[5.52748421,53.2574635],[5.48255368,53.24048962],[5.46225046,53.22673258],[5.44768245,53.21952285],[5.43782773,53.20977758],[5.4218257,53.18489939],[5.43899106,53.19384193],[5.40978553,53.17481699],[5.4151095,53.16892815],[5.40970713,53.13741109],[5.4044487,53.12163146],[5.39902789,53.11610897],[5.3790729,53.10808635],[5.38238611,53.10460345],[5.37712406,53.09448063],[5.3485369,53.07770491],[5.29324092,53.06688772],[5.16588504,52.99986823],[5.20233392,53.01744694],[5.20704583,53.01709028],[5.22016288,53.02723798],[5.29604008,53.06681357],[5.35080995,53.07732627],[5.37940927,53.09165022],[5.38939498,53.07684294],[5.3899317,53.06951636],[5.39930967,53.05470308],[5.37257815,53.05477341],[5.378473,53.05279969],[5.39499545,53.03192971],[5.40217695,53.0308743],[5.39761035,53.02349092],[5.40860858,53.02162131],[5.39979897,53.00216767],[5.39853182,52.99207061],[5.41002,52.97222743],[5.41084286,52.9605398],[5.40624403,52.96002711],[5.40915668,52.94770737],[5.39597009,52.94273938],[5.40119073,52.93883535],[5.40926322,52.92179064],[5.4064014,52.90993443],[5.36881321,52.89800475],[5.35377047,52.88607895],[5.3647161,52.87688736],[5.36219252,52.87352498],[5.37508646,52.87070454],[5.39808098,52.85710056],[5.42612275,52.84813497],[5.44899201,52.8520255],[5.45334095,52.85498861],[5.50003282,52.84576728],[5.54473752,52.83304274],[5.56730232,52.83420199],[5.57999317,52.83979286],[5.58482624,52.84938167],[5.60137579,52.85198475],[5.61827718,52.85060108],[5.64450494,52.86044041],[5.65731687,52.85378133],[5.65744085,52.84452119],[5.69918665,52.84386809],[5.70301769,52.83793806],[5.72568351,52.83507032],[5.72451384,52.84401046],[5.74869413,52.83977302],[5.78423843,52.8175918],[5.78981705,52.80370016],[5.8198253,52.8173181],[5.83352665,52.81171909],[5.83629268,52.80582517],[5.86527418,52.80471108],[5.87902968,52.80092532],[5.89815719,52.80794502],[5.92409822,52.82350596],[5.92674637,52.83367076],[5.94600959,52.83750054],[5.95599092,52.83329038],[5.95884724,52.83994619],[5.9722675,52.84213109],[5.98671663,52.82172],[5.996485,52.81667044],[6.02459839,52.82253871],[6.03114198,52.81509033],[6.05987941,52.82611271],[6.05274371,52.83728898],[6.0809913,52.8387407],[6.0873216,52.84304039],[6.12071424,52.85461386],[6.16041505,52.87257046],[6.20697174,52.89079276],[6.23215162,52.91336693],[6.24721295,52.92333152],[6.24721295,52.92333152]],[[6.05999066,53.47099114],[6.0591026,53.4729135],[6.0521831,53.47208104],[6.05999066,53.47099114],[6.05999066,53.47099114]]
    ]};

    const LOCS = {
	'Nij Beets': { coord: [6.002778, 53.069722], place: 'Nij Beets', placef: 'Nij Beets' },
	'Bakkeveen': { coord: [6.257222, 53.081667], place: 'Bakkeveen', placef: 'Bakkefean' },
	'Rinsumageest': { coord: [5.9475, 53.296667], place: 'Rinsumageest', placef: 'Rinsumageast' },
	'De Westereen': { coord: [6.035556, 53.255278], place: 'De Westereen', placef: 'De Westereen' },
	'Hallum': { coord: [5.785556, 53.306389], place: 'Hallum', placef: 'Hallum' },
	'Sexbierum': { coord: [5.484444, 53.218333], place: 'Sexbierum', placef: 'Seisbierrum' },
	'Woudsend': { coord: [5.6275, 52.942222], place: 'Woudsend', placef: 'Wâldsein' },
	'Grou': { coord: [5.838861, 53.094944], place: 'Grou', placef: 'Grou' },
	'Joure': { coord: [5.799722, 52.966111], place: 'Joure', placef: 'De Jouwer' },
	'Oudemirdum': { coord: [5.535, 52.849722], place: 'Oudemirdum', placef: 'Aldemardum' },
	'Jubbega': { coord: [6.125, 53.005], place: 'Jubbega', placef: 'Jobbegea' },
	'Tietjerk': { coord: [5.911389, 53.213333], place: 'Tietjerk', placef: 'Tytsjerk' },
	'Harkema': { coord: [6.136667, 53.185556], place: 'Harkema', placef: 'Harkema' },
	'Anjum': { coord: [6.127222, 53.374722], place: 'Anjum', placef: 'Anjum' },
	'Weidum': { coord: [5.743889, 53.145833], place: 'Weidum', placef: 'Weidum' },
	'Makkum': { coord: [5.403611, 53.055], place: 'Makkum', placef: 'Makkum' },
	'Akkrum': { coord: [5.835556, 53.048889], place: 'Akkrum', placef: 'Akkrum' },
	'Lemmer': { coord: [5.711944, 52.844444], place: 'Lemmer', placef: 'De Lemmer' },
	'Workum': { coord: [5.445, 52.9775], place: 'Workum', placef: 'Warkum' },
	'Holwerd': { coord: [5.900556, 53.368333], place: 'Holwerd', placef: 'Holwert' }
    };

    const LISTS = [
        {id: 1,
         items: [
	     {id: 1, audio: 'NijBeets_J.wav', loc: LOCS['Nij Beets'] },
	     {id: 2, audio: 'Bakkeveen_O.wav', loc: LOCS['Bakkeveen'] },
	     {id: 3, audio: 'Rinsumageest_J.wav', loc: LOCS['Rinsumageest'] },
	     {id: 4, audio: 'DeWestereen_O.wav', loc: LOCS['De Westereen'] },
	     {id: 5, audio: 'Hallum_O.wav', loc: LOCS['Hallum'] },
	     {id: 6, audio: 'Sexbierum_J.wav', loc: LOCS['Sexbierum'] },
	     {id: 7, audio: 'Woudsend_O.wav', loc: LOCS['Woudsend'] },
	     {id: 8, audio: 'Grou_J.wav', loc: LOCS['Grou'] },
	     {id: 9, audio: 'Joure_O.wav', loc: LOCS['Joure'] },
	     {id: 10, audio: 'Oudemirdum_J.wav', loc: LOCS['Oudemirdum'] },
         ]
        },
        {id: 2,
         items: [
	     {id: 11, audio: 'NijBeets_O.wav', loc: LOCS['Nij Beets'] },
	     {id: 12, audio: 'Bakkeveen_J.wav', loc: LOCS['Bakkeveen'] },
	     {id: 13, audio: 'Rinsumageest_O.wav', loc: LOCS['Rinsumageest'] },
	     {id: 14, audio: 'DeWestereen_J.wav', loc: LOCS['De Westereen'] },
	     {id: 15, audio: 'Hallum_J.wav', loc: LOCS['Hallum'] },
	     {id: 16, audio: 'Sexbierum_O.wav', loc: LOCS['Sexbierum'] },
	     {id: 17, audio: 'Woudsend_J.wav', loc: LOCS['Woudsend'] },
	     {id: 18, audio: 'Grou_O.wav', loc: LOCS['Grou'] },
	     {id: 19, audio: 'Joure_J.wav', loc: LOCS['Joure'] },
	     {id: 20, audio: 'Oudemirdum_O.wav', loc: LOCS['Oudemirdum'] },
         ]
        },
        {id: 3,
         items: [
	     {id: 21, audio: 'Bakkeveen_O.wav', loc: LOCS['Bakkeveen'] },
	     {id: 22, audio: 'Jubbega_J.wav', loc: LOCS['Jubbega'] },
	     {id: 23, audio: 'Tietjerk_O.wav', loc: LOCS['Tietjerk'] },
	     {id: 24, audio: 'Harkema_J.wav', loc: LOCS['Harkema'] },
	     {id: 25, audio: 'Anjum_O.wav', loc: LOCS['Anjum'] },
	     {id: 26, audio: 'Weidum_J.wav', loc: LOCS['Weidum'] },
	     {id: 27, audio: 'Makkum_O.wav', loc: LOCS['Makkum'] },
	     {id: 28, audio: 'Akkrum_J.wav', loc: LOCS['Akkrum'] },
	     {id: 29, audio: 'Lemmer_J.wav', loc: LOCS['Lemmer'] },
	     {id: 30, audio: 'Workum_O.wav', loc: LOCS['Workum'] },
         ]
        },
        {id: 4,
         items: [
	     {id: 31, audio: 'Bakkeveen_J.wav', loc: LOCS['Bakkeveen'] },
	     {id: 32, audio: 'Jubbega_O.wav', loc: LOCS['Jubbega'] },
	     {id: 33, audio: 'Tietjerk_J.wav', loc: LOCS['Tietjerk'] },
	     {id: 34, audio: 'Harkema_O.wav', loc: LOCS['Harkema'] },
	     {id: 35, audio: 'Anjum_J.wav', loc: LOCS['Anjum'] },
	     {id: 36, audio: 'Weidum_O.wav', loc: LOCS['Weidum'] },
	     {id: 37, audio: 'Makkum_J.wav', loc: LOCS['Makkum'] },
	     {id: 38, audio: 'Akkrum_O.wav', loc: LOCS['Akkrum'] },
	     {id: 39, audio: 'Lemmer_O.wav', loc: LOCS['Lemmer'] },
	     {id: 40, audio: 'Workum_J.wav', loc: LOCS['Workum'] },
         ]
        },
        {id: 5,
         items: [
	     {id: 41, audio: 'Jubbega_J.wav', loc: LOCS['Jubbega'] },
	     {id: 42, audio: 'Rinsumageest_O.wav', loc: LOCS['Rinsumageest'] },
	     {id: 43, audio: 'Tietjerk_J.wav', loc: LOCS['Tietjerk'] },
	     {id: 44, audio: 'Holwerd_O.wav', loc: LOCS['Holwerd'] },
	     {id: 45, audio: 'Hallum_J.wav', loc: LOCS['Hallum'] },
	     {id: 46, audio: 'Weidum_O.wav', loc: LOCS['Weidum'] },
	     {id: 47, audio: 'Makkum_J.wav', loc: LOCS['Makkum'] },
	     {id: 48, audio: 'Woudsend_O.wav', loc: LOCS['Woudsend'] },
	     {id: 49, audio: 'Joure_O.wav', loc: LOCS['Joure'] },
	     {id: 50, audio: 'Workum_J.wav', loc: LOCS['Workum'] },
         ]
        },
        {id: 6,
         items: [
	     {id: 51, audio: 'Jubbega_O.wav', loc: LOCS['Jubbega'] },
	     {id: 52, audio: 'Rinsumageest_J.wav', loc: LOCS['Rinsumageest'] },
	     {id: 53, audio: 'Tietjerk_O.wav', loc: LOCS['Tietjerk'] },
	     {id: 54, audio: 'Holwerd_J.wav', loc: LOCS['Holwerd'] },
	     {id: 55, audio: 'Hallum_O.wav', loc: LOCS['Hallum'] },
	     {id: 56, audio: 'Weidum_J.wav', loc: LOCS['Weidum'] },
	     {id: 57, audio: 'Makkum_O.wav', loc: LOCS['Makkum'] },
	     {id: 58, audio: 'Woudsend_J.wav', loc: LOCS['Woudsend'] },
	     {id: 59, audio: 'Joure_J.wav', loc: LOCS['Joure'] },
	     {id: 60, audio: 'Workum_O.wav', loc: LOCS['Workum'] },
         ]
        },
        {id: 7,
         items: [
	     {id: 61, audio: 'NijBeets_J.wav', loc: LOCS['Nij Beets'] },
	     {id: 62, audio: 'DeWestereen_O.wav', loc: LOCS['De Westereen'] },
	     {id: 63, audio: 'Harkema_J.wav', loc: LOCS['Harkema'] },
	     {id: 64, audio: 'Holwerd_O.wav', loc: LOCS['Holwerd'] },
	     {id: 65, audio: 'Anjum_J.wav', loc: LOCS['Anjum'] },
	     {id: 66, audio: 'Sexbierum_O.wav', loc: LOCS['Sexbierum'] },
	     {id: 67, audio: 'Akkrum_J.wav', loc: LOCS['Akkrum'] },
	     {id: 68, audio: 'Grou_O.wav', loc: LOCS['Grou'] },
	     {id: 69, audio: 'Lemmer_O.wav', loc: LOCS['Lemmer'] },
	     {id: 70, audio: 'Oudemirdum_J.wav', loc: LOCS['Oudemirdum'] },
         ]
        },
        {id: 8,
         items: [
	     {id: 71, audio: 'NijBeets_O.wav', loc: LOCS['Nij Beets'] },
	     {id: 72, audio: 'DeWestereen_J.wav', loc: LOCS['De Westereen'] },
	     {id: 73, audio: 'Harkema_O.wav', loc: LOCS['Harkema'] },
	     {id: 74, audio: 'Holwerd_J.wav', loc: LOCS['Holwerd'] },
	     {id: 75, audio: 'Anjum_O.wav', loc: LOCS['Anjum'] },
	     {id: 76, audio: 'Sexbierum_J.wav', loc: LOCS['Sexbierum'] },
	     {id: 77, audio: 'Akkrum_O.wav', loc: LOCS['Akkrum'] },
	     {id: 78, audio: 'Grou_J.wav', loc: LOCS['Grou'] },
	     {id: 79, audio: 'Lemmer_J.wav', loc: LOCS['Lemmer'] },
	     {id: 80, audio: 'Oudemirdum_O.wav', loc: LOCS['Oudemirdum'] },
         ]
        },
    ];

    const PRACTICE = {
	items: [
	    {id: 1, audio: 'Jobbegea_J_voorbeeld1.wav', loc: LOCS['Jubbega'] },
	    {id: 2, audio: 'Lemmer_J_voorbeeld2.wav', loc: LOCS['Lemmer'] },
	]
    };

    class Round {
        list = null;
        idx = null;
        done = false;

        constructor(list) {
            // shuffle item list
            this.list = list;
            this.list.items = this.list.items.sort(() => {return Math.random() - 0.5});
        }

        get id() {
            return this.list.id;
        }

        get item() {
            return this.list.items[this.idx];
        }

        advanceItem() {
            if (this.idx === null) {
                // round just started
                this.idx = 0;
                return true;
            }
            else if (this.idx < this.list.items.length) {
                this.idx++;
                return true;
            }

            // out of items
            return false;
        }
    }

    class Session {
        // if the participant chooses to participate repeatedly,
        // keep track of the assigned lists to avoid duplication
        listsStarted = [];

        // cumulative score
        score = 0;

        // how many items were presented in total
        total = 0;

        pickList() {
	    let i;
	    if (this.listsStarted.length == 0) {
		// pick first list at random
		i = Math.floor(Math.random() * LISTS.length);
	    }
	    else {
		// look at the next list and pick the next one
		let last = this.listsStarted[this.listsStarted.length - 1];
		i = (last + 1) % LISTS.length;
	    }

	    let list = LISTS[i];
	    this.listsStarted.push(i);
	    this.total += list.items.length;
	    return list;
        }

        startRound() {
            let list = this.pickList();
            if (list !== null) {
                return new Round(list);
            }
            return null;
        }

	practiceRound() {
	    return new Round(PRACTICE);
	}
    }

    // start the session and first round
    let session = new Session();
    let round = session.practiceRound();

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

    function updateValue(dataBox, loc, zoomLevel) {
        let value = JSON.stringify({
            list: round.id,
            item: round.item,
            response: loc,
            zoom: zoomLevel
        });

        // quotes must be escaped because we embed the value using
        // Qualtrics' embedded strings, and that would break the HTML code
        let escaped = value.replace(/"/g, '&quot;');
        dataBox.value = escaped;
    }

    function insertMap(_id, container) {
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
        document.querySelector('#fragment_audio').addEventListener('play', () => {
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
            updateValue(dataBox, event.latLng, map.zoom);

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

        let newp = MAP_POLYGONS.coords.map((poly) => poly.map((coord) => {return {lat: coord[1], lng:coord[0]}}));
        let poly = new google.maps.Polygon({
            paths: [outer].concat(newp),
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
            lat: round.item.loc.coord[1],
            lng: round.item.loc.coord[0]
        };

        let sourceMarker = new google.maps.Marker({
            map: map,
            position: srcLatLng
        });

        let responseMarker = new google.maps.Marker({
            map: map,
            position: data.response
        });

        new google.maps.Polyline({
            map: map,
            strokeColor: '#1f1',
            strokeOpacity: 0.6,
            path: [srcLatLng, data.response],
        });

        let bounds = new google.maps.LatLngBounds();
        bounds.extend(sourceMarker.position);
        bounds.extend(responseMarker.position);

        map.setCenter(bounds.getCenter());
        map.setZoom(MAP_ZOOM);

        // calculate distance and score
        let km = haversineDistance([srcLatLng.lat, srcLatLng.lng],
                                   [data.response.lat, data.response.lng]);

        let points = kmToPoints(km);
        session.score += points;

	let rounds = (session.total / 10);
        let niceScore = (session.score / rounds).toFixed(1);
        Qualtrics.SurveyEngine.setEmbeddedData('score', niceScore);

        // present textual feedback
        let feedback = document.querySelector('#pp_feedback');
        feedback.innerHTML = '';

        if (km < 5) {
	    feedback.innerHTML += `
		<p style="font-size:18px">Dat klopt, het juiste antwoord is ${round.item.loc.place}. </p>
		<p style="font-size:16px"><i>Dat kloppet, it goede antwurd is ${round.item.loc.placef}.</i></p>`;
        }
	else {
	    feedback.innerHTML += `
		<p style="font-size:18px">Het juiste antwoord was ${round.item.loc.place}. </p>
		<p style="font-size:16px"><i>It goede antwurd wie ${round.item.loc.placef}.</i></p>`;
	}
	feedback.innerHTML += `
		<p></p>
		<p style="font-size:18px">Het verschil is ${km.toFixed(1)} km.</p>
		<p style="font-size:16px"><i>It ferskil is ${km.toFixed(1)} km.</i></p>`;
    }

    // placeholder score formula
    function kmToPoints(km) {
	if (km < 10) return 1;
	return 0;
    }

    function onReadyHandler() {
        let next = document.querySelector('#NextButton');
        // hide the next button until participant responds
        next.classList.add('hidden');
    }

    function initSpeakerFragment(container) {
        // embed some necessary elements into the question html
        let questionBody = container.querySelector('.QuestionText');

        round.advanceItem();
        let audioSrc = round.item.audio;
        let correctLocation = round.item.loc.coord;

        let audio = document.createElement('audio');
        audio.controls = true;
        audio.src = AUDIO_ROOT + audioSrc;
        audio.id = 'fragment_audio';
	if (questionBody.offsetWidth > 0) {
	    // small hack to prevent audio autoplaying in mobile preview iframe
	    // (only relevant when previewing the survey)
	    audio.autoplay = true;
	}
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


    function startNewRound() {
        round = session.startRound();
        // round could be null if we run out of lists
    }

    // register global functions
    window.onReadyHandler = onReadyHandler;
    window.initGoogleMapsQuestion = initGoogleMapsQuestion;
    window.initSpeakerFragment = initSpeakerFragment;
    window.showFeedback = showFeedback;
    window.startNewRound = startNewRound;
})();
