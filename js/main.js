var map;

function initMap() {
    var myLatLng = {
            lat: 12.935522, 
            lng: 77.618123
        };
    map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: 17,
        center: myLatLng
    });

    ko.applyBindings(new viewModel());
}

google.maps.event.addDomListener(window, 'load', initMap);

var addMarker = function(theMap, latLng) {
    var iconBase = 'http://maps.google.com/mapfiles/ms/micons/';
    var marker = new google.maps.Marker({
        position: latLng,
        map: theMap,
        title: '',
        icon: iconBase + 'restaurant.png'
    });
    return marker;
}

var locations = [{

        coordinates: {
            lat: 12.933035,
            lng: 77.613900
        },
        title: "Truffles Ice & Spice",
        content: "Burger Joint, Café, and Italian Restaurant",
        venueId: '4c11f49ca9420f47c3a07d51',
        details: ''
    },

    {

        coordinates: {
            lat: 12.933538,
            lng: 77.622194
        },
        title: "Chianti",
        content: "Italian Restaurant",
        venueId: '4fa944cce4b02c573aa1f27c',
        details:''
    }, {
        coordinates: {
            lat: 12.937371, 
            lng: 77.617608
        },
        title: "Dyu Art Cafe",
        content: "Café",
        venueId: '5264a31011d252c0294134f2',
        details:''
    }, {
        coordinates: {
            lat: 12.937140,
            lng: 77.619579
        },
        title: "Sree Krishna Kafe",
        content: "Breakfast Spot, Indian Restaurant, and Asian Restaurant",
        venueId: '4cf510727e0da1cdb763a597',
        details:''
    },
    {
        coordinates: {
            lat: 12.936445,
            lng: 77.615022
        },
        title: "Zingron - Naga Kitchen",
        content: "Diner and Indian Restaurant",
        venueId: '4d4d759372eba1430ca34312',
        details:''
    },
    {
        coordinates: {
            lat: 12.933763, 
            lng: 77.620573
        },
        title: "Mainland China",
        content: "Chinese Restaurant",
        venueId: '4e23040c62e1964dbb7708de',
        details:''
    },
    {
        coordinates: {
            lat: 12.934441, 
            lng: 77.613428
        },
        title: "Gramin",
        content: "Indian Restaurant",
        venueId: '4bdc11da383276b06bc27369',
        details:''
    },
    {
        coordinates: {
            lat: 12.933589, 
            lng: 77.622159
        },
        title: "Cafe D'Hide",
        content: "Café",
        venueId: '5558a326498e2877ccf1051d',
        details:''
    },
    {
        coordinates: {
            lat: 12.935005, 
            lng:  77.615999
        },
        title: "Moscow Mule Bar & Grill",
        content: "Bar",
        venueId: '4e931f4793adf0b0009bbb79',
        details:''
    },
    {
        coordinates: {
            lat: 12.932864, 
            lng:  77.614796
        },
        title: "Gilly's Rest-O-Bar",
        content: "Bar",
        venueId: '53a5aa42498e7989b0b0bb3d',
        details:''
    },
    {
        coordinates: {
            lat: 12.935227,
            lng:  77.613673
        },
        title: "Fenny's Lounge & Kitchen",
        content: "Lounge, Pizza Place, and Mediterranean Restaurant",
        venueId: '512dd16dd86cdfb81d74a7fc',
        details:''
    }


];


function place(data) {
    this.title = data.title;
    this.coordinates = data.coordinates;
    this.marker = addMarker(map, this.coordinates);
    this.content = data.content;
    this.venueId = data.venueId;
};

function detailFormatter(detailsArray) {
    var details = '';
    detailsArray.forEach(function(detail) {
        details += '<p>'+detail+'</p>';
    });
    return details;
}

function activateMarker(object, infowindow) {
           console.log(object.details);

            infowindow.setContent('<h3><b>'+ object.title + '</b></h3><h6>'+ object.content + '</h6>' + object.details);
            infowindow.open(map, object.marker);

             object.marker.setAnimation(google.maps.Animation.BOUNCE);

             setTimeout(function(){ object.marker.setAnimation(null); }, 750);
}

function getDetails(object) {
        
        var topTips = [];
        var venueUrl = 'https://api.foursquare.com/v2/venues/' + object.venueId + '/tips?sort=recent&limit=5&v=20160311&client_id=RR4S5124LFE1CSJ0FLS4WOA4CQF2PB4X53TDXBCIWZ5WLK40&client_secret=B5IPIYRLBPTGPQUHWACDR3GUETYJX102DJMFGDMQ0QUWUNDW';
    
        $.getJSON(venueUrl, function(data) {
            var items = data.response.tips.items;
            items.forEach(function(item) {
                topTips.push(String(item.text));
            })
            object.details = topTips;
            object.details = detailFormatter(object.details);
        });

    }  

var viewModel = function() {
    var self = this;
    self.infowindow = new google.maps.InfoWindow();
    

    self.placeNames = [];
    self.observableNames = ko.observableArray([]);
    self.test = ko.observableArray([{name:'nmnk'},{name:'yuzy'}]);

        locations.forEach(function(location) {
        var placeObject = new place(location);
        getDetails(placeObject);

        //********************************************************************************************************

        google.maps.event.addListener(placeObject.marker, 'click', function() {

            /*self.infowindow.setContent('<h2><b>'+ placeObject.title + '<b></h2><p>' + placeObject.content + '</p>');
            self.infowindow.open(map, placeObject.marker);

             placeObject.marker.setAnimation(google.maps.Animation.BOUNCE);

             setTimeout(function(){ placeObject.marker.setAnimation(null); }, 750);*/
             activateMarker(placeObject, self.infowindow);
        });
        //********************************************************************************************************

        self.placeNames.push(placeObject);
        self.observableNames.push(placeObject.title);

    });

    

    self.clickHandler = function(item) {
        self.placeNames.forEach(function(element) {
            if (item === element.title) {
                activateMarker(element, self.infowindow);
            }
        });
    }

    self.searchPlaces = function() {
        var searchString = document.getElementById('searchBar').value.toLowerCase();
        self.observableNames([]);
        self.placeNames.forEach(function(place) {
            place.marker.setVisible(false);
        })
        self.infowindow.close();
        self.placeNames.forEach(function(place){
            if (place.title.toLowerCase().indexOf(searchString) > -1) {
                self.observableNames.push(place.title);
                place.marker.setVisible(true);
            }
        })
        self.test.pop();
    }
}

