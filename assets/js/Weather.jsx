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
        this.getFavoriteContainers = this.getFavoriteContainers.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
        this.getLocationData = this.getLocationData.bind(this);
        this.getWeatherFormats = this.getWeatherFormats.bind(this);
        this.getUserFavorites = this.getUserFavorites.bind(this);
        this.getFavoriteData = this.getFavoriteData.bind(this);
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
            activeLocation: [data.name],
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
                // let query = source === "google" ? responseJson.results[0].formatted_address : this.state.queryString
            this.setState({
                currentWeatherData: responseJson,
                activeLocation: location[0],
                // queryString: query,
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
        let form = new FormData();
        form.append("cityId", this.state.currentWeatherData.id);
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
                    })
                }
                this.getOpenWeatherData(coords.lat,coords.lng, "google");
            // fetch("http://api.openweathermap.org/data/2.5/weather?lat="+ coords.lat + "&lon=" + coords.lng + "&us&appid=" + this.state.openWeatherKey + "&units=imperial", {credentials: "same-origin"})
            //     .then((response) => response.json()).then((responseJson) => {
            //     this.setState({
            //         currentWeatherData: responseJson,
            //     })
            // })
            //     .catch((error) => {
            //         console.error(error);
            //     });
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
                    <button className="btn btn-secondary" type="button" onClick={this.getBrowserLocation}><i className="fa fa-crosshairs"></i> </button>

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
        if(!this.state.userFavorites ) {
            this.state.userFavorites.forEach((fave) => {
                if (!this.state.faveData.keys.find(fave.name)) {
                    fetch("http://api.openweathermap.org/data/2.5/weather?id=" + fave.city_id + "&appid=" + this.state.openWeatherKey + "&units=imperial", {credentials: "same-origin"})
                        .then((response) => response.json())
                        .then((responseJson) => {
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
            containers.push(<FaveContainer
                key={fave.city_id}
                formats={this.state.weatherFormats}
                apiKey={this.state.openWeatherKey}
                data={fave}
                onSelect={this.setToActive}
            />)
        })
        return containers;
    }

    render() {
        let faves = this.getFavoriteContainers();
        let isFavorite = this.state.userFavorites.filter((fave) => fave.name === this.state.activeLocation);
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
                        isFavorite={isFavorite}
                    /> : ""}
                <div className="fave-container card-columns">
                    {faves}
                </div>
            </div>
        )
    }

}

export default Weather;
