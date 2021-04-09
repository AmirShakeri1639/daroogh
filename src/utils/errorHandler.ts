import routes from "routes";

export default (e: any): void => {
  if (e.response) {
    console.error(`Error in api response: ${JSON.stringify(e.response.data)}`);
  } else if (e.request) {
    console.error(`Error in api request: ${e.request}`);
  } else {
    console.error(`Error in api callback: ${e.message ?? JSON.stringify(e)}`);
  }
  
  if (e.response?.data?.status === 401) {
    window.location.hash = routes.error401
  }
};
