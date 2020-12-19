// console.table(window.location)
// console.log(window.location.pathname)
const page = document.location.pathname
const links = document.getElementsByClassName('nav-link')
// console.log(links)
for (let link of links) {
  // console.log(link.getAttribute('href'))
  link.getAttribute('href') === page
    ? link.classList.add('active')
    : link.classList.remove('active')
}

if ('serviceWorker' in navigator) {
  try {
    navigator.serviceWorker.register('./sw.js')
    console.log('SW registered')
  } catch (err) {
    console.log(err)
  }
}
