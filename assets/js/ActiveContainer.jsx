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
        console.log(this.props.isFavorite);
        let data = this.props.weatherData;
        let format = this.props.weatherFormat;
        let stamp = data.sys.sunrise + data.timezone;
        let utcString = new Date(stamp * 1000).toUTCString();
        let sunrise = utcString.slice(-11, -7);
        stamp = data.sys.sunset + data.timezone;
        utcString = new Date(stamp * 1000).toUTCString();
        let sunset = utcString.slice(-12, -7);
        let faveLink = <a href={"#"} className={"active-text"} onClick={this.onSaveFavorite}><small><i className="fas fa-plus" /> Add to Favorites</small></a>;
        if (this.props.isFaveLocation.length > 0) {
            faveLink = <a href={"#"} className={"active-text"} onClick={this.onRemoveFavorite}><small><i className="fas fa-minus" /> Remove from Favorites</small></a>;
        }
        return (
            <div className="card active-pane" style={{backgroundColor:format.bgColor ? format.bgColor : '#cccccc'}}>
                <div className="card-body">
                    <div className={"col-xs-12 float-right"}>
                        <i className={"weather-icon fas " + format.icon} style={{color:format.iconColor ? format.iconColor : '#ffffff'}}/>
                    </div>
                    <h1><div className={"col-xs-12 col-sm-12 active-text"}>{this.props.activeLocation}</div></h1>
                    {faveLink}
                    <div><div className={"active-text temp-text"}>{Math.round(data.main.temp)}&#176;</div></div>
                    <div className={"active-text data-grid col-lg-4 col-md-4 col-sm-4 col-xs-12"}>High: {Math.round(data.main.temp_max)}&#176;</div>
                    <div className={"active-text data-grid col-lg-4 col-md-4 col-sm-4 col-xs-12"}>Sunrise: {sunrise}</div>
                    {/*<div className={"active-text data-grid col-4"}>Pressure: {Math.round(data.main.pressure)}</div>*/}
                    <div className={"active-text data-grid col-lg-4 col-md-4 col-sm-4 col-xs-12"}>Visibility: {Math.round(data.visibility/1609.344)} mi</div>
                    <div className={"active-text data-grid col-lg-4 col-md-4 col-sm-4 col-xs-12"}>Low: {Math.round(data.main.temp_min)}&#176;</div>
                    <div className={"active-text data-grid col-lg-4 col-md-4 col-sm-4 col-xs-12"}>Sunset: {sunset}</div>
                    <div className={"active-text data-grid col-lg-4 col-md-4 col-sm-4 col-xs-12"}>Wind: <i className={"fas fa-long-arrow-alt-up"} style={{transform:"rotate(" +data.wind.deg + "deg)",textShadow:"none"}}/> {Math.round(data.wind.speed)}mph</div>

                </div>
            </div>
        );
    }

}

export default ActiveContainer;
