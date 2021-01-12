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
    "Hello World", 
    "Chuck Norris", 
    "stories/text/story_01.txt", 
    "/stories/img/story_01.jpg", 
    "much picture", 
    "/stories/thumb/story_01.jpg", 
    "31.12.2020", 
    [[43.16,-91.15,13],
    [42.75,-91.08,11],
    [41.9,-90.16,11]]);

arr_stories[1]=new Story(
    "My Old Friend", 
    "Chuck Norris", 
    "hi there", 
    "/stories/img/story_01.jpg", 
    "much wow", 
    "/stories/thumb/story_01.jpg", 
    "31.12.2020", 
    [[43.16,-92.15,10],
    [42.16,-92.15,10]]);

arr_stories[2]=new Story(
    "Mississippi Isabell", 
    "Chuck Norris", 
    "hi there", 
    "/stories/img/story_01.jpg", 
    "cat", 
    "/stories/thumb/story_01.jpg", 
    "31.12.2020", 
    [[43.16,-91.15,10]]);
