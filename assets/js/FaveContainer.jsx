import React from 'react';

class FaveContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            weatherData: [],
            icon: null,
        }
        this.getLocationData = this.getLocationData.bind(this);
    }

    componentDidMount(){
        this.getLocationData()
    }

    getLocationData() {
        fetch("http://api.openweathermap.org/data/2.5/weather?id=" + this.props.data.city_id + "&appid=" + this.props.apiKey + "&units=imperial", {credentials: "same-origin"})
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    weatherData: responseJson,
                    icon: responseJson.weather[0].icon,
                })
            })
            // .done()
            .catch((error) => {
                console.error(error);
            });
    }


    render(){
        console.log(this.props.name);
        let format = this.props.formats[this.state.icon];
        return (
            <div className="card fave-card" style={{backgroundColor:  format ? format.bgColor : "#cccccc"}} key={this.props.data.city_id}>
                <div className="card-body" >
                    <div className={"active-text"}>{this.props.data.name} {format ? Math.round(this.state.weatherData.main.temp) : ""}&#176;
                        <i className={"fas fa-2x float-right fave-icon " + (format ? format.icon : "") } style={{color:(format ? format.iconColor : "#ffffff")}}/>
                    </div>

                </div>
            </div>
        );
    }

}

export default FaveContainer;
