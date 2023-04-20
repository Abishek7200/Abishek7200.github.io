const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const clearButton = document.getElementById('clear-button');
const loading = document.getElementById('loading');

const allSongsRadio = document.getElementById('all-songs');
const selectedSongsRadio = document.getElementById('selected-songs');
const songList = document.getElementById('options');

allSongsRadio.addEventListener('change', function() {
  // Show all songs
  Array.from(songList.options).forEach(function(option) {
    option.style.display = 'block';
  });
});

selectedSongsRadio.addEventListener('change', function() {
  // Filter selected songs
  Array.from(songList.options).forEach(function(option) {
    if (option.song-type === 'worship') {
      option.style.display = 'block';
    } else {
      option.style.display = 'none';
    }
  });
});

searchInput.addEventListener('input', function() {
  // Filter songs based on search query
  const query = searchInput.value.toLowerCase();
  Array.from(songList.children).forEach(function(song) {
    if (song.textContent.toLowerCase().indexOf(query) === -1) {
      song.style.display = 'none';
    } else {
      song.style.display = 'block';
    }
  });
});

// add a click event listener to the search button
searchButton.addEventListener('click', () => {
  // get the selected song from the search input
  const selectedSong = searchInput.value;

  if (!selectedSong) {
    alert('Please select a song before clicking search button');
    return;
  }
  else{
    loading.classList.add('loading');
  }

  // fetch the XML file for the selected song
  fetch(selectedSong)
    .then(response => response.text())
    .then(data => {
      // parse the XML data and extract the song title and lyrics
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'application/xml');
      const title = xml.querySelector('title').textContent;
      const lyrics = xml.querySelector('lyrics').innerHTML;

      // remove the loading animation and display the search button text
      loading.classList.remove('loading');

      // remove any existing song title and lyrics from the webpage
      let existingTitle = document.querySelector('h2');
      if (existingTitle) {
        existingTitle.remove();
      }
      let existingLyrics = document.querySelector('p');
      if (existingLyrics) {
        existingLyrics.remove();
      }

      // display the song title and lyrics on the webpage
      const songTitle = document.createElement('h2');
      songTitle.textContent = title;
      const songLyrics = document.createElement('p');
      songLyrics.innerHTML = lyrics;
      const songarea = document.body.querySelector('#songarea')
      songarea.appendChild(songTitle);
      songarea.appendChild(songLyrics);
    })
    .catch(error => {
      // display an error message if the XML file could not be fetched
      const errorMessage = document.createElement('p');
      errorMessage.textContent = `Error fetching XML file: ${error}`;
      const resultsContainer = document.getElementById('results-container');
      resultsContainer.innerHTML = '';
      resultsContainer.appendChild(errorMessage);
      // remove the loading animation and display the search button text
      loading.classList.remove('loading');

    });
});

clearButton.addEventListener('click', () => {
  searchInput.value = ''; // reset the value of the input field
  songarea.style.display='none'
});

const copyButton = document.querySelector('#copy-button');

copyButton.addEventListener('click', () => {
  const stitle = document.querySelector('body h2');
  const slyrics = document.querySelector('body p');
  const text = stitle.innerText + '\n\n' + slyrics.innerText + '\n\n' + '\n' + "https://s0qylkppodzgzu9p6xujiw.on.drv.tw/www.tamil_christian_song_lyrics.com/render.html";

  try {
    navigator.clipboard.writeText(text)
      .then(() => {
        copyButton.innerHTML = 'Copied';
        setTimeout(() => {
          copyButton.innerHTML = 'Copy';
        }, 3000); // Change back to 'Copy' after 5 seconds
      })
      .catch((error) => {
        console.error('Failed to copy lyrics: ', error);
      });
  } catch (err) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
    copyButton.innerHTML = 'Copied';
    setTimeout(() => {
      copyButton.innerHTML = 'Copy';
    }, 3000); // Change back to 'Copy' after 5 seconds
  }
});
