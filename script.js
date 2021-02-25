function setHeigth(){
    let viewport = document.getElementById('viewport-meta')
    let viewheight = window.innerHeight
    let viewwidth = window.innerWidth
    viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0");
    console.log('viewport')
}

const locationDOM = document.getElementById('location')
const timezone  = document.getElementById('timezone')
const ipAddress = document.getElementById('ip-adress')
const isp   = document.getElementById('isp')
const searchIcon = document.getElementById('search-icon')
const loadingIcon = document.getElementById('loading-icon')
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
const apiKey= 'at_tvKWjQxCkjcUgn2b5YWu8uHevhT8O'
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiMHB0MWMwIiwiYSI6ImNrbGp0Znp1djBtYWkybm13c2o4cDFudDYifQ.FwDwxesRh_rVNv8u8240rA'
}).addTo(mymap);

setHeigth()

var locationIcon = L.icon({
    iconUrl : './images/icon-location.svg',
    iconSize: [50, 50],
})

function ValidateIPaddress(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
      return (true)  
    }  
    return (false)  
}

function setDOM(data){
    locationDOM.innerHTML = `${data.location.region},${data.location.country},${data.location.postalCode}`
    timezone.innerHTML = `UTC ${data.location.timezone}`
    ipAddress.innerHTML = data.ip
    isp.innerHTML = data.isp
}

function setViewMap(data){
    mymap.setView([data.location.lat,data.location.lng], 13)
    var marker = L.marker([data.location.lat,data.location.lng],{icon: locationIcon}).addTo(mymap);
    marker.bindPopup('Hello there')
}

async function getGeoData(search){
    if(ValidateIPaddress(search)){
        const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=at_tvKWjQxCkjcUgn2b5YWu8uHevhT8O&ipAddress=${search}`)
        const data = await response.json()
        await console.log(data)
        await setViewMap(data)
        await setDOM(data)
        await stopLoading()
    }
    else{
        const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=at_tvKWjQxCkjcUgn2b5YWu8uHevhT8O&domain=${search}`)
        const data = await response.json()
        await console.log(data)
        if(!data.location){
            alert("please enter a valid search")
            stopLoading()
        }
        await setViewMap(data)
        await setDOM(data)
        await stopLoading()
    }
    
}

function submitSearch(event){
    event.preventDefault()
    startLoading()
    const value = document.getElementById('input-search').value
    console.log(value)
    getGeoData(value)
}


function startLoading(){
    searchIcon.classList.add('hide')
    loadingIcon.classList.add('show')
}
function stopLoading(){
    searchIcon.classList.remove('hide')
    loadingIcon.classList.remove('show')
}