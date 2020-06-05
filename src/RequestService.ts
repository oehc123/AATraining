import * as React from 'react';

const BASE_URL = `https://sample-movie-api.web.app/`

class RequestService extends React.Component {
  static async fetchMovies(){
    const response = await fetch(BASE_URL+ '/movies', {
      method: 'GET',
    });
    return response.json()
  }
};

export default RequestService;