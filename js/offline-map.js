document.getElementById('cineMap').classList.add('offline-map');
document.getElementById('boxOffice').innerHTML = '';

var offlineFilm = JSON.parse(localStorage.getItem('lastVisited'));
console.log(offlineFilm);

const offlineBoxOffice = document.getElementById('boxOffice');
const filmOutput =  "<div class='film-list-port'>" +
                  "<div class='film-out'>" +
                    "<div class='film-thumb'>" +
                    "<img src='${film[0].picture}' alt='"+ offlineFilm + " Movie Poster'/>" +
                    "</div>" +
                    "<div class='film-times'>" +
                    "<h5>"+ offlineFilm + "</h5>" +
                    "<p>" +
                        "<a href='#' class='btn date-change'>&lt;</a>" +
                       " Today" +
                       " <a href='#' class='btn date-change'>&gt;</a>" +
                    "</p>" +
                    "<ul>" +
                      "<li class='dropdown'>" +
                       " <a href='#'>3D</a>" +
                        "<ul class='dropdown-menu'>" +
                          "<li>${film[0].times.td[0]}</li>" +
                          "<li>${film[0].times.td[1]}</li>" +
                          "<li>${film[0].times.td[2]}</li>" +
                       " </ul>" +
                     " </li>" +
                      "<li class='dropdown'>" +
                       " <a href='#'>Standard</a>" +
                        "<ul class='dropdown-menu'>" +
                         " <li>${film[0].times.standard[1]}</li>" +
                         " <li>${film[0].times.standard[2]}</li>" +
                         " <li>${film[0].times.standard[3]}</li>" +
                         " <li>${film[0].times.standard[4]}</li>" +
                        "</ul>" +
                     " </li>" +
                   " </ul>" +
                   " </div>" +
                  "</div>" +
                "</div>";

offlineBoxOffice.innerHTML = filmOutput;
   
var offlineSearch = '<h2>You are offline</h2><p>The films and times below are from your previous search</p>';
document.getElementById('searchBox').innerHTML = offlineSearch;
