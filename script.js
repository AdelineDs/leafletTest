/*
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
        let photo = listePhotos[i];
        var latLng = new L.LatLng(photo.position.lat, photo.position.lng);
        let marker = new L.Marker(latLng, {title: photo.nom, alt: latLng});
        markersCluster.addLayer(marker);
        marker.on('click', function(){
            var gallery = document.getElementById("gallery")
           if(document.getElementById("thumbnailsLink")){
               gallery.innerHTML="";
           }
            let lien = document.createElement("a");
            lien.id = "thumbnailsLink";
            lien.href = 'http://localhost/Projets_perso/photosJavascript/' + photo.url;
            
            var photoMin = document.createElement("img");
            photoMin.className = "thumbnails";
            photoMin.alt = photo.description;
            photoMin.src =  photo.url;
            
            lien.appendChild(photoMin);
            gallery.appendChild(lien);
            
            var caption = document.createElement("p");
            caption.className = "caption";
            caption.appendChild(document.createTextNode(photo.description));
            gallery.appendChild(caption);
        });
        
        var circle = L.circle([48.856614 , 2.352222], {
            color: 'white',
            fillColor: '#fff',
            fillOpacity: 0.5,
            radius: 10000
        });

        function onMapClick(e) { 
            $('h3').hide()
            $('.none').hide()
            var currentPos = e.latlng;
            circle
                .setLatLng(currentPos)
                .addTo(mymap);
            
            var bounds = circle.getBounds();
            mymap.fitBounds(bounds);

            var boundsGallery = document.getElementById("boundsGallery")
            if(document.getElementsByClassName("thumbnailsLink2")){
                boundsGallery.innerHTML="";
            }
            var titre = document.createElement("h3");
            titre.appendChild(document.createTextNode("Dans le même secteur :"));
            boundsGallery.appendChild(titre);
            var texte = document.createElement("p");
            texte.className = "none";
            texte.appendChild(document.createTextNode("Aucune suggestion dans cette zone !"));
            boundsGallery.appendChild(texte);
                        
            
            listePhotos.forEach(function(aPhoto){
                if(aPhoto.position.lat !== currentPos.lat && aPhoto.position.lng !== currentPos.lng){
                    if(bounds.contains(aPhoto.position)) {
                        $('.none').hide();
                        
                        var div = document.createElement("div");
                        div.className = "suggested";
                        
                        var lien2 = document.createElement("a");
                        lien2.className = "thumbnailsLink2";
                        lien2.href = 'http://localhost/Projets_perso/photosJavascript/' + aPhoto.url;
                        div.appendChild(lien2);

                        var photoMin2 = document.createElement("img");
                        photoMin2.className = "thumbnails2";
                        photoMin2.alt = aPhoto.description;
                        photoMin2.src = aPhoto.url;
                        lien2.appendChild(photoMin2);

                        var caption2 = document.createElement("p");
                        caption2.className = "caption2";
                        caption2.appendChild(document.createTextNode(aPhoto.description));
                        div.appendChild(caption2);
                        
                        if(document.getElementById("thumbnailsLink").href !== lien2.href ){
                            boundsGallery.appendChild(div);;
                        }
                    }
            
                }
            })
        }
        marker.on('click', onMapClick);
    }//end for ----------------------------------
    
    mymap.addLayer(markersCluster);  
});

$(document).ready(function() {
    
    $('#gallery').magnificPopup({
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
    
    $('#boundsGallery').magnificPopup({
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



*/



class leafletMap{
    constructor(map, latLng=[48.862725, 2.287592], zoom=6, layer='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', maxZoom=18){
        this.map = map;
        this.latLng = latLng;
        this.zoom = zoom;
        this.layer = layer;
        this.maxZoom = maxZoom;
        this.myMap = L.map(this.map).setView(this.latLng,this.zoom);
        
        L.tileLayer(this.layer, {maxZoom: this.maxZoom}).addTo(this.myMap);
    }//-- end constructor --
    
    photoRecovery(source) {
        ajaxGet(source, reponse => {
            let photosList = JSON.parse(reponse);
            let markersCluster = L.markerClusterGroup();
            
            for(let photo of photosList){
                let latLng = new L.LatLng(photo.position.lat, photo.position.lng);
                let marker = new L.Marker(latLng, {title: photo.nom});
                markersCluster.addLayer(marker);
                
                marker.on('click', ()=>{
                    const gallery = document.getElementById("gallery")
                    if(document.getElementById("thumbnailsLink")){
                        gallery.innerHTML="";
                    }
                    const link = document.createElement("a");
                    link.id = "thumbnailsLink";
                    link.href = 'http://localhost/Projets_perso/photosJavascript/' + photo.url;

                    const thumbnails = document.createElement("img");
                    thumbnails.className = "thumbnails";
                    thumbnails.alt = photo.description;
                    thumbnails.src =  photo.url;

                    link.appendChild(thumbnails);
                    gallery.appendChild(link);

                    const caption = document.createElement("p");
                    caption.className = "caption";
                    caption.appendChild(document.createTextNode(photo.description));
                    gallery.appendChild(caption);
                });//-- end marker.on --
                
            }//-- end for --
            this.myMap.addLayer(markersCluster);
        });//-- end ajaxGet --
    }//-- end photoRecorvery --    
}//---- END CLASS LEAFLETMAP ----

window.onload = function(){
    let myMap = new leafletMap("map");
    myMap.photoRecovery("http://localhost/Projets_perso/photosJavascript/photos.json");
}
