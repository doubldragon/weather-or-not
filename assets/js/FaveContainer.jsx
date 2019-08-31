import React from 'react';

class FaveContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            weatherData: [],

        }
        this.getLocationData = this.getLocationData.bind(this);
    }

    componentDidMount() {
        this.getLocationData();
    }

    getLocationData() {
        console.log(this.props.apiKey);
        fetch("http://api.openweathermap.org/data/2.5/weather?id=2172797&appid=" + this.props.apiKey + "&units=imperial", {credentials: "same-origin"})
            .then((response) => response.json()).then((responseJson) => {
            console.log(responseJson);
            // this.setState({
            //     currentWeatherData: responseJson,
            // })
        })
            .catch((error) => {
                console.error(error);
            });
    }



    render(){

        return (
            <div className="card fave-card">
                <div className="card-body" style={{bgColor:"#000000"}}>
                    Favorite {this.props.id}
                </div>
            </div>
        );
    }

}

export default FaveContainer;
