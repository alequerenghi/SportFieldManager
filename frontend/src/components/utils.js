const searchSingle = async (collection, val) => {
  const response = await fetch(`/api/${collection}?q=${val}`);
  const data = await response.json();
  return data;
};

export { searchSingle };
