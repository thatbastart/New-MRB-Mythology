// LEAFLET MAP BASICS -----------------------------
// maxBounds
let southWest = L.latLng(25, -118),
    northEast = L.latLng(54, -74),
    mybounds = L.latLngBounds(southWest, northEast);
// initialize map
let map = L.map('map', {maxBounds: mybounds, minZoom: 10, maxZoom: 14, rotate: true, zoomControl: false});
map.setView([43.18, -91.15], 12); // map center

// custom tiles
L.tileLayer('/Tiles/{z}/{x}/{y}.png', {
    'attribution':  "Map Data &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>", // panel bottomright
    'useCache': true
}).addTo(map);


// OVERLAYS -----------------------------
// panel topleft: zoom, rotation, edit mode, overview
L.control.custom({
    position: "topleft",
    content: "<table><tr>" +
                "<td>Zoom</td><td>Rotation</td><td>Edit Mode</td><td>Overview</td><td>Stories</td></tr>" +
                "<tr><td style='width:3vw; min-width: 60px;'><button type='button' id='ctrl_zm' class='ctrl_zoom' style='width: 50%; min-width: 30px; height: 2vh; min-height: 20px;' onClick='map.setZoom(map.getZoom() - 1)'><clr-icon shape='minus' style='color: #000'></clr-icon></button>"+
                "<button type='button' id='ctrl_zp' class='ctrl_zoom' style='width: 50%; min-width: 30px; height: 2vh; min-height: 20px;' onClick='map.setZoom(map.getZoom() + 1)'><clr-icon shape='plus' style='color: #000'></clr-icon></button></td>"+
                "<td style='width:6vw;'><input type='range' min='0' max='360' value='0' step='30' name='rotation' id='ctrl_rotate' class='ctrl_rotate'/></td>" +
                "<td style='width:4vw;'><label class='switch'><input type='checkbox' id='ctrl_edit' onclick='edit()'><span class='ctrl_edit'></span></label></td>" +
                "<td style='width:4vw;'><label class='switch'><input type='checkbox' id='ctrl_ov' onclick='overview();'><span class='ctrl_edit'></span></label></td>" +
                "<td style='width:4vw;'><label class='switch'><input type='checkbox' id='ctrl_st' onclick='stories();'><span class='ctrl_edit'></span></label></td>" +
                "</tr></table><br><div id='stories-panel' class='stories-panel scroll'></div><div id='story' class='story scroll' onScroll='scrollMarker()'></div>",
    style:
    {
        margin: "0",
        padding: "0px 0 0 0",
    },
}).addTo(map);

class Story {
    constructor(title, author, text, img, img_sub, thumb, date, arr_marker){
        this.title=title;
        this.author=author;
        this.text=text;
        this.img=img;
        this.img_sub=img_sub
        this.thumb=thumb;
        this.date=date;
        this.marker=arr_marker;
    }
}

arr_stories=[];
arr_stories[0]=new Story("Hello World", "Chuck Norris", "stories/text/story_01.txt", "/stories/img/story_01.jpg", "much picture", "/stories/thumb/story_01.jpg", "31.12.2020", [[43.16,-91.15,13]]);
arr_stories[1]=new Story("My Old Friend", "Chuck Norris", "hi there", "/stories/img/story_01.jpg", "much wow", "/stories/thumb/story_01.jpg", "31.12.2020", [[43.16,-91.15,10]]);
arr_stories[2]=new Story("Mississippi Isabell", "Chuck Norris", "hi there", "/stories/img/story_01.jpg", "cat", "/stories/thumb/story_01.jpg", "31.12.2020", [[43.16,-91.15,10]]);

let tiles="";
for (let i=0;i<arr_stories.length;i++){
    tiles=tiles+"<div class='stories-panel_tiles' onClick='createStory("+i+")'><div style='height: 60%; overflow: hidden;'><img src='" + arr_stories[i].thumb + "' style='width: 100%; height:auto;'></img></div><div class='stories-panel_tiles_title'>"+arr_stories[i].title+"</div></div>";
}
document.getElementById("stories-panel").innerHTML="<center>"+tiles+"</center>";
  
let curr_st=undefined;
function createStory(id){
    curr_st=id;
    document.getElementById("stories-panel").style.display="none";
    document.getElementById("story").style.display="block";

    fetch(arr_stories[id].text)
        .then(response => response.text())
        .then(text => {document.getElementById("story").innerHTML="<clr-icon shape='arrow' dir='left' style='cursor: pointer; width: 20px; height: 20px; color: #000; position: absolute; top: 10px; left:10px;' onClick='story_back()'></clr-icon><center><span class='stories-panel_tiles_title'>" + arr_stories[id].title + "</span></center>" + arr_stories[id].author + ", " + arr_stories[id].date + "<br><br><img src='" + arr_stories[id].img + "' style='width: 100%; height:auto;'></img>" + arr_stories[id].img_sub + "<br><br>" + text;})
    
}

function scrollMarker(){
    let c=0;
    let m="story_marker_" + c;
    let spanY=document.getElementById(m).getBoundingClientRect().y - document.getElementById("story").getBoundingClientRect().y;
    let thld=document.getElementById("story").getBoundingClientRect().height / 2;

    if(spanY<thld && spanY>0){
        map.setView([arr_stories[curr_st].marker[c][0], arr_stories[curr_st].marker[c][1]], arr_stories[curr_st].marker[c][2]);
    }
    
}


function story_back(){
    document.getElementById("story").style.display="none";
    document.getElementById("stories-panel").style.display="block";
}


// panel topright: title
L.control.custom({
    position: "topright",
    content: "<h1 style='font-size: max(4.5vh,30px);'>The New Mississippi River Basin Mythology</h1>",
}).addTo(map);        
        
// panel bottomleft: Lat and Lng at cursor
L.control.mousePosition({prefix: "Lat ", separator: "\nLng ", numDigits: 2}).addTo(map);



// OVERLAY FUNCTIONS -----------------------------
// rotation slider
window.onload = function() {
    let slider = document.getElementById("ctrl_rotate");
    slider.addEventListener('input', function () {
        let rot=document.getElementById("ctrl_rotate").value;
        if(pu_flag==true){
            setAnchor();
        }
        map.setBearing(rot);
    });
}

// shading the rotation slider bar
document.getElementById("ctrl_rotate").oninput = function() {
    this.style.background = 'linear-gradient(to right, #00a104 0%, #00a104 ' + this.value/3.6 + '%, #fff ' + this.value/3.6 + '%, white 100%)'
};


// overview
let curr_view=[0.0,0.0,0]
let curr_pos=undefined;
let curr_edit=false;

function overview(){
    
    if(document.getElementById("ctrl_ov").checked==true){
        curr_edit=document.getElementById("ctrl_edit").checked;
        document.getElementById("ctrl_edit").checked=false;
        curr_view[0]=map.getCenter().lat;
        curr_view[1]=map.getCenter().lng;
        curr_view[2]=map.getZoom();
        curr_pos=L.marker([curr_view[0], curr_view[1]], {icon: redIcon}).addTo(map);
        
        setIcon(greenIcon,12);
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

// set edit depending on overview
function edit(){
    if(document.getElementById("ctrl_ov").checked==true){
        document.getElementById("ctrl_edit").checked=false;
    }
    if(document.getElementById("ctrl_edit").checked==false){
        popup_close_check();
    }
    // redraw popup to show/hide edit button
    let title =  curr_pu.title;
    let content =  curr_pu.content;
    curr_pu.bindPopup(popupString(title, content, 2,document.getElementById("ctrl_edit").checked));
    isOverflown(document.getElementById("pu_title_ld"));
}

// stories
function stories(){
    if(document.getElementById("ctrl_st").checked==true){
        document.getElementById("stories-panel").style.display="block";
    } else {
        document.getElementById("stories-panel").style.display="none";
        document.getElementById("story").style.display="none";
    }
}

// MARKER -----------------------------

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

// POPUP OPEN
let curr_pu=undefined;
let pu_flag=false;
let hist_c=undefined;
map.on('popupopen', function(e) {
    setAnchor();
    curr_pu = e.popup._source;
    pu_flag=true;
    hist_c=0;
    isOverflown(document.getElementById("pu_title_ld"));
});

// POPUP CLOSE
map.on("popupclose", function(e) {
    pu_flag=false;
    popup_close_check();
});

function popup_close_check(){
    if(document.getElementById("pu_title")!=null && document.getElementById("pu_content")!=null){
        if(document.getElementById("pu_title").value=="" && document.getElementById("pu_content").value==""){
            map.removeLayer(arr_marker[arr_marker.length-1]);
            arr_marker.pop();
        } else {
            if (confirm("The content of this marker is not submitted yet. Are you sure you want to close it? All content will be lost!")){
                document.getElementById("pu_title").value="";
                document.getElementById("pu_content").value="";
                map.removeLayer(arr_marker[arr_marker.length-1]);
                arr_marker.pop();
            } else {
                let pu_ll=marker._latlng;
                let pu_t=document.getElementById("pu_title").value;
                let pu_c=document.getElementById("pu_content").value;
                document.getElementById("pu_title").value="";
                document.getElementById("pu_content").value="";
                map.removeLayer(arr_marker[arr_marker.length-1]);
                arr_marker.pop();
                add_marker(pu_ll,pu_t,pu_c);
                document.getElementById("ctrl_edit").checked=true;
            }
        }
    }
}



let arr_marker = [];

// GET NOTES - Fetch all notes from the database and add them to the map.
fetch("/api/get_notes", {
    cache: "no-cache"
})
.then(response => response.json())
.then(json => json.map(note => {
    let marker = new L.marker({ lat: note.lat, lng: note.lon }, {icon: greenIcon}).addTo(map);
    let title = note.versions[note.versions.length-1].title;
    let content =  note.versions[note.versions.length-1].text;
    marker.title=title;
    marker.content=content;
    marker.bindPopup(popupString(title, content, 2,document.getElementById("ctrl_edit").checked));
    marker.noteVersions = note.versions;
    arr_marker.push(marker);
}))
.catch(err => console.log(err));

// ADD NOTES - popup submit function
function pu_submit(){
    let title = L.DomUtil.get("pu_title").value;
    let text = L.DomUtil.get("pu_content").value;
    if (title=="" || text==""){
        alert("Please enter a title and some content.");
    } else {
        let latlng = arr_marker[arr_marker.length-1]._latlng;
        let converter = new showdown.Converter({extensions: ["htmlescape"]});
        let content= converter.makeHtml(text);
        arr_marker[arr_marker.length-1].title=title;
        arr_marker[arr_marker.length-1].content=content;
        arr_marker[arr_marker.length-1].bindPopup(popupString(title, content, 2,document.getElementById("ctrl_edit").checked));
        isOverflown(document.getElementById("pu_title_ld"));

        // push the created note to the database.
        fetch("/api/add_note", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            cache: "no-cache",
            // The backend only accepts this very request structure. Ping Kerstin for more fields etc.
            body: JSON.stringify( {
                versions: [ {
                title: title,
                text: content
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
}

function popupString(title, content, n, edit){ // n1: edit layout; n2: final layout
    let disp="";
    if(edit==true){
        disp="inline";
    } else {
        disp="none";
    }
    switch(n){
        case 1:
            return "<textarea id='pu_title' rows='1' style='text-align: center' maxlength='40' class='title_ta'>" + title + "</textarea><br><br>" +
            "<textarea id='pu_content' rows='30' class='content_ta scroll'>" + content + "</textarea><br><br>" +
            "<div class='tooltip'>You can use Markdown to format the text." + 
            "<span class='tooltiptext'>Heading 1: # <br>Heading 2: ## <br>Italics: *Text* <br>Bold: **Text** <br>Blockquote: < Text <br>Horizontal Line: --- <br>Links: [Text](URL) <br>Paragraph: Empty Line</span></div><br><br>" +
            "<button type='button' style='width:6vw; min-width:100px; height: 20px;' onclick='pu_submit()'><clr-icon shape='check' style='color: #000'></clr-icon> Submit</button>"
        case 2:
            return "<h1 id='pu_title_ld' class='title' style='font-size: 30'>" + title + "</h1><br><div id='pu_content_ld' class='content scroll'>" + content +"</div><br>" +
            "<button type='button' id='btn_edit' style='width:3vw; min-width: 40px; height: 20px; display:" + disp + ";' onClick='invoke_pu_edit()' ><clr-icon shape='pencil' style='color: #000'></clr-icon></button>" +
            "<button type='button' id='btn_history' style='width:3vw; min-width: 40px; height: 20px;' onClick='show_history()' ><clr-icon shape='history' style='color: #000'></clr-icon></button>" +
            "<select id='dd_ver' style='width:180px;height:20px;visibility:hidden;' onChange='change_version()'></select>";
    }
  
    
}

// edit button for popup
function invoke_pu_edit(){
    let title =  curr_pu.title;
    let content =  curr_pu.content;
    let converter = new showdown.Converter();
    content = converter.makeMarkdown(content);
    curr_pu.bindPopup(popupString(title, content, 1,document.getElementById("ctrl_edit").checked));
}

// shows the versions dropdown
function show_history(){
    hist_c+=1;
    if(hist_c % 2 == 1){
        let sel=document.getElementById("dd_ver");
        for(let i=0;i<curr_pu.noteVersions.length;i++){
            let opt=document.createElement("option");
            opt.value=i;
            opt.innerHTML=curr_pu.noteVersions[i].creation_date;

            sel.appendChild(opt);
            }
        document.getElementById("dd_ver").style.visibility="visible";
    } else {
        document.getElementById("dd_ver").style.visibility="hidden";
    }
}

// changes the version after dropdown select
function change_version(){
    title=curr_pu.noteVersions[document.getElementById("dd_ver").value].title;
    content=curr_pu.noteVersions[document.getElementById("dd_ver").value].text;
    curr_pu.bindPopup(popupString(title, content, 2,document.getElementById("ctrl_edit").checked));
    isOverflown(document.getElementById("pu_title_ld"));
}

// ADDING MARKER FUNCTION
let marker=undefined;
function add_marker(pos,title,content){
    marker = new L.marker(pos, {icon: greenIcon}).addTo(map);
    
    title = (typeof title !== 'undefined') ?  title : "";
    content = (typeof content !== 'undefined') ?  content : "";
    marker.bindPopup(popupString(title, content, 1,document.getElementById("ctrl_edit").checked));
    
    arr_marker.push(marker);
    view_reset(pos.lat,pos.lng);
    setAnchor();
    marker.openPopup();
    set_edit_btn();
}

// onClick Event -> adding marker
map.on('click', function(e){
    if(document.getElementById("ctrl_edit").checked==true && document.getElementById("ctrl_ov").checked==false){
        add_marker(e.latlng);
    }
});


// UTILITY FUNCTIONS -----------------------------
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

// redefine icon size
function setIcon(ico,size){
    ico.options.iconSize=[size, size];
    ico.options.iconAnchor=[size/2, size/2];

    for(let i=0;i<arr_marker.length;i++){
        arr_marker[i].setIcon(ico);
    }
}

let rot_matrix={0: [-500,15],
    30: [-360,245],
    60: [-121,370],
    90: [145,370],
    120: [375,225],
    150: [505, -10],
    180: [500,-280],
    210: [360, -510],
    240: [125,-640],
    270: [-145,-635],
    300: [-378,-495],
    330: [-505,-255],
    360: [-500,15]} 

// redefine pu anchor
function setAnchor(){
    let rot=document.getElementById("ctrl_rotate").value;
    console.log(rot);
    greenIcon.options.popupAnchor=rot_matrix[rot];
    for(let i=0;i<arr_marker.length;i++){
        arr_marker[i].setIcon(greenIcon);
    }
}

// adjust fontSize to fit container
function isOverflown(element) {
    let f=0;
    do {
        f=Number(element.style.fontSize.replace("px",""));
        f-=1;
        element.style.fontSize=String(f);
    } while (element.scrollWidth > element.clientWidth)
}