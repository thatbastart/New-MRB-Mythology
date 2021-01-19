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

arr_stories[0]=new Story(
    "Invasion of the Carps", 
    "Marielouis Hippler", 
    "stories/text/story_01.html", 
    "/stories/img/story_01.jpg", 
    "Invading Carls", 
    "/stories/thumb/story_01.jpg", 
    "16.01.2021", 
    [[44.914,-93.202,14],
    [44.914,-93.202,14],
    [44.982,-93.258,14]]);

arr_stories[1]=new Story(
    "The UnRiver", 
    "Tilmann Finner", 
    "stories/text/story_02.html", 
    "/stories/img/story_02.png", 
    "UnReality at Lock and Dam Number 3", 
    "/stories/thumb/story_02.jpg", 
    "16.01.2021", 
    [[44.611,-92.61,13],
    [44.611,-92.61,13],
    [44.0,-91.438,13],
    [43.213,-91.1,14]]);

arr_stories[2]=new Story(
    "Unknown Pressures", 
    "Tilmann Finner", 
    "stories/text/story_03.html", 
    "/stories/img/story_03.png", 
    "Arkansas City 2011", 
    "/stories/thumb/story_03.jpg", 
    "17.01.2021", 
    [[36.5809, -89.5474, 12],
    [36.1941, -89.6527, 12],
    [35.6568, -89.9277, 12],
    [35.1230, -90.0774, 12],
    [34.5166, -90.5841, 12],
    [33.5515, -91.2383, 12],
    [33.2895, -91.1610, 12],
    [32.3118, -90.9023, 12],
    [31.5440, -91.4334, 12],
    [30.4291, -91.2069, 12],
    [29.9347, -90.1361, 12]]);

arr_stories[3]=new Story(
    "Levee War", 
    "Marielouis Hippler", 
    "stories/text/story_04.html", 
    "/stories/img/story_04.png", 
    "", 
    "/stories/thumb/story_04.jpg", 
    "17.01.2021", 
    [[29.9448, -90.0769, 13],
    [29.9448, -90.0769, 13],
    [30.164, -90.978, 10],
    [35.1477, -90.0522, 13],
    [36.8818, -89.1843, 12],
    [30.0019, -90.44, 14],
    [37.0091, -89.1784, 14],
    [38.9701, -90.4354, 14],
    [38.9944, -90.7393, 14]]);
