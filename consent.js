  

// Define dataLayer and the gtag function.

window.dataLayer = window.dataLayer || [];

function gtag(){dataLayer.push(arguments);}

 
// IMPORTANT – DO NOT COPY/PASTE WITHOUT MODIFYING REGION LIST

//Set default consent for specific regions according to your requirements

gtag('consent', 'default', {

  'ad_storage': 'denied',

  'ad_user_data': 'denied',

  'ad_personalization': 'denied',

  'analytics_storage': 'denied',

 'regions':[<list of ISO 3166-2 region codes>]

});

// Set default consent for all other regions according to your requirements

gtag('consent', 'default', {

  'ad_storage': 'granted',

  'ad_user_data': 'granted',

  'ad_personalization': 'granted',

  'analytics_storage': 'granted'

});

 
