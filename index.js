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
                "</tr><tr><td></td><td><div id='new_type' style='display: none;'><div id='kind_label' class='btn_toggle' data-checked='false' style='float: right; margin-right: 5px; border-radius: 0 5px 5px 0;' onClick='kind_label()'><clr-icon shape='chat-bubble' size='22' style='#fff'></clr-icon></div>"+
                "<div id='kind_note' class='btn_toggle' data-checked='true' style='float: right; margin-left: 5px; border-radius: 5px 0 0 5px; border-right: 1px solid #005201;' onClick='kind_note()'><clr-icon shape='note' size='22' style='#fff'></clr-icon></div></div></td></tr></table>" +
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
                "<button type='button' id='ctrl_layer_l' style='border-radius: 5px 5px 0 0; border-bottom:1px solid #005201' onClick='btn_layer_label()' data-checked='false'><clr-icon shape='chat-bubble' size='22' style='#fff'></clr-icon></button>"+
                "<br><button type='button' id='ctrl_layer_i' style='border-radius: 0 0 5px 5px;' onClick='btn_layer_info()' data-checked='false'><clr-icon shape='info-circle' size='26' style='#fff'></clr-icon></button><br><br>" +
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

let layer_labels = L.layerGroup();
function btn_layer_label(){
    console.log(document.getElementById("ctrl_layer_l").getAttribute("data-checked"));
    if(document.getElementById("ctrl_layer_l").getAttribute("data-checked")=="true"){
        map.removeLayer(layer_labels);
        document.getElementById("ctrl_layer_l").style.background="#333";
        document.getElementById("ctrl_layer_l").setAttribute("data-checked", "false");
    } else {
        map.addLayer(layer_labels);
        document.getElementById("ctrl_layer_l").style.background="#005201";
        document.getElementById("ctrl_layer_l").setAttribute("data-checked", "true");
    }
}

let layer_info = L.layerGroup();
function btn_layer_info(){
    map.addLayer(layer_info);
    console.log(document.getElementById("ctrl_layer_i").getAttribute("data-checked"));
    if(document.getElementById("ctrl_layer_i").getAttribute("data-checked")=="true"){
        map.removeLayer(layer_info);
        document.getElementById("ctrl_layer_i").style.background="#333";
        document.getElementById("ctrl_layer_i").setAttribute("data-checked", "false");
    } else {
        map.addLayer(layer_info);
        document.getElementById("ctrl_layer_i").style.background="#005201";
        document.getElementById("ctrl_layer_i").setAttribute("data-checked", "true");
    }
}


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

function kind_note(){
    btn_tgl("kind_note","kind_label");
}

function kind_label(){
    btn_tgl("kind_label","kind_note");
}

// set edit depending on overview
function edit(){
    document.getElementById("about").style.display="none";
    document.getElementById("about-arrow").style.display="none";

    if(document.getElementById("ctrl_ov").getAttribute("data-checked")=="true"){
        document.getElementById("ctrl_edit").setAttribute("data-checked","false");
    } else {
        btn_tgl("ctrl_edit");
        if(document.getElementById("ctrl_edit").getAttribute("data-checked")=="true"){
            document.getElementById("map").style.cursor="pointer";
        } else {
            document.getElementById("map").style.cursor="grab";
        }
        if(document.getElementById("new_type").style.display=="inline"){
            document.getElementById("new_type").style.display="none";
        } else {
            document.getElementById("new_type").style.display="inline";
        }
    }

    if(document.getElementById("ctrl_edit").getAttribute("data-checked")=="false"){
        popup_close_check();
        label_cancel();
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
let emptyIcon = L.icon({
    iconUrl: 'marker_green.png',
    iconSize:     [0, 0], 
    iconAnchor:   [0, 0], 
    popupAnchor:  [0, 0] 
});

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
    if(document.getElementById("kind_note").getAttribute("data-checked")=="true"){
        view_reset(curr_pu._latlng.lat,curr_pu._latlng.lng);
    } else {
        map.flyTo([curr_pu._latlng.lat, curr_pu._latlng.lng], map.getZoom(), {
            animate: true,
            duration: 0.25
        });
    }
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
    if(note.kind=="note"){
        let marker = new L.marker({ lat: note.lat, lng: note.lon }, {icon: greenIconL}).addTo(map);
        let { title, content, image_path } = note.versions[note.versions.length-1];
        marker.title=title;
        marker.content=content;
        marker.bindPopup(popupString(
            title,
            content,
            2,
            document.getElementById("ctrl_edit").getAttribute("data-checked"),
            image_src = image_path
        ));
        marker.noteVersions = note.versions;
        arr_marker.push(marker);
    } else if(note.kind=="label"){
        let lbl = new L.marker({lat: note.lat, lng: note.lon}, {icon: emptyIcon});
        let title = note.versions[note.versions.length-1].title;
        lbl.bindTooltip(title, {permanent: true, className: "label", direction: "center"});
        lbl.addTo(layer_labels);
    }
}))
.catch(err => console.log(err));

// Upload an image file. When the upload finished successfully, we receive the
// URL of the uploaded image and call upload_note() with it.
async function upload_note_with_image(image_file, note_object) {
    let image_path = null;
    let reader = new FileReader();
    reader.readAsDataURL(image_file);
    reader.onload = async function() {
        await fetch("/api/upload_image", {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            cache: "no-cache",
            body: reader.result
        })
        .then(response => response.json())
        .then(json => {
            console.log(json)
            image_path = json.file_path;
            note_object.versions[0].image_path = image_path;
            upload_note(note_object);
        })
        .catch(err => console.log(err));
    };
    return image_path;
}

// Uploads a note version and logs the resulting message to the console.
async function upload_note(note_object) {
    fetch("/api/add_note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
        body: JSON.stringify( note_object )
    })
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(err => console.log(err));
}

// ADD NOTES - popup submit function
async function pu_submit(){

    let title = L.DomUtil.get("pu_title").value;
    let text = L.DomUtil.get("pu_content").value;

    if (title === "" || text === ""){
        alert("Please enter a title and some content.");
        return;
    }

    // Let's just assume that the marker going to be submitted is the last in arr_marker.
    let current_marker = arr_marker[arr_marker.length-1];

    let { lat, lng } = current_marker._latlng;
    let converter = new showdown.Converter({extensions: ["htmlescape"]});
    let content = converter.makeHtml(text);

    // The object that is going to be submitted.
    let note_object = {
        versions: [
            {
                title: title,
                text: content,
            }
        ],
        lat: lat,
        lon: lng,
        kind: "note"
    };

    // Data URL for displaying the potentially uploaded image in the current session.
    // Stays null if there is no image submitted.
    let image_src = null;

    // Push the note (and potentially an image) to DB.
    let image_file = document.getElementById("upload_image").files[0];
    if (image_file) {
        image_src = URL.createObjectURL(image_file);
        upload_note_with_image(image_file, note_object);
    } else {
        upload_note(note_object);
    }

    // Bind all the note properties to the current marker, so the new note is
    // directly present in the current session.
    current_marker.title = title;
    current_marker.content = content;
    current_marker.bindPopup(
        popupString(title,
            content,
            2,
            document.getElementById("ctrl_edit").getAttribute("data-checked"),
            image_src = image_src
        )
    );
    isOverflown(document.getElementById("pu_title_ld"));
}

function popupString(title, content, n, edit, image_src){ // n1: edit layout; n2: final layout
    let disp="";
    if(edit=="true"){
        disp="inline";
    } else {
        disp="none";
    }
    switch(n){
        case 1:
            return "<textarea id='pu_title' rows='1' style='text-align: center' maxlength='40' class='title_ta'>" + title + "</textarea><br><br>" +
            "<label class='custom-file-upload'><clr-icon shape='image' size='20'></clr-icon><input id='upload_image' type='file' accept='image/jpeg,image/png' onChange='img_value()'></label><span id='img_file'></span><br><br>"+
<<<<<<< HEAD
            "<textarea id='pu_content' class='content_ta scroll'>" + content + "</textarea><br><br>" +
            "<table style='width: 101%;'><tr><td><div class='tooltip'>You can use Markdown to format the text." + 
            "<span class='tooltiptext'>Heading 1: # <br>Heading 2: ## <br>Italics: *Text* <br>Bold: **Text** <br>Blockquote: < Text <br>Horizontal Line: --- <br>Links: [Text](URL) <br>Paragraph: Empty Line</span></div></td>" +
            "<td style='text-align: right;'><button id='pu_btn' type='button' onclick='pu_submit()' style='border-radius: 5px 0 0 5px; border-right: 1px solid #005201'><clr-icon shape='check' size='20'></clr-icon></button>" +
            "<button id='pu_btn' type='button' onclick='pu_cancel()' style='border-radius: 0 5px 5px 0;'><clr-icon shape='times' size='20'></clr-icon></button></td></tr></table>"
=======
            "<textarea id='pu_content' rows='30' class='content_ta scroll'>" + content + "</textarea><br><br>" +
            "<div class='tooltip'>You can use Markdown to format the text." +
            "<span class='tooltiptext'>Heading 1: # <br>Heading 2: ## <br>Italics: *Text* <br>Bold: **Text** <br>Blockquote: < Text <br>Horizontal Line: --- <br>Links: [Text](URL) <br>Paragraph: Empty Line</span></div><br><br>" +
            "<button id='pu_btn' type='button' onclick='pu_submit()'><clr-icon shape='check' size='20'></clr-icon></button>"
>>>>>>> 62a6de28ef0d0e93138ea649adcbea65cd41643a
        case 2:
            return "<h1 id='pu_title_ld' class='title' style='font-size: 30'>" + title + "</h1><br>" +
                ((image_src) ? "<img src='" + image_src + "' style='height: 100%'>" : "") +
                "<div id='pu_content_ld' class='content scroll'>" + content +"</div><br>" +
                "<button id='pu_btn' type='button' id='btn_edit' style='border-radius: 5px 0 0 5px; border-right: 1px solid #005201; display:" + disp + ";' onClick='invoke_pu_edit()' ><clr-icon shape='pencil' size='20'></clr-icon></button>" +
                "<button id='pu_btn' type='button' id='btn_history' onClick='show_history()' style='border-radius: 0 5px 5px 0;'><clr-icon shape='history' size='20'></clr-icon></button>" +
                "<select id='dd_ver' style='visibility: hidden;' onChange='change_version()'></select>";
    }
}

function img_value(){
    let str=document.getElementById("upload_image").value;
    let parts=str.split("\\");
    str=parts[parts.length-1];
    document.getElementById("img_file").innerHTML=str;
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

let label=undefined;
function add_label(pos){
    if(document.getElementById("ctrl_layer_l").getAttribute("data-checked")=="false"){
        btn_layer_label();
    }
    let text="<textarea id='label_text' rows='1' maxlength='100' class='label_ta'></textarea>"+
            "<button id='lbl_submit' type='button' onclick='label_submit()' style='left: 400px; border-radius:5px 0 0 5px; border-right: 1px solid #005201;'><clr-icon shape='check' size='20'></clr-icon></button>"+
            "<button id='lbl_cancel' type='button' onclick='label_cancel()' style='left: 440px; border-radius:0 5px 5px 0;'><clr-icon shape='times' size='20'></clr-icon></button>";
    label = new L.marker(pos, {icon: emptyIcon});
    label.bindPopup(text, {closeButton: false});
    label.addTo(map);
    label.openPopup();
}

function label_submit(){
    let lbl = new L.marker(label._latlng, {icon: emptyIcon});
    let text=document.getElementById("label_text").value;
    lbl.bindTooltip(text, {permanent: true, className: "label", direction: "center"});
    lbl.addTo(layer_labels);
    map.removeLayer(label);
    fetch("/api/add_note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
        // The backend only accepts this very request structure. Ping Kerstin for more fields etc.
        body: JSON.stringify( {
            versions: [ {
            title: text,
            text: ""
            } ],
            lat: label._latlng.lat,
            lon: label._latlng.lng,
            kind: "label"
        } )
    })
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(err => console.log(err));
}

function label_cancel(){
    map.removeLayer(label);
}

// onClick Event -> adding marker or label
map.on('click', function(e){
    if(document.getElementById("ctrl_edit").getAttribute("data-checked")=="true" && document.getElementById("ctrl_ov").getAttribute("data-checked")=="false"){
        if(document.getElementById("kind_note").getAttribute("data-checked")=="true"){
            let rule=css_getClass(".leaflet-popup-content-wrapper");
            rule.style.height="600px"
            rule.style.transform="";

            rule=css_getClass(".leaflet-popup-content");
            rule.style.setProperty("width", "90%","important");
            rule.style.setProperty("height", "95%","important");
            rule.style.margin="5%";

            rule=css_getClass(".leaflet-popup-tip-container");
            rule.style.display="inline";

            add_marker(e.latlng);
        } else {
            let rule=css_getClass(".leaflet-popup-content-wrapper");
            rule.style.height="45px"
            rule.style.transform="translateY(42px)";

            rule=css_getClass(".leaflet-popup-content");
            rule.style.setProperty("width", "100%","important");
            rule.style.setProperty("height", "100%","important");
            rule.style.margin="0";

            rule=css_getClass(".leaflet-popup-tip-container");
            rule.style.display="none";

            map.flyTo(e.latlng, map.getZoom(), {
                animate: true,
                duration: 0.25
            });
            add_label(e.latlng);
        }
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

function btn_tgl(btn, btn2){
    btn2=btn2||"";
    if(btn2==""){
        if(document.getElementById(btn).getAttribute("data-checked")=="true"){
            document.getElementById(btn).setAttribute("data-checked","false");
        } else {
            document.getElementById(btn).setAttribute("data-checked","true");
        }
    } else {
        if(document.getElementById(btn).getAttribute("data-checked")=="true"){
            document.getElementById(btn).setAttribute("data-checked","false");
            document.getElementById(btn2).setAttribute("data-checked","true");
        } else {
            document.getElementById(btn).setAttribute("data-checked","true");
            document.getElementById(btn2).setAttribute("data-checked","false");
        }
    }
}

function css_getClass(name) {
    let rules = {};
    let cssRules = document.styleSheets[3].cssRules;
    for (let j=0; j<cssRules.length; ++j){
        rules[cssRules[j].selectorText] = cssRules[j];
    }
    return rules[name];
}
