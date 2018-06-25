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
                this.myMap.on('moveend', () => {
                    let bounds =this.myMap.getBounds();
                
                    e.layer.gallery.forEach(element => {

                        $('h3').hide();
                        $('.none').hide();
                        const boundsGallery = document.getElementById("boundsGallery");

                        if(document.getElementsByClassName("thumbnailsLink2")){
                            boundsGallery.innerHTML="";
                        }

                        const titre = document.createElement("h3");
                        titre.appendChild(document.createTextNode("Dans le même secteur :"));
                        boundsGallery.appendChild(titre);
                        const texte = document.createElement("p");
                        texte.className = "none";
                        texte.appendChild(document.createTextNode("Aucune suggestion dans cette zone !"));
                        boundsGallery.appendChild(texte);

                        photosList.forEach(function(aPhoto){
                            if(aPhoto.position.lat !== element.position.lat && aPhoto.position.lng !== element.position.lng){
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
                                    }//-- end if --
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
        const gallery = document.getElementById("gallery");
        if(document.getElementById("thumbnailsLink")){
                   gallery.innerHTML="";
        }
        source.forEach(element => {
            const link = document.createElement("a");
            link.id = "thumbnailsLink";
            link.href = `http://localhost/Projets_perso/photosJavascript/ ${element.url}`;

            const thumbnails = document.createElement("img");
            thumbnails.className = "thumbnails";
            thumbnails.alt = element.description;
            thumbnails.src =  element.url;

            link.appendChild(thumbnails);
            gallery.appendChild(link);

            const caption = document.createElement("p");
            caption.className = "caption";
            caption.appendChild(document.createTextNode(element.description));
            gallery.appendChild(caption);
        });
    } 
}//---- END CLASS GALLERY ----


window.onload = function(){
    let myMap = new leafletMap("map");
    myMap.photoRecovery("http://localhost/Projets_perso/photosJavascript/photos.json");
}
