import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./MainView.css";
import MapChart from "../Map/Map";
import PollutantList from "../Pollutants/PollutantList";
import PollutantDetails from "../Pollutants/PollutantDetails";
import TopCountries from "../TopCountries/TopCountries";

const MainView = ({ allPollutants = [] }) => {
  const navigate = useNavigate();
  const [selectedPollutant, setSelectedPollutant] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("");


  const searchOptions = [
    { value: '', label: 'Select search parameter' },
    { value: 'city', label: 'City' },
    { value: 'country', label: 'Country' },
  ];

  const onSearchButtonClick = async () => {
    navigate("/detailed", {
      state: {
        searchedValue: searchValue,
        searchedType: searchType,
        allPollutants: allPollutants
      }
    });
  }

  const handleChange = (event) => {
    setSearchType(event.target.value);
  };

  return (
    <div className="main-view">
      <nav className="navbar">
        <div className="header">Air Quality Dashboard</div>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/">Main</Link>
          </li>
          <li className="nav-item">
            <Link to="/historical">Historical</Link>
          </li>
        </ul>
        <span></span>
      </nav>

      <div className="main-container">
        <div className="list-and-detail-container">
          <div className="pollutant-select-container">
            <PollutantList
              pollutants={allPollutants}
              onPollutantSelect={id => {
                const currPollutant = allPollutants.filter(pollutant => Number(pollutant.id) === Number(id));
                setSelectedPollutant(currPollutant[0]);
              }}
            />
            <div className="pollutant-details-container">
              <PollutantDetails pollutant={selectedPollutant} />
              <TopCountries />
            </div>
          </div>
        </div>

        <div className="main-map-container">
          <div className="search-box detail-search-box">
            <select value={searchType} onChange={handleChange}>
              {searchOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input id="cityName" name="cityName" value={searchValue} onChange={e => setSearchValue(e.target.value)} type="text" placeholder="Search..." />
            <button className="search-btn" onClick={onSearchButtonClick}>Search</button>
          </div>
          <MapChart />
        </div>
      </div>
    </div>
  );
};

export default MainView;