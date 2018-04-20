function changeUrl(url, substringToDelete) {

	let substringLength = substringToDelete.length;
	let newUrl = '';

	if (url.href.substr(-substringLength) == substringToDelete) {
		newUrl = url.href.slice(0, -substringToDelete);
	}

	return newUrl;
}


class Controller {
  
    constructor() {
      this.newDOM = newDOM;
    }
  
    filterButton(){
        
        const filterJobsByAmount = document.getElementById('filterJobsByAmount');
        const filterJobsByAmountButton = document.getElementById('filterJobsByAmountButton');

        const filterCountyButton = document.getElementById('filterCountyButton');
        const filterCounty = document.getElementById('filterCounty');

        const searchJobs = document.getElementById('searchJobs');
        const searchJobsButton = document.getElementById('searchJobsButton');

        const filterProfession = document.getElementById('filterProfession');
        const filterProfessionButton = document.getElementById('filterProfessionButton');
        
        filterJobsByAmountButton.addEventListener('click', () => {
            newFetch.fetchLatestJobsByID(filterJobsByAmount.value, filterCounty.value)  
        })
        filterCountyButton.addEventListener('click', () => {
            newFetch.fetchLatestJobsByID(filterJobsByAmount.value, filterCounty.value)
        })
        searchJobsButton.addEventListener('click', () => {
            newFetch.fetchBySearch(searchJobs.value);
        })
        filterProfessionButton.addEventListener('click', () =>{
            newFetch.fetchByProfession(filterProfession.value)
        })
        
    }

    SavedAdsButtonEventlistener() {
      const displaySavedAdsButton = document.getElementById('savedAds');
      displaySavedAdsButton.addEventListener('click', this.newDOM.displaySavedAds)
    } 
}

class Fetch {
    
    fetchLatestJobsByID(rows = 10, ID = 1){
        
        const fetchLatestJobs = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?sida=1&antalrader=${rows}&lanid=${ID}`);
        
        fetchLatestJobs.then((response) => {
            return response.json();
        }).then((fetchLatestJobs) => { 
            newDOM.displayTotalAmoutOfJobs(fetchLatestJobs);
            newDOM.displayListedJobs(fetchLatestJobs);
        }).catch((error) =>{     
            console.log(error);
       })
        
    }

    fetchSingleJobPostById(jobId){
        
        const fetchSingleJobPost = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${jobId}`);
        
        fetchSingleJobPost.then((response) => {
            return response.json();
        }).then((fetchSingleJobPost) => {
           
            let oldUrl = new URL(window.location.href);
            let stringInUrlToDelete ='index.html';
            let url = changeUrl(oldUrl, stringInUrlToDelete);     

            location.assign(`${url}single_job_post.html?id=${jobId}`);
            
        }).catch((error) => {     
            console.log(error);
       })
        
    }
    
    fetchAllCounty(){
        
        const fetchAllCounty = fetch(`http://api.arbetsformedlingen.se/af/v0/arbetsformedling/soklista/lan`);
        
        fetchAllCounty.then((response) => {
            return response.json();
        }).then((allCounties) => { 
            newDOM.displayOptions(allCounties.soklista.sokdata, filterCounty);
        }).catch((error) =>{     
            console.log(error);
       })
    }
    
    fetchSingleJobPostById(jobId){
        
        const fetchSingleJobPost = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${jobId}`);
        
        fetchSingleJobPost.then((response) => {
            return response.json();
        }).then((fetchSingleJobPost) => {
            let url = new URL(window.location.href);
            
            if(url.href.substr(-10) == 'index.html'){
                url = url.href.slice(0, -10);
                location.replace(`${url}single_job_post.html?id=${jobId}`);
            }else{
                location.replace(`${url}single_job_post.html?id=${jobId}`);
            }
        }).catch((error) =>{     
            console.log(error);
       })
        
    }
    
     fetchBySearch(searchValue){
        
        const fetchBySearch = fetch(` http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?nyckelord=${searchValue}`);
        
        fetchBySearch.then((response) => {
            return response.json();
        }).then((searchResults) => { 
            newDOM.displayListedJobs(searchResults);
        }).catch((error) =>{     
            console.log(error);
       })
    }
    
    fetchAllProfessions(){
        
        const fetchProfessions = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden`);
        
        fetchProfessions.then((response) => {
            return response.json();
        }).then((allProfessions) => { 
            newDOM.displayOptions(allProfessions.soklista.sokdata, filterProfession);
        }).catch((error) =>{     
            console.log(error);
       })
    }
    
    fetchByProfession(professionID){
        const fetchProfession = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?yrkesomradeid=${professionID}&sida=1&antalrader=20`);
        
        fetchProfession.then((response) => {
            return response.json();
        }).then((profession) => {
            newDOM.displayListedJobs(profession);
        }).catch((error) =>{     
            console.log(error);
       })
    }
}

class DOM {

	displayTotalAmoutOfJobs(jobs) {

		const amountOfJobsDiv = document.getElementById('amountOfJobs');
		const lan = jobs.matchningslista.matchningdata[0].lan;
		const amountOfJobs = jobs.matchningslista.antal_platsannonser_exakta;

		const amountOfJobsContent = `
            <p> Antal jobb i ${lan}: ${amountOfJobs}
        `;
        
        amountOfJobsDiv.innerHTML=amountOfJobsContent;
        
    }
    
    displayOptions(optionsValue, optionOutput){
        let options = "";
        for(let option of optionsValue) {

            const optionID = option.id;
            const optionName = option.namn;

            options += `<option value="${optionID}">${optionName}</option>`;
        }
        optionOutput.innerHTML = options;
    }
    
    displayListedJobs(jobs){
        
        const outputListJobs = document.getElementById('outputListJobs');
        const jobData = jobs.matchningslista.matchningdata;
        let listedJobs = "";
        outputListJobs.innerHTML = ""
        const jobDataLength = jobData.length;
        
        for(let i = 0; i < jobDataLength; i++){
           const date = jobData[i].sista_ansokningsdag
            //Sending info to the contructor, which formates the data.
            //newDOM.formateDate(jobData[i].sista_ansokningsdag)
            
            let formatedDate = ""
            if(date){
                formatedDate = date.substring(0,10);
            } else {
                formatedDate = "Oklart";
            }
            
            const latestJob = document.createElement('div');
            latestJob.classList.add('latestJobs');
            latestJob.innerHTML = `

                <h3>${jobData[i].annonsrubrik}</h3>
                <p><span>${jobData[i].yrkesbenamning}</span> - ${jobData[i].kommunnamn}</p>
                <p>${jobData[i].arbetsplatsnamn}</p>
                <p>${jobData[i].anstallningstyp}</p>
                <p><span>Sista ansökningsdag:</span> ${formatedDate}</p>
                <button id="${jobData[i].annonsid}">Läs mer!</button>
            `;

			outputListJobs.appendChild(latestJob);

			let readMoreButton = document.getElementById(`${jobData[i].annonsid}`);
			readMoreButton.addEventListener('click', function () {
				newFetch.fetchSingleJobPostById(jobData[i].annonsid);
			});
		}

	}

	displaySavedAds() {
		var savedAds = JSON.parse(localStorage.getItem('adUrlList'));
		console.log(savedAds);
		const savedAdsWrapper = document.createElement('div');
		savedAdsWrapper.innerHTML = `<ul id="savedAdsList"></ul>`;
		const mainElement = document.querySelector('main');
		mainElement.appendChild(savedAdsWrapper);
		for (let adUrl of savedAds) {
			let savedAd = document.createElement('li');
			savedAd.innerHTML = adUrl;
			let savedAdsList = document.getElementById('savedAdsList');
			savedAdsList.appendChild(savedAd);
			
		}
	}

	formateDate(date) {
		console.log(date)
	}

}

//Starts fetch when entering the homepage
const newDOM = new DOM;
const newController = new Controller;
const newFetch = new Fetch;

newController.SavedAdsButtonEventlistener();
newFetch.fetchLatestJobsByID(10, 1);
newFetch.fetchAllCounty();
newController.filterButton();
newFetch.fetchAllProfessions();
