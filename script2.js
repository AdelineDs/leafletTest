class leafletMap{
    constructor(map, latLng=[48.862725, 2.287592], zoom=10, layer='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',minZoom=6, maxZoom=11){
        this.map = map;
        this.latLng = latLng;
        this.zoom = zoom;
        this.layer = layer;
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.myMap = L.map(this.map).setView(this.latLng,this.zoom);
        this.markersCluster = L.markerClusterGroup();
        this.list = new L.Control.ListMarkers({layer: this.markersCluster, itemIcon: null, maxZoom: this.maxZoom});
        this.myMap.addControl(this.list);
        
        L.tileLayer(this.layer, {minZoom: this.minZoom, maxZoom: this.maxZoom}).addTo(this.myMap);
        
        this.myMap.addLayer(this.markersCluster);
    }//-- end constructor --
    
    photoRecovery(source) {
        ajaxGet(source, reponse => {
            let photosList = JSON.parse(reponse);
            let takenIds =[];
            let addedImage = false;
            for(let i=0; i < photosList.length; i++){
                let photo = photosList[i];
                let photoGallery =[];
                for (let j=i; j < photosList.length; j++){
                    let picture = photosList[j];
                    if(!this.contains.call(takenIds, photo.id)){
                        photoGallery.push(photo);
                        takenIds.unshift(photo.id);
                        addedImage = true;
                    }
                    if(photo.position.lat == picture.position.lat && photo.position.lng == picture.position.lng){
                        if(!this.contains.call(takenIds, picture.id)){
                            photoGallery.push(picture);
                            takenIds.push(picture.id);
                        }
                    }
                }//-- end for --
                if(addedImage){
                    takenIds.shift();
                    addedImage = false;
                }
                let latLng = new L.LatLng(photo.position.lat, photo.position.lng);
                if(!this.contains.call(takenIds, photo.id)){
                    let marker = new L.Marker(latLng, {title: photo.nom});
                    marker.gallery = photoGallery;
                    this.markersCluster.gallery = photoGallery;
                    this.markersCluster.addLayer(marker);
                }//--end if--
            }//-- end for --
            
            this.list.on('item-click', e => {
                let imageGallery = new Gallery(e.layer.gallery);
                
                
                $("#rslides").removeClass();
                $('.rslides_nav').remove();
                $("#rslides").responsiveSlides({
                    auto: true,
                    speed: 400,
                    timeout: 3000,
                    pause: true,
                    pagination: false,
                    nav: true,
                    maxwidth: 800
                });
                
                $('.li').magnificPopup({
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

                $('#boundsGallery').multislider({interval: 2000});
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
                
                this.myMap.on('moveend', () => {
                    $("#boundsGallery").removeClass();

                    let bounds =this.myMap.getBounds();
                
                    e.layer.gallery.forEach(element => {
                        
                        const text = document.getElementById("text");
                        $('h3').remove();
                        $('.empty').remove();
                        
                        const title = document.createElement("h3");
                        title.appendChild(document.createTextNode("Dans le même secteur :"));
                        text.appendChild(title);
                        const empty = document.createElement("p");
                        empty.className = "empty";
                        empty.appendChild(document.createTextNode("Aucune suggestion dans cette zone !"));
                        text.appendChild(empty);
                        
                        const boundsGallery = document.getElementById("boundsGallery");
                        const slider = document.getElementById("slider");

                        if(document.getElementsByClassName("thumbnailsLink2")){
                            slider.innerHTML="";
                            $('.MS-controls').hide();
                        }

                        photosList.forEach(function(aPhoto){
                            if(aPhoto.position.lat !== element.position.lat && aPhoto.position.lng !== element.position.lng){
                                if(bounds.contains(aPhoto.position)) {
                                    $('.empty').remove();
                                    $('.MS-controls').show();

                                    const div = document.createElement("div");
                                    div.className = "item";

                                    const lien2 = document.createElement("a");
                                    lien2.className = "thumbnailsLink2";
                                    lien2.href = 'http://localhost/Projets_perso/photosJavascript/' + aPhoto.url;
                                    div.appendChild(lien2);

                                    const photoMin2 = document.createElement("img");
                                    photoMin2.className = "thumbnails2";
                                    photoMin2.alt = aPhoto.description;
                                    photoMin2.src = aPhoto.url;
                                    lien2.appendChild(photoMin2);

                                    const caption2 = document.createElement("p");
                                    caption2.className = "caption2";
                                    caption2.appendChild(document.createTextNode(aPhoto.description));
                                    div.appendChild(caption2);

                                    slider.appendChild(div);
                                }//-- end if --
                            }//-- end if --
                        })//-- end forEach --
                    })//-- end forEach --
                })//-- end myMyap.moveend -- 
            })//-- end list.on --
        });//-- end ajaxGet --
    }//-- end photoRecorvery --   
    
    contains(needle){
        // Per spec, the way to identify NaN is that it is not equal to itself
        let findNaN = needle !== needle;
        let indexOf;
        if(!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = needle =>{
                let i = -1, index = -1;
                for(i = 0; i < this.length; i++) {
                    let item = this[i];
                    if((findNaN && item !== item) || item === needle) {
                        index = i;
                        break;
                    }
                }
                return index;
            };
        }
        return indexOf.call(this, needle) > -1;
    }

}//---- END CLASS LEAFLETMAP ----

class Gallery {
    
    constructor(source) {
        this.source = source;
        this.createGallery(this.source);
    }//-- end constructor --
    
    createGallery(source){
        const gallery = document.getElementById("rslides");
        if(document.getElementById("thumbnailsLink")){
                   gallery.innerHTML="";
        }
        source.forEach(element => {
            const li = document.createElement("li")
            li.className = "li";
            
            const link = document.createElement("a");
            link.id = "thumbnailsLink";
            link.href = `http://localhost/Projets_perso/photosJavascript/${element.url}`;

            const thumbnails = document.createElement("img");
            thumbnails.className = "thumbnails";
            thumbnails.alt = element.description;
            thumbnails.src =  element.url;

            link.appendChild(thumbnails);
            li.appendChild(link);

            const caption = document.createElement("p");
            caption.className = "caption";
            caption.appendChild(document.createTextNode(element.description));
            li.appendChild(caption);
            gallery.appendChild(li);
        });
    }//-- end createGallery -- 
}//---- END CLASS GALLERY ----


window.onload = () => {
    let myMap = new leafletMap("map");
    myMap.photoRecovery("http://localhost/Projets_perso/photosJavascript/photos.json");
}

