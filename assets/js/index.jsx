import  React from 'react';
import {render} from 'react-dom';
import Weather from './Weather.jsx';


if (document.getElementById('weather-app')) {
    render (<Weather />, document.getElementById('weather-app'))
}
