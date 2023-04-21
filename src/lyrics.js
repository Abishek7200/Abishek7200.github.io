const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const clearButton = document.getElementById('clear-button');
const loading = document.getElementById('loading');

const allSongsRadio = document.getElementById('all-songs');
const worshipSongsRadio = document.getElementById('worship-songs');
const songSearch = document.getElementById('search-input');
const songList = document.getElementById('options');

allSongsRadio.addEventListener('change', function() {
  searchInput.removeAttribute('list')
  searchInput.setAttribute('list','all')
});

worshipSongsRadio.addEventListener('change', function() {
  searchInput.removeAttribute('list')
  searchInput.setAttribute('list','worship')
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
      let lyrics = xml.querySelector('lyrics').innerHTML;
      
      // Remove <br> element that is the first child of each <verse> element
      const verseElements = xml.querySelectorAll('verse');
      verseElements.forEach(verseElement => {
        const brElement = verseElement.querySelector('br:first-child');
        if (brElement !== null && brElement.nextElementSibling !== null) {
          brElement.remove();
        }
      });
      lyrics = xml.querySelector('lyrics').innerHTML;

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
  loading.classList.remove('loading');
});

const copyButton = document.querySelector('#copy-button');

copyButton.addEventListener('click', () => {
  const stitle = document.querySelector('body h2');
  const slyrics = document.querySelector("div[id='songarea'] p verse").innerText.replace(/\n/g, '<br>');;
  const text = stitle.innerText + '\n\n' + slyrics + '\n\n' + '\n' + "https://abishek7200.github.io/render.html";

  try {
    navigator.clipboard.writeText(text)
      .then(() => {
        copyButton.innerHTML = 'Copied!';
        setTimeout(() => {
          copyButton.innerHTML = 'Copy';
        }, 2000); // Change back to 'Copy' after 5 seconds
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
    copyButton.innerHTML = 'Copied!';
    setTimeout(() => {
      copyButton.innerHTML = 'Copy';
    }, 2000); // Change back to 'Copy' after 5 seconds
  }
});
