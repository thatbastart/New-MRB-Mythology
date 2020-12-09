// initialize map
let map = L.map('map', {minZoom: 10, maxZoom: 14, rotate: true, zoomControl: false});
map.setView([43.0, -91.0], 8);

// custom tiles
L.tileLayer('/Tiles/{z}/{x}/{y}.png', {
    'attribution':  'Map Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    'useCache': true
}).addTo(map);

// custom controls
// control panel zoom, rotation, edit mode
L.control.custom({
    position: "topleft",
    content: "<table style='text-align: center; vertical-align: center; background-color:rgba(0, 0, 0, 0.5); padding:5px;'><tr>" +
                "<td>Zoom</td><td>Rotation</td><td>Edit Mode</td></tr>" +
                "<tr><td><button type='button' id='ctrl_zp' class='ctrl_zoom' style='width: 30px; height: 20px;' onClick='map.setZoom(map.getZoom() + 1)'><clr-icon shape='plus' style='color: #000'></clr-icon></button>"+
                "<button type='button' id='ctrl_zm' class='ctrl_zoom' style='width: 30px; height: 20px;' onClick='map.setZoom(map.getZoom() - 1)'><clr-icon shape='minus' style='color: #000'></clr-icon></button></td>"+
                "<td><input type='range' min='0' max='360' value='0' step='1' name='rotation' id='ctrl_rotate' class='ctrl_rotate'/></td>" +
                "<td><label class='switch'><input type='checkbox' id='ctrl_edit'><span class='ctrl_edit'></span></label></td>" +
                "</tr></table>",
    style:
    {
        margin: "0",
        padding: "0px 0 0 0",
    },
}).addTo(map);

// title
L.control.custom({
    position: "topright",
    content: "<h1>The New Mississippi River Basin Mythology</h1>",
}).addTo(map);        
        
// Lat and Lng at cursor
L.control.mousePosition({prefix: "Lat ", separator: "\nLng ", numDigits: 2}).addTo(map);

// intialize marker icons; green=community; blue=editorial
let greenIcon = L.icon({
    iconUrl: 'marker_green.png',
    iconSize:     [30, 30], 
    iconAnchor:   [15, 15], 
    popupAnchor:  [-500, 15] 
});

// reset view when marker is selected
map.on('popupopen', function(e) {
    let marker = e.popup._source;
    view_reset(marker._latlng.lat,marker._latlng.lng);
});

let arr_marker = [];

// popup (pu) submit function
function pu_submit(){
    let title = L.DomUtil.get("pu_title").value;
    let content = L.DomUtil.get("pu_content").value;
    arr_marker[arr_marker.length-1].bindPopup("<h1>" + title + "</h1><br>" + content);
}

// adding marker
map.on('click', function(e){
    if(document.getElementById("ctrl_edit").checked==true){
        let marker = new L.marker(e.latlng, {icon: greenIcon}).addTo(map);
        
        marker.bindPopup("<textarea id='pu_title' rows='1' style='text-align: center'></textarea><br><br>" +
                        "<textarea id='pu_content' rows='32'></textarea><br><br>" +
                        "<button type='button' style='width:80px; height: 20px;' onclick='pu_submit()'>Submit</button>")
        
        arr_marker.push(marker);
        marker.openPopup();
        view_reset(e.latlng.lat,e.latlng.lng);
    }

});

// set rotation on slider change (continous)
window.onload = function() {
    let slider = document.getElementById("ctrl_rotate");
    slider.addEventListener('input', function () {
        map.closePopup();
        map.setBearing(document.getElementById("ctrl_rotate").value);
    });
}

// focus on marker; coord offset depending on zoom level
function change_view(lt,ln){
    let offset=0;
    switch(map.getZoom()){
        case 10:
            offset=0.275;
            break;
        case 11:
            offset=0.15;
            break;
        case 12:
            offset=0.075;
            break;
        case 13:
            offset=0.04;
            break;
        case 14:
            offset=0.015;
            break;
    }
    map.setView([lt+offset, ln-offset]);
}

// reset rotation and focus
function view_reset(lt,ln){
    map.setBearing(0);
    document.getElementById("ctrl_rotate").value=0;
    document.getElementById("ctrl_rotate").style.background = 'linear-gradient(to right, #00a104 0%, #00a104 0%, #fff 0%, white 100%)';
    change_view(lt,ln); 
}

// shading the rotation slider bar
document.getElementById("ctrl_rotate").oninput = function() {
    this.style.background = 'linear-gradient(to right, #00a104 0%, #00a104 ' + this.value/3.6 + '%, #fff ' + this.value/3.6 + '%, white 100%)'
};
