import React from 'react';

class FaveContainer extends React.Component {
    constructor(props) {
        super(props);
        this.setToActive =this.setToActive.bind(this);
    }

    setToActive() {
        this.props.onSelect(this.props.data,this.props.weatherData[0])
    }

    render(){
        let format = this.props.weatherData.length > 0 ? this.props.formats[this.props.weatherData[0].weather[0].icon] : [];
        return (
            <div className="card fave-card" style={{backgroundColor:  format ? format.bgColor : "#cccccc"}} key={this.props.data.city_id} onClick={this.setToActive}>
                <div className="card-body" >
                    <div className={"active-text"}>{this.props.data.name} {format ? Math.round(this.props.weatherData[0].main.temp) : ""}&#176;
                        <i className={"fas fa-2x float-right fave-icon " + (format ? format.icon : "") } style={{color:(format ? format.iconColor : "#ffffff")}}/>
                    </div>

                </div>
            </div>
        );
    }

}

export default FaveContainer;
