const baseURL = "https://calendarific.com/api/v2/";
const key = "b60d7cc8f568ece2de1236cc2e8d33b7b583da29";
let selectPageType; // the page type: holidays, languages, countries
let selectCountry; // select country, USA for example
let selectYear; // select year for returning holidays (supports up to 2049)
let countriesURL; // URL for storing the countries
let holidaysURL; // the combined URL for searching holidays of a country
let holidayButtonCountry; // country selected when clicking on the holiday info button

// keyURL = baseURL + selectPageType + "?&api_key=" + key + "&country=" + country + "&year=" + selectYear;

// test the fetch first to see if we can get a successful request

/* FIRST, FETCH AND STORE THE COUNTRIES */

const fetchCountriesApi = () => {
    console.log("Executing fetchCountriesApi:");
    // construct countriesURL for fetch
    countriesURL = baseURL + "countries" + "?&api_key=" + key;
    console.log("Countries URL:", countriesURL);
    fetch(countriesURL)
        .then((response) => {
            if (!response.ok) {
                console.log(response);
                throw new Error(`fetchCountriesApi if else error. Status: ${response.status}`);
            } else {
                console.log("Response received (fetchCountriesApi):")
                return response.json();
            }
        })
        .then((results) => {
            console.log("fetchCountriesApi Results:", results);
            let countriesArray = storeCountries(results);
            console.log("Array of countries:", countriesArray.response.countries);
            console.log("Populating table in html document with country entries:")
            countriesArray.response.countries.forEach(createCountryEntries);

            function createCountryEntries(item, index) {
                // create the countries and each one's info that will populate the search table
                let countryEntryTr = document.createElement('tr');
                let countryEntryTd1 = document.createElement('td');
                let countryEntryTd2 = document.createElement('td');
                let countryEntryTd3 = document.createElement('td');
                let countryEntryTd4 = document.createElement('td');
                let holidayButton = document.createElement('button');

                // edit each entry's text to display when appended
                countryEntryTd1.innerText = countriesArray.response.countries[index].country_name;
                countryEntryTd2.innerText = countriesArray.response.countries[index]['iso-3166'];
                countryEntryTd3.innerText = countriesArray.response.countries[index].total_holidays;

                let holidayButtonValue = countriesArray.response.countries[index]['iso-3166'];
                // console.log(typeof(holidayButtonValue));

                // edit the button, and append button to countryEntryTd4
                holidayButton.innerText = "Holiday Info";
                holidayButton.setAttribute("class", "btn btn-info btn-lg");
                holidayButton.setAttribute("type", "button");
                holidayButton.setAttribute("data-toggle", "modal");
                holidayButton.setAttribute("data-target", "#holidaysModal");
                holidayButton.setAttribute("value", holidayButtonValue);
                holidayButton.setAttribute("id", "override-button-color");
                holidayButton.addEventListener("click", function () {
                    holidayButtonCountry = holidayButtonValue;
                })
                holidayButton.addEventListener("click", fetchHolidaysApi)
                countryEntryTd4.setAttribute("class", "text-center")
                countryEntryTd4.appendChild(holidayButton);

                // append the td's to the tr
                countryEntryTr.appendChild(countryEntryTd1);
                countryEntryTr.appendChild(countryEntryTd2);
                countryEntryTr.appendChild(countryEntryTd3);
                countryEntryTr.appendChild(countryEntryTd4);

                // append country entry to the tbody in the html document
                // append type", "button"document;
                document.getElementsByTagName("tbody")[0].appendChild(countryEntryTr);
            };
        })
        .catch(error => console.log(`fetchCountriesApi catch error. Status: ${error}`));
}
fetchCountriesApi();

/* STANDARD FETCH VERSION */
const fetchHolidaysApi = () => {
    console.log("Executing fetchHolidaysApi:");
    // construct holidaysURL for fetch
    // holidaysURL = baseURL + selectPageType + "?&api_key=" + key + "&country=" + selectCountry + "&year=" + selectYear;
    holidaysURL = baseURL + "holidays" + "?&api_key=" + key + "&country=" + holidayButtonCountry + "&year=" + "2020";
    console.log("URL:", holidaysURL);
    fetch(holidaysURL)
        .then((response) => {
            if (!response.ok) {
                console.log(response);
                throw new Error(`fetchHolidaysApi if else error. Status: ${response.status}`);
            } else {
                console.log("Response received (fetchHolidaysApi):")
                return response.json();
            }
        })
        .then((results) => {
            // if any holiday list is curently present, delete it first
            while (document.getElementsByClassName("modal-body")[0].firstChild) {
                document.getElementsByClassName("modal-body")[0].removeChild(document.getElementsByClassName("modal-body")[0].firstChild);
            }

            console.log("fetchHolidaysApi results:", results);
            // console.log(results);
            let holidaysArray = results;
            console.log("Array of Holidays:", holidaysArray);
            console.log("Populating modal in html document with the selected country's holidays:")

            // create heading for the selected country in the modal(this only needs to be done once, outside of the loop)
            // let countryHolidayh2 = document.createElement('h2');
            // countryHolidayh2.innerText = holidaysArray.response.holidays.country.name;

            holidaysArray.response.holidays.forEach(createHolidayEntries);

            function createHolidayEntries(item, index) {



                // create elements that will go inside the modal and show the country holiday info
                // name / date of each holiday
                let countryHolidayh6 = document.createElement('h6');
                // description for each holiday
                let countryHolidayP = document.createElement('p');

                // edit each entry's text to the appropriate holiday entry in the holidaysArray
                countryHolidayh6.innerText = holidaysArray.response.holidays[index].name + "\n" + holidaysArray.response.holidays[index].date.iso;
                countryHolidayP.innerText = holidaysArray.response.holidays[index].description;

                // put name/date/description in a div
                let countryHolidayEntryDiv = document.createElement('div');

                // append holiday name/date/description to the div
                countryHolidayEntryDiv.appendChild(countryHolidayh6);
                countryHolidayEntryDiv.appendChild(countryHolidayP);

                // append the heading
                document.getElementsByClassName("modal-body")[0].appendChild(countryHolidayEntryDiv);
            }
        })
        .catch(error => console.log(`fetchHolidaysApi catch error. Status: ${error}`));
}

function storeCountries(results) {
    let c = results;
    // console.log("Logging c:");
    // console.log(c);
    // console.log("Walking through in dot notation:");
    // console.log(c.response.countries[190])
    return c;
}

function storeHolidays(results) {
    let h = results;
    // console.log("Logging h:")
    // console.log(h);
    return h;
}

/* JQuery for the search behavior of the filterable table */
$(document).ready(function () {
    $("#userSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#countryTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

/* ASYNC FETCH VERSION */
// can write fetch with arrow anonymous function async () =>, or regular anonymous async function ()
/*
const asyncfetchHolidaysApi = async () => {
    try {
        console.log("Executing fetchHolidaysApi");
        // construct holidaysURL for fetch
        holidaysURL = baseURL + selectPageType + "?&api_key=" + key + "&country=" + selectCountry + "&year=" + selectYear;
        console.log("URL:", holidaysURL);
        let response = await fetch(holidaysURL);
        if (!response.ok) {
            throw new Error(`asyncfetchHolidaysApi if else error. Stats: ${response.status}`);
        } else {
            console.log(`Response received`)
            let results = await response.json();
            return results;
        }
    }
    catch (error) {
        console.log(`asyncfetchHolidaysApi try catch error. Status: ${error}`);
    }
}

asyncfetchHolidaysApi()
    .then((results) => {
        console.log(`Logging results`);
        console.log(results);
    })
    .catch(error => console.log(`asyncfetchHolidaysApi catch error. Status: ${error}`));
*/