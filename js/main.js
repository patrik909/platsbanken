function changeUrl(url, substringToDelete) {

    let substringLength = substringToDelete.length;
    let newUrl = '';

    if (url.href.substr(-substringLength) === substringToDelete) {
        newUrl = url.href.slice(0, -substringToDelete);
    }

    return newUrl;
}

class Init {
    launch() {
        newController.checkUrlEnding();
        //Initializing of search functionality 
        newController.filterButton();
        newController.searchField();
        newController.shareListing();
        newController.savedAdsButtonEventlistener();
        //Fetching values for options in filter.
        newFetch.fetchList(`/platsannonser/soklista/yrkesomraden`).then(newDOM.displayFilterOptions);
        newFetch.fetchList(`/arbetsformedling/soklista/lan`).then(newDOM.displayFilterOptions).then(newController.countyDropdownEventlistener);

        let countyID = (new URL(document.location)).searchParams.get('lanid');
        console.log(countyID)

        newFetch.fetchList(`/platsannonser/soklista/kommuner?lanid=${countyID}`).then(newDOM.displayFilterOptions)


    }
}

class Controller {
    addToUrl(newUrlEnding) {
        window.history.replaceState(null, null, newUrlEnding);
    }

    checkUrlEnding() {
        const urlFetchInfo = '?';

        if (url.includes('annonsid')) {
            let jobId = (new URL(document.location)).searchParams.get('annonsid');

            newFetch.fetchList(`/platsannonser/${jobId}`).
            then(newDOM.displaySingleJobPost);
        } else if (url.includes(urlFetchInfo)) {
            const firstIndexOfUrlEnding = url.indexOf("?");
            const lastIndexOfUrlEnding = url.length;
            const urlEnding = url.substring(firstIndexOfUrlEnding, lastIndexOfUrlEnding);

            newController.addToUrl(urlEnding);
            newFetch.fetchList(`/platsannonser/matchning${urlEnding}`).
            then(newDOM.displayListed);
        } else {
            //If entering the page with index.html only. Add Stockholm fetch info to url.
            location.replace(url + `?sida=1&antalrader=10&lanid=1`);
        }
    }

    filterElements() {
        const filterProfession = document.getElementById('filterProfession');
        const filterTown = document.getElementById('filterTown');
        const filterCounty = document.getElementById('filterCounty');
        const filterJobsByAmount = document.getElementById('filterJobsByAmount');
        const filterButton = document.getElementById('filterButton');
    }

    filterButton() {
        this.filterElements();

        filterButton.addEventListener('click', () => {
            location.reload();
            
            if (url.includes("kommunid")){
            newController.addToUrl(`?sida=1&antalrader=${filterJobsByAmount.value}&lanid=${filterCounty.value}&yrkesomradeid=${filterProfession.value}&kommunid=${filterTown.value}`);
            } else {
            newController.addToUrl(`?sida=1&antalrader=${filterJobsByAmount.value}&lanid=${filterCounty.value}&yrkesomradeid=${filterProfession.value}`);
            }
        });
    }

    searchElements() {
        const searchJobsInput = document.getElementById('searchJobsInput');
        const searchJobsButton = document.getElementById('searchJobsButton');
        const autoCompleteOutput = document.getElementById('autoCompleteOutput');
    }

    searchField() {
        this.searchElements();

        searchJobsInput.addEventListener('keyup', () => {
            if (searchJobsInput.value.length < 3) {
                autoCompleteOutput.innerHTML = '<p id="autoCompleteMessage">Skriv 3 tecken för att få upp sökförslag</p>';
            } else if (searchJobsInput.value.length === 3) {
                autoCompleteOutput.innerHTML = '';
                newFetch.fetchList(`/platsannonser/soklista/yrken/${searchJobsInput.value}`).
                then(newDOM.displayAutoComplete);
            }
        });
    }

    autoCompleteSearch() {
        const searchListItems = document.getElementsByClassName('searchDraft');

        for (let draftItem of searchListItems) {
            draftItem.addEventListener('click', function () {
                autoCompleteOutput.innerHTML = '';
                location.reload();
                newController.addToUrl(`?sida=1&antalrader=10&nyckelord=${this.id}`);
            });
        }
        document.addEventListener('click', () => {
            //Closes the autoCompleteDiv if user clicks outside the div.
            autoCompleteOutput.innerHTML = '';
        })

    }

    paginationButtons(totalPageNumbers) {
        const currentPageNumber = (new URL(document.location)).searchParams.get("sida");
        const firstIndexOfUrlEnding = url.indexOf("antalrader") + 11;
        const lastIndexOfUrlEnding = url.length;
        const urlEnding = url.substring(firstIndexOfUrlEnding, lastIndexOfUrlEnding);

        const previousPageButton = document.getElementById('previousPage');
        const nextPageButton = document.getElementById('nextPage');

        previousPageButton.addEventListener('click', () => {
            if (Number(currentPageNumber) >= 2) {
                let prevPageNumber = Number(currentPageNumber) - 1;
                location.reload();
                newController.addToUrl(`?sida=${prevPageNumber}&antalrader=${urlEnding}`);
            }
        })
        nextPageButton.addEventListener('click', () => {
            if (Number(currentPageNumber) < totalPageNumbers) {
                let nextPageNumber = Number(currentPageNumber) + 1;
                location.reload();
                newController.addToUrl(`?sida=${nextPageNumber}&antalrader=${urlEnding}`);
            }
        })
    }

    shareListing() {
        const shareListingButton = document.getElementById('shareListingButton');
        const outputShareListing = document.getElementById('outputShareListing');

        shareListingButton.addEventListener('click', () => {
            outputShareListing.innerHTML = window.location.href;
        });
    }

    savedAdsButtonEventlistener() {
        const displaySavedAdsButton = document.getElementById('savedAds');

        displaySavedAdsButton.addEventListener('click', () => {
            let savedAds = JSON.parse(localStorage.getItem('jobList'));
            newFetch.fetchSavedAds(savedAds)
        })
    }

    shareButtonEventListener() {
        const shareButton = document.getElementById('shareButton');

        shareButton.addEventListener('click', newDOM.displayUrl);
    }

    countyDropdownEventlistener() {
        
        const filterTown = document.getElementById('filterTown');
        const filterCounty = document.getElementById('filterCounty');
        filterCounty.addEventListener('change', function() {
            filterTown.classList.remove('hidden');
            newFetch.fetchList(`/platsannonser/soklista/kommuner?lanid=${filterCounty.value}`).then(newDOM.displayFilterOptions)
        })
    }
}

class Save {
    saveAdToBrowser(id) {

        let savedJobId = JSON.parse(localStorage.getItem('jobList'));

        if (savedJobId === null) {
            let jobIdArray = [];
            jobIdArray.push(id);
            localStorage.setItem('jobList', JSON.stringify(jobIdArray));
        } else {
            savedJobId.push(id);
            localStorage.setItem('jobList', JSON.stringify(savedJobId));
        }
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

    displayAmountOfJobs(latestJobs) {
        const amountOfJobsDiv = document.getElementById('amountOfJobs');
        const county = latestJobs.matchningslista.matchningdata[0].lan;
        const amountOfJobs = latestJobs.matchningslista.antal_platsannonser;

        let word = 'matchade jobb';
        if (!url.includes('nyckelord')) {
            word = `jobb i ${county}`;
        }

        const amountOfJobsContent = `<p> Antal ${word}: ${amountOfJobs}`;
        amountOfJobsDiv.innerHTML = amountOfJobsContent;
    }

    displayFilterOptions(optionsValue) {
        let optionOutput = ''
        let optionsToList = optionsValue.soklista.listnamn
        let options = '';

        for (let option of optionsValue.soklista.sokdata) {
            const optionID = option.id;
            const optionName = option.namn;

            options += `<option class="townItem" value="${optionID}">${optionName}</option>`;
        }

        if (optionsToList === 'yrkesomraden') {
            optionOutput = document.getElementById('filterProfession');
            optionOutput.innerHTML = options;
        } else if (optionsToList === 'lan') {
            optionOutput = document.getElementById('filterCounty');
            optionOutput.innerHTML = options;
            
            const townButton = document.getElementsByClassName('townItem');
    
             let countyID = (new URL(document.location)).searchParams.get('lanid');

            for (let i = 0; i < townButton.length; i++) {
                if(townButton[i].value === countyID){
                    townButton[i].setAttribute('selected', 'selected')
                }
            } 
        } else {

            optionOutput = document.getElementById('filterTown');
            optionOutput.innerHTML = '<option class="townItem" value="allCounty">Hela länet</option>' + options;
        }

    }

    displayAutoComplete(autoCompleteWords) {

        const autoCompleteUl = document.createElement('ul');
        const autoCompleteOutput = document.getElementById('autoCompleteOutput');
        autoCompleteOutput.appendChild(autoCompleteUl)
        let searchDrafts = '';

        if (autoCompleteWords.soklista.totalt_antal_platsannonser === 0) {
            let autoCompleteMessage = `<p id="autoCompleteMessage">Inget matchade din sökning, testa igen!</p>`;
            autoCompleteOutput.innerHTML = autoCompleteMessage;
        } else {
            for (let draft of autoCompleteWords.soklista.sokdata) {
                if (draft.antal_platsannonser > 0) {
                    searchDrafts += `
                        <li class="searchDraft" id="${draft.namn}">
                            ${draft.namn} 
                            <span>(${draft.antal_platsannonser})</span>
                        </li>
                    `;
                }
            }
            autoCompleteUl.innerHTML = searchDrafts;
            newController.autoCompleteSearch();
        }
    }

    displayListed(latestJobs) {
        const outputListJobs = document.getElementById('outputListJobs');

        if (latestJobs.matchningslista.antal_platsannonser) {
            newDOM.displayAmountOfJobs(latestJobs);

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
                    location.reload();
                    newController.addToUrl(`?annonsid=${jobData[i].annonsid}`)
                });
            }
        } else {
            outputListJobs.innerHTML = 'Inga matchade jobb';
        }

        newDOM.pagination(latestJobs)
    }

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
                location.reload();
                newController.addToUrl(`?annonsid=${saveAd.annonsid}`);
            });
        }
    }

    pagination(latestJobs) {
        const currentPageNumber = (new URL(document.location)).searchParams.get("sida");
        const pageNumberDiv = document.getElementById('pageNumber');
        const totalAmountOfPages = latestJobs.matchningslista.antal_sidor

        pageNumberDiv.innerHTML = `${currentPageNumber} av ${latestJobs.matchningslista.antal_sidor}`;
        newController.paginationButtons(totalAmountOfPages);
    }

    displaySingleJobPost(jobDetails) {

        const outputSingleJobPost = document.getElementById('jobDetails');
        const headline = document.getElementById('headline');

        const singleJobDetails = jobDetails.platsannons.annons;
        const workplaceDetails = jobDetails.platsannons.arbetsplats;
        const employmentConditions = jobDetails.platsannons.villkor;
        const jobId = jobDetails.platsannons.annons.annonsid;
        outputListJobs.innerHTML = `
            <div class="jobDetails">
                <button id="shareButton">Dela</button>
                <input id="displayUrl" class="hidden" value="" />
                <button id='saveAdButton' data-id='${jobId}'>Spara</button>
                <button id="backButton">Tillbaka</button>
                <h2>${singleJobDetails.annonsrubrik}</h2>
                <p><strong>${singleJobDetails.yrkesbenamning}</strong> - ${singleJobDetails.kommunnamn}</p>
                <p>${singleJobDetails.annonstext}</p>
                <p>${workplaceDetails.arbetsplatsnamn}</p>
                <p>${singleJobDetails.anstallningstyp}</p>
            </div>
        `;

        let backButton = document.getElementById('backButton');
        backButton.addEventListener('click', function () {
            //BAck button
        })
        let saveAdButton = document.getElementById('saveAdButton');
        saveAdButton.addEventListener('click', function () {
            newSave.saveAdToBrowser(this.dataset.id);
        })

        newController.shareButtonEventListener();

    }

    displayUrl() {
        const displayUrl = document.getElementById('displayUrl');
        displayUrl.classList.toggle('hidden');
        displayUrl.value = url;
    }

}
const url = window.location.href;
const newDOM = new DOM;
const newSave = new Save;
const newController = new Controller;
const newFetch = new Fetch;

const newInit = new Init;

//Starts fetch when entering the homepage
newInit.launch();