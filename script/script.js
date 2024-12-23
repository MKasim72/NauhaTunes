console.log("Hello")

let currentSong = new Audio()
let color;
let songs;
let songInfo = document.querySelector(".songInfo .songName")
let currFolder;

async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`) 
    // let a = await fetch(`/${folder}/`)  

    let response = await a.text()  
    // console.log(response)   
    let div = document.createElement('div')
    div.innerHTML = response;
    let tds = div.getElementsByTagName("a");
    songs = []
    for(let i=0;i<tds.length;i++){
        if(tds[i].href.endsWith('.mp3')){
            songs.push(tds[i].href)
        }
    }
    let songUL = document.querySelector(".songList").getElementsByTagName('ul')[0]
    songUL.innerHTML = ""
    for (const sang of songs){
        songUL.innerHTML = songUL.innerHTML + `
        
                        <li>
                            <img src="img/music.svg" alt="music">
                            <div class="info">
                                <div>${sang.split(`/${currFolder}/`)[1].replaceAll("%20"," ")}</div>
                                <div></div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img src="img/play.svg" class="invert" alt="">
                            </div>
                        </li>
        `
    }
    // astral-creepy-dark-logo-254198 - Copy

    //Playing the song
    // let play = document.querySelector('#play')
    // play.addEventListener('click',()=>{
    //     var audio = new Audio(songs[0])
    //     audio.play() 
    // }) 

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener('click',()=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            let passed = e.querySelector(".info")
            playMusic(e.querySelector(".info").firstElementChild.innerHTML,passed)
        })
    })
    // console.log(songs)
    return songs
    
}

const playMusic = (track,pause=false) =>{
    currentSong.src = `/${currFolder}/`+track
    if(!pause){
        currentSong.play()
        play.src = 'img/pause.svg'
    }
    currentSong.play()
    play.src = 'img/pause.svg'
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
    songInfo.innerHTML = currentSong.src.split(`/${currFolder}/`)[1]

}

const formatTime = (seconds) => {
    // Ensure seconds is an integer
    seconds = Math.floor(seconds);

    // Calculate minutes and seconds
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    // Format as MM:SS
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
DisplayAlbums = async (album) => {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    // let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    let cardContainer = document.querySelector(".cardContainer")
    div.innerHTML = response;
    console.log(div);

    let allAnchors = div.querySelectorAll("#wrapper li a"); // Select anchor elements inside the list items
    let array = Array.from(allAnchors)
        for(let i=0;i<array.length;i++){
            const e = array[i]
                    // console.log(e.innerText); // Log the text content of each anchor element
            if(e.href.includes("/songs") && !e.href.includes(".htaccess")){
                let folder = e.href.split("/songs/")[1].split("/")[0];
                let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
                let response = await a.json();
                console.log(response)
                cardContainer.innerHTML = cardContainer.innerHTML + `
                <div class="card" data-folder="${folder}">
                <div class="play">
                    <img src="img/play.svg" alt="" />
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="" />
                <h2>${response.title}</h2>
                <p>${response.desc}</p>
                </div>
                `
            
        

        }
    };

        //Load the playlist when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(el=>{
        el.addEventListener("click",async item=>{
            console.log(item.currentTarget.dataset.folder)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            console.log(songs)
        })
    })
};


async function main(){

    
    await getSongs("songs/raza")
    // console.log(songs)
    playMusic(songs[0].split(`${currFolder}`)[1],true)

    // Display all the Albums on the page : 
    DisplayAlbums()
    play.addEventListener('click',()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = `img/pause.svg`
        }
        else{
            currentSong.pause()
            play.src = `img/play.svg`

        }
    })

    currentSong.addEventListener('timeupdate',()=>{
        console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".songTime").innerHTML=`${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%"
    })

    document.querySelector(".seekBar").addEventListener("click",(e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector('.circle').style.left= percent +"%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event for HamBurger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click",()=>{
        // let mySong = currentSong.src
        // console.log(mySong)
        // let index = songs.indexOf(mySong)
        // console.log(index)
        let mySong = currentSong.src.split("/songs/")[1]; // Extract only the song name
        let index = songs.findIndex(song => song.includes(mySong)); // Find index
        if (index === -1) {
            console.error("Song not found in the songs array:", mySong);
            return
        };
        // if((index+1)>songs.length){
        let selSong = songs[index-1].split("/songs/")[1]
        console.log(selSong)
        playMusic(selSong)
    })
    // previous.addEventListener("click", () => {
    //     currentSong.pause()
    //     console.log("Previous clicked")
    //     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    //     if ((index - 1) >= 0) {
    //         playMusic(songs[index - 1])
    //     }
    // })
    
    next.addEventListener("click",()=>{
        // console.log("Current song : "+currentSong.src.split("/song/")[1].replaceAll("%20"," "))
        let mySong = currentSong.src
        console.log("Song Name",mySong)
        let index = songs.includes(mySong)
        // console.log(index)
        if((index+1)<songs.length){
        let selSong = songs[index+1].split("/songs/nadeem_sarwar")[1]
        console.log(selSong)
        playMusic(selSong)
        }
    })



}

document.addEventListener('DOMContentLoaded', main);


