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
            <p class="jobUrl">${singleJobDetails.platsannonsUrl}</p>
            <p>${singleJobDetails.annonstext}</p>
            <p>${workplaceDetails.arbetsplatsnamn}</p>
            <p>${singleJobDetails.anstallningstyp}</p>
        `;

        headline.innerHTML = `${singleJobDetails.annonsrubrik}`;
        outputSingleJobPost.appendChild(singleJobPost);

    }
}

const newDOM = new DOM;
const newFetch = new Fetch;
newFetch.fetchSingleJobPostById(annonsId);