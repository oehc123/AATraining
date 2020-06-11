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

  static async loginWithUsernameAndPassword(username: string, password: string) {
    try {
      const response = await fetch(BASE_URL+ 'login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
       body: `password=`+password+`&username=`+username
      });
      const responseBody = await response.json()
      if(!responseBody.user) {
        return responseBody
      }
      else {
        return await this.requestWatchList(responseBody)
      }
    } catch(e){ console.log( 'error at loginWithUsernameAndPassword ', e)}
  }

  static async requestWatchList(response: {user: {email: string, token: string}}) {
    const myWatchListResponse = await fetch(BASE_URL+ 'watchlist', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer `+response.user.token
      }
    });
    const myWatchList = await myWatchListResponse.json()
    return myWatchList
  }
}

export default RequestService;