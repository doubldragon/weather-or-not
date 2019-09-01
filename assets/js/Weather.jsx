import React from 'react';
import ActiveContainer from './ActiveContainer.jsx';
import FaveContainer from './FaveContainer.jsx';

class Weather extends React.Component {
    constructor(props) {
        super(props);
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
        this.getFavoriteContainers = this.getFavoriteContainers.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
        this.getLocationData = this.getLocationData.bind(this);
        this.getWeatherFormats = this.getWeatherFormats.bind(this);
        this.getUserFavorites = this.getUserFavorites.bind(this);
        this.onSaveFavorite = this.onSaveFavorite.bind(this);
        this.onRemoveFavorite = this.onRemoveFavorite.bind(this);
        this.setToActive = this.setToActive.bind(this);
        this.getBrowserLocation = this.getBrowserLocation.bind(this);
    }

    componentDidMount() {
        this.getWeatherFormats();
        this.getUserFavorites();
    }

    setToActive(data, weatherData) {
        this.setState({
            activeLocation: data.name,
            currentWeatherData: weatherData
        })
    }

    getBrowserLocation() {
            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition((position) => {
                    this.setState({
                        queryString: position.coords.latitude + ', ' + position.coords.longitude,
                    }, this.getOpenWeatherData(position.coords.latitude, position.coords.longitude), "browser");
                });

            } else {
                alert("Device location is currently disabled.");
            }
    }

    getOpenWeatherData(lat, lng, source) {
        fetch("http://api.openweathermap.org/data/2.5/weather?lat="+ lat + "&lon=" + lng + "&us&appid=" + this.state.openWeatherKey + "&units=imperial", {credentials: "same-origin"})
            .then((response) => response.json()).then((responseJson) => {
                let location = source === "google" ? this.state.activeLocation : [responseJson.name];
                this.setState({
                    currentWeatherData: responseJson,
                    activeLocation: location[0],
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    onSaveFavorite() {
        let form = new FormData();
        form.append("cityName", this.state.activeLocation);
        form.append("cityId", this.state.currentWeatherData.id);
        fetch("/api/user/favorites/add", {credentials: "same-origin",method: "post", body: form, encType: "multipart/form-data"})
            .then((response) => response.json()).then((responseJson) => {
            this.getUserFavorites();
        })
            .catch((error) => {
                console.error(error);
            });
    }

    onRemoveFavorite() {
        fetch("/api/user/favorites/remove/" + this.state.currentWeatherData.id, {credentials: "same-origin",method: "post"})
            .then((response) => response.json()).then((responseJson) => {
            this.getUserFavorites();
        })
            .catch((error) => {
                console.error(error);
            });
    }

    updateQuery(e) {
        this.setState({queryString: e.target.value})
    }

    getUserFavorites() {
        this.setState({
            userFavorites:[]
        });
        fetch("/api/user/favorites", {credentials: "same-origin"})
            .then((response) => response.json()).then((responseJson) => {
            this.setState({
                userFavorites: responseJson,
            });
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
                    this.setState({
                        queryString: responseJson.results[0].formatted_address,
                        activeLocation: responseJson.results[0].formatted_address.split(",", 1)
                    },
                        this.getOpenWeatherData(coords.lat,coords.lng, "google")
                    )
                }
        })
            .catch((error) => {
                console.error(error);
            });
    }

    getSearchBar() {
        return (
            <div className="search-bar input-group">
                <div className="input-group-prepend">
                    <button className="btn " type="button" onClick={this.getBrowserLocation}><i className="fa fa-crosshairs"></i> </button>
                </div>
                <input type="text" className="form-control" value={this.state.queryString} onChange={this.updateQuery}/>
                <div className="input-group-append">
                    <button className="btn " type="button" onClick={this.getLocationData}>Search</button>
                </div>
            </div>
        )
    }

    getFavoriteContainers() {
        let containers = [];
        this.state.userFavorites.forEach((fave) => {
            containers.push(<FaveContainer
                key={fave.city_id}
                formats={this.state.weatherFormats}
                apiKey={this.state.openWeatherKey}
                data={fave}
                onSelect={this.setToActive}
            />)
        });
        return containers;
    }

    render() {
        let faves = this.getFavoriteContainers();
        return (
            <div key="app" className="app-container mt-3 col-lg-8 col-xl-8 col-md-12 col-sm-12 col-xs-12">
                {this.getSearchBar()}
                {this.state.currentWeatherData ?
                    <ActiveContainer
                        weatherData={this.state.currentWeatherData}
                        weatherFormat={this.state.weatherFormats[this.state.currentWeatherData.weather[0].icon]}
                        activeLocation={this.state.activeLocation}
                        handleSaveFavorite={this.onSaveFavorite}
                        handleRemoveFavorite={this.onRemoveFavorite}
                        isFaveLocation={this.state.userFavorites.filter((fave) => fave.name === this.state.activeLocation)}
                    /> : ""}
                <div className="fave-container card-columns">
                    {faves}
                </div>
            </div>
        )
    }

}

export default Weather;
