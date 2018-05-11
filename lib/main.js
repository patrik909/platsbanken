'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Init = function () {
    function Init() {
        _classCallCheck(this, Init);
    }

    _createClass(Init, [{
        key: 'launch',
        value: function launch() {
            newController.checkUrlEnding();
            //Initializing of search functionality 
            newController.filterByOptions();
            newController.searchField();
            newController.shareSearchResult();
            newController.savedAdsButtonEventlistener();
            //Fetching values for options in filter.
            newFetch.fetchList('/platsannonser/soklista/yrkesomraden').then(newDOM.displayFilterOptions);
            newFetch.fetchList('/arbetsformedling/soklista/lan').then(newDOM.displayFilterOptions).then(newController.countyDropdownEventlistener);

            var countyID = new URL(document.location).searchParams.get('lanid');
            if (!countyID) {
                // Sets default value for town options, if there is no 'lanid' info in url.
                countyID = 10;
            }
            newFetch.fetchList('/platsannonser/soklista/kommuner?lanid=' + countyID).then(newDOM.displayFilterOptions);
        }
    }]);

    return Init;
}();

var Controller = function () {
    function Controller() {
        _classCallCheck(this, Controller);
    }

    _createClass(Controller, [{
        key: 'addToUrl',
        value: function addToUrl(newUrlEnding) {
            window.history.replaceState(null, null, newUrlEnding);
        }

        // Delays reloading needed for the application to work in Firefox and Safari

    }, {
        key: 'delayReload',
        value: function delayReload() {
            setTimeout(function () {
                window.location.reload();
            }, 500);
        }
    }, {
        key: 'formatDate',
        value: function formatDate(date) {
            var formatedDate = '';
            if (!date) {
                formatedDate = 'Öppen';
            } else {
                formatedDate = date.substring(0, 10);
            }
            return formatedDate;
        }
    }, {
        key: 'checkUrlEnding',
        value: function checkUrlEnding() {
            // Separates url from query parameters
            var urlSeparator = '?';

            if (url.includes('annonsid')) {
                var jobId = new URL(document.location).searchParams.get('annonsid');

                newFetch.fetchList('/platsannonser/' + jobId).then(newDOM.displaySingleJobPost);
            } else if (url.includes(urlSeparator)) {
                var firstIndexOfUrlEnding = url.indexOf(urlSeparator);
                var lastIndexOfUrlEnding = url.length;
                var urlEnding = url.substring(firstIndexOfUrlEnding, lastIndexOfUrlEnding);

                newController.addToUrl(urlEnding);
                newFetch.fetchList('/platsannonser/matchning' + urlEnding).then(newDOM.displayListed);
            } else {
                //If entering the page with index.html only. Add Stockholm fetch info to url.
                location.replace(url + '?sida=1&antalrader=10&lanid=1');
            }
        }
    }, {
        key: 'filterElements',
        value: function filterElements() {
            var filterProfession = document.getElementById('filterProfession');
            var filterTown = document.getElementById('filterTown');
            var filterCounty = document.getElementById('filterCounty');
            var filterJobsByAmount = document.getElementById('filterJobsByAmount');
            var filterButton = document.getElementById('filterButton');
        }
    }, {
        key: 'filterByOptions',
        value: function filterByOptions() {
            this.filterElements();
            filterButton.addEventListener('click', function () {
                newController.delayReload();
                if (Number(filterTown.value) > 0) {
                    newController.addToUrl('?sida=1&antalrader=' + filterJobsByAmount.value + '&lanid=' + filterCounty.value + '&yrkesomradeid=' + filterProfession.value + '&kommunid=' + filterTown.value);
                } else {
                    newController.addToUrl('?sida=1&antalrader=' + filterJobsByAmount.value + '&lanid=' + filterCounty.value + '&yrkesomradeid=' + filterProfession.value);
                }
            });
        }
    }, {
        key: 'searchFieldElements',
        value: function searchFieldElements() {
            var searchFieldInput = document.getElementById('searchFieldInput');
            var searchFieldButton = document.getElementById('searchFieldButton');
            var autoCompleteOutput = document.getElementById('autoCompleteOutput');
        }
    }, {
        key: 'searchField',
        value: function searchField() {
            this.searchFieldElements();

            searchFieldInput.addEventListener('keyup', function () {
                if (searchFieldInput.value.length < 3) {
                    autoCompleteOutput.innerHTML = '<p id="autoCompleteMessage">Skriv 3 tecken för att få upp sökförslag</p>';
                } else if (searchFieldInput.value.length === 3) {
                    autoCompleteOutput.innerHTML = '';
                    newFetch.fetchList('/platsannonser/soklista/yrken/' + searchFieldInput.value).then(newDOM.displayAutoComplete);
                }
            });

            searchFieldButton.addEventListener('click', function () {
                if (searchFieldInput.value) {
                    newController.delayReload();
                    newController.addToUrl('?sida=1&antalrader=10&nyckelord=' + searchFieldInput.value);
                }
            });

            searchFieldInput.addEventListener('keydown', function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    if (searchFieldInput.value.length > 2) {
                        /* Enables enter but still need the preventDefault to prevent
                           user from sending bad values in to the url */
                        newController.delayReload();
                        newController.addToUrl('?sida=1&antalrader=10&nyckelord=' + searchFieldInput.value);
                    }
                }
            });
        }
    }, {
        key: 'autoCompleteSearch',
        value: function autoCompleteSearch() {
            var searchListItems = document.getElementsByClassName('searchDraft');

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = searchListItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var suggestedItem = _step.value;

                    suggestedItem.addEventListener('click', function () {
                        autoCompleteOutput.innerHTML = '';
                        newController.delayReload();
                        newController.addToUrl('?sida=1&antalrader=10&nyckelord=' + this.id);
                    });
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            document.addEventListener('click', function () {
                //Closes the autoCompleteDiv if user clicks outside the div.
                autoCompleteOutput.innerHTML = '';
            });
        }
    }, {
        key: 'paginationButtons',
        value: function paginationButtons(totalPageNumbers) {
            var currentPageNumber = new URL(document.location).searchParams.get('sida');
            var firstIndexOfUrlEnding = url.indexOf('antalrader') + 11;
            var lastIndexOfUrlEnding = url.length;
            var urlEnding = url.substring(firstIndexOfUrlEnding, lastIndexOfUrlEnding);

            var previousPageButton = document.getElementById('previousPage');
            var nextPageButton = document.getElementById('nextPage');

            previousPageButton.addEventListener('click', function () {
                if (Number(currentPageNumber) >= 2) {
                    var prevPageNumber = Number(currentPageNumber) - 1;
                    newController.delayReload();
                    newController.addToUrl('?sida=' + prevPageNumber + '&antalrader=' + urlEnding);
                }
            });
            nextPageButton.addEventListener('click', function () {
                if (Number(currentPageNumber) < totalPageNumbers) {
                    var nextPageNumber = Number(currentPageNumber) + 1;
                    newController.delayReload();
                    newController.addToUrl('?sida=' + nextPageNumber + '&antalrader=' + urlEnding);
                }
            });
        }
    }, {
        key: 'closePopup',
        value: function closePopup() {
            window.onclick = function (event) {
                if (event.target === savedJobsPopupBackground || event.target === sharePopupBackground || event.target === errorMessagePopupBackground) {
                    savedJobsPopupBackground.style.display = 'none';
                    sharePopupBackground.style.display = 'none';
                    errorMessagePopupBackground.style.display = 'none';
                }
            };
        }
    }, {
        key: 'shareSearchResult',
        value: function shareSearchResult() {
            var shareSearchResultButton = document.getElementById('shareSearchResultButton');
            shareSearchResultButton.addEventListener('click', newDOM.displayUrl);
        }
    }, {
        key: 'savedAdsButtonEventlistener',
        value: function savedAdsButtonEventlistener() {
            var displaySavedAdsButton = document.getElementById('savedAds');

            displaySavedAdsButton.addEventListener('click', function () {
                var savedAds = JSON.parse(localStorage.getItem('savedJobsList'));
                newFetch.fetchSavedAds(savedAds);
                outputSavedJobs.style.display = 'block';
                var savedJobsPopupBackground = document.getElementById('savedJobsPopupBackground');
                savedJobsPopupBackground.style.display = 'flex';

                newController.closePopup();
            });
        }
    }, {
        key: 'clearLocalStorageButtonEventlistener',
        value: function clearLocalStorageButtonEventlistener() {
            document.addEventListener('click', function (event) {
                var clickedElem = event.target;

                if (clickedElem.id !== 'clearButton') {
                    return;
                } else {
                    localStorage.removeItem('savedJobsList');
                    var _outputSavedJobs = document.getElementById('outputSavedJobs');
                    _outputSavedJobs.innerText = 'Annonserna är borttagna!';
                }
            }, false);
        }
    }, {
        key: 'countyDropdownEventlistener',
        value: function countyDropdownEventlistener() {
            var filterTown = document.getElementById('filterTown');
            var filterCounty = document.getElementById('filterCounty');
            filterCounty.addEventListener('change', function () {
                newFetch.fetchList('/platsannonser/soklista/kommuner?lanid=' + filterCounty.value).then(newDOM.displayFilterOptions);
            });
        }
    }, {
        key: 'showSingleJobEventListener',
        value: function showSingleJobEventListener() {
            var outputListJobs = document.getElementById('outputListJobs');
            var countyID = new URL(document.location).searchParams.get('lanid');
            outputListJobs.addEventListener('click', function (event) {
                var clickedElem = event.target;

                if (clickedElem.className !== 'readMoreButton') {
                    return;
                } else {
                    newController.delayReload();
                    newController.addToUrl('?annonsid=' + clickedElem.id + '&lanid=' + countyID);
                }
            }, false);
        }
    }]);

    return Controller;
}();

var Save = function () {
    function Save() {
        _classCallCheck(this, Save);
    }

    _createClass(Save, [{
        key: 'saveAdToBrowser',
        value: function saveAdToBrowser(id) {
            var savedJobId = JSON.parse(localStorage.getItem('savedJobsList'));

            if (savedJobId === null) {
                var jobIdArray = [];
                jobIdArray.push(id);
                localStorage.setItem('savedJobsList', JSON.stringify(jobIdArray));
            } else {
                if (!savedJobId.includes(id)) {
                    savedJobId.push(id);
                    localStorage.setItem('savedJobsList', JSON.stringify(savedJobId));
                }
            }
        }
    }]);

    return Save;
}();

var Fetch = function () {
    function Fetch() {
        _classCallCheck(this, Fetch);
    }

    _createClass(Fetch, [{
        key: 'fetchList',
        value: function fetchList(urlEnding) {
            return fetch('http://api.arbetsformedlingen.se/af/v0' + urlEnding).then(function (response) {
                return response.json();
            }).then(function (result) {
                var fetchResult = result;
                return fetchResult;
            }).catch(function (error) {
                newDOM.displayErrorMessage(error);
            });
        }
    }, {
        key: 'fetchSavedAds',
        value: function fetchSavedAds(saveAds) {
            if (saveAds != null) {
                (function () {
                    var jobArray = [];
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = saveAds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var adUrl = _step2.value;

                            fetch('http://api.arbetsformedlingen.se/af/v0/platsannonser/' + adUrl).then(function (response) {
                                if (!response.ok) {
                                    throw Error(response.status);
                                }
                                return response;
                            }).then(function (response) {
                                return response.json();
                            }).then(function (job) {
                                jobArray.push(job);
                                newDOM.displaySavedAds(jobArray);
                            }).catch(function (error) {
                                newDOM.displayErrorMessage(error);
                            });
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                })();
            }
        }
    }]);

    return Fetch;
}();

var DOM = function () {
    function DOM() {
        _classCallCheck(this, DOM);
    }

    _createClass(DOM, [{
        key: 'displayAmountOfJobs',
        value: function displayAmountOfJobs(latestJobs) {
            var amountOfJobsDiv = document.getElementById('amountOfJobs');
            var county = latestJobs.matchningslista.matchningdata[0].lan;
            var town = latestJobs.matchningslista.matchningdata[0].kommunnamn;
            var amountOfJobs = latestJobs.matchningslista.antal_platsannonser;

            var resultMessage = 'matchade jobb';
            if (url.includes('kommunid')) {
                resultMessage = 'jobb i ' + town + ', ' + county;
            } else if (!url.includes('nyckelord')) {
                resultMessage = 'jobb i ' + county;
            }
            var amountOfJobsContent = '<p> Antal ' + resultMessage + ': ' + amountOfJobs;
            amountOfJobsDiv.innerHTML = amountOfJobsContent;
        }
    }, {
        key: 'displayFilterOptions',
        value: function displayFilterOptions(optionsValue) {
            var optionOutput = '';
            var optionsToList = optionsValue.soklista.listnamn;
            var options = '';

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = optionsValue.soklista.sokdata[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var option = _step3.value;

                    var optionID = option.id;
                    var optionName = option.namn;

                    options += '<option class="townItem" value="' + optionID + '">' + optionName + '</option>';
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            if (optionsToList === 'yrkesomraden') {
                optionOutput = document.getElementById('filterProfession');
                optionOutput.innerHTML = options;
            } else if (optionsToList === 'lan') {
                optionOutput = document.getElementById('filterCounty');
                optionOutput.innerHTML = options;

                var townButton = document.getElementsByClassName('townItem');
                var countyID = new URL(document.location).searchParams.get('lanid');

                for (var i = 0; i < townButton.length; i++) {
                    if (townButton[i].value === countyID) {
                        townButton[i].setAttribute('selected', 'selected');
                    }
                }
            } else {
                optionOutput = document.getElementById('filterTown');
                optionOutput.innerHTML = '<option class="townItem" value="0">Hela länet</option>' + options;
            }
        }
    }, {
        key: 'displayAutoComplete',
        value: function displayAutoComplete(autoCompleteWords) {

            var autoCompleteUl = document.createElement('ul');
            var autoCompleteOutput = document.getElementById('autoCompleteOutput');
            autoCompleteOutput.appendChild(autoCompleteUl);
            var searchDrafts = '';

            if (autoCompleteWords.soklista.totalt_antal_platsannonser === 0) {
                var autoCompleteMessage = '<p id="autoCompleteMessage">Inget matchade din s\xF6kning, testa igen!</p>';
                autoCompleteOutput.innerHTML = autoCompleteMessage;
            } else {
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = autoCompleteWords.soklista.sokdata[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var suggested = _step4.value;

                        if (suggested.antal_platsannonser > 0) {
                            searchDrafts += '\n                        <li class="searchDraft" id="' + suggested.namn + '">\n                            ' + suggested.namn + ' \n                            <span>(' + suggested.antal_platsannonser + ')</span>\n                        </li>\n                    ';
                        }
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }

                autoCompleteUl.innerHTML = searchDrafts;
                newController.autoCompleteSearch();
            }
        }
    }, {
        key: 'displayListed',
        value: function displayListed(latestJobs) {

            var outputListJobs = document.getElementById('outputListJobs');

            if (latestJobs.matchningslista.antal_platsannonser) {

                newDOM.displayAmountOfJobs(latestJobs);

                var jobData = latestJobs.matchningslista.matchningdata;
                var listedJobs = '';
                outputListJobs.innerHTML = '';
                var jobDataLength = jobData.length;

                for (var i = 0; i < jobDataLength; i++) {

                    var date = jobData[i].sista_ansokningsdag;
                    var formatedDate = newController.formatDate(date);

                    var latestJob = document.createElement('div');
                    latestJob.classList.add('latestJobs');
                    latestJob.innerHTML = '\n                    <h3>' + jobData[i].annonsrubrik + '</h3>\n                    <p><span>' + jobData[i].yrkesbenamning + '</span> - ' + jobData[i].kommunnamn + '</p>\n                    <p>' + jobData[i].arbetsplatsnamn + '</p>\n                    <p>' + jobData[i].anstallningstyp + '</p>\n                    <p><span>Sista ans\xF6kningsdag:</span> ' + formatedDate + '</p>\n                    <button type="button" class="readMoreButton" id="' + jobData[i].annonsid + '">L\xE4s mer!</button>\n                ';
                    outputListJobs.appendChild(latestJob);
                }

                newController.showSingleJobEventListener();
                newDOM.pagination(latestJobs);
                localStorage.setItem('previousUrl', window.location.href);
            } else {
                outputListJobs.innerHTML = 'Inga matchade jobb';
            }
        }
    }, {
        key: 'displaySavedAds',
        value: function displaySavedAds(jobArray) {

            var outputSavedJobs = document.getElementById('outputSavedJobs');
            outputSavedJobs.innerHTML = '';
            var savedAdsList = document.createElement('ul');
            var jobDataLength = jobArray.length;

            outputSavedJobs.innerHTML = '<h2>Sparade jobbannonser</h2>';

            var _loop = function _loop(i) {
                var listElement = document.createElement('li');
                var saveAd = jobArray[i].platsannons.annons;

                listElement.innerHTML = saveAd.annonsrubrik + '<button id=\'savedAd' + saveAd.annonsid + '\'>L\xE4s mer!</button>';

                savedAdsList.appendChild(listElement);
                outputSavedJobs.appendChild(savedAdsList);

                var savedAdButton = document.getElementById('savedAd' + saveAd.annonsid);
                savedAdButton.addEventListener('click', function () {
                    newController.delayReload();
                    newController.addToUrl('?annonsid=' + saveAd.annonsid);
                });
            };

            for (var i = 0; i < jobDataLength; i++) {
                _loop(i);
            }

            var clearSavedAdsButton = document.createElement('button');
            clearSavedAdsButton.setAttribute('id', 'clearButton');
            var textnode = document.createTextNode('Ta bort mina sparade annonser');
            clearSavedAdsButton.appendChild(textnode);

            outputSavedJobs.appendChild(clearSavedAdsButton);
            newController.clearLocalStorageButtonEventlistener(clearSavedAdsButton);
        }
    }, {
        key: 'pagination',
        value: function pagination(latestJobs) {
            var currentPageNumber = new URL(document.location).searchParams.get('sida');
            var pageNumberDiv = document.getElementById('pageNumber');
            var totalAmountOfPages = latestJobs.matchningslista.antal_sidor;

            pageNumberDiv.innerHTML = currentPageNumber + ' av ' + latestJobs.matchningslista.antal_sidor;
            newController.paginationButtons(totalAmountOfPages);
        }
    }, {
        key: 'displaySingleJobPost',
        value: function displaySingleJobPost(jobDetails) {
            var pagineringWrapper = document.getElementById('pagineringWrapper');
            pagineringWrapper.style.visibility = 'hidden';
            var singleJobDetails = jobDetails.platsannons.annons;
            var applicationDetails = jobDetails.platsannons.ansokan;
            var workplaceDetails = jobDetails.platsannons.arbetsplats;
            var employmentConditions = jobDetails.platsannons.villkor;

            var date = applicationDetails.sista_ansokningsdag;
            var formatedDate = newController.formatDate(date);

            var jobId = jobDetails.platsannons.annons.annonsid;
            outputListJobs.innerHTML = '\n            <div class="jobDetails">\n                <button id="backButton">Tillbaka</button>\n                <button id=\'saveAdButton\' data-id=\'' + jobId + '\'>Spara</button>\n                <span id="saveMessage" class="hidden saveMessage"><i class="fas fa-check-circle"></i> Sparat</span>\n                <h2>' + singleJobDetails.annonsrubrik + '</h2>\n                <p><strong>' + singleJobDetails.yrkesbenamning + '</strong> - ' + singleJobDetails.kommunnamn + '</p>\n                <p><strong>Antal platser:</strong> ' + singleJobDetails.antal_platser + ' </p>\n                <p class="singleJobText">' + singleJobDetails.annonstext + '</p>\n                <p>' + workplaceDetails.arbetsplatsnamn + '</p>\n                <h3>Villkor</h3>\n                <p><strong>Anst\xE4llningsform:</strong> ' + employmentConditions.arbetstid + '</p>\n                <p><strong>L\xF6n:</strong> ' + employmentConditions.lonetyp + '</p>\n                <h3>Ans\xF6kan</h3>\n                <p><strong>Sista ans\xF6kningsdag:</strong> ' + formatedDate + '</p>\n                <p><a href="' + applicationDetails.webbplats + '">Ans\xF6k h\xE4r</a></p>\n            </div>\n        ';

            var backButton = document.getElementById('backButton');
            backButton.addEventListener('click', function () {
                var previousUrl = localStorage.getItem('previousUrl');
                document.location.assign(previousUrl);
                localStorage.removeItem('previousUrl');
            });

            var saveAdButton = document.getElementById('saveAdButton');
            saveAdButton.addEventListener('click', function () {
                newSave.saveAdToBrowser(this.dataset.id);
                newDOM.displaySaveMessage();
            });
        }
    }, {
        key: 'displayUrl',
        value: function displayUrl() {
            var outputShareSearchResult = document.getElementById('outputShareSearchResult');
            var sharePopupBackground = document.getElementById('sharePopupBackground');

            outputShareSearchResult.value = url;
            sharePopupBackground.style.display = 'flex';
            outputShareSearchResult.style.display = 'block';

            newController.closePopup();
        }
    }, {
        key: 'displayErrorMessage',
        value: function displayErrorMessage(error) {
            var outputErrorMessage = document.getElementById('outputErrorMessage');
            var errorMessagePopupBackground = document.getElementById('errorMessagePopupBackground');
            outputErrorMessage.innerHTML = '\n            <i class="fas fa-exclamation-triangle"></i>\n            <h3>Hoppsan! N\xE5got gick fel</h3>\n            <p>Det verkar som vi inte f\xE5r kontakt med servern. Testa att ladda om sidan.</p>\n        ';
            errorMessagePopupBackground.style.display = 'flex';
            outputErrorMessage.style.display = 'block';

            newController.closePopup();
        }
    }, {
        key: 'displaySaveMessage',
        value: function displaySaveMessage() {
            var saveMessage = document.getElementById('saveMessage');
            saveMessage.style.display = 'inline-block';
        }
    }]);

    return DOM;
}();

var url = window.location.href;
var newDOM = new DOM();
var newSave = new Save();
var newController = new Controller();
var newFetch = new Fetch();

//Starts fetch when entering the homepage
var newInit = new Init();
newInit.launch();