

var getPosition = false;
var currentLat = null;
var currentLong = null;



inicioMap();
funcionInit();

//#region Carga el mapa de GOOGLE MAPS
///////////////////////////// CARGA DEL MAPA DE GOOGLE MAPS ////////////////////////////////

function inicioMap(){
    // console.log("Latitud: "+lat+"   Longitud: "+long);

    mapEle = document.getElementById('map_canvas');
    destination = {lat: 40.4163403, lng: -3.70343861982586};

    lat = 40.4163403;
    lng = -3.70343861982586;

    if(this.currentLat != null){
        lat = this.currentLat;
    }
    if(this.currentLong != null){
        lng = this.currentLong;
    }

    map = new google.maps.Map(
        mapEle, {
        center: new google.maps.LatLng(lat, lng),//latitud,longitud),//
        zoom: 8, // zoom del mapa
        draggableCursor: 'auto', // forma del cursor
        draggingCursor: 'crosshair',
        mapTypeId: google.maps.MapTypeId.ROADMAP // tipo de mapa
        });
}
////////////////////////////////////////////////////////////////////////////////////////////
//#endregion




//#region Pedir Ubicacion del dispositivo
///////////////////////////// PEDIMOS UBICACION DEL DISPOSITIVO ////////////////////////////////
function funcionInit() {
    if(!getPosition){
        if (!"geolocation" in navigator) {
            return alert("Tu navegador no soporta el acceso a la ubicación. Intenta con otro");
        }
    
        const onUbicacionConcedida = ubicacion => {
            console.log("Tengo la ubicación: ", ubicacion);
            const coordenadas = ubicacion.coords;
            this.currentLat = coordenadas.latitude;
            this.currentLong = coordenadas.longitude;
            console.log("Latitud: "+currentLat+"  Longitud: "+currentLong );
            this.getPosition = true;
            console.log(getPosition);
            centrarMapa(map, currentLat, currentLong);
            zoomMapa(12);
            ponerMarcador(currentLat, currentLong, "Ubicacion actual");
        }
      
        const onErrorDeUbicacion = err => {
            console.log("Error obteniendo ubicación: ", err);
        }
    
        const opcionesDeSolicitud = {
            enableHighAccuracy: true, // Alta precisión
            maximumAge: 0, // No queremos caché
            timeout: 5000 // Esperar solo 5 segundos
        };
        // Solicitar
        navigator.geolocation.getCurrentPosition(onUbicacionConcedida, onErrorDeUbicacion, opcionesDeSolicitud);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////
//#endregion

//#region Cambiar el centro del MAPA
///////////////////////////// CENTRAR EL MAPA ////////////////////////////////
function centrarMapa(map, latitud, longitud){
    map.setCenter(new google.maps.LatLng(latitud, longitud),23);
}

//////////////////////////////////////////////////////////////////////////////
//#endregion

//#region Cambiar el zoom del MAPA
///////////////////////////// CENTRAR EL MAPA ////////////////////////////////
function zoomMapa(num){
    map.setZoom(num);
}

//////////////////////////////////////////////////////////////////////////////
//#endregion









function ponerMarcador(lat, long, txt) {
    var marker = new google.maps.Marker({
        position: {lat: lat, lng: long},
        // icon: url("https://pegaso.h3m.com:2083/cpsess2639202532/viewer/home%2fs022045b%2fpublic_html%2fcurso21_22%2fVelasco_Diego_2122%2fassets%2fimg/ubiBlue.png"),
        map: map,
        title: txt
    });
}


function ponerMarcadores() {
    this.markers = new google.maps.Marker();
}



function hacerRuta(){
    var origen = document.getElementById("cOrigen").value
    var destino = document.getElementById("cDestino").value
    var request = {
            origin:origen,
            destination:destino,
            travelMode: google.maps.TravelMode.DRIVING
        };
        alert(origen)
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        // Indicamos dónde esta el mapa para renderizarnos
        directionsDisplay.setMap(map);
        // Indicamos dónde esta el panel para mostrar el texto
        directionsDisplay.setPanel(document.getElementById("pano"));
        directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result);
            }
        });

}





function centrarMunicipio(){
    var  geocoder = new google.maps.Geocoder();
    var municipio = document.getElementById("selectMunicipio").textContent;
    var provincia = document.getElementById("selectProvincia").textContent;
    var ccaa = document.getElementById("selectCCAA").textContent;
    console.log(document.getElementById("selectMunicipio").textContent);

    console.log(municipio);

    geocoder.geocode( { 'address': municipio+", "+provincia+", "+ccaa+"España"}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

            console.log(results[0].geometry.location);
            map.setCenter(results[0].geometry.location);
            zoomMapa(12);
            // var marker = new google.maps.Marker({
            //     map: map,
            //     icon:"buscar.png",
            //     position: results[0].geometry.location
            // });
        } else {
            alert('Geocode no ha podido localizar la dirección por este motivo: ' + status);
        }  
    });
}
