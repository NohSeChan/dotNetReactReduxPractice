import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface WeatherForecastsState {
    isLoading: boolean;
    startDateIndex?: number;
    forecasts: WeatherForecast[];
}

export interface WeatherForecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

interface RequestWeatherForecastsAction {
    type: 'REQUEST_WEATHER_FORECASTS';
    startDateIndex: number;
}

interface ReceiveWeatherForecastsAction {
    type: 'RECEIVE_WEATHER_FORECASTS';
    startDateIndex: number;
    forecasts: WeatherForecast[];
}

type KnownAction = RequestWeatherForecastsAction | ReceiveWeatherForecastsAction;

export const actionCreators = {
    requestWeatherForecasts: (startDateIndex: number): AppThunkAction<KnownAction> => (
        (dispatch, getState) => {
            const appState = getState();
            if (appState.weatherForecasts && appState.weatherForecasts.startDateIndex !== startDateIndex) {
                fetch(`weatherforecast`)
                    .then(response => response.json() as Promise<WeatherForecast[]>)
                    .then(data => {
                        dispatch({
                            type: 'RECEIVE_WEATHER_FORECASTS',
                            startDateIndex: startDateIndex,
                            forecasts: data
                        });
                    });
                dispatch({
                    type: 'REQUEST_WEATHER_FORECASTS',
                    startDateIndex: startDateIndex
                });
            }
        }
    )
}

const unloadedState: WeatherForecastsState = { forecasts: [], isLoading: false };

export const reducer: Reducer<WeatherForecastsState>
    = (state: WeatherForecastsState | undefined, incomingAction: Action): WeatherForecastsState => {
        if (state === undefined) {
            return unloadedState;
        }

        const action = incomingAction as KnownAction;
        switch (action.type) {
            case 'REQUEST_WEATHER_FORECASTS':
                return {
                    startDateIndex: action.startDateIndex,
                    forecasts: state.forecasts,
                    isLoading: true
                };
            case 'RECEIVE_WEATHER_FORECASTS':
                if (action.startDateIndex === state.startDateIndex) {
                    return {
                        startDateIndex: action.startDateIndex,
                        forecasts: action.forecasts,
                        isLoading: false
                    };
                }
                break;
        }

        return state;
    };
