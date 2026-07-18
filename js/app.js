const TOKEN = "Bearer 5FC74043-4CBC-EF11-9194-98F2B32FB60F";
const STATION_API = "https://api.hrtransport.org/misInfo/TimetableStationList/";
const TIMETABLE_API = "https://api.hrtransport.org/misInfo/TimetableList";

let boardingStation = null;
let destinationStation = null;
let table = null;

$(document).ready(function () {
    initializeSelect2();
    initializeDataTable();
});

function initializeSelect2() {
    $("#boardingSelect").select2({
        placeholder: "Search Boarding Station",
        width: "100%",
        minimumInputLength: 3,
        ajax: {
            transport: function (params, success, failure) {
                fetch(
                    STATION_API + params.data.term,
                    {
                        headers: {
                            Authorization: TOKEN
                        }
                    }
                )
                    .then(res => res.json())
                    .then(success)
                    .catch(failure);
            },
            processResults: function (data) {
                return {
                    results: data.model.map(item => ({
                        id: item.stationID,
                        text: item.stationName,
                        station: item
                    }))
                };
            }
        }
    });

    $("#destinationSelect").select2({
        placeholder: "Search Destination",
        width: "100%",
        minimumInputLength: 3,
        ajax: {
            transport: function (params, success, failure) {
                fetch(
                    STATION_API + params.data.term,
                    {
                        headers: {
                            Authorization: TOKEN
                        }
                    }
                )
                    .then(res => res.json())
                    .then(success)
                    .catch(failure);
            },
            processResults: function (data) {
                return {
                    results: data.model.map(item => ({
                        id: item.stationID,
                        text: item.stationName,
                        station: item
                    }))
                };
            }
        }
    });
}


$("#boardingSelect").on("select2:select", function (e) {
    boardingStation = e.params.data.station;
    $("#cardBoarding").text(
        boardingStation.stationName
    );
});

$("#destinationSelect").on("select2:select", function (e) {
    destinationStation = e.params.data.station;
    $("#cardDestination").text(
        destinationStation.stationName
    );
});

$("#swapBtn").click(function () {
    if (!boardingStation || !destinationStation)
        return;
    const temp = boardingStation;
    boardingStation = destinationStation;
    destinationStation = temp;

    const b = new Option(
        boardingStation.stationName,
        boardingStation.stationID,
        true,
        true
    );

    $("#boardingSelect").append(b).trigger("change");
    const d = new Option(
        destinationStation.stationName,
        destinationStation.stationID,
        true,
        true
    );

    $("#destinationSelect").append(d).trigger("change");
    $("#cardBoarding").text(
        boardingStation.stationName
    );
    $("#cardDestination").text(
        destinationStation.stationName
    );
});

function initializeDataTable() {
    table = $("#busTable").DataTable({
        responsive: true,
        destroy: true,
        pageLength: 10,
        lengthMenu: [
            [10,25,50,100,-1],
            [10,25,50,100,"All"]
        ],
        dom:
            'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="bi bi-file-earmark-excel"></i> Excel',
                className: 'btn btn-success'
            },
            {
                extend: 'pdf',
                text: '<i class="bi bi-file-earmark-pdf"></i> PDF',
                className: 'btn btn-danger'
            },
            {
                extend: 'print',
                text: '<i class="bi bi-printer"></i> Print',
                className: 'btn btn-primary'
            }
        ]
    });
}

$("#searchBtn").click(function(){
    if(!boardingStation){
        alert("Please select Boarding Station");
        return;
    }
    if(!destinationStation){
        alert("Please select Destination Station");
        return;
    }
    loadTimetable();
});

$("#refreshBtn").click(function(){
    if(boardingStation&&destinationStation){
        loadTimetable();
    }
});

async function loadTimetable(){
    showLoader();

    const payload={
        boardingStationList:[{
            stationID:boardingStation.stationID,
            stationName:boardingStation.stationName
        }],
        destinationStationList:[{
            stationID:destinationStation.stationID,
            stationName:destinationStation.stationName
        }]
    };
    try{
        const response=await fetch(TIMETABLE_API,{
            method:"POST",
            headers:{
                "Content-Type":"application/json", Authorization:TOKEN
            }, body:JSON.stringify(payload)
        });
        const json=await response.json();
        hideLoader();
        renderTable(json);
    }catch(e){
        hideLoader();
        alert("Unable to load timetable.");
        console.log(e);
    }
}

function renderTable(data){
    table.clear();
    if(!data.model||data.model.length===0){
        $("#cardBus").text("0");
        table.draw();
        return;
    }
    $("#cardBus").text(data.model.length);
    data.model.forEach(bus=>{
        table.row.add([
            `<span class="badge bg-primary">${formatTime(bus.tripTime)}</span>`,
            bus.boardingStationName,
            bus.destinationStationName,
            bus.tripName,
            bus.vehicleNumber,
            `<span class="badge bg-info">${bus.vehicleType1}</span>`,
            `<span class="badge bg-success">${bus.depotName}</span>`,
            `<button class="btn btn-sm btn-warning view-route" data-id="${bus.dutyID}">
                <i class="bi bi-signpost"></i> Route
            </button>`
        ]);
    });
    table.draw();
}

function formatTime(dateTime){
    const d=new Date(dateTime);
    return d.toLocaleTimeString("en-IN",{
        hour:"2-digit",
        minute:"2-digit",
        hour12:true
    });
}


function showToast(message,type="success"){

    $(".toast-container").remove();

    const bg={
        success:"bg-success",
        danger:"bg-danger",
        warning:"bg-warning",
        info:"bg-primary"
    };

    $("body").append(`
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index:999999">
        <div class="toast align-items-center text-white ${bg[type]}" role="alert">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    </div>`);

    const toast=new bootstrap.Toast(document.querySelector(".toast"));
    toast.show();

}

setInterval(function(){
    if(boardingStation&&destinationStation){
        loadTimetable();
    }
},30000);


$(document).keydown(function(e){
    if(e.ctrlKey&&e.key==="p"){
        e.preventDefault();
        window.print();
    }

    if(e.ctrlKey&&e.key==="f"){
        e.preventDefault();
        $("#boardingSelect").select2("open");
    }
    if(e.key==="Escape"){
        $("#boardingSelect").select2("close");
        $("#destinationSelect").select2("close");
    }
});

function saveHistory(){

    if(!boardingStation||!destinationStation)return;

    let history=JSON.parse(localStorage.getItem("history"))||[];

    history.unshift({
        boarding:boardingStation,
        destination:destinationStation,
        date:new Date().toLocaleString()
    });

    history=history.slice(0,10);

    localStorage.setItem("history",JSON.stringify(history));

}

window.addEventListener("offline",function(){

    showToast("No Internet Connection","danger");

});

window.addEventListener("online",function(){

    showToast("Internet Connected","success");

});


// Route API Base URL
const ROUTE_API = "https://api.hrtransport.org/misInfo/TimetableStationDetail/";

$(document).on("click", ".view-route", function () {
    const dutyID = $(this).data("id");

    const routeModal = new bootstrap.Modal(document.getElementById('routeModal'));
    routeModal.show();

    $("#modalTripName").text("-");
    $("#modalVehicleNo").text("-");
    $("#modalStopCount").text("0");
    $("#modalLoadingRoute").show();
    $("#modalTimeline").addClass("d-none").html("");

    fetchRouteDetails(dutyID);
});

async function fetchRouteDetails(dutyID) {
    try {
        const res = await fetch(ROUTE_API + dutyID, {
            headers: {
                Authorization: TOKEN
            }
        });
        const json = await res.json();

        $("#modalLoadingRoute").hide();

        if (!json.model || json.model.length === 0) {
            $("#modalTimeline").removeClass("d-none").html(`
                <div class="text-center py-4">
                    <h5>No Route Found</h5>
                </div>
            `);
            return;
        }

        renderModalTimeline(json.model);

    } catch (err) {
        console.log(err);
        $("#modalLoadingRoute").hide();
        $("#modalTimeline").removeClass("d-none").html(`
            <div class="text-center text-danger py-4">
                <i class="bi bi-exclamation-circle fs-2"></i>
                <h5 class="mt-2">Unable to load route.</h5>
            </div>
        `);
    }
}

function renderModalTimeline(data) {
    const first = data[0];

    // टॉप कार्ड्स का डेटा अपडेट करें
    $("#modalTripName").text(first.tripName);
    $("#modalVehicleNo").text(first.vehicleNumber);
    $("#modalStopCount").text(data.length);

    let html = "";
    data.forEach((stop, index) => {
        html += `
        <div class="timeline-item mb-3 p-2 border-start border-success border-3 bg-light rounded shadow-sm">
            <div class="row align-items-center g-2">
                <div class="col-3 col-md-2">
                    <span class="badge bg-primary w-100 py-2">
                        ${formatTime(stop.tripTime)}
                    </span>
                </div>
                <div class="col-6 col-md-8">
                    <h6 class="mb-0 fw-bold text-dark">${stop.boardingStationName}</h6>
                    <small class="text-muted" style="font-size: 0.75rem;">${stop.tripName || ''}</small>
                </div>
                <div class="col-3 col-md-2 text-end">
                    <span class="badge bg-success">
                        Stop ${stop.srNo}
                    </span>
                </div>
            </div>
        </div>`;
    });

    $("#modalTimeline").html(html).removeClass("d-none");
}

saveHistory();

showToast("Timetable Loaded Successfully");