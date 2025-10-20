// Data keys and variables
const STORAGE_KEY = 'vtm_characters';
let characters = [];
let currentCharacterIndex = null;

// DOM references
const characterListSection = document.getElementById('character-list');
const characterCardsContainer = document.getElementById('character-cards-container');
const createCharacterBtn = document.getElementById('create-character-btn');
const characterSheetSection = document.getElementById('character-sheet');
const backToListBtn = document.getElementById('back-to-list-btn');
const characterForm = document.getElementById('character-form');

const textareaIdsToAutoResize = [
  'char-ambition',
  'char-desire',
  'char-history',
  'char-chronicle-tenets'
];

// Load characters from localStorage
function loadCharacters() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      characters = JSON.parse(stored);
      console.log(`Loaded from localStorage: ${characters.length} characters`);
    } else {
      characters = [];
      console.log('No saved characters found, starting fresh');
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    characters = [];
  }
}

// Save characters to localStorage
function saveCharacters() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    console.log(`Saved to localStorage: ${characters.length} characters`);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Render the list of character cards
function renderCharacterList() {
  characterCardsContainer.innerHTML = '';
  if (characters.length === 0) {
    characterCardsContainer.textContent = 'No characters created yet.';
    return;
  }
  characters.forEach((char, index) => {
    const card = document.createElement('div');
    card.classList.add('character-card');
    card.tabIndex = 0;
    card.innerHTML = `
      <h3>${char.name}</h3>
      <p><strong>Clan:</strong> ${char.clan || 'Unknown'}</p>
      <p><strong>Chronicle:</strong> ${char.chronicle || '-'}</p>
      <p><strong>Generation:</strong> ${char.generation || '-'}</p>
      <button class="edit-char-btn" data-index="${index}">Edit</button>
    `;
    characterCardsContainer.appendChild(card);
  });

  // Attach edit event listeners
  document.querySelectorAll('.edit-char-btn').forEach(btn =>
    btn.addEventListener('click', (e) => {
      const idx = Number(e.target.dataset.index);
      openCharacterSheet(idx);
    })
  );
}

function openCharacterSheet(index) {
  currentCharacterIndex = index;

  // Show form section, hide list
  characterListSection.hidden = true;
  characterSheetSection.hidden = false;

  // If new character
  const char = characters[index] || {};

  // Populate form fields
  document.getElementById('char-name').value = char.name || '';
  document.getElementById('char-player').value = char.player || '';
  document.getElementById('char-chronicle').value = char.chronicle || '';
  document.getElementById('char-concept').value = char.concept || '';
  document.getElementById('char-clan').value = char.clan || '';
  document.getElementById('char-generation').value = char.generation || '';
  document.getElementById('char-predator-type').value = char.predatorType || '';
  document.getElementById('char-ambition').value = char.ambition || '';
  document.getElementById('char-desire').value = char.desire || '';
  document.getElementById('char-history').value = char.history || '';
  document.getElementById('char-chronicle-tenets').value = char.chronicleTenets || '';

  // Resize narrative textareas
  textareaIdsToAutoResize.forEach(id => autoResizeTextarea(document.getElementById(id)));
}

// Auto resize a textarea to fit content
function autoResizeTextarea(textarea) {
  if (!textarea) return;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

// Attach oninput event to narrative textareas for dynamic resizing
function attachTextareaAutoResize() {
  textareaIdsToAutoResize.forEach(id => {
    const ta = document.getElementById(id);
    if (ta) {
      ta.addEventListener('input', () => autoResizeTextarea(ta));
    }
  });
}

// Save form data into characters array
function saveCharacterForm() {
  const charData = {
    name: document.getElementById('char-name').value.trim(),
    player: document.getElementById('char-player').value.trim(),
    chronicle: document.getElementById('char-chronicle').value.trim(),
    concept: document.getElementById('char-concept').value.trim(),
    clan: document.getElementById('char-clan').value,
    generation: document.getElementById('char-generation').value,
    predatorType: document.getElementById('char-predator-type').value,
    ambition: document.getElementById('char-ambition').value.trim(),
    desire: document.getElementById('char-desire').value.trim(),
    history: document.getElementById('char-history').value.trim(),
    chronicleTenets: document.getElementById('char-chronicle-tenets').value.trim(),
  };

  if (!charData.name || !charData.clan) {
    alert('Name and Clan are required fields.');
    return false;
  }

  if (currentCharacterIndex === null) {
    characters.push(charData);
  } else {
    characters[currentCharacterIndex] = charData;
  }
  saveCharacters();
  return true;
}

function init() {
  // Load character data
  loadCharacters();

  // Populate clan and predator type options (add your clan options here)
  const clanSelect = document.getElementById('char-clan');
  const clans = ['Brujah', 'Gangrel', 'Malkavian', 'Nosferatu', 'Toreador', 'Tremere', 'Ventrue',
  'Banu Haqim', 'Hecata', 'Lasombra', 'Ministry', 'Ravnos', 'Salubri', 'Tzimisce', 'Caitiff', 'Thin-blood'];
  clans.forEach(c => {
    const option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    clanSelect.appendChild(option);
  });

  const predatorSelect = document.getElementById('char-predator-type');
  const predatorTypes = ['Alleycat', 'Bagger', 'Blood Leech', 'Cleaver', 'Consensualist', 'Extortionist', 'Farmer',
  'Osiris', 'Pursuer', 'Sandman', 'Scene Queen', 'Siren'];
  predatorTypes.forEach(p => {
    const option = document.createElement('option');
    option.value = p;
    option.textContent = p;
    predatorSelect.appendChild(option);
  });

  // Attach event listeners
  createCharacterBtn.addEventListener('click', () => {
    currentCharacterIndex = null;
    characterListSection.hidden = true;
    characterSheetSection.hidden = false;
    characterForm.reset();
    textareaIdsToAutoResize.forEach(id => autoResizeTextarea(document.getElementById(id)));
  });

  backToListBtn.addEventListener('click', () => {
    currentCharacterIndex = null;
    characterSheetSection.hidden = true;
    characterListSection.hidden = false;
    renderCharacterList();
  });

  characterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (saveCharacterForm()) {
      characterSheetSection.hidden = true;
      characterListSection.hidden = false;
      renderCharacterList();
    }
  });

  attachTextareaAutoResize();

  renderCharacterList();
}

window.addEventListener('DOMContentLoaded', init);
