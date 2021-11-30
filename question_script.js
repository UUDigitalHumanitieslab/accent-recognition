Qualtrics.SurveyEngine.addOnload(function()
{
	initGoogleMapsQuestion(this.questionId, this.getQuestionContainer(), {
        // Map Options, set these! See Map Options in Option Documentation Section
		options: {
        center: {
            lat: 39.1836,
            lng: -96.5717,
        },
        zoom: 16,
        },
        // Marker Options, set these!
        markers: [
        // First Marker
        {
            // See Marker Options in Option Documentation Section
            options: {
            title: "Marker 1",
            draggable: true,
            label: "1",
            },
            autocomplete: {
                // If true, an autocomplete will show.
                enabled: false,
                // The label shown for the autocomplete field
                label: "Location for Marker 1",
                // Styles for the label
                labelCss: "padding-left: 0; padding-right: 0;",
                // Text to show if an invalid location is selected
                invalidLocationAlertText:
                    "Please choose a location from the search dropdown. If your location doesn't appear in the search, enter a nearby location and move the marker to the correct location.",
            },
        },
        // You can add more markers as well
        ],
    });
});

Qualtrics.SurveyEngine.addOnReady(function()
{
	/*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function()
{
	/*Place your JavaScript here to run when the page is unloaded*/

});