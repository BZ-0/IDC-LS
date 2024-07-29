
//
const date = new Date();

//
const setElementContent = (selector, value)=>{
    const element = document.querySelector(selector);
    if (element) { element.innerHTML = value; }
}

//
const updateTime = ()=>{
    const date = new Date();
    const timeMinutes = `${date.getMinutes()}`.padStart(2,"0");
    const timeHours = `${date.getUTCHours()}`.padStart(2,"0");

    //
    setElementContent(".ui-time-minute", timeMinutes);
    setElementContent(".ui-time-hour", timeHours);
}

//
updateTime();
setInterval(updateTime, 500);
document.addEventListener("DOMContentLoaded", updateTime);
