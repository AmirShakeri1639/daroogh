const useQueryString = (queryParam: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const item = urlParams.get(queryParam);
  return item;
};

export default useQueryString;
