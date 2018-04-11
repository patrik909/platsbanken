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
                <header>${jobListing[i].annonsrubrik}</header>
                <button id="">Läs mer!</button>
            </div>
        `
        console.log(jobListing[i])
        console.log(jobListing[i].annonsrubrik)
    }
    
    const main = document.getElementById('outputListJobs');

    main.innerHTML=listedJobs
    
}