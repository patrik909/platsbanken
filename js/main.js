listJobsByLanID(1)

function listJobsByLanID(ID){
    
    const fetchData = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?sida=1&antalrader=10&lanid=${ID}`);

    fetchData.then((response) => {
        return response.json();
    }).then((fetchData) => {
        listJobs(fetchData);
    }).catch((error) =>{
        console.log(error);
    })
}

function listJobs(jobs){
    
    console.log(jobs.matchningslista)
    
    const jobListing = jobs.matchningslista.matchningdata
    let listedJobs = "";
    
    for(let i = 0; i < jobListing.length; i++){
        
        listedJobs +=`
            <div class="latestJobs">
                <h3>${jobListing[i].annonsrubrik}</h3>
                <p><span>${jobListing[i].yrkesbenamning}</span> - ${jobListing[i].kommunnamn}</p>
                <p>${jobListing[i].arbetsplatsnamn}</p>
                <p>${jobListing[i].anstallningstyp}</p>
                <p>${jobListing[i].sista_ansokningsdag}</p>
                <button id="${jobListing[i].annonsid}"=>Läs mer!</button>
            </div>
        `;
    
    }
    
    const main = document.getElementById('outputListJobs');

    main.innerHTML=listedJobs
    
}