const API_KEY = '15d2ea6d0dc1d476efbca3eba2b9bbfb';
const IMAGE_PATH = 'https://image.tmdb.org/t/p/w500';
let allMovies = [];
let selectedMovie = null;
if (!localStorage.getItem('kero')) {
  localStorage.setItem('kero', JSON.stringify({ username: 'kero', password: '1234' }));
}

document.addEventListener('DOMContentLoaded', () => {
  setupAllListeners();
  checkLoginStatus();
});

function setupAllListeners() {
  document.getElementById('go-to-signup').onclick = (e) => {
    e.preventDefault();
    document.getElementById('login-form-box').classList.add('hidden');
    document.getElementById('signup-form-box').classList.remove('hidden');
  };
  document.getElementById('go-to-login').onclick = (e) => {
    e.preventDefault();
    document.getElementById('signup-form-box').classList.add('hidden');
    document.getElementById('login-form-box').classList.remove('hidden');
  };
  document.getElementById('signup-form').onsubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if (!username || !password) return;

    if (localStorage.getItem(username)) {
      alert('This username is already taken. Please choose another one.');
      return;
    }

    localStorage.setItem(username, JSON.stringify({ username, password }));

    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
    allUsers.push(username);
    localStorage.setItem('all_users', JSON.stringify(allUsers));

    alert('Account created! Please login.');
    document.getElementById('signup-form').reset();
    document.getElementById('go-to-login').click();
  };
  document.getElementById('login-form').onsubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const savedUser = JSON.parse(localStorage.getItem(username));

    if (savedUser && savedUser.password === password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUsername', username);
      showDashboard(username);
      fetchMovies();
    } else {
      alert('Invalid Username or Password!');
    }
  };

  document.getElementById('logout-btn').onclick = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUsername');
    location.reload();
  };
  document.getElementById('search-input').oninput = (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = allMovies.filter(m => m.title.toLowerCase().includes(query));
    displayMoviesList(filtered);
  };
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.onclick = (e) => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const catId = e.target.dataset.category;
      fetchMovies(catId === 'all' ? null : catId);
    };
  });
  document.getElementById('back-to-home-btn').onclick = () => {
    document.getElementById('video-player').src = "";
    document.getElementById('details-section').classList.add('hidden');
    document.getElementById('review-section').classList.add('hidden');

    document.getElementById('hero-banner').classList.remove('hidden');
    document.getElementById('movies-section').classList.remove('hidden');
    document.querySelector('.categories-section').classList.remove('hidden');
  };
  document.getElementById('finish-watching-btn').onclick = () => {
    document.getElementById('video-player').src = "";
    document.getElementById('details-section').classList.add('hidden');
    document.getElementById('review-section').classList.remove('hidden');
    if (selectedMovie) {
      document.getElementById('review-movie-title').textContent = selectedMovie.title;
    }
  };
  document.getElementById('submit-review-btn').onclick = () => {
    const rating = document.getElementById('rating-select').value;
    const comment = document.getElementById('review-comment').value.trim();

    if (!comment) {
      alert('Please write a review comment!');
      return;
    }
    const reviews = JSON.parse(localStorage.getItem('movie_reviews') || '[]');
    reviews.push({
      movieId: selectedMovie ? selectedMovie.id : '',
      movieTitle: selectedMovie ? selectedMovie.title : '',
      username: localStorage.getItem('currentUsername'),
      rating: rating,
      comment: comment
    });
    localStorage.setItem('movie_reviews', JSON.stringify(reviews));
    playSuccessSound();
    alert('Review saved successfully!');
    document.getElementById('review-comment').value = '';
    document.getElementById('back-to-home-btn').click();
  };
}

async function fetchMovies(genreId = null) {
  try {
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    if (genreId) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    allMovies = data.results || [];

    if (allMovies.length > 0) {
      displayHeroMovie(allMovies[0]);
      displayMoviesList(allMovies.slice(1));
    }
  } catch (err) {
    console.error('API Error:', err);
  }
}

function displayHeroMovie(movie) {
  const hero = document.getElementById('hero-banner');
  if (movie.backdrop_path) {
    hero.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
  }
  document.getElementById('hero-title').textContent = movie.title;
  document.getElementById('hero-overview').textContent = movie.overview ? movie.overview.slice(0, 150) + '...' : '';

  document.getElementById('hero-watch-btn').onclick = () => openMovieDetails(movie);
}

function displayMoviesList(movies) {
  const grid = document.getElementById('movies-grid');
  grid.innerHTML = '';

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    const poster = movie.poster_path ? IMAGE_PATH + movie.poster_path : 'https://via.placeholder.com/500x750';

    card.innerHTML = `
      <img src="${poster}" alt="${movie.title}">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <span>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10</span>
      </div>
    `;

    card.onclick = () => openMovieDetails(movie);
    grid.appendChild(card);
  });
}

async function openMovieDetails(movie) {
  selectedMovie = movie;

  document.getElementById('hero-banner').classList.add('hidden');
  document.getElementById('movies-section').classList.add('hidden');
  document.querySelector('.categories-section').classList.add('hidden');
  document.getElementById('review-section').classList.add('hidden');

  document.getElementById('details-section').classList.remove('hidden');

  document.getElementById('detail-title').textContent = movie.title;
  document.getElementById('detail-overview').textContent = movie.overview || '';

  loadSavedReviews(movie.id);

  const player = document.getElementById('video-player');
  try {
    const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`);
    const videoData = await videoRes.json();
    const trailer = videoData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

    if (trailer) {
      player.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
    } else {
      player.src = "https://www.youtube.com/embed/dQw4w9WgXcQ";
    }
  } catch (e) {
    player.src = "https://www.youtube.com/embed/dQw4w9WgXcQ";
  }
}

function loadSavedReviews(movieId) {
  const list = document.getElementById('saved-reviews-list');
  const reviews = JSON.parse(localStorage.getItem('movie_reviews') || '[]');
  
  // استخدام == بدل === لتجنب اختلاف النوع بين String و Number
  const movieReviews = reviews.filter(r => r.movieId == movieId);

  if (movieReviews.length === 0) {
    list.innerHTML = '<p class="no-reviews">No reviews yet for this movie.</p>';
    return;
  }

  list.innerHTML = movieReviews.map(r => `
    <div class="saved-review-item">
      <div class="review-top">
        <span>${r.username}</span>
        <span>⭐ ${r.rating} / 5</span>
      </div>
      <p>${r.comment}</p>
    </div>
  `).join('');
}

function showDashboard(username) {
  document.querySelector('.auth-card').classList.add('hidden');
  document.getElementById('main-dashboard').classList.remove('hidden');
  document.getElementById('user-display-name').textContent = `Welcome, ${username}`;
}

function checkLoginStatus() {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    const username = localStorage.getItem('currentUsername');
    showDashboard(username);
    fetchMovies();
  }
}

function playSuccessSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
  oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.2);
  
  gain.gain.setValueAtTime(0.3, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}