const Utils={

formatTime(date){
    return new Date(date).toLocaleTimeString("en-IN",{
        hour:"2-digit",
        minute:"2-digit",
        hour12:true
    });
},

formatDate(date){
    return new Date(date).toLocaleDateString("en-IN",{
        day:"2-digit",
        month:"short",
        year:"numeric"
    });
},

showLoader(){
    $("#loadingOverlay").fadeIn(200);
},

hideLoader(){
    $("#loadingOverlay").fadeOut(200);
},

showToast(msg,type="success"){

    $(".toast-container").remove();

    let bg={
        success:"bg-success",
        danger:"bg-danger",
        warning:"bg-warning",
        info:"bg-primary"
    };

    $("body").append(`
<div class="toast-container position-fixed top-0 end-0 p-3" style="z-index:999999">
<div class="toast text-white ${bg[type]}">
<div class="d-flex">
<div class="toast-body">${msg}</div>
<button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
</div>
</div>
</div>`);

    new bootstrap.Toast(document.querySelector(".toast")).show();

},

saveHistory(boarding,destination){

    let history=JSON.parse(localStorage.getItem("routeHistory"))||[];

    history.unshift({
        boarding,
        destination,
        date:new Date().toISOString()
    });

    history=history.slice(0,10);

    localStorage.setItem("routeHistory",JSON.stringify(history));

},

loadHistory(){

    return JSON.parse(localStorage.getItem("routeHistory"))||[];

},

clearHistory(){

    localStorage.removeItem("routeHistory");

},

copy(text){

    navigator.clipboard.writeText(text);

    this.showToast("Copied");

},

network(){

    return navigator.onLine;

}

};