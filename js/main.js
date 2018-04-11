listJobsByLanID(1)

function listJobsByLanID(ID){
    
    const fetchData = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?sida=1&antalrader=10&lanid=${ID}`);

    fetchData.then((response) => {
        return response.json();
    }).then((fetchData) => {
        displayLatestJobs(fetchData);
        displayAmountOfJobs(fetchData)
    }).catch((error) =>{
        console.log(error);
    })
}

function displayAmountOfJobs(jobs){
    
    const amountOfJobsDiv = document.getElementById('amountOfJobs');

    let amountOfJobsContent = `<p> Antal jobb i ${jobs.matchningslista.matchningdata[0].kommunnamn}:  ${jobs.matchningslista.antal_platsannonser_exakta}`
    
    amountOfJobsDiv.innerHTML=amountOfJobsContent;

}

function displayLatestJobs(jobs){
    
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
    
    const outputListJobs = document.getElementById('outputListJobs');
    outputListJobs.innerHTML=listedJobs
    
}