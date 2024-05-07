const getGameInfo=()=>JSON.parse(localStorage.getItem('game'));
const name_input=document.querySelector("#input-name");
const start_screen=document.querySelector("#start-screen");
document.querySelector("#btn-play").addEvent
const init=()=>{
    const game=getGameInfo();
    document.querySelector("#btn-continue").style.display=game?'grid':'none';
}