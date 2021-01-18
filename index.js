// LEAFLET MAP BASICS -----------------------------
// maxBounds
// initialize map
let map = L.map('map', {minZoom: 10, maxZoom: 14, rotate: true, zoomControl: false});

map.on('moveend', function(e) {
    bakeCookie_pos();
    document.getElementById("ov_pos").style.top=mapRange(map.getCenter().lat,49.753,28.623,0.0,100.0)+"%";
    document.getElementById("ov_pos").style.left=mapRange(map.getCenter().lng,-113.976,-77.779,0.0,100.0)+"%";
});


// GLOBAL VARIABLES
let curr_view=[0.0,0.0,0]
let curr_pos=undefined;
let curr_edit=false;
let curr_layer_l="false";
let curr_layer_i="false";

let curr_pu=undefined;
let pu_flag=false;
let hist_c=undefined;

let curr_st=undefined;
let curr_st_m=-1;
let st_marker;
let st_line;

let tiles="";
let arr_story_markers=[];

let layer_info = L.layerGroup();
let layer_stories = L.layerGroup();
let layer_labels = L.layerGroup();

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
    iconUrl: 'marker_violet.png',
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

let arr_marker = [];




// custom tiles
L.tileLayer('/Tiles/{z}/{x}/{y}.png', {
    'attribution':  "Map Data &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> | <a href='https://github.com/The-bastART/New-MRB-Mythology'>GitHub</a>", // panel bottomright
    'useCache': true
}).addTo(map);

// OVERLAYS -----------------------------
// panel topright: title
L.control.custom({
    position: "topleft",
    content: "<h1 id='title' onClick='showAbout()'>The New Mississippi River Basin Mythology</h1>" +
            "<div id='tut' class='tut-panel scroll' style='display:none;'>"+
            "<table style='width: 100%; text-align: right;'>"+
            "<tr style='text-align:left;'><td><span id='tut_title' class='about-panel_tiles_title'></span></td></tr>"+
            "<tr><td><div id='tut_text' class='tut-text'></div></td></tr>"+
            "<tr><td><button type='button' id='tut_skp' style='border-radius: 5px 0 0 5px; border-right:1px solid #005201;' onClick='tutorial_skip()'>Skip All</button>"+
            "<button type='button' id='tut_nxt' style='border-radius: 0 5px 5px 0;' onClick='tutorial_next()' counter='0'>Next</button>"+
            "</td></tr></table></div>",
}).addTo(map);    

// https://decolonialatlas.wordpress.com/2015/01/05/native-names-for-the-mississippi-river/
let names=["Mississippi River", "Báhat Sássin", "Beesniicíe", "Hahcicobá", "Kickaátit", "Mäse’sibowi", "Ma’xeé’ome’tää’e", "Mihcisiipiiwi", "Misi-Ziibi", "Misha Sipokni", "Mníšošethąka", "Ny-tonks", "Ohnawiiò:ke", "Uhtawiyúˀkye", "Yandawezue", "Yununu’a", "Xósáu", "Mississippi River"];
let names_lang=["English", "Hasí:nay (Caddo)<br>“Mother of rivers”", "Hinónoʼeitíít (Arapaho)", "Kowassá:ti (Koasati)", "Paári (Pawnee)", "Meshkwahkihaki (Fox-Sauk)", "Tsėhésenėstsestȯtse (Cheyenne)<br>“Big, greasy river”", "Myaamia (Miami-Illinois)", "Anishinaabemowin (Ojibwe)<br>“Great river”", "Chahta’ (Choctaw)<br>“Beyond age”", "Dakȟótiyapi (Dakota)", "Okáxpa íe (Quapaw)<br>“Great river”", "Kanien’kéha’ (Mohawk)", "Ska:rù:rę’ (Tuscarora)", "Waⁿdat (Wyandot)", "yUdjEha (Yuchi)<br>“Great river”", "Cáuijògà (Kiowa)<br>“Standing Rocks”", "English"]
let names_rand;
const tippy_inst = tippy("#title", {
    content: "About the Project",
    allowHTML: true,
    placement: "bottom",
});

setInterval(function(){ 
    names_rand=parseInt(math.random(names.length));
    document.getElementById("title").innerHTML="The New " + names[names_rand] + " Basin Mythology"; 
    tippy_inst[0].setContent("About the Project <br>" + names_lang[names_rand]);
}, 90000);


function showAbout(){
    document.getElementById("about_bg").style.display="inline";
    document.getElementById("about").style.display="inline";
}


// panel topright: stories, new
L.control.custom({
    position: "topright",
    content: "<div style='margin: 20px 20px 0 0;'><table style='margin-right: 0px; margin-left: auto;'><tr><td><div id='ctrl_st' class='btn_toggle' onclick='stories();' data-checked='false'><span style='display: table-cell; vertical-algin:middle'>Stories&nbsp<clr-icon id='st_angle' shape='angle' dir='down' style='width: max(2vh,14px); height: max(2vh,14px);'></clr-icon></span></div></td>" +
                "<td><div id='ctrl_edit' class='btn_toggle' onclick='edit();' data-checked='false'><span style='display: table-cell; vertical-algin:middle'>New</span></div></td>" +
                "</tr><tr><td></td><td><div id='new_type' style='display: none;'><div id='kind_label' class='btn_toggle' data-checked='false' style='float: right; margin-right: 5px; border-radius: 0 5px 5px 0;' onClick='kind_label()'><clr-icon id='ico_label' shape='chat-bubble' class='icon-pos' style='width: max(2vh,16px); height: max(2vh,16px);'></clr-icon></div>"+
                "<div id='kind_note' class='btn_toggle' data-checked='true' style='float: right; margin-left: 5px; border-radius: 5px 0 0 5px; border-right: 1px solid #005201;' onClick='kind_note()'><clr-icon id='ico_note' shape='note' class='is-solid icon-pos' style='width: max(2vh,16px); height: max(2vh,16px);' ></clr-icon></div></div></td></tr></table>" +
                "<br><div id='stories-panel-outer' class='stories-outer'><div id='stories-panel' class='stories-panel story-scroll'></div></div>"+
                "<div id='story-outer' class='story-outer'><div id='story' class='story story-scroll' onScroll='scrollMarker()''></div></div></div>",
    style:
    {
        margin: "0",
        padding: "0px 0 0 0",
    },
}).addTo(map);

// panel bottomleft: Lat and Lng at cursor
L.control.mousePosition({prefix: "Lat ", separator: " | Lng ", numDigits: 3}).addTo(map);

L.control.custom({
    position: "bottomleft",
    content:    "<div class='nav_panel'><br><br>"+
                "<br><button type='button' id='ctrl_layer_s' style='border-radius: 5px 5px 0 0; border-bottom:1px solid #005201;' onClick='btn_layer(0)' data-checked='false'><clr-icon id='ico_layer_s' shape='file-group' style='width: max(2.2vh,16px); height: max(2.2vh,16px);'></clr-icon></button>" +
                "<br><button type='button' id='ctrl_layer_l' style='border-radius: 0; border-bottom:1px solid #005201;' onClick='btn_layer(1)' data-checked='false'><clr-icon id='ico_layer_l' shape='chat-bubble' style='width: max(2.2vh,16px); height: max(2.2vh,16px);'></clr-icon></button>"+
                "<br><button type='button' id='ctrl_layer_i' style='border-radius: 0 0 5px 5px;' onClick='btn_layer(2)' data-checked='false'><clr-icon id='ico_layer_i' shape='info-circle' style='width: max(2.5vh,18px); height: max(2.5vh,18px);'></clr-icon></button><br><br>" +
                "<button type='button' id='ctrl_zp' style='border-radius: 5px 5px 0 0; border-bottom:1px solid #005201' onClick='map.setZoom(map.getZoom() + 1)'><clr-icon shape='plus' style='width: max(2.5vh,18px); height: max(2.5vh,18px);'></clr-icon></button>"+
                "<br><button type='button' id='ctrl_zm' style='border-radius: 0 0 5px 5px;' onClick='map.setZoom(map.getZoom() - 1)'><clr-icon shape='minus' style='width: max(2.5vh,18px); height: max(2.5vh,18px);'></clr-icon></button>" +
                "<br><br><br><span id='ctrl_rotate_span'><input type='range' min='0' max='360' value='0' step='1' name='rotation' id='ctrl_rotate' class='ctrl_rotate'>"+
                "<table style='margin-top: 5px; margin-bottom: 5px; table-layout: fixed; width: 100%; font-size: max(1.2vh,10px); text-shadow: 0 0 3px #000;'><colgroup><col style='width: 50%'><col style='width: 50%'></colgroup><tr><td style='text-align: left;'>0°</td><td style='text-align: right;'>360°</td></tr></table></span>" +
                "<div id='ctrl_ov' class='ctrl_ov' onclick='overview();' data-checked='false'><div style='position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%;'><img id='img_ov' src='overview.jpg' style='width: 100%; height:auto;'></img><div id='ov_pos' style='position: absolute; width: 5px; height: 5px; background:#ff0000; border-radius: 2px; box-shadow: 0 0 1px #fff'></div</div></div></div>",
    style:
    {
        margin: "0",
        padding: "0px 0 0 0",
    },
}).addTo(map);


let cookie_pos=getCookie("MRB_position");

if(cookie_pos){
    map.setView([parseFloat(cookie_pos[1]), parseFloat(cookie_pos[2])], parseInt(cookie_pos[3]));
} else {
    let lt, ln;
    let rand=parseInt(math.random(7));
    switch(rand){
        case 0:
        case 1:
            lt=43.18;
            ln=-91.15;
            break;
        case 2:
            lt=33.8;
            ln=-91.1;
            break;
        case 3:
            lt=36.87;
            ln=-85.1;
            break;
        case 4:
            lt=39.2;
            ln=-96.65;
            break;
        case 5:
            lt=44.44;
            ln=-100.4;
            break;
        case 6:
        case 7:
            lt=48.0;
            ln=-106.4;
            break;
    }
    document.getElementById("ov_pos").style.top=mapRange(lt,49.753,28.623,0.0,100.0)+"%";
    document.getElementById("ov_pos").style.left=mapRange(ln,-113.976,-77.779,0.0,100.0)+"%";
    map.setView([lt, ln], 12);
    bakeCookie_pos();

}



let tut_content=["Click the zoom buttons to zoom in and out (or use the mouse wheel). <br><br> Use the rotation slider to adjust the view to your perspective.",
                    "Click the map to get to the overview for better orientation. The red point is your current position. Get back by clicking on the old location now shown in the corner or click somewhere on the overview and jump to that location.",
                    "Do you see the green markers? Here you can participate and tell your own story, myth and relationship towards the basin. Take your time and discover the hidden parts of the rivers. <br>Just select ‘New’ and go for it. Click anywhere you want and follow the directions. Even the smallest note helps to understand the dimensions of the Mississippi River Basin.",
                    "But wait, there is more. You can also comment on the river if you want. It's a short and easy way to collect thoughts about the basin and its rivers. Especially if you don’t want to fill the whole marker pop-up… <br>Just click anywhere you want and write down anything you like.",
                    "From Minnesota to New Orleans, the story of the Mississippi River Basin fluently curated.",
                    "If you want to understand the Mississippi River Basin you need coherent connection lines between different stories. And this is where the story mode comes in. Just scroll through and follow the lines.",
                    "And finally here we have the layer section. If you want to activate or hide the different layers click the buttons. You can choose between the stories, comments and an additional info layer."];
let tut_titles=["Basic Navigation",
                "Overview",
                "Notes",
                "Comments",
                "Stories",
                "Stories",
                "Layers"];


function tutorial_next(){
    let c=parseInt(document.getElementById("tut_nxt").getAttribute("counter"));
    console.log(c);
    document.getElementById("tut_title").innerHTML=tut_titles[c];
    document.getElementById("tut_text").innerHTML=tut_content[c];
    switch(c){
        case 0:
            document.getElementById("ctrl_layer_s").style.filter="blur(4px)";
            document.getElementById("ctrl_layer_l").style.filter="blur(4px)";
            document.getElementById("ctrl_layer_i").style.filter="blur(4px)";
            document.getElementById("ctrl_st").style.filter="blur(4px)";
            document.getElementById("ctrl_edit").style.filter="blur(4px)";
            document.getElementById("ctrl_ov").style.filter="blur(4px)";
            document.getElementById("ctrl_zp").style.filter="blur(0)";
            document.getElementById("ctrl_zm").style.filter="blur(0)";
            document.getElementById("ctrl_rotate").style.filter="blur(0)";
            document.getElementById("ctrl_rotate_span").style.filter="blur(0)";
            break;
        case 1:
            document.getElementById("ctrl_layer_s").style.filter="blur(4px)";
            document.getElementById("ctrl_layer_l").style.filter="blur(4px)";
            document.getElementById("ctrl_layer_i").style.filter="blur(4px)";
            document.getElementById("ctrl_st").style.filter="blur(4px)";
            document.getElementById("ctrl_edit").style.filter="blur(4px)";
            document.getElementById("ctrl_ov").style.filter="blur(0)";
            document.getElementById("ctrl_zp").style.filter="blur(4px)";
            document.getElementById("ctrl_zm").style.filter="blur(4px)";
            document.getElementById("ctrl_rotate").style.filter="blur(4px)";
            document.getElementById("ctrl_rotate_span").style.filter="blur(4px)";
            if(document.getElementById("ctrl_ov").getAttribute("data-checked")=="false"){
                overview();
            }
            break;
        case 2:
            document.getElementById("ctrl_layer_s").style.filter="blur(4px)";
            document.getElementById("ctrl_layer_l").style.filter="blur(4px)";
            document.getElementById("ctrl_layer_i").style.filter="blur(4px)";
            document.getElementById("ctrl_st").style.filter="blur(4px)";
            document.getElementById("ctrl_edit").style.filter="blur(0)";
            document.getElementById("ctrl_ov").style.filter="blur(4px)";
            document.getElementById("ctrl_zp").style.filter="blur(4px)";
            document.getElementById("ctrl_zm").style.filter="blur(4px)";
            document.getElementById("ctrl_rotate").style.filter="blur(4px)";
            document.getElementById("ctrl_rotate_span").style.filter="blur(4px)";
            if(document.getElementById("ctrl_ov").getAttribute("data-checked")=="true"){
                overview();
            }
            if(document.getElementById("ctrl_edit").getAttribute("data-checked")=="false"){
                edit();
            }
            if(document.getElementById("kind_note").getAttribute("data-checked")=="false"){
                kind_note();
            }
            break;
        case 3:
            document.getElementById("ctrl_layer_s").style.filter="blur(4px)";
            document.getElementById("ctrl_layer_l").style.filter="blur(4px)";
            document.getElementById("ctrl_layer_i").style.filter="blur(4px)";
            document.getElementById("ctrl_st").style.filter="blur(4px)";
            document.getElementById("ctrl_edit").style.filter="blur(0)";
            document.getElementById("ctrl_ov").style.filter="blur(4px)";
            document.getElementById("ctrl_zp").style.filter="blur(4px)";
            document.getElementById("ctrl_zm").style.filter="blur(4px)";
            document.getElementById("ctrl_rotate").style.filter="blur(4px)";
            document.getElementById("ctrl_rotate_span").style.filter="blur(4px)";
            if(document.getElementById("ctrl_edit").getAttribute("data-checked")=="false"){
                edit();
            }
            if(document.getElementById("kind_label").getAttribute("data-checked")=="false"){
                kind_label();
            }
            if(document.getElementById("ctrl_layer_l").getAttribute("data-checked")=="false"){
                btn_layer(1);
            }
            break;
        case 4:
            document.getElementById("ctrl_layer_s").style.filter="blur(4px)";
            document.getElementById("ctrl_layer_l").style.filter="blur(4px)";
            document.getElementById("ctrl_layer_i").style.filter="blur(4px)";
            document.getElementById("ctrl_st").style.filter="blur(0)";
            document.getElementById("ctrl_edit").style.filter="blur(4px)";
            document.getElementById("ctrl_ov").style.filter="blur(4px)";
            document.getElementById("ctrl_zp").style.filter="blur(4px)";
            document.getElementById("ctrl_zm").style.filter="blur(4px)";
            document.getElementById("ctrl_rotate").style.filter="blur(4px)";
            document.getElementById("ctrl_rotate_span").style.filter="blur(4px)";
            if(document.getElementById("ctrl_edit").getAttribute("data-checked")=="true"){
                edit();
            }
            if(document.getElementById("kind_note").getAttribute("data-checked")=="false"){
                kind_note();
            }
            if(document.getElementById("ctrl_layer_l").getAttribute("data-checked")=="true"){
                btn_layer(1);
            }
            if(document.getElementById("ctrl_st").getAttribute("data-checked")=="false"){
                stories();
            }
            break;
        case 5:
            document.getElementById("ctrl_layer_s").style.filter="blur(4px)";
            document.getElementById("ctrl_layer_l").style.filter="blur(4px)";
            document.getElementById("ctrl_layer_i").style.filter="blur(4px)";
            document.getElementById("ctrl_st").style.filter="blur(0)";
            document.getElementById("ctrl_edit").style.filter="blur(4px)";
            document.getElementById("ctrl_ov").style.filter="blur(4px)";
            document.getElementById("ctrl_zp").style.filter="blur(4px)";
            document.getElementById("ctrl_zm").style.filter="blur(4px)";
            document.getElementById("ctrl_rotate").style.filter="blur(4px)";
            document.getElementById("ctrl_rotate_span").style.filter="blur(4px)";
            if(document.getElementById("ctrl_edit").getAttribute("data-checked")=="true"){
                edit();
            }
            if(document.getElementById("kind_label").getAttribute("data-checked")=="false"){
                kind_label();
            }
            
            if(document.getElementById("ctrl_st").getAttribute("data-checked")=="false"){
                stories();
                document.getElementById("stories-panel").style.display="none";
            }
            createStory(0);
            break;
        case 6:
            document.getElementById("ctrl_layer_s").style.filter="blur(0)";
            document.getElementById("ctrl_layer_l").style.filter="blur(0)";
            document.getElementById("ctrl_layer_i").style.filter="blur(0)";
            document.getElementById("ctrl_st").style.filter="blur(4px)";
            document.getElementById("ctrl_edit").style.filter="blur(4px)";
            document.getElementById("ctrl_ov").style.filter="blur(4px)";
            document.getElementById("ctrl_zp").style.filter="blur(4px)";
            document.getElementById("ctrl_zm").style.filter="blur(4px)";
            document.getElementById("ctrl_rotate").style.filter="blur(4px)";
            document.getElementById("ctrl_rotate_span").style.filter="blur(4px)";
            if(document.getElementById("ctrl_st").getAttribute("data-checked")=="true"){
                stories();
            }
            if(document.getElementById("ctrl_layer_s").getAttribute("data-checked")=="false"){
                btn_layer(0);
            }
            if(document.getElementById("ctrl_layer_l").getAttribute("data-checked")=="false"){
                btn_layer(1);
            }
            if(document.getElementById("ctrl_layer_i").getAttribute("data-checked")=="false"){
                btn_layer(2);
            }

            break;
        case 7:
            document.getElementById("ctrl_layer_s").style.filter="blur(0)";
            document.getElementById("ctrl_layer_l").style.filter="blur(0)";
            document.getElementById("ctrl_layer_i").style.filter="blur(0)";
            document.getElementById("ctrl_st").style.filter="blur(0)";
            document.getElementById("ctrl_edit").style.filter="blur(0)";
            document.getElementById("ctrl_ov").style.filter="blur(0)";
            document.getElementById("ctrl_zp").style.filter="blur(0)";
            document.getElementById("ctrl_zm").style.filter="blur(0)";
            document.getElementById("ctrl_rotate").style.filter="blur(0)";
            document.getElementById("ctrl_rotate_span").style.filter="blur(0)";
            if(document.getElementById("ctrl_layer_s").getAttribute("data-checked")=="true"){
                btn_layer(0);
            }
            if(document.getElementById("ctrl_layer_l").getAttribute("data-checked")=="true"){
                btn_layer(1);
            }
            if(document.getElementById("ctrl_layer_i").getAttribute("data-checked")=="true"){
                btn_layer(2);
            }
            document.getElementById("tut").style.display="none";
            break;
    }
    c+=1;
    document.getElementById("tut_nxt").setAttribute("counter",c);
}
function tutorial_skip(){
    document.getElementById("tut_nxt").setAttribute("counter", "7");
    tutorial_next();
    document.getElementById("tut").style.display="none";
    document.getElementById("about_bg").style.display="none";
    document.getElementById("about").style.display="none";
}

function tutorial_start(){
    document.getElementById("tut").style.display="inline";
    document.getElementById("about_bg").style.display="none";
    document.getElementById("about").style.display="none";
    document.getElementById("tut_nxt").setAttribute("counter", "0");
    tutorial_next();
}


for(let i=0; i<arr_info_label.length;i++){
    let lbl = new L.marker([arr_info_label[i][1],arr_info_label[i][2]], {icon: emptyIcon});
    let dir="";
    switch(arr_info_label[i][3]){
        case "L":
            dir="left";
            break;
        case "R":
            dir="right";
            break;
        case "C":
            dir="center";
            break;
    }
    lbl.bindTooltip(arr_info_label[i][0], {permanent: true, className: "label-info", direction: dir});
    lbl.addTo(layer_info);
}

// load story tiles
for (let i=0;i<arr_stories.length;i++){
    tiles=tiles+"<div class='stories-panel_tiles' onClick='createStory("+i+")'><div style='height: 60%; overflow: hidden;'><img src='" + arr_stories[i].thumb + "' style='width: 100%; height:auto;'></img></div><div class='stories-panel_tiles_title'>"+arr_stories[i].title+"</div></div>";
    for(let k=0;k<arr_stories[i].marker.length;k++){
        let pos = [arr_stories[i].marker[k][0],arr_stories[i].marker[k][1]];
        let m = new L.marker(pos, {icon: blueIconL}).addTo(layer_stories).on('click', st_marker_click);
        arr_story_markers.push(m);
        m.story=i;
    }
    L.polyline(arr_stories[i].marker, {color: '#7A6FDE'}).addTo(layer_stories);
}
document.getElementById("stories-panel").innerHTML="<center>"+tiles+"</center>";


// construct the story
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
    st_line = L.polyline(arr_stories[id].marker, {color: '#7A6FDE'}).addTo(map);
    
    map.flyTo([arr_stories[curr_st].marker[0][0],arr_stories[curr_st].marker[0][1]], arr_stories[curr_st].marker[0][2], {
        animate: true,
        duration: 0.5
    });
    
    document.getElementById("story").innerHTML="<clr-icon shape='arrow' dir='left' style='cursor: pointer; width: 20px; height: 20px; color: #000; position: absolute; top: 10px; left:10px;' onClick='story_back()'></clr-icon>"+
                        "<center><span class='stories-panel_tiles_title'>Loading...</span></center><br>Please Wait.<span id='story_marker_0'></span><br><br>"+
                        "<img src='' class='story-images' onClick='larger_image(this.src)'></img><br><br>"+
                        "<br><br><hr><br>" +
                        "<p style='font-weight: bold;'>If you also got a story to tell just contact us via E-Mail.</p><br><br><br>"+
                        "<clr-icon shape='arrow' dir='up' style='cursor: pointer; width: 20px; height: 20px; color: #000; position: absolute; right:10px;' onClick='story_up()'></clr-icon><br><br>";


    fetch(arr_stories[id].text)
        .then(response => response.text())
        .then(text => {document.getElementById("story").innerHTML="<clr-icon shape='arrow' dir='left' style='cursor: pointer; width: 20px; height: 20px; color: #000; position: absolute; top: 10px; left:10px;' onClick='story_back()'></clr-icon>"+
                        "<center><span class='stories-panel_tiles_title'>" + arr_stories[id].title + "</span></center><br>" + arr_stories[id].author + ", " + arr_stories[id].date + "<span id='story_marker_0'></span><br><br>"+
                        "<img src='" + arr_stories[id].img + "' class='story-images' onClick='larger_image(this.src)'></img><span style='font-size: max(1.5vh,11px);'>" + arr_stories[id].img_sub + "</span><br><br>"+
                        text + "<br><br><hr><br>" +
                        "<p style='font-weight: bold;'>If you also got a story to tell just contact us via E-Mail.</p><br><br><br>"+
                        "<clr-icon shape='arrow' dir='up' style='cursor: pointer; width: 20px; height: 20px; color: #000; position: absolute; right:10px;' onClick='story_up()'></clr-icon><br><br>";})
    let river_commission;
    if(id==2){
        let sketch = function(sk){

            let sel=10;
            let gage_pos;
            
            let tbl_org=[], hell, loc;
            let tbl = [];
            let mx = [];
            let a_mx=[];
            let x, y, p, prev, rf=false, ry=0, ri=0;
            
            for(let i=0;i<11; i++){
              tbl.push([]);
              for(let k=0;k<21; k++){
                tbl[i].push([]);
              }
            }
            
            
            
            sk.preload = function() {
                tbl_org[0] = sk.loadTable("/stories/text/story_03_data/00-New Orleans.csv", "ssv", "header");
                tbl_org[1] = sk.loadTable("/stories/text/story_03_data/01-Baton Rouge.csv", "ssv", "header");
                tbl_org[2] = sk.loadTable("/stories/text/story_03_data/02-Natchez.csv", "ssv", "header");
                tbl_org[3] = sk.loadTable("/stories/text/story_03_data/03-Vicksburg.csv", "ssv", "header");
                tbl_org[4] = sk.loadTable("/stories/text/story_03_data/04-Greenville.csv", "ssv", "header");
                tbl_org[5] = sk.loadTable("/stories/text/story_03_data/05-Arkansas City.csv", "ssv", "header");
                tbl_org[6] = sk.loadTable("/stories/text/story_03_data/06-Helena.csv", "ssv", "header");
                tbl_org[7] = sk.loadTable("/stories/text/story_03_data/07-Memphis.csv", "ssv", "header");
                tbl_org[8] = sk.loadTable("/stories/text/story_03_data/08-Osceola.csv", "ssv", "header");
                tbl_org[9] = sk.loadTable("/stories/text/story_03_data/09-Caruthersville.csv", "ssv", "header");
                tbl_org[10] = sk.loadTable("/stories/text/story_03_data/10-New Madrid.csv", "ssv", "header");
                
                hell = sk.loadFont("/stories/text/story_03_data/HelveticaLTStd-Roman.otf");
            }
            
            sk.setup = function() {
                let canvasDiv = document.getElementById("canvas");
                let width = canvasDiv.offsetWidth;
                let sketchCanvas = sk.createCanvas(width,width*1.2);
                sketchCanvas.parent("canvas");
                sketchCanvas.mousePressed(next);

                sk.frameRate(12);
                
                for(let p=0;p<tbl.length;p++){
                let date = "",
                    elevation = 0.0,
                    Y = 0,
                    Ystr="",
                    M = 0,
                    D = 0;
            
                for (let i = 0; i < tbl_org[p].getRowCount(); i++) {
                    date = tbl_org[p].get(i, 0);
                    
                    Y = sk.int(sk.split(date, "/")[2]);
                    M = sk.int(sk.split(date, "/")[0]);
                    D = sk.int(sk.split(date, "/")[1]);
            
            
                    elevation = sk.float(tbl_org[p].get(i, 1));
                    tbl[p][Y].push(elevation);
                }
            
                for (let i=0;i<tbl[p].length;i++){
                    a_mx[i] = sk.max(tbl[p][i]);
                }
                mx[p]=sk.max(a_mx);
                } 
            }
            
            
            
            
            sk.draw = function() {
                sk.background(0);
                
                x = sk.width/7.4;
                y = sk.height/5;
                p = 0;
                
            
                rf=false;
                for (let i = 0; i < tbl[0].length; i++) {
                x = sk.width/7.4;
                y += sk.height/32.4;
                sk.fill(0);
                sk.stroke(0);
                sk.strokeWeight(sk.width/400);
                sk.beginShape();
                for(let k=0;k<tbl[sel][i].length;k++){
                    x += sk.width/500;
                    p = sk.map(tbl[sel][i][k], 0, mx[sel], 0, sk.height/9.6);
                    sk.vertex(x, y - p);
                }
                sk.vertex(x+sk.width/500,p)
                sk.vertex(x,y+sk.height/9.6);
                sk.vertex(sk.width/7.4,y+sk.height/9.6);
                sk.endShape(sk.CLOSE);
                
                x=sk.width/7.4;
                
                if (sk.mouseY<y && sk.mouseY>y-sk.height/32.4 && sk.mouseX>sk.width/7.4 && sk.mouseX<(sk.width-sk.width/7.4)){
                    ry=y;
                    rf=true;
                    ri=i;
                }
                
                if(rf==true && i==ri){
                    sk.stroke(200,0,0);
                    sk.noFill();
                } else {
                    sk.noFill();
                    sk.stroke(255);
                }
                
                sk.beginShape();
                for(let k=0;k<tbl[sel][i].length;k++){
                    x += sk.width/500;
                    p = sk.map(tbl[sel][i][k], 0, mx[sel], 0, sk.height/9.6);
                    sk.vertex(x, y - p);
                }
                sk.endShape();
                }
                
                if(rf==true){
                sk.stroke(200,0,0,100);
                sk.noFill();
                x=sk.width/7.4;
                sk.beginShape();
                for(let k=0;k<tbl[sel][ri].length;k++){
                    x += sk.width/500;
                    p = sk.map(tbl[sel][ri][k], 0, mx[sel], 0, sk.height/9.6);
                    sk.vertex(x, ry - p);
                }
                sk.endShape();
                
                sk.push();
                sk.textSize(sk.width/40);
                sk.textAlign(sk.RIGHT);
                sk.textFont(hell);
                sk.noStroke();
                sk.fill(200,0,0);
                sk.text(2000+ri,sk.width/8.3,ry);
                sk.textAlign(sk.LEFT);
                sk.textSize(sk.width/50);
                sk.text("gage zero", (sk.width-sk.width/8.3), ry);
                sk.text(sk.round(mx[sel])+" ft", (sk.width-sk.width/8.3), ry-sk.height/9.6);
                sk.noFill();
                    
                sk.stroke(200,0,0);
                sk.strokeWeight(sk.width/500);
                sk.stroke(200,0,0);
                sk.line(sk.width/7.4,ry, (sk.width-sk.width/7.4),ry);
                sk.line((sk.width-sk.width/7),ry-sk.height/9.6, (sk.width-sk.width/7.4),ry-sk.height/9.6);
                sk.pop();
                }
            
                sk.textAlign(sk.CENTER);
                sk.textFont(hell);
                sk.fill(255);
                sk.noStroke();
                sk.textSize(sk.width/13.3);
                sk.text("RIVER COMMISSION", sk.width / 2, sk.height/8.57);
                sk.textSize(sk.width/15.87);
                sk.text("UNKNOWN PRESSURES", sk.width / 2, (sk.height-sk.height/9.6));
                sk.textSize(sk.width/66.66);
        
                switch(sel){
                case 0:
                    gage_pos=[[36.5809, -89.5474],10];
                    loc="NEW ORLEANS";
                    break;
                case 1:
                    gage_pos=[[29.9347, -90.1361],10];
                    loc="BATON ROUGE";
                    break;
                case 2:
                    gage_pos=[[30.4291, -91.2069],10];
                    loc="NATCHEZ";
                    break;
                case 3:
                    gage_pos=[[31.5440, -91.4334],10];
                    loc="VICKSBURG";
                    break;
                case 4:
                    gage_pos=[[32.3118, -90.9023],10];
                    loc="GREENVILLE";
                    break;
                case 5:
                    gage_pos=[[33.2895, -91.1610],10];
                    loc="ARKANSAS CITY";
                    break;
                case 6:
                    gage_pos=[[33.5515, -91.2383],10];
                    loc="HELENA";
                    break;
                case 7:
                    gage_pos=[[34.5166, -90.5841],10];
                    loc="MEMPHIS";
                    break;
                case 8:
                    gage_pos=[[35.1230, -90.0774],10];
                    loc="OSCEOLA";
                    break;
                case 9:
                    gage_pos=[[35.6568, -89.9277],10];
                    loc="CARUTHERSVILLE";
                    break;
                case 10:
                    gage_pos=[[36.1941, -89.6527],10];
                    loc="NEW MADRID";
                    break;
                }
                sk.text(loc, sk.width / 2, (sk.height-sk.height/60));
            
            }
            
            
            let next = function() {
                if(sel==0){
                    sel=tbl.length-1;
                } else {
                    sel-=1;
                }
                map.flyTo(gage_pos[0], 11, {
                    animate: true,
                    duration: 1.0
                });
            }
            }
 
            river_commission = new p5(sketch);
    }
    story_up();
}

function st_marker_click(e){
    if(document.getElementById("ctrl_ov").getAttribute("data-checked")=="false" && (document.getElementById("story-outer").style.display=="none" || document.getElementById("story-outer").style.display=="")){
        story_back();
        btn_layer(0);
        stories();
        createStory(e.target.story);
    }
}

// jump to markers while scrolling
function scrollMarker(){
    for(let i=0;i<arr_stories[curr_st].marker.length;i++){
        let m="story_marker_" + i;
        let spanY=document.getElementById(m).getBoundingClientRect().y - document.getElementById("story").getBoundingClientRect().y;
        let thld=document.getElementById("story").getBoundingClientRect().height / 2;
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
    if(st_marker!=undefined){
        rmStoryMarkers();
    }
}

// in story back to top
function story_up(){
    document.getElementById("story").scrollTop=0;
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
function overview(){
    if(document.getElementById("ctrl_ov").getAttribute("data-checked")=="false"){
        document.getElementById("map").style.cursor="crosshair";
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
            if (img.height!=0){
                document.getElementById("img_ov").src=img.src;
                break;
            }
        }
        document.getElementById("img_ov").style.transform="translateY(-12.5%)";
        document.getElementById("ov_pos").style.display="none";
        
        chngIcon(arr_marker, greenIconS);
        chngIcon(st_marker, blueIconS);
        chngIcon(arr_story_markers, blueIconS);

        map.options.minZoom=6;
        map.options.maxZoom=6;
        map.setView([curr_view[0], curr_view[1]], 6);
        map.closePopup();

        curr_layer_l=document.getElementById("ctrl_layer_l").getAttribute("data-checked");
        curr_layer_i=document.getElementById("ctrl_layer_i").getAttribute("data-checked");
        if(curr_layer_l=="true"){
            btn_layer(1);
        } 
        if(curr_layer_i=="true"){
            btn_layer(2);
        }
        document.getElementById("ctrl_ov").setAttribute("data-checked", "true");
    } else {
        document.getElementById("map").style.cursor="grab";
        document.getElementById("ctrl_edit").checked=curr_edit;
        map.removeLayer(curr_pos);

        document.getElementById("img_ov").src="overview.jpg";
        document.getElementById("img_ov").style.transform="translateY(0)";
        document.getElementById("ov_pos").style.display="inline";

        chngIcon(arr_marker, greenIconL);
        chngIcon(st_marker, blueIconL);
        chngIcon(arr_story_markers, blueIconL);

        map.options.minZoom=10;
        map.options.maxZoom=14;
        map.setView([curr_view[0], curr_view[1]], curr_view[2]);

        document.getElementById("ctrl_ov").setAttribute("data-checked", "false");
        if(curr_layer_l=="true"){
            btn_layer(1);
        }
        if(curr_layer_i=="true"){
            btn_layer(2);
        }
    }
}

function kind_note(){
    btn_tgl("kind_note","kind_label", "ico_note", "ico_label");
}

function kind_label(){
    btn_tgl("kind_label","kind_note", "ico_label", "ico_note");
}

// set edit depending on overview
function edit(){
    if(document.getElementById("ctrl_edit").getAttribute("data-checked")=="true"){
        if(document.getElementById("kind_note").getAttribute("data-checked")=="true"){
            pu_cancel();
        } else {
            label_cancel();
        }
    }

    if(document.getElementById("ctrl_ov").getAttribute("data-checked")=="true"){
        document.getElementById("ctrl_edit").setAttribute("data-checked","false");
    } else {
        btn_tgl("ctrl_edit");
        if(document.getElementById("ctrl_edit").getAttribute("data-checked")=="true"){
            document.getElementById("map").style.cursor="crosshair";
        } else {
            document.getElementById("map").style.cursor="grab";
        }
        if(document.getElementById("new_type").style.display=="inline"){
            document.getElementById("new_type").style.display="none";
        } else {
            document.getElementById("new_type").style.display="inline";
        }
    }
    // redraw popup to show/hide edit button
    if(curr_pu!=undefined){
        let { title, content, image_path } = curr_pu;
        curr_pu.bindPopup(popupString(
            title,
            content,
            2,
            image_path
        ));
        isOverflown(document.getElementById("pu_title_ld"), "w");
    }
}

// stories
function stories(){
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
        document.getElementById("stories-panel").scrollTop=0;
    }
}

// MARKER -----------------------------
// POPUP OPEN
map.on('popupopen', function(e) {
    curr_pu = e.popup._source;
    if(document.getElementById("ctrl_ov").getAttribute("data-checked")=="false"){
        if(document.getElementById("ctrl_edit").getAttribute("data-checked")=="true"){
            if(document.getElementById("kind_note").getAttribute("data-checked")=="true"){
                popup_style("note");
                view_reset(curr_pu._latlng.lat,curr_pu._latlng.lng);
            } else {
                if(curr_pu.kind=="note"){
                    popup_style("note");
                    view_reset(curr_pu._latlng.lat,curr_pu._latlng.lng);
                } else {
                    popup_style("label");
                    document.getElementById("label_text").focus();
                    map.flyTo([curr_pu._latlng.lat, curr_pu._latlng.lng], map.getZoom(), {
                    animate: true,
                    duration: 0.25
                });
                }
            }
        } else {
            view_reset(curr_pu._latlng.lat,curr_pu._latlng.lng);
        }
        
        pu_flag=true;
        hist_c=0;
        isOverflown(document.getElementById("pu_title_ld"),"w");
    } else {
        curr_pu.closePopup();
    }
});

// POPUP CLOSE
map.on("popupclose", function(e) {
    if(pu_flag==true){
        popup_close_check();
    }
});

function popup_close_check(){
    pu_flag=false;
    if(document.getElementById("pu_title")!=null && document.getElementById("pu_content")!=null){
        if(document.getElementById("pu_title").value=="" && document.getElementById("pu_content").value==""){
            map.removeLayer(arr_marker[arr_marker.length-1]);
            arr_marker.pop();
        } else {
            if (confirm("The content of this marker is not submitted yet. Are you sure you want to close it? All changes will be lost!")){
                if(arr_marker[arr_marker.length-1].noteVersions==undefined){
                    map.removeLayer(arr_marker[arr_marker.length-1]);
                    arr_marker.pop(); 
                } else {
                    let note=arr_marker[arr_marker.length-1];
                        
                    let title=document.getElementById("pu_title").value=note.noteVersions[note.noteVersions.length-1].title;
                    let content=document.getElementById("pu_content").value=note.noteVersions[note.noteVersions.length-1].text;
                    let img=document.getElementById("pu_content").value=note.noteVersions[note.noteVersions.length-1].image_path;
                    note.bindPopup(
                        popupString(title,
                            content,
                            2,
                            img
                        )
                    );
                }
            } else {
                let pu_ll=arr_marker[arr_marker.length-1]._latlng;
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

// GET NOTES - Fetch all notes from the database and add them to the map.
fetch("/api/get_notes", {
    cache: "no-cache"
})
.then(response => response.json())
.then(json => json.map(note => {
    if (note.kind === "note" || note.kind === "") {
        let marker = new L.marker({ lat: note.lat, lng: note.lon }, {icon: greenIconL}).addTo(map);
        let newest_version = note.versions[note.versions.length-1];
        let { title, text, image_path } = newest_version;
        marker.title=title;
        marker.content=text;
        marker.bindPopup(popupString(
            title,
            text,
            2,
            image_path = image_path
        ));
        marker.noteVersions = note.versions;
        marker.kind=note.kind;
        arr_marker.push(marker);
    } else if (note.kind === "label") {
        let lbl = new L.marker({lat: note.lat, lng: note.lon}, {icon: emptyIcon});
        let title = note.versions[note.versions.length-1].title;
        lbl.kind=note.kind;
        lbl.bindTooltip(title, {permanent: true, className: "label", direction: "center"});
        lbl.addTo(layer_labels);
    }
}))
.catch(err => console.log(err));

// Upload an image file. When the upload finished successfully, we receive the
// URL of the uploaded image and call upload_note() with it.
async function upload_note_with_image(image_file, note_object) {

    // The URL where the uploaded image is going to be available.
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
    let image_path = null;

    // Push the note (and potentially an image) to DB.
    let image_file = document.getElementById("upload_image").files[0];
    if (image_file) {
        image_path = URL.createObjectURL(image_file);
        upload_note_with_image(image_file, note_object);
    } else {
        upload_note(note_object);  
    }
    
    // Bind all the note properties to the current marker, so the new note is
    // directly present in the current session.
    current_marker.title = title;
    current_marker.content = content;
    current_marker.kind="note";
    if(image_path==null && current_marker.noteVersions!=undefined){
        image_path=current_marker.noteVersions[current_marker.noteVersions.length-1].image_path;
    }
    current_marker.bindPopup(
        popupString(title,
            content,
            2,
            image_path
        )
    );
    

    if (!current_marker.noteVersions) current_marker.noteVersions = [];
    current_marker.noteVersions.push(
        {
            title: title,
            text: content,
            image_path: image_path,
        }
    );
    isOverflown(document.getElementById("pu_title_ld"),"w");
}

function pu_cancel(){
    map.closePopup();
}

function popupString(title, content, n, image_path){ // n1: edit layout; n2: final layout
    switch(n){
        case 1:
            return "<textarea id='pu_title' rows='1' style='text-align: center' maxlength='40' class='title_ta'>" + title + "</textarea>" +
                "<table><tr id='img_upload_tr'><td><label class='custom-file-upload'><clr-icon id='img_upload' shape='image' size='20'></clr-icon><input id='upload_image' type='file' accept='image/jpeg,image/png' onChange='img_value()'></label><span id='img_file'></span></td></tr></table>"+
                "<textarea id='pu_content' class='content_ta scroll'>" + content + "</textarea>" +
                "<table style='width: 101%; margin-bottom: 10px;'><tr><td><div class='tooltip'>You can use Markdown to format the text." + 
                "<span class='tooltiptext'>Heading 1: # <br>Heading 2: ## <br>Italics: *Text* <br>Bold: **Text** <br>Blockquote: < Text <br>Horizontal Line: --- <br>Links: [Text](URL) <br>Paragraph: Empty Line</span></div></td>" +
                "<td style='text-align: right;'><button id='pu_btn' type='button' onclick='pu_submit()' style='border-radius: 5px 0 0 5px; border-right: 1px solid #005201'><clr-icon shape='check' size='20'></clr-icon></button>" +
                "<button id='pu_btn' type='button' onclick='pu_cancel()' style='border-radius: 0 5px 5px 0;'><clr-icon shape='times' size='20'></clr-icon></button></td></tr></table>"
        case 2:
            return "<h1 id='pu_title_ld' class='title' style='font-size: 30'>" + title + "</h1><br>" +
                "<div id='pu_content_ld' class='content scroll'>" +    
                ((image_path) ? "<div style='max-height: 55%; margin-top: 10px; margin-bottom: 10px; overflow: hidden;'><img src='" + image_path + "' style='width: 100%; height:auto; cursor: nesw-resize;' onClick='larger_image(this.src)'></div>" : "") +
                content +"</div><br>" +
                "<div style='position: relative;'><button id='pu_btn' type='button' id='btn_edit' style='border-radius: 5px 0 0 5px; border-right: 1px solid #005201;' onClick='invoke_pu_edit()' ><clr-icon shape='pencil' size='18'></clr-icon></button>" +
                "<button id='pu_btn' type='button' id='btn_history' onClick='show_history()' style='border-radius: 0 5px 5px 0;'><clr-icon shape='history' size='18'></clr-icon></button>" +
                "<select id='dd_ver' style='visibility: hidden;' onChange='change_version()'></select></div>";
    }
}

function img_value(){
    let str=document.getElementById("upload_image").value;
    let parts=str.split("\\");
    str=parts[parts.length-1];
    document.getElementById("img_file").innerHTML=str;
    document.getElementById("img_upload").classList.add("is-solid");
}

// edit button for popup
function invoke_pu_edit(){
    let title =  curr_pu.title;
    let content =  curr_pu.content;
    let converter = new showdown.Converter();
    content = converter.makeMarkdown(content);
    curr_pu.bindPopup(popupString(title, content, 1));
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
    let { title, content, image_path } = curr_pu.noteVersions[document.getElementById("dd_ver").value];
    curr_pu.bindPopup(popupString(
        title,
        content,
        2,
        image_path = image_path
    ));
    isOverflown(document.getElementById("pu_title_ld"),"w");
}

// ADDING MARKER FUNCTION
let marker=undefined;
function add_marker(pos,title,content){
    marker = new L.marker(pos, {icon: greenIconL}).addTo(map);
    
    title = (typeof title !== 'undefined') ?  title : "";
    content = (typeof content !== 'undefined') ?  content : "";
    marker.bindPopup(popupString(title, content, 1));
    
    arr_marker.push(marker);
    marker.openPopup();
    view_reset(pos.lat,pos.lng);
    set_edit_btn();
}

let label=undefined;
function add_label(pos){
    if(document.getElementById("ctrl_layer_l").getAttribute("data-checked")=="false"){
        btn_layer(1);
    }
    let text="<textarea id='label_text' rows='1' maxlength='100' class='label_ta'></textarea>"+
            "<button id='lbl_submit' type='button' onclick='label_submit()' style='left: 400px; border-radius:5px 0 0 5px; border-right: 1px solid #005201;'><clr-icon shape='check' size='20'></clr-icon></button>"+
            "<button id='lbl_cancel' type='button' onclick='label_cancel()' style='left: 440px; border-radius:0 5px 5px 0;'><clr-icon shape='times' size='20'></clr-icon></button>";
    label = new L.marker(pos, {icon: emptyIcon});
    label.kind="label";
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
    if(label){
        map.removeLayer(label);
    }
    
}

function popup_style(n){
    let rule=css_getClass(".leaflet-popup-content-wrapper");
    switch(n){
        case "note":
            
            rule.style.height="600px"
            rule.style.transform="";

            rule=css_getClass(".leaflet-popup-content");
            rule.style.setProperty("width", "90%","important");
            rule.style.setProperty("height", "95%","important");
            rule.style.margin="5%";

            rule=css_getClass(".leaflet-popup-tip-container");
            rule.style.display="inline";
            break;
        case "label":
            rule.style.height="45px"
            rule.style.transform="translateY(42px)";

            rule=css_getClass(".leaflet-popup-content");
            rule.style.setProperty("width", "100%","important");
            rule.style.setProperty("height", "100%","important");
            rule.style.margin="0";

            rule=css_getClass(".leaflet-popup-tip-container");
            rule.style.display="none";
            break;
    }
}

// onClick Event -> adding marker or label
map.on('click', function(e){
    if(document.getElementById("ctrl_edit").getAttribute("data-checked")=="true" && document.getElementById("ctrl_ov").getAttribute("data-checked")=="false"){
        if(document.getElementById("kind_note").getAttribute("data-checked")=="true"){
            popup_style("note");
            add_marker(e.latlng);
        } else {
            popup_style("label");
            map.flyTo(e.latlng, map.getZoom(), {
                animate: true,
                duration: 0.25
            });
            add_label(e.latlng);
        }
    } else if (document.getElementById("ctrl_ov").getAttribute("data-checked")=="true"){
        curr_view[0]=e.latlng.lat;
        curr_view[1]=e.latlng.lng;
        overview();
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
function isOverflown(element, n) {
    let f=0;
    if(n=="w"){
        while (element.scrollWidth > element.clientWidth) {
            f=Number(element.style.fontSize.replace("px",""));
            f-=1;
            element.style.fontSize=String(f);
        } 
    } else if (n=="h"){
        while (element.scrollHeight > element.clientHeight) {
            f=Number(element.style.fontSize.replace("px",""));
            f-=1;
            element.style.fontSize=String(f);
        } 
    }
    
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

function btn_tgl(btn1, btn2, ico1, ico2){
    btn2=btn2||"";
    ico1=ico1||"";
    ico2=ico2||"";
    if(btn2==""){
        if(document.getElementById(btn1).getAttribute("data-checked")=="true"){
            document.getElementById(btn1).setAttribute("data-checked","false");
        } else {
            document.getElementById(btn1).setAttribute("data-checked","true");
        }
    } else {
        if(document.getElementById(btn1).getAttribute("data-checked")=="true"){
            document.getElementById(btn1).setAttribute("data-checked","false");
            document.getElementById(btn2).setAttribute("data-checked","true");
            if(ico1!=""){
                document.getElementById(ico1).classList.remove("is-solid");
                document.getElementById(ico2).classList.add("is-solid");
            }
        } else {
            document.getElementById(btn1).setAttribute("data-checked","true");
            document.getElementById(btn2).setAttribute("data-checked","false");
            if(ico1!=""){
                document.getElementById(ico1).classList.add("is-solid");
                document.getElementById(ico2).classList.remove("is-solid");
            }
        }
    }
}

function css_getClass(name) {
    let rules = {};
    let cssRules;
    let sheets = document.styleSheets;
    
    for(let i in document.styleSheets){
        if( sheets[i].href && sheets[i].href.indexOf("style.css") > -1 ) {
            cssRules = sheets[i].cssRules;
            break;
        }
    }

    for (let j=0; j<cssRules.length; ++j){
        rules[cssRules[j].selectorText] = cssRules[j];
    }
    return rules[name];
}



function btn_layer(n){
    let btn, ico, layer;
    switch(n){
        case 0:
            btn="ctrl_layer_s";
            ico="ico_layer_s";
            layer=layer_stories;
            break;
        case 1:
            btn="ctrl_layer_l";
            ico="ico_layer_l";
            layer=layer_labels;
            break;
        case 2:
            btn="ctrl_layer_i";
            ico="ico_layer_i";
            layer=layer_info;
            break;
    }
    if(document.getElementById("ctrl_ov").getAttribute("data-checked")=="false" || btn=="ctrl_layer_s"){
        map.addLayer(layer);
        if(document.getElementById(btn).getAttribute("data-checked")=="true"){
            map.removeLayer(layer);
            document.getElementById(btn).style.background="#333";
            document.getElementById(ico).classList.remove("is-solid");
            document.getElementById(btn).setAttribute("data-checked", "false");
        } else {
            map.addLayer(layer);
            document.getElementById(btn).style.background="#005201";
            document.getElementById(ico).classList.add("is-solid");
            document.getElementById(btn).setAttribute("data-checked", "true");
        }
    }
}

function mapRange (value, a, b, c, d) {
    value = (value - a) / (b - a);
    return c + value * (d - c);
}

function larger_image(img){
    document.getElementById("larger_img_close").style.display="block";
    document.getElementById("img_container").style.display="flex";
    document.getElementById("img_container").innerHTML="<img id='large_img' src='" + img + "' style='max-width: 95%; max-height: 95%; width: auto; height: auto; pointer-events: none; transition: transform 0.25s;' zoom-level='0'></img>";
}

let mouseDown = 0;
document.body.onmousedown = function() { 
  mouseDown=1;
}
document.body.onmouseup = function() {
  mouseDown=0;
}

function move_image(event){
    console.log(mouseDown);
    let z=document.getElementById("large_img").getAttribute("zoom-level");
    if(mouseDown && z>0){
        let x=mapRange(event.clientX,0, screen.width,-50, 50);
        let y=mapRange(event.clientY,0, screen.height,-50,50);
        document.getElementById("large_img").style.transform="translate("+x+"%, "+y+"%)";
    }
}

function larger_image_close(){
    document.getElementById("img_container").style.transform="scale(1)";
    document.getElementById("larger_img_close").style.display="none";
    document.getElementById("img_container").style.display="none";
    document.getElementById("img").style.display="none";
}

function zoom_image(){
    let z=document.getElementById("large_img").getAttribute("zoom-level");
    if(z==0){
        z++;
        document.getElementById("img_container").style.transform="scale(1.5)";
        document.getElementById("large_img").setAttribute("zoom-level", z);
    } else if(z==1){
        z++;
        document.getElementById("img_container").style.transform="scale(2.0)";
        document.getElementById("large_img").setAttribute("zoom-level", z);
    } else if(z==2){
        z++;
        document.getElementById("img_container").style.transform="scale(2.5)";
        document.getElementById("large_img").setAttribute("zoom-level", z);
    } else {
        z=0;
        document.getElementById("img_container").style.transform="scale(1)";
        document.getElementById("large_img").setAttribute("zoom-level", z);
        document.getElementById("large_img").style.transform="translate(0%, 0%)";
    }
}

tippy("#ctrl_layer_s", {
    content: "Layer: Stories",
    placement: "right",
});
tippy("#ctrl_layer_l", {
    content: "Layer: Comments",
    placement: "right",
});
tippy("#ctrl_layer_i", {
    content: "Layer: Infos",
    placement: "right",
});

tippy("#ctrl_zp", {
    content: "Navigation: Zoom In",
    placement: "right",
});
tippy("#ctrl_zm", {
    content: "Navigation: Zoom Out",
    placement: "right",
});

tippy("#ctrl_rotate_span", {
    content: "Navigation: Rotate",
    placement: "top",
});
tippy("#ctrl_ov", {
    content: "Navigation: Overview",
    placement: "top",
});

tippy("#ctrl_st", {
    content: "Read Curated Stories",
    placement: "bottom",
});
tippy("#ctrl_edit", {
    content: "Create New Content",
    placement: "bottom",
});

tippy("#kind_note", {
    content: "Create: Note",
    placement: "bottom",
});
tippy("#kind_label", {
    content: "Create: Comment",
    placement: "bottom",
});


function bakeCookie_pos(){
    let date = new Date();
    date.setTime(date.getTime() + (604800000)); // 7 days
    let expires = "expires="+ date.toUTCString();
    document.cookie = "MRB_position=/" + map.getCenter().lat + "/" + map.getCenter().lng + "/" + map.getZoom() + "/;" + expires;
}

function getCookie(str){
    if(document.cookie.indexOf(str)!=-1){
        let index=document.cookie.indexOf(str);
        let cookie = document.cookie.slice(index);
        let cookie_sub=cookie.split("/");
        return cookie_sub;
    } else{
        return false;
    }
}


let carl_text=["The Mississippi River is 2,340 miles long.",
                "It takes 90 days for a drop of water to travel the entire length of the Mississippi River.",
                "The Great River Road runs through about 110 counties and parishes.",
                "In the year A.D. 1250, the ancient metropolis of Cahokia, Illinois, was home to more people than London.",
                "Waterskiing was invented on Lake Pepin, located between Minnesota and Wisconsin.",
                "The Mississippi River is home to 360 species of fish, 326 species of birds, 145 species of amphibians and 50 species of mammals.",
                "The deepest place on the Mississippi River is 200-feet deep and is located near Algiers Point in New Orleans.",
                "Mississippi’s catfish farms produce the majority of the nation’s farm-raised catfish.",
                "Louisiana was named after the Fourteenth King of France.",
                "Missouri is known as the “Show Me” state.",
                "Illinois has the largest population of all the states located along the Mississippi River.",
                "Better fish than fash.",
                "The Mississippi River also contains over 240 different fish species, which is 25% of all the fish species that can be found in North America.",
                "Power to the fish stick it to the men.",
                "The oppressed are allowed once every few years to decide which particular representatives of the oppressing class are to represent and repress them.",
                "The old world is dying, and the new world struggles to be born: Now is the time of monsters.",
                "zzzzzzz"];

function caaaarl(){
    if(document.getElementById("carl").getAttribute("closed")=="true"){
        document.getElementById("c1").style.display="block";
        document.getElementById("c2").style.display="block";
        document.getElementById("c3").style.display="block";
        document.getElementById("c4").style.display="table";
        document.getElementById("carl").src="howmuchami.png";
        document.getElementById("carl").setAttribute("closed","false");
        let ci=parseInt(math.random(carl_text.length-1));
        document.getElementById("c4").innerHTML="<b>Carl the Carp says:</b><br><div id='carl_txt' style='width: 100%; height: 85%; overflow: hidden; font-size: 24px; margin-top: 5px;'>" + carl_text[ci] + "</div>";
        isOverflown(document.getElementById("carl_txt"),"h");
    } else {
        document.getElementById("c1").style.display="none";
        document.getElementById("c2").style.display="none";
        document.getElementById("c3").style.display="none";
        document.getElementById("c4").style.display="none";
        document.getElementById("carl").src="howmuchami_closed.png";
        document.getElementById("carl").setAttribute("closed","true");
    }
}