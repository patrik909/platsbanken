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
        const jobId = jobDetails.platsannons.annons.annonsid;

        const singleJobPost = document.createElement('div');
        singleJobPost.classList.add('jobDetails');
        singleJobPost.innerHTML = `
            <button id='saveAdButton' data-id='${jobId}'>Spara</button>
            <p><strong>${singleJobDetails.yrkesbenamning}</strong> - ${singleJobDetails.kommunnamn}</p>
            <p>${singleJobDetails.annonstext}</p>
            <p>${workplaceDetails.arbetsplatsnamn}</p>
            <p>${singleJobDetails.anstallningstyp}</p>
        `;

		headline.innerHTML = `${singleJobDetails.annonsrubrik}`;
		outputSingleJobPost.appendChild(singleJobPost);
        
        let saveAdButton = document.getElementById('saveAdButton');
		saveAdButton.addEventListener('click', function () {
            console.log(this.dataset.id);
            
            let savedJobId = JSON.parse(localStorage.getItem('jobList'));
            
			if (savedJobId == null) {
                let jobIdArray = [];
                jobIdArray.push(this.dataset.id);
                localStorage.setItem('jobList', JSON.stringify(jobIdArray));
                
			}
			else {
                savedJobId.push(this.dataset.id);
                localStorage.setItem('jobList', JSON.stringify(savedJobId));
			}
            
            
        })

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
            console.log(this.dataset.track);
//			let savedJobId = JSON.parse(localStorage.getItem('jobList'));
//			if (savedJobId == null) {
//                let urlArray = [];
//                urlArray.push(this.dataset.track);
//                localStorage['jobList'] = JSON.stringify(urlArray);
//			}
//			else {
//				savedJobId.push(url);
//				localStorage['jobList'] = JSON.stringify(savedJobId);
//			}
//			console.log(savedJobId = JSON.parse(localStorage.getItem('jobList')));
//			
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

//const newSave = new Save;
//newSave.saveAdToBrowser();

const newController = new Controller;
newController.shareButtonEventListener();
