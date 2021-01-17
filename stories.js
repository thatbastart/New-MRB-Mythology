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
    "stories/text/story_01.txt", 
    "/stories/img/story_01.jpg", 
    "much picture", 
    "/stories/thumb/story_01.jpg", 
    "16.01.2021", 
    [[44.914,-93.202,14],
    [44.982,-93.258,14]]);

arr_stories[1]=new Story(
    "The UnRiver", 
    "Tilmann Finner", 
    "stories/text/story_02.txt", 
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
    "hi there", 
    "/stories/img/story_03.jpg", 
    "cat", 
    "/stories/thumb/story_03.jpg", 
    "17.01.2021", 
    [[43.16,-91.15,10]]);
