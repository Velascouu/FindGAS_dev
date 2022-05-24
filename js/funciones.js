// const municipiosJson = import('../assets/json/localidades.json');


var arrayEESS = new Array();
var markers = new Array();
var precioMedio;

buscarCCAA();

//#region Buscar el listado de CCAA
///////////////////////////// Buscar el listado de CCAA ////////////////////////////////

function buscarCCAA() {
    fetch('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ComunidadesAutonomas/')
    .then(resp => {
        console.log("Estado url : "+ resp.url+ "  status: "+resp.status+" type: "+resp.type);              
        return resp.json();
    })
    .then(json => {
        // console.log(json);
        i=0;
        var ListaCCAA = json;
        select = document.getElementById('selectCCAA');
        // limpiarSelect(select);

        ListaCCAA.forEach(e => {
            // console.log(e);
            id = ListaCCAA[i]["IDCCAA"];
            nombre = ListaCCAA[i]["CCAA"];
            // console.log("Id: "+id+"    Nombre: "+nombre);

            var option = document.createElement("option");
            option.value = id;
            option.text = nombre;
            this.select.options.add(option);
            i++;
        });
    })
    .catch(err => { console.log("ERROR :" + err) });
}
//#endregion

//#region Buscar el listado de CCAA por Tipo de Combustible
///////////////////////////// Buscar el listado de CCAA por Tipo de Combustible ////////////////////////////////

function buscarEESSxCCAAyPrecio(idCCAA) {
    fetch('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroCCAAProducto/'+idCCAA+'/'+1)
    .then(resp => {
        console.log("Estado url : "+ resp.url+ "  status: "+resp.status+" type: "+resp.type);              
        return resp.json();
    })
    .then(json => {
        console.log(json);
        i=0;
        var sumaPrecios = 0;
        var mediaPrecios = 0;
        var ListaEESS = json;
        // limpiarSelect(select);

        ListaEESS["ListaEESSPrecio"].forEach(e => {
            // console.log(e);
            // console.log(e["PrecioProducto"]);
            // e["PrecioProducto"]
            sumaPrecios = sumaPrecios + parseFloat(e["PrecioProducto"].replace(',', '.'));
            // console.log(sumaPrecios);
            i++;
        });
        mediaPrecios = sumaPrecios/(i+1);
        console.log(mediaPrecios);
    })
    .catch(err => { console.log("ERROR :" + err) });
}
//#endregion

//#region Buscar el listado de Provincias
///////////////////////////// Buscar el listado de Provincias ////////////////////////////////

function buscarProvincias(idCCAA) {
    fetch('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ProvinciasPorComunidad/'+idCCAA)
    .then(resp => {
        console.log("Estado url : "+ resp.url+ "  status: "+resp.status+" type: "+resp.type);              
        return resp.json();
    })
    .then(json => {
        // console.log(json);
        i=0;
        var ListaProvincias = json;
        select = document.getElementById('selectProvincia');
        limpiarSelect(select);


        ListaProvincias.forEach(e => {
            // console.log(e);
            id = ListaProvincias[i]["IDPovincia"];
            nombre = ListaProvincias[i]["Provincia"];
            // console.log("Id: "+id+"    Nombre: "+nombre);

            var option = document.createElement("option");
            option.value = id;
            option.text = nombre;
            select.options.add(option);
            i++;
        });
    })
    .catch(err => { console.log("ERROR :" + err) });
}
//#endregion

//#region Buscar el listado de Municipios
///////////////////////////// Buscar el listado de Municipios ////////////////////////////////

function buscarMunicipios(idProvincia) {
    fetch('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/'+idProvincia)
    .then(resp => {
        console.log("Estado url : "+ resp.url+ "  status: "+resp.status+" type: "+resp.type);              
        return resp.json();
    })
    .then(json => {
        console.log(json);
        i=0;
        var ListaMunicipios = json;
        select = document.getElementById('selectMunicipio');
        limpiarSelect(select);

        ListaMunicipios.forEach(e => {
            // console.log(e);
            id = ListaMunicipios[i]["IDMunicipio"];
            nombre = ListaMunicipios[i]["Municipio"];
            // console.log("Id: "+id+"    Nombre: "+nombre);

            var option = document.createElement("option");
            option.value = id;
            option.text = nombre;
            select.options.add(option);
            i++;
        });
    })
    .catch(err => { console.log("ERROR :" + err) });
}
//#endregion

//#region Buscar el listado de EESS por municipios
///////////////////////////// Buscar el listado de EESS por municipios ////////////////////////////////

function buscarEESSporMun(idMunicipio) {
    fetch('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/'+idMunicipio)
    .then(resp => {
        console.log("Estado url : "+ resp.url+ "  status: "+resp.status+" type: "+resp.type);              
        return resp.json();
    })
    .then(json => {
        console.log(json);
        i=0;
        var ListaEESS = json["ListaEESSPrecio"];

        limpiarRegistros();
        // limpiarMarcadores();

        if(ListaEESS.length > 0){
            guardarRegistros(ListaEESS);
            guardarMarcadores(ListaEESS);
        }
        
    })
    .catch(err => { console.log("ERROR :" + err) });
}
//#endregion

//#region Funcion que guarda los registros en arrayEESS
function guardarRegistros(ListaEESS) {
    i = 0;

    // limpiarRegistros();
    if(document.getElementById('selectCombustible').value == null){
        alerta("Selecciona un tipo de combustible", "liveAlertPlaceholder");
    }else{
        imprimirHeaders();
        
        ListaEESS.forEach(e => {
            eess =  new Array({
                id: i,
                cp: e["C.P."],
                direccion: e["Dirección"],
                horario: e["Horario"],
                localidad: e["Municipio"],
                provincia: e["Provincia"],
                empresa: e["Rótulo"],
                latitud: parseFloat(e["Latitud"].replace(',', '.')),
                longitud: parseFloat(e["Longitud (WGS84)"].replace(',', '.')),
    
                precio_biodiesel: e["Precio Biodiesel"],
                precio_bioetanol: e["Precio Bioetanol"],
                precio_gasComp: e["Precio Gas Natural Comprimido"],
                precio_gasLic: e["Precio Gas Natural Licuado"],
                precio_gasolina95: e["Precio Gasolina 95 E5"],
                precio_gasoleoA: e["Precio Gasoleo A"],
                precio_gasoleoB: e["Precio Gasoleo B"],
                precio_gasoleoPremium: e["Precio Gasoleo Premium"],
                precio_gasolina95premium: e["Precio Gasolina 95 E5 Premium"],
                precio_gasolina98: e["Precio Gasolina 98 E5"],
                precio_hidrogeno: e["Precio Hidrogeno"],
    
                tipo_venta: e["Tipo Venta"],
                margen: e["Margen"],
                idCCAA: e["IDCCAA"],
                idEESS: e["IDEESS"],
            });

            // var marker = new Array({
            //     position: {lat: parseFloat(eess.latitud), lng: parseFloat(eess.longitud)},
            //     // icon: url("./assets/img/ubiBlue.png"),
            //     map: map,
            //     title: eess.empresa+", "+eess.direccion
            // });
            // markers.add(marker);
            arrayEESS.push(eess);

            ponerMarcador(parseFloat(e["Latitud"].replace(',', '.')), parseFloat(e["Longitud (WGS84)"].replace(',', '.')), e["Rótulo"]+", "+e["Dirección"]);
            
            imprimirRegistro(i);
            i++;
        });
    }
    console.log(this.arrayEESS);
}
//#endregion

//#region Guardar MARCADORES
function guardarMarcadores(ListaEESS) {
    i = 0;

    limpiarMarcadores();
    
    ListaEESS.forEach(e => {
        
        console.log(e);

        var marker = new Array({
            position: {lat: parseFloat(e.latitud), lng: parseFloat(e.longitud)},
            // icon: url("./assets/img/ubiBlue.png"),
            map: map,
            title: e.empresa+", "+e.direccion
        });
        markers.push(marker);
        
        i++;
    });

    // console.log(this.markers);
}
//#endregion

//#region Funcion de ALERTA
function alerta(texto, id) {
    const alertPlaceholder = document.getElementById(id)

    const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }

    // const alertTrigger = document.getElementById('liveAlertBtn')
    // if (alertTrigger) {
    // alertTrigger.addEventListener('click', () => {
        alert(texto, 'danger')
    // })
    // }
}
//#endregion

//#region Busca el listado de municipios de toda España
///////////////////////////// Buscar el listado de Municipios ////////////////////////////////

function buscarListaMunicipios() {
    fetch('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/Municipios/')
    .then(resp => {
        console.log("Estado url : "+ resp.url+ "  status: "+resp.status+" type: "+resp.type);              
        return resp.json();
    })
    .then(json => {
        console.log(json);
        var ListaMunicipios = json;
        
        ListaMunicipios.forEach(e => {
            // console.log(e);
            id = ListaMunicipios[i]["IDMunicipio"];
            nombre = ListaMunicipios[i]["Municipio"];
            if(idMunicipio == id){
                console.log("Id: "+id+"    Nombre: "+nombre);
            //     console.log(e);
            }
            i++;
        });
    })
    .catch(err => { console.log("ERROR :" + err) });
}
//#endregion

//#region Limpia los select
function limpiarSelect(select) {
    if (select.hasChildNodes) {
        // console.log(select.lastChild.text);
        // console.log(select.firstChild.text);
        // console.log(select.childNodes.length)
        while (select.lastChild.text != select.firstChild.text) {
            select.removeChild(select.lastChild);
        }
        return
    }else{
        return
    }
}
//#endregion

//#region Ver MODAL
///////////////////////////// Fuuncion del modal ////////////////////////////////
function verModal(){
    var myModal = document.getElementById('myModal')
    var myInput = document.getElementById('myInput')

    myModal.addEventListener('shown.bs.modal', function () {
    myInput.focus()
})
}
//#endregion

//#region Funcion LIMPIAR REGISTROS
function limpiarRegistros() {
    // console.log("*********************************************************************");
    // console.log(this.arrayEESS.length);
    // console.log(this.arrayEESS);
    this.arrayEESS.splice(0, arrayEESS.length);
    // console.log(this.arrayEESS.length);
    // console.log(this.arrayEESS);
    // console.log("*********************************************************************");

    limpiarCabecera();
    limpiarTabla();

}
//#endregion

//#region Funcion LIMPIAR TABLA
function limpiarTabla() {
   
    var tabla = document.getElementById("tabla");
    var cuerpo = document.getElementById("tablaEESS");
    while (cuerpo.getElementsByTagName("tr").length > 0) {
        // alert(cuerpo.getElementsByTagName("tr").length)
        cuerpo.removeChild(cuerpo.lastChild);
    }
}
//#endregion

//#region Funcion LIMPIAR CABECERA
function limpiarCabecera() {
    
    var tabla = document.getElementById("tabla");
    var header = document.getElementById("tablaHeaders");
    while (header.getElementsByTagName("tr").length > 0) {
        // alert(header.getElementsByTagName("tr").length)
        header.removeChild(header.lastChild);
    }
}
//#endregion

//#region Limpiar MARCADORES
function limpiarMarcadores() {
    console.log("*********************************************************************");
    console.log(this.markers.length);
    console.log(this.markers);
    this.markers.splice(0, markers.length);
    console.log(this.markers.length);
    console.log(this.markers);
    console.log("*********************************************************************");
}
//#endregion

//#region Funcion IMPRIMIR CABECERA
function imprimirHeaders() {

    limpiarCabecera();

    comb = selectCombustibleString();


    header = document.getElementById('tablaHeaders');
    linea = document.createElement("tr");
    // linea.setAttribute("onclick", "metodoSort()");


    head = document.createTextNode("#");
    Columna = document.createElement("th");
    // Columna.setAttribute("scope", "col");
    Columna.appendChild(head);
    linea.appendChild(Columna);

    head = document.createTextNode("EMPRESA");
    Columna = document.createElement("th");
    // Columna.setAttribute("scope", "col");
    Columna.appendChild(head);
    linea.appendChild(Columna);

    head = document.createTextNode("DIRECCIÓN");
    Columna = document.createElement("th");
    // Columna.setAttribute("scope", "col");
    Columna.appendChild(head);
    linea.appendChild(Columna);

    head = document.createTextNode("LOCALIDAD");
    Columna = document.createElement("th");
    // Columna.setAttribute("scope", "col");
    Columna.appendChild(head);
    linea.appendChild(Columna);
    
    head = document.createTextNode("C.P.");
    Columna = document.createElement("th");
    // Columna.setAttribute("scope", "col");
    Columna.appendChild(head);
    linea.appendChild(Columna);

    head = document.createTextNode("PROVINCIA");
    Columna = document.createElement("th");
    // Columna.setAttribute("scope", "col");
    Columna.appendChild(head);
    linea.appendChild(Columna);

    head = document.createTextNode("HORARIO");
    Columna = document.createElement("th");
    // Columna.setAttribute("scope", "col");
    Columna.appendChild(head);
    linea.appendChild(Columna);

    if(comb == ""){
        head = document.createTextNode("COMBUSTIBLE");
    }else{
        head = document.createTextNode(comb);
    }
    Columna = document.createElement("th");
    // Columna.setAttribute("scope", "col");
    Columna.appendChild(head);
    linea.appendChild(Columna);
    
    // linea.appendChild(Columna)
    header.appendChild(linea);



}
//#endregion

//#region Seleccion del COMBUSTIBLE y devuelve una cadena de texto
function selectCombustibleString() {
    switch (document.getElementById('selectCombustible').value) {
        case 'gasolina95':
            return "GASOLINA 95";
        case 'gasolina95premium':
            return "GASOLINA 95 PREMIUM";
        case 'gasolina98':
            return "GASOLINA 98";
        case 'diesel':
            return "DIÉSEL";
        case 'diesel+':
            return "DIÉSEL +";
        case 'biodiesel':
            return "BIODIÉSEL";
        case 'bioetanol':
            return "BIOETANOL";
        case 'GNC':
            return "GNC";
        case 'GNL':
            return "GLC";
        case 'hidrogeno':
            return "HIDRÓGENO";
        default:
            return null;
    }
}
//#endregion

//#region Funcion IMPRIMIR REGISTRO
function imprimirRegistro(i) {

    comb = selectCombustible(this.arrayEESS[i][0]);
    lat = parseFloat(this.arrayEESS[i][0].latitud);
    long = parseFloat(this.arrayEESS[i][0].longitud);
    empresa = this.arrayEESS[i][0].empresa;
    direccion = this.arrayEESS[i][0].direccion;
    localidad = this.arrayEESS[i][0].localidad;
    cp = this.arrayEESS[i][0].cp;
    provincia = this.arrayEESS[i][0].provincia;
    horario = this.arrayEESS[i][0].horario;

//Empieza la estructura de lineas creadas
    registro = document.getElementById('tablaEESS');
    linea = document.createElement("tr");
    linea.setAttribute("onclick", "clickEESS(this.id)");
    linea.setAttribute("id", i);
    linea.setAttribute("class", "registroEESS");

    dato = document.createTextNode(i+1);
    Columna = document.createElement("td");
    Columna.appendChild(dato);
    linea.appendChild(Columna);

    dato = document.createTextNode(empresa);
    Columna = document.createElement("td");
    Columna.appendChild(dato);
    linea.appendChild(Columna);

    dato = document.createTextNode(direccion);
    Columna = document.createElement("td");
    Columna.appendChild(dato);
    linea.appendChild(Columna);

    dato = document.createTextNode(localidad);
    Columna = document.createElement("td");
    Columna.appendChild(dato);
    linea.appendChild(Columna);
    
    dato = document.createTextNode(cp);
    Columna = document.createElement("td");
    Columna.appendChild(dato);
    linea.appendChild(Columna);

    dato = document.createTextNode(provincia);
    Columna = document.createElement("td");
    Columna.appendChild(dato);
    linea.appendChild(Columna);

    dato = document.createTextNode(horario);
    Columna = document.createElement("td");
    Columna.appendChild(dato);
    linea.appendChild(Columna);

    if(comb == ""){
        dato = document.createTextNode('No hay datos');
    }else{
        if(comb == undefined){
            dato = document.createTextNode('Selecciona un tipo de combustible');
        }else{
            dato = document.createTextNode(comb+'€/l');
        }
    }
    Columna = document.createElement("td");
    Columna.appendChild(dato);
    linea.appendChild(Columna);
    
    linea.appendChild(Columna)
    registro.appendChild(linea);
}
//#endregion

//#region Seleccion del COMBUSTIBLE
function selectCombustible(eess) {
    switch (document.getElementById('selectCombustible').value) {
        case 'gasolina95':
            combustible = eess.precio_gasolina95;
            return combustible;
        case 'gasolina95premium':
            combustible = eess.precio_gasolina95premium;
            return combustible;
        case 'gasolina98':
            combustible = eess.precio_gasolina98;
            return combustible;
        case 'diesel':
            combustible = eess.precio_gasoleoA;
            return combustible;
        case 'diesel+':
            combustible = eess.precio_gasoleoPremium;
            return combustible;
        case 'biodiesel':
            combustible = eess.precio_biodiesel;
            return combustible;
        case 'bioetanol':
            combustible = eess.precio_bioetanol;
            return combustible;
        case 'GNC':
            combustible = eess.precio_gasComp;
            return combustible;
        case 'GNL':
            combustible = eess.precio_gasLic;
            return combustible;
        case 'hidrogeno':
            combustible = eess.precio_hidrogeno;
            return combustible;
        default:
            
            return null;
    }
}
//#endregion

//#region Metodo onclick para cada registro

function clickEESS(i) {
    // console.log(evento.target.id.value);
    // i = evento.target.id;

    lat = parseFloat(this.arrayEESS[i][0].latitud);
    long = parseFloat(this.arrayEESS[i][0].longitud);
    empresa = this.arrayEESS[i][0].empresa;
    direccion = this.arrayEESS[i][0].direccion;

    console.log("Lat: "+lat+"   Long: "+long);
    zoomMapa(14);
    // ponerMarcadores(lat, long, empresa+", "+direccion);
    centrarMapa(map, lat, long);
}
//#endregion





// var localidades = JSON.parse(municipiosJson);
// console.log(localidades[1]["Comunidad"]);


// try {
//     var localidades = JSON.parse(municipiosJson);
// } catch (error) {
//     is_json = false;
//     console.log("Invalid JSON string");
// }









