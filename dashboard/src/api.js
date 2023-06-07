
import axios from "axios";
import { AN_API_KEY } from "./config";

const apiURL = "https://api.openaq.org/v2";

export const getCountries = async () => {
  try {
    const response = await fetch('https://api.openaq.org/v2/latest');
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}  ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    throw error;
  }
}

export const getCityData = async (city) => {
  try {
    console.log("getCityData called!");
    const { latitude, longitude } = await getCoords(city);
    if(latitude && longitude) {
      console.log("Back!", latitude, longitude);
    }
    const url = `https://api.openaq.org/v2/latest?limit=500&city=${encodeURIComponent(city)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${city}: ${response.status}  ${response.statusText}`);
    }
    const data = await response.json();
    let index = null;
    if(data.results) {
      for (let i = 0; i < data.results.length; i++) {
        if(!index || data.results[i].measurements.length > index){
          index = i;
        }
      }
    }
    if(index) {
      return data.results[index];
    } else {
      return data;
    }
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    throw error;
  }
}

export const getCountryData = async (country) => {
  try {
    console.log("getCountryData called!");
    const countryCode = await getCountryCode(country); 
    const response = await fetch (`https://api.openaq.org/v2/latest?limit=500&country=${countryCode}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${country}: ${response.status}  ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    const targetCountry = data.results.find((countryData) => countryData.country === countryCode); //Returns the 1st match in the response
    console.log(countryCode);
    console.log(targetCountry);
    return targetCountry;
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    throw error;
  }
};

export const getCurrentData = async () => {
  try {
    const url = 'https://api.openaq.org/v2/latest?limit=6000';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}  ${response.statusText}`);
    }
    const data = await response.json();
    let currentData = {};
    for (let result of data.results) {
      if (!currentData[result.country]) {
        console.log("Adding: ", result.country);
        currentData[result.country] = result;
      }
    }
    return currentData;
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    throw error;
  }
}


export const getDateRange = async (startDate, endDate, location, type) => {
  try {
    // construct the URL
    const url = `https://api.openaq.org/v2/measurements?date_from=${encodeURIComponent(startDate)}&date_to=${encodeURIComponent(endDate)}&${encodeURIComponent(type)}=${encodeURIComponent(location)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${location} between ${startDate} and ${endDate}: ${response.status}  ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    throw error;
  }
};

export const getAllCities = async () => {
  try {
    const response = await fetch('https://api.openaq.org/v2/cities?limit=2000');
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}  ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    throw error;
  }
}

export const apiClient = axios.create({
  baseURL: apiURL,
  headers: {
    "accept": "application/json"
  },
});

export async function getAllPollutants() {
  const allPollutants = await apiClient.get("/parameters?order_by=name");
  return allPollutants.data;
}


//Bit of a mess, but I tested it briefly using 'Mexico' as the country and it works that far, at least
//Helper function getCountryCode returns the 2char code for the country name passed in.
//Then call the API with the country code and get the data for that country.
//Then find the measurement for PM2.5 and get the value.
//Then calculate the AQI value for that PM2.5 value. (Helper functions getBPLimits and getAQILimits are used for this.)
//Then return the AQI value.



export async function getCountryCode(country) {
  try {
  //  console.log("getCountryCode called: ", country);
    const url = 'https://api.openaq.org/v2/countries?limit=200';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch country data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
   // console.log(data);
    const target = data.results.find((countryData) => countryData.name === country);
    if (!target) {
      throw new Error(`Country ${country} not found: ${response.status} ${response.statusText}`);
    }
    return target.code;
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    throw error;
  }
}

export async function getCoords(cityName) {
  try {
    console.log("getCoords called: ", cityName);
    const url = `http://api.positionstack.com/v1/forward?access_key=${AN_API_KEY}&query=${encodeURIComponent(cityName)}`;
    const response = await fetch(url);
    console.log(response);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      if (data.data.length > 0) {
        console.log("Coords: ", data.data[0].latitude, data.data[0].longitude); 
        const { latitude, longitude } = data.data[0];
        return { latitude, longitude };
      } else {
        console.log('No results found.');
      }
    } else {
      console.log(`Error: ${response.status}`);
    }
  } catch (error) {
    console.log('An error occurred:', error);
  }

  return null;
}








//Sources, so I don't forget later: https://www.airnow.gov/sites/default/files/2020-05/aqi-technical-assistance-document-sept2018.pdf, https://forum.airnowtech.org/t/the-aqi-equation/169