// LEAFLET MAP BASICS -----------------------------
// maxBounds
// initialize map
let map = L.map('map', {minZoom: 10, maxZoom: 14, rotate: true, zoomControl: false});
map.setView([43.18, -91.15], 12); // map center

// custom tiles
L.tileLayer('/Tiles/{z}/{x}/{y}.png', {
    'attribution':  "Map Data &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> | <a href='https://github.com/The-bastART/New-MRB-Mythology'>GitHub</a>", // panel bottomright
    'useCache': true
}).addTo(map);

let label = new L.marker([43.26, -91.06], { opacity: 0 }); //opacity may be set to zero
label.bindTooltip("My Label", {permanent: true, className: "my-label", direction: "center"});
label.addTo(map);

// OVERLAYS -----------------------------
// panel topright: title
L.control.custom({
    position: "topleft",
    content: "<h1 id='title' title='About the Project' style='font-size: max(4.5vh,30px); cursor: help;' onClick='showAbout()'>The New Mississippi River Basin Mythology</h1>" +
            "<div id='about-arrow' class='about-arrow'></div><div id='about' class='about-outer'><div id='about' class='about-panel scroll' style='display:inline;'><span class='stories-panel_tiles_title'><center>About</center></span><br><br><span class='stories-panel_tiles_title'><center>Contribute Notes</center></span><br>Did you ever see what happens after locks and dams disrupt the river flow?<br> How the landscape turns into pictures, into stories that want to get told?<br> The Mississippi isn’t just a River, it’s all about the stories, group events, myths and legends that grow up around the current.<br> Are you familiar with the Mississippi River Child or the invasion of the carps?<br> Take your time, discover the hidden parts and above all participate and tell your own story, myth and relationship towards the river. Just click the Edit Box and go for it. Even the smallest note helps to understand the dimension of the Mississippi River Basin. <br><br><span class='stories-panel_tiles_title'><center>Stories</center></span><br>From Minnesota to New Orleans, the Story of the Mississippi fluently curated. <br>If you want to understand the Mississippi you need coherent connection lines between different stories. Because a wide variety of forces and diverse narratives are at work here which unite 40 percent of the U.S. surface area in the Mississippi River Basin. And this is where the story mode comes in. Just scroll through the tales and follow the lines." +
            "</div></div>",
}).addTo(map);    

function showAbout(){
    if(document.getElementById("about").style.display=="none"){
        document.getElementById("about").style.display="block";
        document.getElementById("about-arrow").style.display="block";
    } else {
        document.getElementById("about").style.display="none";
        document.getElementById("about-arrow").style.display="none";
    }
}

// panel topright: stories, new
L.control.custom({
    position: "topright",
    content: "<div style='margin: 20px 20px 0 0;'><table style='margin-right: 0px; margin-left: auto;'><tr><td><div id='ctrl_st' class='btn_toggle' onclick='stories();' data-checked='false'>Stories&nbsp<clr-icon id='st_angle' shape='angle' dir='down' size='20'></clr-icon></div></td>" +
                "<td><div id='ctrl_edit' class='btn_toggle' onclick='edit();' data-checked='false'>New</div></td>" +
                "</tr><tr id='new_type' style='display: none;'><td></td><td><div id='kind_sel' class='btn_toggle' data-checked='false' style='float: right; margin-right: 5px; border-radius: 0 5px 5px 0;'><clr-icon shape='chat-bubble' size='22' style='#fff'></clr-icon></div>"+
                "<div id='kind_sel' class='btn_toggle' data-checked='false' style='float: right; margin-left: 5px; border-radius: 5px 0 0 5px; border-right: 1px solid #005201;'><clr-icon shape='note' size='22' style='#fff'></clr-icon></div></td></tr></table>" +
                "<br><div id='stories-panel-outer' class='stories-outer'><div id='stories-panel' class='stories-panel scroll'></div></div><div id='story-outer' class='story-outer'><div id='story' class='story scroll' onScroll='scrollMarker()''></div></div></div>",
    style:
    {
        margin: "0",
        padding: "0px 0 0 0",
    },
}).addTo(map);

// panel bottomleft: Lat and Lng at cursor
L.control.mousePosition({prefix: "Lat ", separator: " | Lng ", numDigits: 2}).addTo(map);

L.control.custom({
    position: "bottomleft",
    content:    "<div class='nav_panel'><br><br>"+
                "<button type='button' id='ctrl_layer' style='border-radius: 5px 5px 0 0; border-bottom:1px solid #005201' onClick=''><clr-icon shape='chat-bubble' size='22' style='#fff'></clr-icon></button>"+
                "<br><button type='button' id='ctrl_layer' style='border-radius: 0 0 5px 5px;' onClick=''><clr-icon shape='info-circle' size='26' style='#fff'></clr-icon></button><br><br>" +
                "<button type='button' id='ctrl_zp' style='border-radius: 5px 5px 0 0; border-bottom:1px solid #005201' onClick='map.setZoom(map.getZoom() + 1)'><clr-icon shape='plus' size='24' style='#fff'></clr-icon></button>"+
                "<br><button type='button' id='ctrl_zm' style='border-radius: 0 0 5px 5px;' onClick='map.setZoom(map.getZoom() - 1)'><clr-icon shape='minus' size='24'></clr-icon></button>" +
                "<br><br><br><input type='range' min='0' max='360' value='0' step='1' name='rotation' id='ctrl_rotate' class='ctrl_rotate'>"+
                "<table style='margin-top: 5px; margin-bottom: 5px; table-layout: fixed; width: 100%; font-size: max(1.2vh,10px); text-shadow: 0 0 3px #000;'><colgroup><col style='width: 50%'><col style='width: 50%'></colgroup><tr><td style='text-align: left;'>0°</td><td style='text-align: right;'>360°</td></tr></table>" +
                "<div id='ctrl_ov' class='ctrl_ov' onclick='overview();' data-checked='false'><div style='position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%;'><img id='img_ov' src='overview.jpg' style='width: 100%; height:auto;'></img></div></div></div>",
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
arr_stories[0]=new Story("Hello World", "Chuck Norris", "stories/text/story_01.txt", "/stories/img/story_01.jpg", "much picture", "/stories/thumb/story_01.jpg", "31.12.2020", [[43.16,-91.15,13],[42.75,-91.08,11],[41.9,-90.16,11]]);
arr_stories[1]=new Story("My Old Friend", "Chuck Norris", "hi there", "/stories/img/story_01.jpg", "much wow", "/stories/thumb/story_01.jpg", "31.12.2020", [[43.16,-91.15,10]]);
arr_stories[2]=new Story("Mississippi Isabell", "Chuck Norris", "hi there", "/stories/img/story_01.jpg", "cat", "/stories/thumb/story_01.jpg", "31.12.2020", [[43.16,-91.15,10]]);

// load story tiles
let tiles="";
for (let i=0;i<arr_stories.length;i++){
    tiles=tiles+"<div class='stories-panel_tiles' onClick='createStory("+i+")'><div style='height: 60%; overflow: hidden;'><img src='" + arr_stories[i].thumb + "' style='width: 100%; height:auto;'></img></div><div class='stories-panel_tiles_title'>"+arr_stories[i].title+"</div></div>";
}
document.getElementById("stories-panel").innerHTML="<center>"+tiles+"</center>";


// construct the story
let curr_st=undefined;
let curr_st_m=-1;
let st_marker;
let st_line;
function createStory(id){
    st_marker=[];
    curr_st=id;
    document.getElementById("stories-panel-outer").style.display="none";
    document.getElementById("story-outer").style.display="block";
    
    for(let i=0;i<arr_stories[id].marker.length;i++){
        let pos = [arr_stories[id].marker[i][0],arr_stories[id].marker[i][1]];
        let m = new L.marker(pos, {icon: blueIconL}).addTo(map);
        st_marker.push(m);
    }
    curr_st_m=0;
    st_line = L.polyline(arr_stories[id].marker, {color: '#355AD9'}).addTo(map);
    
    map.flyTo([arr_stories[curr_st].marker[0][0],arr_stories[curr_st].marker[0][1]], arr_stories[curr_st].marker[0][2], {
        animate: true,
        duration: 0.5
    });
    
    fetch(arr_stories[id].text)
        .then(response => response.text())
        .then(text => {document.getElementById("story").innerHTML="<clr-icon shape='arrow' dir='left' style='cursor: pointer; width: 20px; height: 20px; color: #000; position: absolute; top: 10px; left:10px;' onClick='story_back()'></clr-icon><center><span class='stories-panel_tiles_title'>" + arr_stories[id].title + "</span></center>" + arr_stories[id].author + ", " + arr_stories[id].date + "<span id='story_marker_0'></span><br><br><img src='" + arr_stories[id].img + "' style='width: 100%; height:auto;'></img>" + arr_stories[id].img_sub + "<br><br>" + text + "<br><br><clr-icon shape='arrow' dir='up' style='cursor: pointer; width: 20px; height: 20px; color: #000; position: absolute; right:10px;' onClick='story_up()'></clr-icon><br>";})
    story_up();
}


// jump to markers while scrolling
function scrollMarker(){
    for(let i=0;i<arr_stories[curr_st].marker.length;i++){
        let m="story_marker_" + i;
        let spanY=document.getElementById(m).getBoundingClientRect().y - document.getElementById("story").getBoundingClientRect().y;
        let thld=document.getElementById("story").getBoundingClientRect().height / 3;

        if(spanY<thld && spanY>0 && i!=curr_st_m){
            map.flyTo([arr_stories[curr_st].marker[i][0],arr_stories[curr_st].marker[i][1]], arr_stories[curr_st].marker[i][2], {
                animate: true,
                duration: 1.0
            });
            curr_st_m=i;
        }
    }
}

// remove Story Markers and Line
function rmStoryMarkers(){
    for (let i=0;i<st_marker.length;i++){
        map.removeLayer(st_marker[i]);
    }
    map.removeLayer(st_line);
    st_marker=[];
}

// back to story overview panel
function story_back(){
    document.getElementById("story-outer").style.display="none";
    document.getElementById("stories-panel-outer").style.display="block";
    rmStoryMarkers();
}

// in story back to top
function story_up(){
    document.getElementById("story").scrollTop=0;
    scrollMarker();
}



// OVERLAY FUNCTIONS -----------------------------
// rotation slider
window.onload = function() {
    let slider = document.getElementById("ctrl_rotate");
    slider.addEventListener('input', function () {
        map.closePopup();
        map.setBearing(document.getElementById("ctrl_rotate").value);
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
    document.getElementById("about").style.display="none";
    document.getElementById("about-arrow").style.display="none";
    if(document.getElementById("ctrl_ov").getAttribute("data-checked")=="false"){
        curr_edit=document.getElementById("ctrl_edit").checked;
        document.getElementById("ctrl_edit").checked=false;
        curr_view[0]=map.getCenter().lat;
        curr_view[1]=map.getCenter().lng;
        curr_view[2]=map.getZoom();
        curr_pos=L.marker([curr_view[0], curr_view[1]], {icon: redIcon}).addTo(map);
        for (let i=curr_view[2]; i>=5; i--){
            let tilefile=getTileURL(curr_view[0], curr_view[1], i);
            let img=new Image();
            img.src="/Tiles/" + tilefile + ".png";
            console.log(img.src);
            if (img.height!=0){
                document.getElementById("img_ov").src=img.src;
                break;
            }
        }
        document.getElementById("img_ov").style.transform="translateY(-12.5%)";
        
        chngIcon(arr_marker, greenIconS);
        chngIcon(st_marker, blueIconS);

        map.options.minZoom=6;
        map.options.maxZoom=6;
        map.setView([curr_view[0], curr_view[1]], 6);
        map.closePopup();
        document.getElementById("ctrl_ov").setAttribute("data-checked", "true");
    } else {
        document.getElementById("ctrl_edit").checked=curr_edit;
        map.removeLayer(curr_pos);

        document.getElementById("img_ov").src="overview.jpg";
        document.getElementById("img_ov").style.transform="translateY(0)";

        chngIcon(arr_marker, greenIconL);
        chngIcon(st_marker, blueIconL);

        map.options.minZoom=10;
        map.options.maxZoom=14;
        map.setView([curr_view[0], curr_view[1]], curr_view[2]);
        document.getElementById("ctrl_ov").setAttribute("data-checked", "false");
    }
}

// set edit depending on overview
function edit(){
    document.getElementById("about").style.display="none";
    document.getElementById("about-arrow").style.display="none";
    if(document.getElementById("ctrl_edit").getAttribute("data-checked")=="true"){
        document.getElementById("ctrl_edit").setAttribute("data-checked","false");
    } else {
        document.getElementById("ctrl_edit").setAttribute("data-checked","true");
    }

    if(document.getElementById("ctrl_ov").getAttribute("data-checked")=="true"){
        document.getElementById("ctrl_edit").setAttribute("data-checked","false");
    }
    if(document.getElementById("ctrl_edit").getAttribute("data-checked")=="false"){
        popup_close_check();
    }
    // redraw popup to show/hide edit button
    if(curr_pu!=undefined){
        let title =  curr_pu.title;
        let content =  curr_pu.content;
        curr_pu.bindPopup(popupString(title, content, 2,document.getElementById("ctrl_edit").getAttribute("data-checked")));
        isOverflown(document.getElementById("pu_title_ld"));
    }
}

// stories
function stories(){
    document.getElementById("about").style.display="none";
    document.getElementById("about-arrow").style.display="none";
    if(document.getElementById("ctrl_st").getAttribute("data-checked")=="true"){
        document.getElementById("st_angle").dir="down";
        document.getElementById("ctrl_st").setAttribute("data-checked","false");
        document.getElementById("stories-panel-outer").style.display="none";
        document.getElementById("story-outer").style.display="none";
        rmStoryMarkers();
    } else {
        document.getElementById("st_angle").dir="up";
        document.getElementById("ctrl_st").setAttribute("data-checked","true");
        document.getElementById("stories-panel-outer").style.display="block";
    }
}

// MARKER -----------------------------

// intialize marker icons; green=community; blue=editorial; red=position
let greenIconL = L.icon({
    iconUrl: 'marker_green.png',
    iconSize:     [30, 30], 
    iconAnchor:   [15, 15], 
    popupAnchor:  [-500, 15] 
});

let blueIconL = L.icon({
    iconUrl: 'marker_blue.png',
    iconSize:     [30, 30], 
    iconAnchor:   [15, 15], 
    popupAnchor:  [-500, 15] 
});

let greenIconS = L.icon({
    iconUrl: 'marker_green.png',
    iconSize:     [12, 12], 
    iconAnchor:   [6, 6], 
    popupAnchor:  [-500, 6] 
});

let blueIconS = L.icon({
    iconUrl: 'marker_blue.png',
    iconSize:     [12, 12], 
    iconAnchor:   [6, 6], 
    popupAnchor:  [-500, 6] 
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
    document.getElementById("about").style.display="none";
    document.getElementById("about-arrow").style.display="none";
    curr_pu = e.popup._source;
    view_reset(curr_pu._latlng.lat,curr_pu._latlng.lng);
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
    let marker = new L.marker({ lat: note.lat, lng: note.lon }, {icon: greenIconL}).addTo(map);
    let title = note.versions[note.versions.length-1].title;
    let content =  note.versions[note.versions.length-1].text;
    marker.title=title;
    marker.content=content;
    marker.bindPopup(popupString(title, content, 2,document.getElementById("ctrl_edit").getAttribute("data-checked")));
    marker.noteVersions = note.versions;
    arr_marker.push(marker);
}))
.catch(err => console.log(err));

// ADD NOTES - popup submit function
function pu_submit(){

    let image_file = document.getElementById("upload_image").files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image_file);
    reader.onload = function() {
        console.log(reader.result);
        fetch("/api/upload_image", {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            cache: "no-cache",
            body: reader.result
        })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));
    };

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
        arr_marker[arr_marker.length-1].bindPopup(popupString(title, content, 2,document.getElementById("ctrl_edit").getAttribute("data-checked")));
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
    if(edit=="true"){
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
            "<button id='pu_btn' type='button' onclick='pu_submit()'><clr-icon shape='check' size='20'></clr-icon></button>" +
            "<input id='upload_image' type='file' accept='image/jpeg,image/png' />"
        case 2:
            return "<h1 id='pu_title_ld' class='title' style='font-size: 30'>" + title + "</h1><br><div id='pu_content_ld' class='content scroll'>" + content +"</div><br>" +
            "<button id='pu_btn' type='button' id='btn_edit' style='border-radius: 5px 0 0 5px; border-right: 1px solid #005201; display:" + disp + ";' onClick='invoke_pu_edit()' ><clr-icon shape='pencil' size='20'></clr-icon></button>" +
            "<button id='pu_btn' type='button' id='btn_history' onClick='show_history()' style='border-radius: 0 5px 5px 0;'><clr-icon shape='history' size='20'></clr-icon></button>" +
            "<select id='dd_ver' style='visibility: hidden;' onChange='change_version()'></select>";
    }
}

// edit button for popup
function invoke_pu_edit(){
    let title =  curr_pu.title;
    let content =  curr_pu.content;
    let converter = new showdown.Converter();
    content = converter.makeMarkdown(content);
    curr_pu.bindPopup(popupString(title, content, 1,document.getElementById("ctrl_edit").getAttribute("data-checked")));
}

// shows the versions dropdown
function show_history(){
    hist_c+=1;
    if(hist_c % 2 == 1){
        let sel=document.getElementById("dd_ver");
        for(let i=curr_pu.noteVersions.length-1;i>=0;i--){
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
    curr_pu.bindPopup(popupString(title, content, 2,document.getElementById("ctrl_edit").getAttribute("data-checked")));
    isOverflown(document.getElementById("pu_title_ld"));
}

// ADDING MARKER FUNCTION
let marker=undefined;
function add_marker(pos,title,content){
    marker = new L.marker(pos, {icon: greenIconL}).addTo(map);
    
    title = (typeof title !== 'undefined') ?  title : "";
    content = (typeof content !== 'undefined') ?  content : "";
    marker.bindPopup(popupString(title, content, 1,document.getElementById("ctrl_edit").getAttribute("data-checked")));
    
    arr_marker.push(marker);
    marker.openPopup();
    view_reset(pos.lat,pos.lng);
    set_edit_btn();
}

// onClick Event -> adding marker
map.on('click', function(e){
    if(document.getElementById("ctrl_edit").getAttribute("data-checked")=="true" && document.getElementById("ctrl_ov").getAttribute("data-checked")=="false"){
        add_marker(e.latlng);
    }
});


// UTILITY FUNCTIONS -----------------------------
// focus on marker; coord offset depending on zoom level
function change_view(lt,ln){
    let offX=0;
    let offY=0;
    switch(map.getZoom()){
        case 10:
            offX=0.6;
            offY=0.3;
            break;
        case 11:
            offX=0.3;
            offY=0.15;
            break;
        case 12:
            offX=0.15;
            offY=0.075;
            break;
        case 13:
            offX=0.08;
            offY=0.04;
            break;
        case 14:
            offX=0.04;
            offY=0.02;
            break;
    }
    map.flyTo([lt+offY, ln-offX], map.getZoom(), {
        animate: true,
        duration: 0.25
    });
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

// adjust fontSize to fit container
function isOverflown(element) {
    let f=0;
    do {
        f=Number(element.style.fontSize.replace("px",""));
        f-=1;
        element.style.fontSize=String(f);
    } while (element.scrollWidth > element.clientWidth)
}

function chngIcon(arr, ico){
    for (m in arr){
        arr[m].setIcon(ico);
    }
}


function getTileURL(lat, lon, zoom) {
    let xtile = parseInt(Math.floor( (lon + 180) / 360 * (1<<zoom) ));
    let ytile = parseInt(Math.floor( (1 - Math.log(Math.tan((lat*Math.PI)/180) + 1 / Math.cos((lat*Math.PI)/180)) / Math.PI) / 2 * (1<<zoom) ));
    return "" + zoom + "/" + xtile + "/" + ytile;
}
