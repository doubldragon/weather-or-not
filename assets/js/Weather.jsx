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
            weatherFormats: [],
            userFavorites: [],
            faveData: [],
        };

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
        this.getFavoriteData = this.getFavoriteData.bind(this);
    }

    componentDidMount() {
        this.getWeatherFormats();
        this.getFavoriteData();
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
        fetch("/api/openweather/latlng/" + lat + "%20" + lng, {credentials: "same-origin"})
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
            this.getFavoriteData();
        })
            .catch((error) => {
                console.error(error);
            });
    }

    onRemoveFavorite() {
        fetch("/api/user/favorites/remove/" + this.state.currentWeatherData.id, {credentials: "same-origin",method: "post"})
            .then((response) => response.json()).then((responseJson) => {
            this.getUserFavorites();
            this.getFavoriteData();
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
        fetch("/api/geocode/" + this.state.queryString, {credentials: "same-origin"})
        // fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.queryString + "&key=" + this.state.geocodeKey, {credentials: "same-origin"})
            .then((response) => response.json()).then((responseJson) => {
                if (responseJson.status === "OK") {
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
                    <button className="btn " type="button" onClick={this.getBrowserLocation}><i className="fa fa-crosshairs" /> </button>
                </div>
                <input type="text" className="form-control" value={this.state.queryString} onChange={this.updateQuery}/>
                <div className="input-group-append">
                    <button className="btn " type="button" onClick={this.getLocationData}>Search</button>
                </div>
            </div>
        )
    }

    getFavoriteData() {
            fetch("/api/openweather/bulk/faves", {credentials: "same-origin"})
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        faveData: responseJson.list,
                    })
                })
                .catch((error) => {
                    console.error(error);
                });
    }

    getFavoriteContainers() {
        let containers = [];
        if (this.state.faveData.length === this.state.userFavorites.length) {
            this.state.userFavorites.forEach((fave) => {
                containers.push(<FaveContainer
                    key={fave.city_id}
                    formats={this.state.weatherFormats}
                    data={fave}
                    weatherData={this.state.faveData.filter((data) => data.id === fave.city_id)}
                    onSelect={this.setToActive}
                />)
            });
        }
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
