import * as React from 'react';

const BASE_URL = `https://sample-movie-api.web.app/`

class RequestService extends React.Component {
  static fetchMovies(){
    console.log('jose fetchmovies');
    fetch(BASE_URL+ '/movies', {
      method: 'GET',
    });
    return 'something'
  }
};

export default RequestService;