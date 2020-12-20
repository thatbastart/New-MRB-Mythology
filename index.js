// initialize map
let southWest = L.latLng(25, -118),
    northEast = L.latLng(54, -74),
    mybounds = L.latLngBounds(southWest, northEast);
let map = L.map('map', {maxBounds: mybounds, minZoom: 10, maxZoom: 14, rotate: true, zoomControl: false});
map.setView([43.18, -91.15], 12);

// custom tiles
L.tileLayer('/Tiles/{z}/{x}/{y}.png', {
    'attribution':  'Map Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    'useCache': true
}).addTo(map);

// custom controls
// control panel zoom, rotation, edit mode
L.control.custom({
    position: "topleft",
    content: "<table><tr>" +
                "<td>Zoom</td><td>Rotation</td><td>Edit Mode</td><td>Overview</td></tr>" +
                "<tr><td><button type='button' id='ctrl_zm' class='ctrl_zoom' style='width: 30px; height: 20px;' onClick='map.setZoom(map.getZoom() - 1)'><clr-icon shape='minus' style='color: #000'></clr-icon></button>"+
                "<button type='button' id='ctrl_zp' class='ctrl_zoom' style='width: 30px; height: 20px;' onClick='map.setZoom(map.getZoom() + 1)'><clr-icon shape='plus' style='color: #000'></clr-icon></button></td>"+
                "<td><input type='range' min='0' max='360' value='0' step='1' name='rotation' id='ctrl_rotate' class='ctrl_rotate'/></td>" +
                "<td><label class='switch'><input type='checkbox' id='ctrl_edit' onclick='edit()'><span class='ctrl_edit'></span></label></td>" +
                "<td><label class='switch'><input type='checkbox' id='ctrl_ov' onclick='overview();'><span class='ctrl_edit'></span></label></td>" +
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

// intialize marker icons; green=community; blue=editorial; red=position
let greenIcon = L.icon({
    iconUrl: 'marker_green.png',
    iconSize:     [30, 30], 
    iconAnchor:   [15, 15], 
    popupAnchor:  [-500, 15] 
});
let redIcon = L.icon({
    iconUrl: 'marker_red.png',
    iconSize:     [16, 16], 
    iconAnchor:   [8, 8], 
});

// reset view when marker is selected
map.on('popupopen', function(e) {
    let marker = e.popup._source;
    view_reset(marker._latlng.lat,marker._latlng.lng);
});


let arr_marker = [];

// Fetch all notes from the database and add them to the map.
fetch("/api/get_notes", {
    cache: "no-cache"
})
.then(response => response.json())
.then(json => json.map(note => {
    let marker = new L.marker({ lat: note.lat, lng: note.lon }, {icon: greenIcon}).addTo(map);
    let title = note.versions[note.versions.length-1].title;
    let text =  note.versions[note.versions.length-1].text;
    marker.bindPopup("<h1>" + title + "</h1><br>" + text);
    marker.noteVersions = note.versions;
    arr_marker.push(marker);
}))
.catch(err => console.log(err));

// popup (pu) submit function
function pu_submit(){
    let title = L.DomUtil.get("pu_title").value;
    let text = L.DomUtil.get("pu_content").value;
    let latlng = arr_marker[arr_marker.length-1]._latlng;
    arr_marker[arr_marker.length-1].bindPopup("<h1>" + title + "</h1><br>" + text);

    // push the created note to the database.
    fetch("/api/add_note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      // The backend only accepts this very request structure. Ping Kerstin for more fields etc.
      body: JSON.stringify( {
        versions: [ {
          title: title,
          text: text
        } ],
        lat: latlng.lat,
        lon: latlng.lng,
        kind: ""
      } )
    })
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(err => console.log(err));
}

// adding marker
let marker=undefined;
function add_marker(pos,title,content){
    marker = new L.marker(pos, {icon: greenIcon}).addTo(map);
    
    title = (typeof title !== 'undefined') ?  title : "";
    content = (typeof content !== 'undefined') ?  content : "";
    marker.bindPopup("<textarea id='pu_title' rows='1' style='text-align: center'>" + title + "</textarea><br><br>" +
                    "<textarea id='pu_content' rows='32'>" + content + "</textarea><br><br>" +
                    "<button type='button' style='width:80px; height: 20px;' onclick='pu_submit()'>Submit</button>")
    
    arr_marker.push(marker);
    marker.openPopup();
    view_reset(pos.lat,pos.lng);
}

map.on('click', function(e){
    if(document.getElementById("ctrl_edit").checked==true && document.getElementById("ctrl_ov").checked==false){
        add_marker(e.latlng);
    }
});

map.on("popupclose", function() {
    if(document.getElementById("pu_title")!=null && document.getElementById("pu_content")!=null){
        if(document.getElementById("pu_title").value=="" && document.getElementById("pu_content").value==""){
            map.removeLayer(marker);
            arr_marker.pop();
        } else {
            if (confirm("The content of this marker is not submitted yet. Are you sure you want to close it? All content will be lost!")){
                map.removeLayer(marker);
                arr_marker.pop();
            } else {
                add_marker(marker._latlng,document.getElementById("pu_title").value,document.getElementById("pu_content").value);
            }
        }
    }
}), function(){console.log("hello");};

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


// edit
function edit(){
    if(document.getElementById("ctrl_ov").checked==true){
        document.getElementById("ctrl_edit").checked=false;
    }
}

// overview
let curr_view=[0.0,0.0,0]
let curr_pos=undefined;

function overview(){
    let curr_edit=false;
    if(document.getElementById("ctrl_ov").checked==true){
        curr_edit=document.getElementById("ctrl_edit").checked;
        document.getElementById("ctrl_edit").checked=false;
        curr_view[0]=map.getCenter().lat;
        curr_view[1]=map.getCenter().lng;
        curr_view[2]=map.getZoom();
        curr_pos=L.marker([curr_view[0], curr_view[1]], {icon: redIcon}).addTo(map);
        
        setIcon(greenIcon,16);
        map.options.minZoom=6;
        map.options.maxZoom=6;
        map.setView([curr_view[0], curr_view[1]], 6);
        map.closePopup();
    } else {
        document.getElementById("ctrl_edit").checked=curr_edit;
        map.removeLayer(curr_pos);

        setIcon(greenIcon,30);
        map.options.minZoom=10;
        map.options.maxZoom=14;
        map.setView([curr_view[0], curr_view[1]], curr_view[2]);
    }
}


// redefine icon size
function setIcon(ico,size){
    ico.options.iconSize=[size, size];
    ico.options.iconAnchor=[size/2, size/2];

    for(let i=0;i<arr_marker.length;i++){
        arr_marker[i].setIcon(ico);
    }
}