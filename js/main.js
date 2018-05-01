function changeUrl(url, substringToDelete) {

	let substringLength = substringToDelete.length;
	let newUrl = '';

	if (url.href.substr(-substringLength) === substringToDelete) {
		newUrl = url.href.slice(0, -substringToDelete);
	}

	return newUrl;
}

class Controller {
    
	constructor() {
		this.newDOM = newDOM;
	}

	filterElements() {
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

		const autoCompleteOutput = document.getElementById('autoCompleteOutput');
	}

	filterButtons() {

		this.filterElements();

		filterProfessionButton.addEventListener('click', () => {
            newFetch.fetchList(`/platsannonser/matchning?sida=${1}&antalrader=${filterJobsByAmount.value}&lanid=${filterCounty.value}&yrkesomradeid=${filterProfession.value}`).then(newDOM.displayListed)
		});
		filterCountyButton.addEventListener('click', () => {
            newFetch.fetchList(`/platsannonser/matchning?sida=${1}&antalrader=${filterJobsByAmount.value}&lanid=${filterCounty.value}&yrkesomradeid=${filterProfession.value}`).then(newDOM.displayListed)
		});
		filterJobsByAmountButton.addEventListener('click', () => {
            newFetch.fetchList(`/platsannonser/matchning?sida=${1}&antalrader=${filterJobsByAmount.value}&lanid=${filterCounty.value}&yrkesomradeid=${filterProfession.value}`).then(newDOM.displayListed)
		});

	}

	searchField() {

		this.filterElements();

		searchJobs.addEventListener('keyup', () => {
			if (searchJobs.value.length < 3) {
				autoCompleteOutput.innerHTML = '<p id="autoCompleteMessage">Skriv 3 tecken för att få upp sökförslag</p>';
			} else if (searchJobs.value.length === 3) {
				autoCompleteOutput.innerHTML = '';
                newFetch.fetchList(`/platsannonser/soklista/yrken/${searchJobs.value}`).
                then(newDOM.displayAutoComplete);
			} else{
				// Eller sortera bort förslag 
                newFetch.fetchList(`/platsannonser/matchning?nyckelord=${searchJobs.value}`).
                then(newDOM.displayListed);
			}
		});
	}

	autoCompleteSearch() {

		const searchListItems = document.getElementsByClassName('searchDraft');

		for (let draftItem of searchListItems) {
			draftItem.addEventListener('click', function () {
				autoCompleteOutput.innerHTML = '';
                newFetch.fetchList(`/platsannonser/matchning?nyckelord=${this.id}`).then(newDOM.displayListed)
			});
		}
		document.addEventListener('click', function (event) {
			autoCompleteOutput.innerHTML = ""
		})

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

	fetchList(urlEnding) {
		return fetch(`http://api.arbetsformedlingen.se/af/v0${urlEnding}`)
			.then((response) => response.json())
			.then((result) => {
				const fetchResult = result;
				return fetchResult;
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

	fetchSavedAds(saveAds) {

		let jobArray = [];
		for (let adUrl of saveAds) {
			fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${adUrl}`).then((response) => {
				return response.json();
			}).then((job) => {
				jobArray.push(job)
				newDOM.displaySavedAds(jobArray)
			}).catch((error) => {
				console.log(error);
			})

		}
	}
}

class DOM {
    
	constructor() {
		this.fetch = new Fetch();
	}

//	displayTotalAmountOfJobs( /*jobs, option = ""*/ ) {
//
//		this.fetch.fetchList().then(this.displayAmount);
//	}

//	displayAmount(latestJobs) {
//		const amountOfJobsDiv = document.getElementById('amountOfJobs');
//		const latestJobsList = latestJobs.matchningslista.matchningdata[0].lan;
//		const amountOfJobs = latestJobs.matchningslista.antal_platsannonser_exakta;
//
//		//const amountOfJobsContent = `<p> Antal ${option} jobb i <span>${county}:</span> ${amountOfJobs}`;
//
//		//amountOfJobsDiv.innerHTML = amountOfJobsContent;
//		amountOfJobsDiv.innerHTML = amountOfJobs;
//
//	}

	displayOptions(optionsValue) {
        let optionOutput = ''
        if(optionsValue.soklista.listnamn === 'yrkesomraden'){
            optionOutput = document.getElementById('filterProfession');
        } else {
            optionOutput = document.getElementById('filterCounty');
        }
		let options = '';
		for (let option of optionsValue.soklista.sokdata) {

			const optionID = option.id;
			const optionName = option.namn;

			options += `<option value="${optionID}">${optionName}</option>`;
		}
		optionOutput.innerHTML = options;
	}
    
    displayAutoComplete(autoCompleteWords){

        const autoCompleteUl = document.createElement('ul');
        const autoCompleteOutput = document.getElementById('autoCompleteOutput');
        autoCompleteOutput.appendChild(autoCompleteUl)
        let searchDrafts = '';
        
        if (autoCompleteWords.soklista.totalt_antal_platsannonser === 0){
            let autoCompleteMessage = `<p id="autoCompleteMessage">Inget matchade din sökning, testa igen!</p>`;
            autoCompleteOutput.innerHTML = autoCompleteMessage;
        } else {
            for (let draft of autoCompleteWords.soklista.sokdata) {
                if(draft.antal_platsannonser > 0){
                    searchDrafts += `
                        <li class="searchDraft" id="${draft.namn}">
                            ${draft.namn} 
                            <span>(${draft.antal_platsannonser})</span>
                        </li>
                    `;
                }
            }
            autoCompleteUl.innerHTML=searchDrafts;
            newController.autoCompleteSearch();
        }
    }

//	displayLatestJobs(urlEnding) {
//		const pagination = new Controller();
//		this.fetch.fetchList(urlEnding).then(this.displayListed)//.then(pagination.paginationButtons);
//
//	}

	displayListed(latestJobs) {

		const outputListJobs = document.getElementById('outputListJobs');
		const jobData = latestJobs.matchningslista.matchningdata;
		let listedJobs = '';
		outputListJobs.innerHTML = '';
		const jobDataLength = jobData.length;

		for (let i = 0; i < jobDataLength; i++) {
            
			const date = jobData[i].sista_ansokningsdag;
			let formatedDate = '';
			if (!date) {
				formatedDate = 'Öppen';
			} else {
				formatedDate = date.substring(0, 10);
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

//	displayLatestJobsByParam(professionID, countyID, rows, pageNumber) {
//		this.fetch.fetchLatestJobsByParam(professionID, countyID, rows, pageNumber).then(this.displayListed);
//	}

	displaySavedAds(jobArray) {
		const outputSavedJobs = document.getElementById('outputSavedJobs');
		outputSavedJobs.innerHTML = '';
		const savedAdsList = document.createElement('ul');
		const jobDataLength = jobArray.length;

		for (let i = 0; i < jobDataLength; i++) {
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

//	displayPageNumber() {
//		this.fetch.fetchList().then(this.paginering);
//	}

//	paginering(latestJobs, pageNumber = 1) {
//		//Function not done
//		const pageNumberDiv = document.getElementById('pageNumber');
//		pageNumberDiv.innerHTML = `${pageNumber} av ${latestJobs.matchningslista.antal_sidor}`;
//	}

}

const newDOM = new DOM;
const newController = new Controller;
const newFetch = new Fetch;

//newDOM.displayTotalAmountOfJobs();
//newDOM.displayPageNumber();
//newDOM.displayOptions(allCounties.soklista.sokdata, filterCounty)

newController.SavedAdsButtonEventlistener();
newController.filterButtons();
newController.searchField();

//Starts fetch when entering the homepage
newFetch.fetchList(`/platsannonser/soklista/yrkesomraden`).then(newDOM.displayOptions);
newFetch.fetchList(`/arbetsformedling/soklista/lan`).then(newDOM.displayOptions);
newFetch.fetchList(`/platsannonser/matchning?sida=1&antalrader=10&lanid=1`).then(newDOM.displayListed);