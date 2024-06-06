import $ from 'jquery';
import BaseSection from './base';

export default class CanadaPopUp extends BaseSection {
};


function getGEO(){
  const request = new XMLHttpRequest()
  request.open('GET', 'https://api.ipgeolocation.io/ipgeo?apiKey=6a0601a8b2424c80a751bfd3962a380b', true)
  request.onload = function() {
    var data = JSON.parse(this.response);
    console.log(data);
    if (data.country_code2 === 'CA') {
        document.getElementById('popUpCanadaBox').style.display = 'block';
        document.getElementById('canadaBoxOverlay').style.display = 'block';
    }else{
      document.cookie = 'visitedFromCA_NOT=true; expires=Fri, 31 Dec 2038 23:59:59 GMT';
    };
  };
  request.send()
};

if (document.cookie.indexOf('visitedFromCA=') <= 0 && document.cookie.indexOf('visitedFromCA_NOT=') <= 0 ) {
  document.cookie = 'visitedFromCA=yes;max-age=172800'
  getGEO();
};

function closeBox(){
  document.getElementById('popUpCanadaBox').style.display = 'none';
  document.getElementById('canadaBoxOverlay').style.display = 'none';
};
document.querySelector('#stayOn4momsUS').addEventListener('click',closeBox);

$( '#CanadaLearnMore' ).click(function() {
  $( '#moreCAInfo' ).toggleClass( 'collapsed' );
});

$( '#CanadaLearnMore' ).click(function() {
  $( '#alcoArrow' ).toggleClass( 'rotateArrow' );
});

