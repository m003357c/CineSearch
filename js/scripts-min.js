function initMap(){if(null===document.getElementById("cineMap"))return!1;var a={lat:53.010596,lng:-2.179887};map=new google.maps.Map(document.getElementById("cineMap"),{zoom:12,center:a,zoomControl:!0,mapTypeControl:!1,scaleControl:!0,streetViewControl:!1,rotateControl:!1,fullscreenControl:!1,draggable:!0}),navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(a){var b={lat:a.coords.latitude,lng:a.coords.longitude};map.setCenter(b)})}"serviceWorker"in navigator&&navigator.serviceWorker.register("serviceworker.js").then(function(a){console.log("Service worker registered successfully")}).catch(function(a){console.log("Service worker registration failed: ",a)});let map;const markersArray=[];let marker,options={enableHighAccuracy:!0,timeout:5e3,maximumAge:0};const boxOfficeContainer=document.getElementById("boxOffice");boxOfficeContainer&&fetch("js/films.json").then(a=>a.json()).then(a=>{const b=a.map(a=>`<a href="#mapHolder" class="film-option"><figure role="group">
\t\t\t  <img src="${a.picture}" alt="${a.name} Movie Poster">
\t\t\t  <figcaption>${a.name}</figcaption>
\t\t\t  </figure></a>`).join("\n");boxOfficeContainer.innerHTML=b}),$(document).ready(function(){function a(){$("#boxOffice").hide(),$("#mapHolder, .container").addClass("tallMap"),$("#searchBox").addClass("absoluteSearch"),setTimeout(function(){$(".top-bar li img").addClass("is-showing");var a=map.getCenter();google.maps.event.trigger(map,"resize"),map.setCenter(a);var b=new XMLHttpRequest;b.open("GET","js/cinemas.json",!0),b.onload=function(){var a=new google.maps.InfoWindow({content:""});if(b.status>=200&&b.status<400)for(var c=JSON.parse(b.responseText),d=0;d<c.length;d++)!function(b){marker=new google.maps.Marker({position:new google.maps.LatLng(b.latitude,b.longitude),map:map,icon:"assets/images/cinesearch-map-icon.png",visible:!0}),google.maps.event.addListener(marker,"click",function(){a.setContent("<h1>"+b.name+'</h1><p><span class="cineLoc">'+b.location+"</span><em> "+b.address+'</em></p><a href="#" class="btn viewing-times-link">Viewing Times</a>'),a.open(map,this)}),markersArray.push(marker)}(c[d]);else console.log("Error returned")},b.onerror=function(){console.log("Complete Error")},b.send()},500)}$("#searchBox .btn").click(a),$("body").on("click","a.search",a),$("body").on("click","a.film-option",function(a){$("#searchBox .filmSearch").remove(),$("a.film-search").hasClass("film-search")&&$("a.film-search").removeClass("film-search"),$(this).addClass("film-search"),$("#searchBox form").hide();var b=$(this).children().children("figcaption").text(),c="<div class='filmSearch'><h2>Cinemas Showing<br><strong>'"+b+"'</strong></h2><p><a href='#' class='btn search'>Search</a><a href='#' class='btn cancel-search'>Cancel</a></p></div>";$("#searchBox").append(c),a.preventDefault();var d=this.hash;$target=$(d),$("html, body").stop().animate({scrollTop:$target.offset().top},900,"swing",function(){window.location.hash=d})}),$("body").on("click","a.cancel-search",function(){$("a.film-search").removeClass("film-search"),$("#searchBox form").show(),$("#searchBox .filmSearch").remove()}),$("body").on("click","a.viewing-times-link",function(){$("#filmTimes").show();var a=$(this).parent().children("h1").text(),b=$(this).parent().children("p").children("span").text();$(".film-times-inner h2").html(a+"<br> <small>"+b+"</small>");var c=new XMLHttpRequest;c.open("GET","js/films.json",!0),c.onload=function(){if(c.status>=200&&c.status<400)for(var a=JSON.parse(c.responseText),b=0;b<a.length;b++)!function(a){var b='<div class="film-list-land"><div class="film-out"><div class="film-thumb"><img src="'+a.picture+'" alt="'+a.name+' Movie Poster"/></div><div class="film-times"><h5>'+a.name+'</h5><p><a href="#" class="date-controls active">Today</a><a href="#" class="date-controls">17/04/17</a><a href="#" class="date-controls">18/04/17</a></p><table><tr><th>3D</th><td>'+a.times.td[0]+"</td><td>"+a.times.td[1]+"</td><td>"+a.times.td[2]+"</td><td>"+a.times.td[3]+"</td><td>"+a.times.td[4]+"</td></tr><tr><th>Standard</th><td>"+a.times.standard[0]+"</td><td>"+a.times.standard[1]+"</td><td>"+a.times.standard[2]+"</td><td>"+a.times.standard[3]+"</td><td>"+a.times.standard[4]+'</td></tr></table></div></div></div><div class="film-list-port"><div class="film-out"><div class="film-thumb"><img src="'+a.picture+'" alt="'+a.name+' Movie Poster"/></div><div class="film-times"><h5>'+a.name+'</h5><p>Today</p><ul><li class="dropdown"><a href="#">3D</a><ul class="dropdown-menu"><li>'+a.times.td[0]+"</li><li>"+a.times.td[1]+"</li><li>"+a.times.td[2]+'</li></ul></li><li class="dropdown"><a href="#">Standard</a><ul class="dropdown-menu"><li>'+a.times.standard[0]+"</li><li>"+a.times.standard[1]+"</li><li>"+a.times.standard[2]+"</li><li>"+a.times.standard[3]+"</li><li>"+a.times.standard[4]+"</li></ul></li></ul></div></div></div>";$(".film-times-inner").append(b),$(".film-list-land td:contains('undefined')").empty(),$(".film-list-port .dropdown-menu li:contains('undefined')").remove()}(a[b]);else console.log("Error returned")},c.onerror=function(){console.log("Complete Error")},c.send()}),$("body").on("click","span.btn-close",function(){$("#filmTimes").hide(),$(".film-times-inner").empty()}),$("body").on("click","li.dropdown a",function(a){a.preventDefault(),$(this).parent().hasClass("open")?$(this).parent().removeClass("open"):$(this).parent().addClass("open")}),$("body").on("click",".dropdown-menu li",function(){var a=$(this).text();$(this).parent().parent().toggleClass("open active").children("a").text(a);var b=$(this).parent().parent().parent().parent().children("h5").text();console.log(b),localStorage.setItem("lastVisited",b)}),$("body").on("click","a.date-controls",function(){$(".date-controls.active").removeClass("active"),$(this).addClass("active")})});
