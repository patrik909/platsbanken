function changeUrl(url, substringToDelete) {

	let substringLength = substringToDelete.length;
	let newUrl = '';

	if (url.href.substr(-substringLength) == substringToDelete) {
		newUrl = url.href.slice(0, -substringToDelete);
	}

	return newUrl;
}


class Fetch {

	fetchLatestJobsByID(ID) {

		const fetchLatestJobs = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?sida=1&antalrader=10&lanid=${ID}`);

		fetchLatestJobs.then((response) => {
			return response.json();
		}).then((fetchLatestJobs) => {
			newDOM.displayTotalAmoutOfJobs(fetchLatestJobs);
			newDOM.displayLatestJobs(fetchLatestJobs);
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

	fetchSingleJobPostById(jobId) {

		const fetchSingleJobPost = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${jobId}`);

		fetchSingleJobPost.then((response) => {
			return response.json();
		}).then((fetchSingleJobPost) => {
			let url = new URL(window.location.href);

			if (url.href.substr(-10) == 'index.html') {
				url = url.href.slice(0, -10);
				location.replace(`${url}single_job_post.html?id=${jobId}`);
			} else {
				location.replace(`${url}single_job_post.html?id=${jobId}`);
			}

		}).catch((error) => {
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

		amountOfJobsDiv.innerHTML = amountOfJobsContent;

	}

	displayLatestJobs(jobs) {

		const outputListJobs = document.getElementById('outputListJobs');
		const jobData = jobs.matchningslista.matchningdata;
		let listedJobs = "";

		for (let i = 0; i < jobData.length; i++) {
			const date = jobData[i].sista_ansokningsdag
			//Sending info to the contructor, which formates the data.
			//newDOM.formateDate(jobData[i].sista_ansokningsdag)

			let formatedDate = ""
			if (date) {
				formatedDate = date.substring(0, 10);
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

class Controller {
	constructor() {
		this.newDOM = newDOM;
	}

	SavedAdsButtonEventlistener() {
		const displaySavedAdsButton = document.getElementById('savedAds');
		displaySavedAdsButton.addEventListener('click', this.newDOM.displaySavedAds)
	}
}



//Starts fetch when entering the homepage
const newDOM = new DOM;
const newFetch = new Fetch;
newFetch.fetchLatestJobsByID(1);

const newController = new Controller;
newController.SavedAdsButtonEventlistener();