import React from 'react';

class Weather extends React.Component {
    constructor(props) {
        super(props);
        /*
        WRITE JSON FOR OPEN WEATHER CODE FOR CUSTOM ICONS/BACKGROUND COLORS
         */
        this.state = {
            currentWeatherData: null,
            queryString: "",
            geocodeKey: "AIzaSyDrjLW5bzv-_BqozBVr8kG843fVJ8OI_xw",
            openWeatherKey: "58e92c763df5499a2c9ae20da806e2dc",
        };
        //NOTE: I would normally put the API Keys in the .env file to protect them, but added them here, for now, for ease of sharing the project
        this.getSearchBar = this.getSearchBar.bind(this);
        this.getActivePane = this.getActivePane.bind(this);
        this.getFavoriteContainers = this.getFavoriteContainers.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
        this.getLocationData = this.getLocationData.bind(this);
    }

    updateQuery(e) {
        console.log(e.target.value);
        this.setState({queryString: e.target.value})
    }

    getLocationData() {

        let coords;
        fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.queryString + "&key=" + this.state.geocodeKey, {credentials: "same-origin"})
            .then((response) => response.json()).then((responseJson) => {
                if (responseJson.status == "OK") {
                    coords = responseJson.results[0].geometry.location;
                    console.log(responseJson.results[0].formatted_address);
                    this.setState({
                        queryString: responseJson.results[0].formatted_address
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
                    <button className="btn btn-primary" type="button" onClick={this.getLocationData}>Button</button>
                </div>
            </div>
        )
    }

    getActivePane () {
        if (this.state.currentWeatherData) {
            return (
                <div className="card active-pane">
                    <div className="card-body">
                        {this.state.currentWeatherData.main.temp}
                        <i className="fas fa-cloud-sun fa-5x"></i>
                        <img className="weather-icon" src={"http://openweathermap.org/img/wn/" + this.state.currentWeatherData.weather[0].icon + ".png"} />
                    </div>
                </div>
            );
        }
        else {
            return "";
        }
    }

    getFavoriteContainers() {
        let favorites = [1,2,3,4,5,6,];
        let containers = [];
        favorites.forEach((fave) =>{
            containers.push(
                <div className="card fave-card">
                    <div className="card-body">
                        Favorite {fave}
                    </div>
                </div>
            )
        });
        return containers;
    }

    render() {
        // let faves = this.getFavoriteContainers();
        return (
            <div className="app-container mt-3 col-8">
                {this.getSearchBar()}
                {this.getActivePane()}
                <div className="fave-container card-columns">
                    {this.getFavoriteContainers()}
                </div>
            </div>
        )
    }

}

export default Weather;
