const url = new URL(window.location.href);
const annonsId = url.searchParams.get("id");

class Fetch {
    
    fetchSingleJobPostById(jobId){

        const fetchSingleJobPost = fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${jobId}`);

        fetchSingleJobPost.then((response) => {
            return response.json();
        }).then((fetchSingleJobPost) => {
            newDOM.displaySingleJobPost(fetchSingleJobPost)
        }).catch((error) =>{     
            console.log(error);
       })

    }
}

class DOM {
    
    displaySingleJobPost(jobDetails){
        console.log(jobDetails);

        const outputSingleJobPost = document.getElementById('jobDetails');
        const headline = document.getElementById('headline');

        const singleJobDetails = jobDetails.platsannons.annons;
        const workplaceDetails = jobDetails.platsannons.arbetsplats;
        const employmentConditions = jobDetails.platsannons.villkor;

        const singleJobPost = document.createElement('div');
        singleJobPost.classList.add('jobDetails');
        singleJobPost.innerHTML = `
            <p><strong>${singleJobDetails.yrkesbenamning}</strong> - ${singleJobDetails.kommunnamn}</p>
            <p>${singleJobDetails.annonstext}</p>
            <p>${workplaceDetails.arbetsplatsnamn}</p>
            <p>${singleJobDetails.anstallningstyp}</p>
        `;

		headline.innerHTML = `${singleJobDetails.annonsrubrik}`;
		outputSingleJobPost.appendChild(singleJobPost);

	}
	
	displayUrl(){
		const displayUrl = document.getElementById('displayUrl');
		displayUrl.classList.toggle('hidden');
		displayUrl.value = url;
	}
}

class Save {
	saveAdToBrowser() {
		let saveAdButton = document.getElementById('saveAdButton');
		saveAdButton.addEventListener('click', function () {
			let savedUrls = JSON.parse(localStorage.getItem('adUrlList'));
			if (savedUrls == null) {
			let urlArray =[];
			urlArray.push(url);
			localStorage['adUrlList'] = JSON.stringify(urlArray);
			}
			else {
				savedUrls.push(url);
				localStorage['adUrlList'] = JSON.stringify(savedUrls);
			}
			console.log(savedUrls = JSON.parse(localStorage.getItem('adUrlList')));
			
		})
	}
}

class Controller {
	constructor(){
		this.newDOM = newDOM;
	}
	
	shareButtonEventListener(){
		const shareButton = document.getElementById('shareButton');
		shareButton.addEventListener('click', this.newDOM.displayUrl);
	}
}

const newDOM = new DOM;
const newFetch = new Fetch;

newFetch.fetchSingleJobPostById(annonsId);

const newSave = new Save;
newSave.saveAdToBrowser();

const newController = new Controller;
newController.shareButtonEventListener();
