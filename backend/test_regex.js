const url1 = `<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/-8KkwpttrwY?si=wE2OavD-9OBTfWQl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
const url2 = `https://www.youtube.com/watch?v=-8KkwpttrwY`;
const url3 = `https://youtu.be/-8KkwpttrwY?si=wE2OavD-9OBTfWQl`;
const url4 = `-8KkwpttrwY`;

const extractYoutubeId = (url) => {
  if (!url) return null;
  const srcMatch = url.match(/src=["'](.*?)["']/);
  const targetStr = srcMatch ? srcMatch[1] : url;

  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = targetStr.match(regExp);
  
  if (match && match[1].length === 11) {
    return match[1];
  }
  
  if (url.trim().length === 11) {
    return url.trim();
  }
  
  return url;
};

console.log(extractYoutubeId(url1));
console.log(extractYoutubeId(url2));
console.log(extractYoutubeId(url3));
console.log(extractYoutubeId(url4));
