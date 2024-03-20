[![DOI](https://zenodo.org/badge/433441878.svg)](https://zenodo.org/doi/10.5281/zenodo.10479054)

# Accent recognition: a perceptual-dialectological study of Frisian

There is a moderate body of work on Frisian dialectology (e.g., Boelens & van der Woude, 1955; Hof, 1933; van der Veen, 2001), but no known insight about how Frisians recognize and perceive regional variation. In this project, we investigate the perception and recognition of regional variation in Frisian based on a Frisian adaptation of the map-based accent-recognition task (Pinget & Voeten, 2023).

Our perceptual-dialectological study aims to investigate: (1) how accurately Frisian listeners can recognize speakers’ regional origin, and whether this accuracy differs for younger and older speakers; (2) which Frisian accents listeners distinguish, and whether perceptual isoglosses delineate different accents; (3) to what extent listeners’ recognition patterns depend on their social profiles.

We constructed an online accent-recognition task using forty 20-second fragments of regionally-accented spontaneous speech from a geographically representative selection of twenty towns within Friesland. The forty speakers coming from twenty places spread over the language area were selected in two age groups and were meant to be representative for the four main dialect areas (Clay, Wood, Northern Corner and Southwest-Corner Frisian; Bloemhoff et al., 2014). Each participant listen to ten fragments (in one of the eight semi-random lists of speakers) and indicated in a Google-Maps interface where they believed the speaker to be from. 

## References

Bloemhoff, H., Haan, G. de & Versloot, A. (2014). 38. Language varieties in the province of Fryslân. Volume 3 Dutch, edited by F. Hinskens & J. Taeldeman, Berlin, Boston: De Gruyter Mouton, pp. 721-738.

Boelens, K. & G. van der Woude (m.m.v. K. Fokkema en Blancquaert) (1955). Dialect-atlas van Friesland.

Hof, J. J. (1933). Friesche Dialectgeographie. Martinus Nijhoff.

Pinget, A. F., & Voeten, C. C. (2023). Social factors in accent recognition: a large-scale study in perceptual dialectology. Journal of Linguistic Geography, 11(2), 78-90.

Veen, Klaas F. van der (2001). West Frisian Dialectology and Dialects. In Horst Haider Munske (ed.), Handbuch des Friesischen / Handbook of Frisian Studies, 98-115. Tübingen: Max Niemeyer. 

## Code

The code in this repository is meant to run as part of a Qualtrics survey (The full exported survey can be found in `Qualtrics_survey.qsf`).
It is primarily used for implementing the following:

1. Audio playback of stimuli
2. Interactive maps using Google Maps API
3. Calculating a score based on the distance between an indicated location and speaker location (using the Haversine formula)

The self-contained `main.js` is loaded into the Qualtrics survey using the *Header* definition as part of the survey's *Look & Feel* configuration.
`main.js` registers the following functions into the global window object:

```
    window.onReadyHandler = onReadyHandler;
    window.initGoogleMapsQuestion = initGoogleMapsQuestion;
    window.initSpeakerFragment = initSpeakerFragment;
    window.showFeedback = showFeedback;
    window.startNewRound = startNewRound;
    window.socialButtons = socialButtons;
```

The relevant functions are then called within the custom Javascript for the relevant question components in Qualtrics.

Because participants may run multiple rounds of the survey, managing the item lists is also done in `main.js` using the classes `Round` and `Session`, while `LISTS` contains the full definition of all stimuli.

## License

This work is licensed under BSD 3-Clause and ODbL 1.0. The latter is only for the OpenStreetMap data. Everything else is licensed under BSD 3-Clause.

`SPDX-License-Identifier: BSD-3-Clause AND ODbL-1.0`
