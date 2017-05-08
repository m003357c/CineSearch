document.getElementById('cineMap').classList.add('offline-map');
document.getElementById('boxOffice').innerHTML = '';

var offlineFilm = JSON.parse(localStorage.getItem('lastVisited'));

const offlineBoxOffice = document.getElementById('boxOffice');
if(offlineBoxOffice){
    fetch("js/films.json")
        .then(response => {
            return response.json();
        }).then(films => {
            const filmOutput = films.map(film => {
                return `<div class="film-list-land">
                          <div class="film-out">
                            <div class="film-thumb">
                                <img src="${film.picture}" alt="${film.name} Movie Poster"/>
                            </div>
                            <div class="film-times">
                                <h5>${film.name}</h5>
                                <p>
                                    <a href="#" class="date-controls active">Today</a>
                                    <a href="#" class="date-controls">17/04/17</a>
                                    <a href="#" class="date-controls">18/04/17</a>
                                </p>
                                <table>
                                  <tr>
                                    <th>3D</th>
                                    <td>${film.times.td[0]}</td>
                                    <td>${film.times.td[1]}</td>
                                    <td>${film.times.td[2]}</td>
                                    <td>${film.times.td[3]}</td>
                                    <td>${film.times.td[4]}</td>
                                  </tr>
                                  <tr>
                                    <th>Standard</th>
                                    <td>${film.times.standard[0]}</td>
                                    <td>${film.times.standard[1]}</td>
                                    <td>${film.times.standard[2]}</td>
                                    <td>${film.times.standard[3]}</td>
                                    <td>${film.times.standard[4]}</td>
                                  </tr>
                                </table>
                                </div>
                              </div>
                            </div>
                            <div class="film-list-port">
                              <div class="film-out">
                                <div class="film-thumb">
                                <img src="${film.picture}" alt="${film.name} Movie Poster"/>
                                </div>
                                <div class="film-times">
                                <h5>${film.name}</h5>
                                <p>
                                    <a href="#" class="btn date-change">&lt;</a>
                                    Today
                                    <a href="#" class="btn date-change">&gt;</a>
                                </p>
                                <ul>
                                  <li class="dropdown">
                                    <a href="#">3D</a>
                                    <ul class="dropdown-menu">
                                      <li>${film.times.td[0]}</li>
                                      <li>${film.times.td[1]}</li>
                                      <li>${film.times.td[2]}</li>
                                    </ul>
                                  </li>
                                  <li class="dropdown">
                                    <a href="#">Standard</a>
                                    <ul class="dropdown-menu">`
                                        /*film.times.standard.forEach(function(item, i){
                                            var standardFilmTimes = `<li>${film.times.standard[i]}</li>`;
                                            
                                        });*/
                                      
                                      //<li>${film.times.standard[1]}</li>
                                      //<li>${film.times.standard[2]}</li>
                                      //<li>${film.times.standard[3]}</li>
                                      //<li>${film.times.standard[4]}</li>
                                    `</ul>
                                  </li>
                                </ul>
                                </div>
                              </div>
                            </div>`;
            }).join("\n");            
            offlineBoxOffice.innerHTML = filmOutput;
        });
}


var offlineSearch = '<h2>You are offline</h2><p>The films and times below are from your previous search</p>';
document.getElementById('searchBox').innerHTML = offlineSearch;

/*$(document).ready(function(){
    $(".film-list-land td:contains('undefined')").empty();
    $(".film-list-port .dropdown-menu li:contains('undefined')").remove();
});*/
