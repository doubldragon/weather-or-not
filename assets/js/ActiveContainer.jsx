import React from 'react';

class ActiveContainer extends React.Component {
    constructor(props) {
        super(props);
        this.onSaveFavorite = this.onSaveFavorite.bind(this);
        this.onRemoveFavorite = this.onRemoveFavorite.bind(this);
    }

    onSaveFavorite() {
        this.props.handleSaveFavorite();
    }

    onRemoveFavorite(){
        this.props.handleRemoveFavorite();
    }

    render() {
        let format = this.props.weatherFormat ? this.props.weatherFormat : []

        if (this.props.activeLocation) {
            let data = this.props.weatherData;
            let description = (data.weather ? data.weather[0].description.toLowerCase() : "")
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
            let timezone = data.timezone ? data.timezone : data.sys.timezone;
            let stamp = data.sys.sunrise + timezone;
            let utcString = new Date(stamp * 1000).toUTCString();
            let sunrise = utcString.slice(-11, -7);
            stamp = data.sys.sunset + timezone;
            utcString = new Date(stamp * 1000).toUTCString();
            let sunset = utcString.slice(-12, -7);
            let faveLink = <a href={"#"} className={" col-xs-12 col-sm-12 active-text"} onClick={this.onSaveFavorite}>
                <small><i className="fas fa-plus"/> Add to Favorites</small>
            </a>;
            if (this.props.isFaveLocation.length > 0) {
                faveLink = <a href={"#"} className={"col-xs-12 col-sm-12 active-text"} onClick={this.onRemoveFavorite}>
                    <small><i className="fas fa-minus"/> Remove from Favorites</small>
                </a>;
            }

            return (
                <div className="card active-pane"
                     style={{backgroundColor: format.bgColor ? format.bgColor : '#cccccc'}}>
                    <div className="card-body">
                        <div className={"col-xs-12 float-right"}>
                            <i className={"weather-icon fas " + format.icon}
                               style={{color: format.iconColor ? format.iconColor : '#ffffff'}}/>
                        </div>
                        <h1>
                            <div className={"col-xs-12 col-sm-12 active-text"}>{this.props.activeLocation}</div>
                        </h1>
                        <div className={"col-xs-12 col-sm-12 active-text"}>{description}</div>
                        {faveLink}
                        <div>
                            <div
                                className={"col-xs-12 col-sm-12 active-text temp-text"}>{Math.round(data.main.temp)}&#176;</div>
                        </div>
                        <div className={"active-text data-grid col-lg-4 col-md-4 col-sm-12 col-xs-12"}><i
                            className={"fas fa-temperature-high"}/> High: {Math.round(data.main.temp_max)}&#176;</div>
                        <div className={"active-text data-grid col-lg-4 col-md-4 col-sm-12 col-xs-12"}><i
                            className={"fas fa-temperature-low"}/> Low: {Math.round(data.main.temp_min)}&#176;</div>
                        <div className={"active-text data-grid col-lg-4 col-md-4 col-sm-12 col-xs-12"}><i
                            className={"fas fa-binoculars"}/> Visibility: {Math.round(data.visibility / 1609.344)} mi
                        </div>
                        <div className={"active-text data-grid col-lg-4 col-md-4 col-sm-12 col-xs-12"}><i
                            className={"fas fa-arrow-up"}/> Sunrise: {sunrise}</div>
                        <div className={"active-text data-grid col-lg-4 col-md-4 col-sm-12 col-xs-12"}><i
                            className={"fas fa-arrow-down"}/> Sunset: {sunset}</div>
                        <div className={"active-text data-grid col-lg-4 col-md-4 col-sm-12 col-xs-12"}><i
                            className={"fas fa-wind"}/> Wind: <i className={"fas fa-long-arrow-alt-up"} style={{
                            transform: "rotate(" + data.wind.deg + "deg)",
                            textShadow: "none"
                        }}/> {Math.round(data.wind.speed)}mph
                        </div>

                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="card active-pane"
                     style={{backgroundColor: format.bgColor ? format.bgColor : '#080340'}}>
                    <div className="card-body">
                        <div className={"center-text"}>To get started, Search for a location</div>
                    </div>
                </div>
            )
        }
    }


}

export default ActiveContainer;
