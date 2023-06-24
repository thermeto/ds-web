import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

api.interceptors.response.use(
  response => {
    // If the request succeeds, we don't have to do anything and just return the response
    return response;
  },
  error => {
    // If the request fails, we can inspect the error
    if (error.response) {
      console.log('The request was made and the server responded with a status code')
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log('The request was made but no response was received')
      console.log(error.request);
    } else {
      console.log('Something happened in setting up the request that triggered an Error')
      console.log('Error', error.message);
    }
    console.log(error.config);

    // We reject the promise here, so the error can still be caught by the catch block of the calling code
    return Promise.reject(error);
  }
);

export default api;
