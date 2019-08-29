import React from 'react';

class Weather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CurrentWeatherData: [],

        }
        this.getSearchBar = this.getSearchBar.bind(this);
        this.getActivePane = this.getActivePane.bind(this);
        this.getFavoriteContainers = this.getFavoriteContainers.bind(this);
    }

    getSearchBar() {
        return (
            <div className="search-bar input-group">
                <input type="text" className="form-control" />
                <div className="input-group-append">
                    <button className="btn btn-primary" type="button">Button</button>
                </div>
            </div>
        )
    }

    getActivePane () {
        if (this.state.CurrentWeatherData.length > 0) {
            return (
                <div className="card active-pane">
                    <div className="card-body"> HOLA</div>
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
