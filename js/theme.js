//======================================
// THEME.JS
//======================================

const body = document.body;
const themeBtn = document.getElementById("themeBtn");

//======================================
// LOAD SAVED THEME
//======================================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    body.classList.add("dark");

    themeBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';

} else {

    body.classList.remove("dark");

    themeBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';

}


//======================================
// TOGGLE THEME
//======================================

themeBtn.addEventListener("click", () => {

    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';

    } else {

        localStorage.setItem("theme", "light");

        themeBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';

    }

});


//======================================
// LIVE CLOCK
//======================================

const liveClock = document.getElementById("liveClock");

function updateClock() {

    const now = new Date();

    liveClock.innerHTML = now.toLocaleTimeString("en-IN", {

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit",

        hour12: true

    });

}

updateClock();

setInterval(updateClock, 1000);


//======================================
// RIPPLE EFFECT
//======================================

document.querySelectorAll(".btn").forEach(btn => {

    btn.addEventListener("click", function(e){

        const circle = document.createElement("span");

        const size = Math.max(this.clientWidth,this.clientHeight);

        const rect = this.getBoundingClientRect();

        circle.style.width = circle.style.height = size + "px";

        circle.style.left = (e.clientX - rect.left - size/2) + "px";

        circle.style.top = (e.clientY - rect.top - size/2) + "px";

        circle.classList.add("ripple");

        this.appendChild(circle);

        setTimeout(()=>{

            circle.remove();

        },600);

    });

});


//======================================
// LOADING OVERLAY
//======================================

function showLoader(){

    const loader=document.getElementById("loadingOverlay");

    if(loader){

        loader.style.display="flex";

    }

}

function hideLoader(){

    const loader=document.getElementById("loadingOverlay");

    if(loader){

        loader.style.display="none";

    }

}


//======================================
// GLOBAL FUNCTIONS
//======================================

window.showLoader = showLoader;
window.hideLoader = hideLoader;