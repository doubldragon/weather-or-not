import React from 'react';

class ActiveContainer extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {
        let data = this.props.weatherData;
        let format = this.props.weatherFormat;
        let stamp = data.sys.sunrise + data.timezone;
        let utcString = new Date(stamp * 1000).toUTCString();
        let sunrise = utcString.slice(-11, -7);
        stamp = data.sys.sunset + data.timezone;
        utcString = new Date(stamp * 1000).toUTCString();
        console.log(utcString);
        let sunset = utcString.slice(-12, -7);
        return (
            <div className="card active-pane" style={{backgroundColor:format.bgColor ? format.bgColor : '#cccccc'}}>
                <div className="card-body">
                    <span className={"float-right"}>
                        <i className={"weather-icon fas " + format.icon} style={{color:format.iconColor ? format.iconColor : '#ffffff'}}/>
                    </span>
                    <h1><div className={"active-text"}>{this.props.activeLocation[0]}</div></h1>
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
