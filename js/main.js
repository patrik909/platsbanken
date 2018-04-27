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

        const filterProfession = document.getElementById('filterProfession');
        const filterCounty = document.getElementById('filterCounty');
        const filterJobsByAmount = document.getElementById('filterJobsByAmount');  
        const searchJobs = document.getElementById('searchJobs');
        
        const filterJobsByAmountButton = document.getElementById('filterJobsByAmountButton');
        const filterCountyButton = document.
        getElementById('filterCountyButton');
        const searchJobsButton = document.
        getElementById('searchJobsButton');
        const filterProfessionButton = document.
        getElementById('filterProfessionButton');
        
        filterProfessionButton.addEventListener('click', () => {
            newFetch.fetchLatestJobsByParam(filterProfession.value, filterCounty.value, filterJobsByAmount.value);
        });
        filterCountyButton.addEventListener('click', () => {
            newFetch.fetchLatestJobsByParam(filterProfession.value, filterCounty.value, filterJobsByAmount.value);
        });
        filterJobsByAmountButton.addEventListener('click', () => {
            newFetch.fetchLatestJobsByParam(filterProfession.value, filterCounty.value, filterJobsByAmount.value);
        });
        searchJobsButton.addEventListener('click', () => {
            newFetch.fetchBySearch(searchJobs.value);
        });

    }

    SavedAdsButtonEventlistener() {

      const displaySavedAdsButton = document.getElementById('savedAds');
      displaySavedAdsButton.addEventListener('click', () => {
          let savedAds = JSON.parse(localStorage.getItem('jobList'));
          newFetch.fetchSavedAds(savedAds)
      })
        
    }
}

class Fetch {
    
    fetchLatestJobs(countyID = 1, rows = 10) {

        const fetchLatestJobs = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?sida=1&antalrader=${rows}&lanid=${countyID}`);

        fetchLatestJobs.then((response) => {
            return response.json();
        }).then((fetchLatestJobs) => {
            newDOM.displayTotalAmoutOfJobs(fetchLatestJobs);
            newDOM.displayListedJobs(fetchLatestJobs);
        }).catch((error) => {
            console.log(error);
        })

    }

    fetchLatestJobsByParam(professionID, countyID, rows) {

        const fetchLatestJobs = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?sida=1&antalrader=${rows}&lanid=${countyID}&yrkesomradeid=${professionID}`);

        fetchLatestJobs.then((response) => {
            return response.json();
        }).then((fetchLatestJobs) => {
            let option = "matchade";
            newDOM.displayTotalAmoutOfJobs(fetchLatestJobs, option);
            newDOM.displayListedJobs(fetchLatestJobs);
        }).catch((error) => {
            console.log(error);
        })

    }

    fetchSingleJobPostById(jobId) {

        const fetchSingleJobPost = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${jobId}`);

        fetchSingleJobPost.then((response) => {
            return response.json();
        }).then((fetchSingleJobPost) => {

            let oldUrl = new URL(window.location.href);
            let stringInUrlToDelete = 'index.html';
            let url = changeUrl(oldUrl, stringInUrlToDelete);

            location.assign(`${url}single_job_post.html?id=${jobId}`);

        }).catch((error) => {
            console.log(error);
        })

    }

    fetchAllCounty() {

        const fetchAllCounty = fetch(`http://api.arbetsformedlingen.se/af/v0/arbetsformedling/soklista/lan`);

        fetchAllCounty.then((response) => {
            return response.json();
        }).then((allCounties) => {
            newDOM.displayOptions(allCounties.soklista.sokdata, filterCounty);
        }).catch((error) => {
            console.log(error);
        })
    }

    fetchBySearch(searchValue) {

        const fetchBySearch = fetch(` http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?nyckelord=${searchValue}`);

        fetchBySearch.then((response) => {
            return response.json();
        }).then((searchResults) => {
            newDOM.displayListedJobs(searchResults);
        }).catch((error) => {     
            console.log(error);
        })
    }

    fetchAllProfessions() {

        const fetchProfessions = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden`);

        fetchProfessions.then((response) => {
            return response.json();
        }).then((allProfessions) => {
            newDOM.displayOptions(allProfessions.soklista.sokdata, filterProfession);
        }).catch((error) => {
            console.log(error);
        })
    }
  
    fetchSavedAds(saveAds){
        
        let jobArray = [];
        for (let adUrl of saveAds) {
                fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${adUrl}`).then((response) => {
                return response.json();
            }).then((job) => {
                jobArray.push(job)
                newDOM.displaySavedAds(jobArray)
            }).catch((error) =>{     
                console.log(error);
            })
            
        }
    }
    
}

class DOM {

	displayTotalAmoutOfJobs(jobs, option = "") {

		const amountOfJobsDiv = document.getElementById('amountOfJobs');
		const lan = jobs.matchningslista.matchningdata[0].lan;
		const amountOfJobs = jobs.matchningslista.antal_platsannonser_exakta;
		const amountOfJobsContent = `<p> Antal ${option} jobb i <span>${lan}:</span> ${amountOfJobs}`;
        
        amountOfJobsDiv.innerHTML=amountOfJobsContent;
        
    }
    
    displayOptions(optionsValue, optionOutput){
        let options = '';
        for(let option of optionsValue) {

            const optionID = option.id;
            const optionName = option.namn;

            options += `<option value="${optionID}">${optionName}</option>`;
        }
        optionOutput.innerHTML = options;
    }

    displayListedJobs(jobs) {

        const outputListJobs = document.getElementById('outputListJobs');
        const jobData = jobs.matchningslista.matchningdata;
        let listedJobs = '';
        outputListJobs.innerHTML = '';
        const jobDataLength = jobData.length;

        for(let i = 0; i < jobDataLength; i++){
           const date = jobData[i].sista_ansokningsdag;
            //Sending info to the contructor, which formates the data.
            //newDOM.formateDate(jobData[i].sista_ansokningsdag)
            
            let formatedDate = '';
            if(!date) {
                formatedDate = 'Öppen';
            } else {
                formatedDate = date.substring(0,10);
            }

           const latestJob = document.createElement('div');
            latestJob.classList.add('latestJobs');
            latestJob.innerHTML = `
                <h3>${jobData[i].annonsrubrik}</h3>
                <p><span>${jobData[i].yrkesbenamning}</span> - ${jobData[i].kommunnamn}</p>
                <p>${jobData[i].arbetsplatsnamn}</p>
                <p>${jobData[i].anstallningstyp}</p>
                <p><span>Sista ansökningsdag:</span> ${formatedDate}</p>
                <button type="button" id="${jobData[i].annonsid}">Läs mer!</button>
            `;

			outputListJobs.appendChild(latestJob);

			let readMoreButton = document.getElementById(`${jobData[i].annonsid}`);
			readMoreButton.addEventListener('click', () => {
				newFetch.fetchSingleJobPostById(jobData[i].annonsid);
			});
		}
	}
    
	displaySavedAds(jobArray) {
        const outputSavedJobs = document.getElementById('outputSavedJobs');
        outputSavedJobs.innerHTML = '';
        const savedAdsList = document.createElement('ul');
        const jobDataLength = jobArray.length;        
        
        for(let i = 0; i < jobDataLength; i++){
            const listElement = document.createElement('li');
            let saveAd = jobArray[i].platsannons.annons;
            
            listElement.innerHTML = `${saveAd.annonsrubrik}<button id='savedAd${saveAd.annonsid}'>Läs mer!</button>`;
            
            savedAdsList.appendChild(listElement);
            outputSavedJobs.appendChild(savedAdsList);
        
			let savedAdButton = document.getElementById(`savedAd${saveAd.annonsid}`);
			savedAdButton.addEventListener('click', function () {
                newFetch.fetchSingleJobPostById(`${saveAd.annonsid}`);
			});
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
newFetch.fetchLatestJobs();
newFetch.fetchAllCounty();
newController.filterButton();
newFetch.fetchAllProfessions();