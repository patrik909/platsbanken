class Fetch {
    
    fetchLatestJobsByID(ID){
        
        const fetchLatestJobs = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?sida=1&antalrader=10&lanid=${ID}`);
        
        fetchLatestJobs.then((response) => {
            return response.json();
        }).then((fetchLatestJobs) => { 
            newDOM.displayTotalAmoutOfJobs(fetchLatestJobs);
            newDOM.displayLatestJobs(fetchLatestJobs);
        }).catch((error) =>{     
            console.log(error);
       })
        
    }
    
}

class DOM {
    
    displayTotalAmoutOfJobs(jobs){

        const amountOfJobsDiv = document.getElementById('amountOfJobs');
        const lan = jobs.matchningslista.matchningdata[0].lan;
        const amountOfJobs = jobs.matchningslista.antal_platsannonser_exakta;
        
        const amountOfJobsContent = `
            <p> Antal jobb i ${lan}: ${amountOfJobs}
        `;
        
        amountOfJobsDiv.innerHTML=amountOfJobsContent;
        
    }
    
    displayLatestJobs(jobs){
        
        const outputListJobs = document.getElementById('outputListJobs');
        const jobData = jobs.matchningslista.matchningdata;
        let listedJobs = "";
        
        for(let i = 0; i < jobData.length; i++){
            
            const date = jobData[i].sista_ansokningsdag
            //Sending info to the contructor, which formates the data.
            //newDOM.formateDate(jobData[i].sista_ansokningsdag)
            
            let formatedDate = ""
            if(date){
                formatedDate = date.substring(0,10);
            } else {
                formatedDate = "Oklart";
            }
            
            listedJobs +=`
                <div class="latestJobs">
                    <h3>${jobData[i].annonsrubrik}</h3>
                    <p><span>${jobData[i].yrkesbenamning}</span> - ${jobData[i].kommunnamn}</p>
                    <p>${jobData[i].arbetsplatsnamn}</p>
                    <p>${jobData[i].anstallningstyp}</p>
                    <p><span>Sista ansökningsdag:</span> ${formatedDate}</p>
                    <button id="${jobData[i].annonsid}"=>Läs mer!</button>
                </div>
            `;
        }
        outputListJobs.innerHTML=listedJobs
    }
    
    formateDate(date){
        console.log(date)
    }
       
}

//Starts fetch when entering the homepage
const newDOM = new DOM;
const newFetch = new Fetch;
newFetch.fetchLatestJobsByID(1);