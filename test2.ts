const dataToInsert = [
  { id: 1, image: "url", images: ["url1", "url2"], title: "title" }
];
const itemsToInsert = dataToInsert.map(({ id, images, ...rest }) => Object.assign(rest, images && images.length > 0 ? { image: images.join('|||') } : {}));
console.log(itemsToInsert);
