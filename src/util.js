import { Circle, Popup } from "react-leaflet";
import React from "react";
import numeral from "numeral";
const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 150,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 200,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 250,
  },
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const sortData = (data) => {
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) return -1;
    else return 1;
  });
  return sortedData;
};
export const showDataonMap = (data, caseType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[caseType].hex}
      fillColor={casesTypeColors[caseType].hex}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[caseType]) * casesTypeColors[caseType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
