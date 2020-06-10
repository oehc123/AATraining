const BASE_URL = `https://sample-movie-api.web.app/`

class RequestService {
  static async fetchMovies(){
    const response = await fetch(BASE_URL+ '/movies', {
      method: 'GET',
    });
    return response.json()
  }

  static async fetchMoviesByCategory(category: string){
    const response = await fetch(BASE_URL+ '/movies?category='+ category, {
      method: 'GET',
    });
    return response.json()
  }

  static async fetchCategories() {
    const response = await fetch(BASE_URL+ '/categories', {
      method: 'GET',
    });
    return response.json()
  }
};

export default RequestService;