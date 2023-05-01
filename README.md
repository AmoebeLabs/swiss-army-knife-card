[![hacs][hacs-badge]][hacs-url]
[![hacs][maintain_badge]][hacs-url]
<br>[![release][release-badge]][release-url]
[![downloads][downloads-badge]][release-url]
<!--- ![beta_badge](https://img.shields.io/badge/State-Beta-orange?style=for-the-badge) -->
<!---[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration) -->

# ![](assets/images/swiss-army-knife24.png) The Swiss Army Knife Custom Card for Home Assistant
The custom Swiss Army Knife card for [Home Assistant][home-assistant] allows you to create your own visualization using [17 basic, advanced and Home Assistant specific SVG-based tools][sak-tools] and CSS [styling][sak-css-styles] and [animation][sak-css-animations] options this card provides.

It is a card with lots of possibilities, fully YAML based, and requires the [user to design a card][sak-how-to-design-your-card]!
What you can make is only limited by the 17 provided tools and your own imagination.

The 3rd Release Candidate will have support for layout templates, which makes using predefined cards much easier.
The [30 functional card examples](https://swiss-army-knife-card-manual.amoebelabs.com/design/example-set-functional-cards/) will be made available as layout templates for easy use and integration.

Remember that this custom card will is a public release candidate as of June/July 2022!

Check https://swiss-army-knife-card-manual.amoebelabs.com/ for the documentation!

And check https://material3-themes-manual.amoebelabs.com/ for Material 3 themes documentation. It has 22 light and dark [example themes](https://material3-themes-manual.amoebelabs.com/examples/introduction/) used by example card [11][example-11] and [12][example-12]!

![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-frontpage.png)

<a href="https://www.buymeacoffee.com/amoebelabs" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## ![](assets/images/swiss-army-knife24.png) Hybrid or Full manual Installation
This custom card should be in the default theme repository of HACS, if you have selected BETA releases.

For installation check the [installation documentation][sak-installation]. As this custom card requires **extra steps on top of HACS** for its installation. The card itself can be installed with HACS, but:
- The card requires extra configuration files to function
- If you want to use the examples and example dashboard, you must download the themes, views and templates too!

Note: It may take some time before this card is included into the default HACS repository! Use custom repository for the time being.

## ![](assets/images/swiss-army-knife24.png) An overview of the [functional card examples](https://swiss-army-knife-card-manual.amoebelabs.com/design/example-set-functional-cards/) I created as demo and inspiration:

![](https://swiss-army-knife-card-manual.amoebelabs.com/assets/screenshots/sak-functional-cards-all-screenshot.png)

## ![](assets/images/swiss-army-knife24.png) An overview of all the [12 example views](https://swiss-army-knife-card-manual.amoebelabs.com/examples/introduction/) from my own installation:
All these examples are available on Github and described in the [installation manual][sak-installation]. Each example has its own page which describes how to adapt / use them in your own installation.

| Examples...| Examples...|
| :------------: | :------------: |
| ![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-example-1b.png) | ![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-example-2.png) | 
| ![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-example-3.png) | ![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-example-4.png) | 
| ![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-example-5.png) | ![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-example-6.png) | 
| ![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-example-7.png) | ![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-example-8.png) | 
| ![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-example-9.png) | ![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-example-10.png) | 

| Examples using a Light Material 3 Theme...| Examples using a Dark Material 3 Theme.. |
| :------------: | :------------: |
| [Example 11: Boiler and Electricity cards][example-11] | |
| ![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-example-11-m3-c11-light.png) | ![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-example-11-m3-c11-dark.png) | 
| [Example 12: Wide cards showing lots of sensors][example-12] | |
| ![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-example-12-m3-d06-light.png) | ![](https://github.com/AmoebeLabs/swiss-army-knife-card-manual/blob/master/docs/assets/screenshots/sak-example-12-m3-d06-dark.png) | 

<a href="https://www.buymeacoffee.com/amoebelabs" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>


<!-- Badges -->

[hacs-url]: https://github.com/hacs/integration
[hacs-badge]: https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge&logo=homeassistantcommunitystore
[beta_badge]: https://img.shields.io/badge/State-Beta-orange?style=for-the-badge&logo=homeassistantcommunitystore
[rc_badge]: https://img.shields.io/badge/State-Release%20Candidate-orange?style=for-the-badge&logo=homeassistantcommunitystore
[maintain_badge]: https://img.shields.io/maintenance/yes/2025?style=for-the-badge&logo=homeassistantcommunitystore
[release-badge]: https://img.shields.io/github/v/release/AmoebeLabs/swiss-army-knife-card?style=for-the-badge&include_prereleases&logo=github
[downloads-badge]: https://img.shields.io/github/downloads/AmoebeLabs/swiss-army-knife-card/total?style=for-the-badge&logo=github
[lgtm-grade-badge]: https://img.shields.io/lgtm/grade/javascript/github/AmoebeLabs/swiss-army-knife-card?style=for-the-badge&logo=lgtm
[lgtm-alerts-badge]: https://img.shields.io/lgtm/alerts/github/AmoebeLabs/swiss-army-knife-card?style=for-the-badge&logo=lgtm

<!-- References -->

[home-assistant]: https://www.home-assistant.io/
[home-assitant-theme-docs]: https://www.home-assistant.io/integrations/frontend/#defining-themes
[hacs]: https://hacs.xyz
[release-url]: https://github.com/AmoebeLabs/swiss-army-knife-card/releases
[sak-docs-url]: https://swiss-army-knife-card-manual.amoebelabs.com/
[lgtm-url]: https://lgtm.com/

[example-11]: https://swiss-army-knife-card-manual.amoebelabs.com/examples/example-11/
[example-12]: https://swiss-army-knife-card-manual.amoebelabs.com/examples/example-12/
[sak-tools]: https://swiss-army-knife-card-manual.amoebelabs.com/tools/circle-tool/
[sak-css-styles]: https://swiss-army-knife-card-manual.amoebelabs.com/basics/styling/styles/
[sak-css-animations]: https://swiss-army-knife-card-manual.amoebelabs.com/basics/animations/css-animations/
[sak-installation]: https://swiss-army-knife-card-manual.amoebelabs.com/start/installation/
[sak-how-to-design-your-card]: https://swiss-army-knife-card-manual.amoebelabs.com/design/how-to-design-your-card/
