const TOKEN="Bearer 5FC74043-4CBC-EF11-9194-98F2B32FB60F";
const API="https://api.hrtransport.org/misInfo/TimetableStationDetail/";

const dutyID=new URLSearchParams(window.location.search).get("dutyID");

if(!dutyID){
    alert("Invalid Duty ID");
    throw new Error("Duty ID Missing");
}

loadRoute();

async function loadRoute(){

    try{

        const res=await fetch(API+dutyID,{
            headers:{
                Authorization:TOKEN
            }
        });

        const json=await res.json();

        $("#loadingRoute").hide();

        if(!json.model||json.model.length===0){

            $("#timeline").removeClass("d-none").html(`
                <div class="text-center py-5">
                    <h5>No Route Found</h5>
                </div>
            `);

            return;

        }

        renderTimeline(json.model);

    }catch(err){

        console.log(err);

        $("#loadingRoute").html(`
            <div class="text-danger">
                <i class="bi bi-exclamation-circle fs-1"></i>
                <h5 class="mt-3">Unable to load route.</h5>
            </div>
        `);

    }

}

function renderTimeline(data){

    const first=data[0];

    $("#tripName").text(first.tripName);
    $("#vehicleNo").text(first.vehicleNumber);
    $("#depotName").text(first.depotName);
    $("#stopCount").text(data.length);

    let html="";
    data.forEach((stop,index)=>{
        html+=`
        <div class="timeline-item">
            <div class="timeline-dot ${index===0?'start':''} ${index===data.length-1?'end':''}"></div>
            <div class="timeline-card">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <span class="badge bg-primary">
                            ${formatTime(stop.tripTime)}
                        </span>
                    </div>

                    <div class="col-md-4">
                        <h6 class="mb-0">${stop.boardingStationName}</h6>
                    </div>

                    <div class="col-md-4">
                        <small class="text-muted">
                            ${stop.tripName}
                        </small>
                    </div>

                    <div class="col-md-2 text-end">
                        <span class="badge bg-success">
                            Stop ${stop.srNo}
                        </span>
                    </div>
                </div>
            </div>
        </div>`;
    });
    $("#timeline").html(html).removeClass("d-none");
}

function formatTime(date){
    return new Date(date).toLocaleTimeString("en-IN",{
        hour:"2-digit",
        minute:"2-digit",
        hour12:true
    });
}