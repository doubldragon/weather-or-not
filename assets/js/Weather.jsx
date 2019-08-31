import React from 'react';
import ActiveContainer from './ActiveContainer.jsx';
import FaveContainer from './FaveContainer.jsx';

class Weather extends React.Component {
    constructor(props) {
        super(props);
        /*
        WRITE JSON FOR OPEN WEATHER CODE FOR CUSTOM ICONS/BACKGROUND COLORS
         */
        this.state = {
            currentWeatherData: null,
            queryString: "",
            activeLocation: "",
            geocodeKey: "AIzaSyDrjLW5bzv-_BqozBVr8kG843fVJ8OI_xw",
            openWeatherKey: "58e92c763df5499a2c9ae20da806e2dc",
            weatherFormats: [],
            userFavorites: [],
            faveData: {},
        };
        //NOTE: I would normally put the API Keys in the .env file to protect them, but added them here, for now, for ease of sharing the project
        this.getSearchBar = this.getSearchBar.bind(this);
        // this.getActivePane = this.getActivePane.bind(this);
        this.getFavoriteContainers = this.getFavoriteContainers.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
        this.getLocationData = this.getLocationData.bind(this);
        this.getWeatherFormats = this.getWeatherFormats.bind(this);
        this.getUserFavorites = this.getUserFavorites.bind(this);
        this.getFavoriteData = this.getFavoriteData.bind(this);
        this.onSaveFavorite = this.onSaveFavorite.bind(this);
        // this.getUserFavorites = this.getUserFavorites.bind(this);
    }

    componentDidMount() {
        this.getWeatherFormats();
        this.getUserFavorites();
    }

    onSaveFavorite() {
        let form = new FormData();
        // console.log(this.state);
        form.append("cityName", this.state.activeLocation);
        form.append("cityId", this.state.currentWeatherData.id);
        fetch("/api/user/favorites/add", {credentials: "same-origin",method: "post", body: form, encType: "multipart/form-data"})
            .then((response) => response.json()).then((responseJson) => {
            this.getUserFavorites();
            this.setState()
            console.log(responseJson);

        })
            .catch((error) => {
                console.error(error);
            });

    }
    updateQuery(e) {
        console.log(e.target.value);
        this.setState({queryString: e.target.value})
    }

    getUserFavorites() {
        fetch("/api/user/favorites", {credentials: "same-origin"})
            .then((response) => response.json()).then((responseJson) => {
            this.setState({
                userFavorites: responseJson,
            })
            console.log(responseJson);

        })
            .catch((error) => {
                console.error(error);
            });
    }

    getWeatherFormats() {
        fetch("/api/weather/formats", {credentials: "same-origin"})
            .then((response) => response.json()).then((responseJson) => {
            this.setState({
                weatherFormats: responseJson,
            })
        })
            .catch((error) => {
                console.error(error);
            });
    }

    getLocationData() {
        let coords;
        fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.queryString + "&key=" + this.state.geocodeKey, {credentials: "same-origin"})
            .then((response) => response.json()).then((responseJson) => {
                if (responseJson.status == "OK") {
                    coords = responseJson.results[0].geometry.location;
                    console.log(responseJson.results[0].formatted_address);
                    this.setState({
                        queryString: responseJson.results[0].formatted_address,
                        activeLocation: responseJson.results[0].formatted_address.split(",", 1)
                    })
                }
            fetch("http://api.openweathermap.org/data/2.5/weather?lat="+ coords.lat + "&lon=" + coords.lng + "&us&appid=" + this.state.openWeatherKey + "&units=imperial", {credentials: "same-origin"})
                .then((response) => response.json()).then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    currentWeatherData: responseJson,
                })
            })
                .catch((error) => {
                    console.error(error);
                });
        })
            .catch((error) => {
                console.error(error);
            });
        // let param = isNaN(this.state.queryString) ? "q=" : "zip=";

    }

    getSearchBar() {
        return (
            <div className="search-bar input-group">
                <div className="input-group-prepend">
                    <button className="btn btn-secondary" type="button"><i className="fa fa-crosshairs"></i> </button>

                </div>

                <input type="text" className="form-control" value={this.state.queryString} onChange={this.updateQuery}/>
                <div className="input-group-append">
                    <button className="btn btn-primary" type="button" onClick={this.getLocationData}>Search</button>
                </div>
            </div>
        )
    }

    getFavoriteData() {
        let containers = [];
        console.log("favorite")
        if(!this.state.userFavorites ) {
            this.state.userFavorites.forEach((fave) => {
                if (!this.state.faveData.keys.find(fave.name)) {
                    fetch("http://api.openweathermap.org/data/2.5/weather?id=" + fave.city_id + "&appid=" + this.state.openWeatherKey + "&units=imperial", {credentials: "same-origin"})
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.log(responseJson);
                            let stateObj = this.state.faveData;
                            stateObj[fave.name] = responseJson;
                            this.setState({
                                faveData: stateObj,
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            });
        }
        return containers;
    }

    getFavoriteContainers() {
        let containers = [];
            this.state.userFavorites.forEach((fave) => {
                console.log('fave');
                containers.push(<FaveContainer
                    formats={this.state.weatherFormats}
                    apiKey={this.state.openWeatherKey}
                    data={fave}
                />)
            })
        return containers;
    }

    render() {
        let faves = this.getFavoriteContainers();
        return (
            <div className="app-container mt-3 col-8">
                {this.getSearchBar()}
                {this.state.currentWeatherData ?
                    <ActiveContainer
                        weatherData={this.state.currentWeatherData}
                        weatherFormat={this.state.weatherFormats[this.state.currentWeatherData.weather[0].icon]}
                        activeLocation={this.state.activeLocation}
                        handleSaveFavorite={this.onSaveFavorite}
                    /> : ""}
                <div className="fave-container card-columns">
                    {faves}
                </div>
            </div>
        )
    }

}

export default Weather;
