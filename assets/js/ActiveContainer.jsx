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
        let data = this.props.weatherData;
        let format = this.props.weatherFormat;
        let stamp = data.sys.sunrise + data.timezone;
        let utcString = new Date(stamp * 1000).toUTCString();
        let sunrise = utcString.slice(-11, -7);
        stamp = data.sys.sunset + data.timezone;
        utcString = new Date(stamp * 1000).toUTCString();
        let sunset = utcString.slice(-12, -7);
        let isFavorite = <a href={"#"} className={"active-text"} onClick={this.onSaveFavorite}><i className="fas fa-plus" /> Add to Favorites</a>;
        if (this.props.isFavorite.length > 0) {
            isFavorite = <a href={"#"} className={"active-text"} onClick={this.onRemoveFavorite}><i className="fas fa-minus" /> Remove from Favorites</a>;
        }
        return (
            <div className="card active-pane" style={{backgroundColor:format.bgColor ? format.bgColor : '#cccccc'}}>
                <div className="card-body">
                    <span className={"float-right"}>
                        <i className={"weather-icon fas " + format.icon} style={{color:format.iconColor ? format.iconColor : '#ffffff'}}/>
                    </span>
                    <h1><div className={"active-text"}>{this.props.activeLocation}</div></h1>
                    {isFavorite}
                    <div><div className={"active-text temp-text"}>{Math.round(data.main.temp)}&#176;</div></div>
                    <div className={"active-text"}>High: {Math.round(data.main.temp_max)}&#176;</div>
                    <div className={"active-text"}>Low: {Math.round(data.main.temp_min)}&#176;</div>
                    <div className={"active-text"}>Pressure: {Math.round(data.main.pressure)}</div>
                    <div className={"active-text"}>Visibility: {Math.round(data.visibility/1609.344)} mi</div>
                    <div className={"active-text"}>Sunrise: {sunrise} Sunset: {sunset}</div>
                    <div className={"active-text"}>Wind: <i className={"fas fa-long-arrow-alt-up"} style={{transform:"rotate(" +data.wind.deg + "deg)",textShadow:"none"}}/> {Math.round(data.wind.speed)}mph</div>

                </div>
            </div>
        );
    }

}

export default ActiveContainer;
