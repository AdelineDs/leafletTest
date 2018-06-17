var france = [48.862725, 2.287592]
//création de la map
var mymap = L.map('map').setView(france, 6);
//creation du calque image
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {maxZoom: 18}).addTo(mymap);

ajaxGet("http://localhost/Projets_perso/photosJavascript/photos.json", function (reponse) {
    var listePhotos = JSON.parse(reponse);
    var markersCluster = L.markerClusterGroup();
    for (var i = 0; i < listePhotos.length; i++) {
        var photo = listePhotos[i];
        var latLng = new L.LatLng(photo.position.lat, photo.position.lng);
        var marker = new L.Marker(latLng, {title: photo.nom});
        markersCluster.addLayer(marker);
        marker.bindPopup('<h3>' + photo.nom + '</h3>'
                                    + '<a href="http://localhost/Projets_perso/photosJavascript/' + photo.url + '" ><img alt="' + photo.description + '" src="' + photo.url +'" width="100px" height="auto"></a>'
                                    + '<p>' + photo.description + '<p>'
                                    )
    }
    


    mymap.addLayer(markersCluster);
    
    
});

$(document).ready(function() {
    
    $('#map').magnificPopup({
            delegate: "a",
            type: 'image',
            closeOnContentClick : true,
            closeBtnInside : false,
            fixedContentPos : true,
            mainClass: 'mfp-no-margins mfp-with-zoom',
            image: {
                verticalFit: true
            },
            zoom: {
                enabled: true,
                duration: 500
            }
    });
});