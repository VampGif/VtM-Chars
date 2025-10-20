// Vampire the Masquerade V5 Character Sheet Application

// Game Data
const GAME_DATA = {
    clans: [
        { name: 'Brujah', disciplines: ['Celerity', 'Potence', 'Presence'] },
        { name: 'Gangrel', disciplines: ['Animalism', 'Fortitude', 'Protean'] },
        { name: 'Malkavian', disciplines: ['Auspex', 'Dominate', 'Obfuscate'] },
        { name: 'Nosferatu', disciplines: ['Animalism', 'Obfuscate', 'Potence'] },
        { name: 'Toreador', disciplines: ['Auspex', 'Celerity', 'Presence'] },
        { name: 'Tremere', disciplines: ['Auspex', 'Blood Sorcery', 'Dominate'] },
        { name: 'Ventrue', disciplines: ['Dominate', 'Fortitude', 'Presence'] },
        { name: 'Banu Haqim', disciplines: ['Blood Sorcery', 'Celerity', 'Obfuscate'] },
        { name: 'Hecata', disciplines: ['Auspex', 'Fortitude', 'Oblivion'] },
        { name: 'Lasombra', disciplines: ['Dominate', 'Oblivion', 'Potence'] },
        { name: 'Ministry', disciplines: ['Obfuscate', 'Presence', 'Protean'] },
        { name: 'Ravnos', disciplines: ['Animalism', 'Obfuscate', 'Presence'] },
        { name: 'Salubri', disciplines: ['Auspex', 'Dominate', 'Fortitude'] },
        { name: 'Tzimisce', disciplines: ['Animalism', 'Dominate', 'Protean'] },
        { name: 'Caitiff', disciplines: ['Any'] },
        { name: 'Thin-blood', disciplines: ['Thin-blood Alchemy'] }
    ],
    
    attributes: {
        Physical: ['Strength', 'Dexterity', 'Stamina'],
        Social: ['Charisma', 'Manipulation', 'Composure'],
        Mental: ['Intelligence', 'Wits', 'Resolve']
    },
    
    skills: {
        Physical: ['Athletics', 'Brawl', 'Craft', 'Drive', 'Firearms', 'Larceny', 'Melee', 'Stealth', 'Survival'],
        Social: ['Animal Ken', 'Etiquette', 'Insight', 'Intimidation', 'Leadership', 'Performance', 'Persuasion', 'Streetwise', 'Subterfuge'],
        Mental: ['Academics', 'Awareness', 'Finance', 'Investigation', 'Medicine', 'Occult', 'Politics', 'Science', 'Technology']
    },
    
    disciplines: [
        'Animalism', 'Auspex', 'Blood Sorcery', 'Celerity', 'Dominate',
        'Fortitude', 'Obfuscate', 'Oblivion', 'Potence', 'Presence',
        'Protean', 'Thin-blood Alchemy'
    ],
    
    predatorTypes: [
        'Alleycat', 'Bagger', 'Blood Leech', 'Cleaver', 'Consensualist',
        'Extortionist', 'Farmer', 'Osiris', 'Pursuer', 'Sandman',
        'Scene Queen', 'Siren'
    ],
    
    relationshipTypes: [
        'Ally', 'Contact', 'Enemy', 'Rival', 'Touchstone', 'Sire',
        'Childer', 'Lover', 'Family', 'Coterie Member', 'Other'
    ]
};

// Application State
let appState = {
    characters: [],
    currentCharacter: null,
    currentView: 'character-list'
};

// CRITICAL FIX: Session-based storage (localStorage blocked in sandbox)
const STORAGE_KEY = 'vtm_characters';
let storageAvailable = false;

// Test if localStorage is available
function testStorageAvailability() {
    try {
        const test = 'vtm_test';
        localStorage.setItem(test, 'test');
        localStorage.removeItem(test);
        storageAvailable = true;
        console.log('localStorage: AVAILABLE');
        return true;
    } catch (error) {
        storageAvailable = false;
        console.log('localStorage: BLOCKED (sandboxed environment)');
        console.log('Using session-only storage. Use Export/Import to persist characters.');
        return false;
    }
}

// LOAD on init - THIS MUST RUN ON PAGE LOAD
function loadCharacters() {
    testStorageAvailability();
    
    if (storageAvailable) {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                appState.characters = JSON.parse(stored);
                console.log('Loaded from localStorage:', appState.characters.length, 'characters');
                return appState.characters;
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }
    
    // Fallback to session storage (memory only)
    if (!appState.characters) {
        appState.characters = [];
    }
    console.log('Using session-only storage:', appState.characters.length, 'characters');
    return appState.characters;
}

// SAVE after any change - THIS MUST RUN AFTER EVERY EDIT
function saveCharacters() {
    if (storageAvailable) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.characters));
            console.log('Saved to localStorage:', appState.characters.length, 'characters');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    } else {
        // Session-only storage (characters persist in memory during browser tab session)
        console.log('Saved to session memory:', appState.characters.length, 'characters');
    }
}

function clearAllStorage() {
    if (storageAvailable) {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
    appState.characters = [];
    console.log('Characters cleared from storage');
}

// Character Template
function createCharacterTemplate() {
    return {
        id: Date.now().toString(),
        // Basic Info
        name: '',
        player: '',
        chronicle: '',
        concept: '',
        clan: '',
        generation: '13th',
        predatorType: '',
        ageCategory: 'Childer',
        sire: '',
        ambition: '',
        desire: '',
        backstory: '',
        
        // Attributes (1-5)
        attributes: {
            strength: 1,
            dexterity: 1,
            stamina: 1,
            charisma: 1,
            manipulation: 1,
            composure: 1,
            intelligence: 1,
            wits: 1,
            resolve: 1
        },
        
        // Skills (0-5)
        skills: {
            // Physical
            athletics: 0, brawl: 0, craft: 0, drive: 0, firearms: 0,
            larceny: 0, melee: 0, stealth: 0, survival: 0,
            // Social
            'animal-ken': 0, etiquette: 0, insight: 0, intimidation: 0,
            leadership: 0, performance: 0, persuasion: 0, streetwise: 0, subterfuge: 0,
            // Mental
            academics: 0, awareness: 0, finance: 0, investigation: 0,
            medicine: 0, occult: 0, politics: 0, science: 0, technology: 0
        },
        
        // Skill specialties
        specialties: {},
        
        // Disciplines
        disciplines: [],
        
        // Relationships
        relationships: [],
        
        // Merits & Flaws
        merits: [],
        flaws: [],
        
        // Humanity & Touchstones
        humanity: 7,
        stains: 0,
        chronicleTenets: '',
        convictions: [],
        
        // Blood & Vitae
        bloodPotency: 1,
        hunger: 1,
        bloodPool: 1,
        resonances: [],
        
        // Health & Willpower
        healthTrack: { superficial: 0, aggravated: 0 },
        willpowerTrack: { superficial: 0, aggravated: 0 },
        
        // Experience
        totalXP: 0,
        spentXP: 0,
        xpLog: [],
        
        // Campaign
        campaignName: '',
        campaignNotes: '',
        sessions: []
    };
}

// Initialize Application
function initApp() {
    // CRITICAL: Load characters from localStorage on page load
    loadCharacters();
    setupEventListeners();
    populateDropdowns();
    showView('character-list');
    renderCharacterList();
}

// Event Listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('create-character-btn').addEventListener('click', showCharacterCreation);
    document.getElementById('back-to-list').addEventListener('click', () => {
        showView('character-list');
        renderCharacterList(); // Ensure list is refreshed when returning
    });
    
    // Character management
    document.getElementById('save-character-btn').addEventListener('click', saveCurrentCharacter);
    document.getElementById('export-character-btn').addEventListener('click', exportCurrentCharacter);
    document.getElementById('export-all-btn').addEventListener('click', exportAllCharacters);
    document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import-file').click());
    document.getElementById('import-file').addEventListener('change', importCharacters);
    document.getElementById('clear-all-btn').addEventListener('click', clearAllData);
    
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });
    
    // Dynamic content buttons
    document.getElementById('add-relationship-btn').addEventListener('click', addRelationshipForm);
    document.getElementById('add-discipline-btn').addEventListener('click', addDisciplineForm);
    document.getElementById('add-merit-btn').addEventListener('click', addMeritForm);
    document.getElementById('add-flaw-btn').addEventListener('click', addFlawForm);
    document.getElementById('add-conviction-btn').addEventListener('click', addConvictionForm);
    document.getElementById('add-xp-entry-btn').addEventListener('click', addXPEntryForm);
    document.getElementById('add-session-btn').addEventListener('click', addSessionForm);
    
    // CRITICAL FIX: Auto-save on input changes (debounced)
    let saveTimeout;
    document.addEventListener('input', (e) => {
        if (appState.currentCharacter && e.target.closest('#character-sheet-view')) {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveCurrentCharacter();
                saveCharacters(); // Auto-save to localStorage
            }, 500); // Wait 500ms after user stops typing
        }
    });
    
    // Clan selection change
    document.getElementById('clan').addEventListener('change', updateClanDisciplines);
    
    // Modal
    document.getElementById('confirm-cancel').addEventListener('click', hideModal);
    document.getElementById('confirm-ok').addEventListener('click', executeModalAction);
}

// Populate dropdowns with game data
function populateDropdowns() {
    const clanSelect = document.getElementById('clan');
    GAME_DATA.clans.forEach(clan => {
        const option = document.createElement('option');
        option.value = clan.name;
        option.textContent = clan.name;
        clanSelect.appendChild(option);
    });
    
    const predatorSelect = document.getElementById('predator-type');
    GAME_DATA.predatorTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        predatorSelect.appendChild(option);
    });
}

// View Management
function showView(viewName) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(viewName + '-view').classList.add('active');
    appState.currentView = viewName;
    
    // CRITICAL FIX: Always refresh character list when showing that view
    if (viewName === 'character-list') {
        renderCharacterList();
    }
}

// Character List Functions
function renderCharacterList() {
    const container = document.getElementById('character-cards');
    const emptyState = document.getElementById('empty-state');
    
    // Update storage status
    updateStorageStatusDisplay();
    
    if (appState.characters.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    container.innerHTML = appState.characters.map(character => `
        <div class="character-card" onclick="editCharacter('${character.id}')">
            <button class="delete-character-btn" onclick="event.stopPropagation(); deleteCharacter('${character.id}')">
                ×
            </button>
            <h3>${character.name || 'Unnamed Character'}</h3>
            <div class="character-card-info">
                <div><strong>Clan:</strong> ${character.clan || 'Unknown'}</div>
                <div><strong>Chronicle:</strong> ${character.chronicle || 'No Chronicle'}</div>
                <div><strong>Generation:</strong> ${character.generation}</div>
                <div><strong>Concept:</strong> ${character.concept || 'No Concept'}</div>
            </div>
        </div>
    `).join('');
}

function showCharacterCreation() {
    appState.currentCharacter = createCharacterTemplate();
    showView('character-sheet');
    populateCharacterSheet(appState.currentCharacter);
    switchTab('overview');
}

function editCharacter(id) {
    const character = appState.characters.find(c => c.id === id);
    if (character) {
        appState.currentCharacter = character;
        showView('character-sheet');
        populateCharacterSheet(character);
        switchTab('overview');
    }
}

function deleteCharacter(id) {
    showConfirmModal('Delete Character', 'Are you sure you want to delete this character? This action cannot be undone.', () => {
        appState.characters = appState.characters.filter(c => c.id !== id);
        // Clear current character if it was the one deleted
        if (appState.currentCharacter && appState.currentCharacter.id === id) {
            appState.currentCharacter = null;
        }
        saveCharacters(); // Save to localStorage after deletion
        renderCharacterList();
    });
}

// Character Sheet Functions
function populateCharacterSheet(character) {
    // Update header
    document.getElementById('character-name-header').textContent = character.name || 'New Character';
    
    // Basic info
    document.getElementById('char-name').value = character.name;
    document.getElementById('player-name').value = character.player;
    document.getElementById('chronicle').value = character.chronicle;
    document.getElementById('concept').value = character.concept;
    document.getElementById('clan').value = character.clan;
    document.getElementById('generation').value = character.generation;
    document.getElementById('predator-type').value = character.predatorType;
    document.getElementById('age-category').value = character.ageCategory;
    document.getElementById('sire').value = character.sire;
    document.getElementById('ambition').value = character.ambition;
    document.getElementById('desire').value = character.desire;
    document.getElementById('backstory').value = character.backstory;
    
    // Attributes & Skills
    createAttributeDots();
    createSkillsInterface();
    updateDerivedStats();
    
    // Disciplines
    renderDisciplines();
    
    // Relationships
    renderRelationships();
    
    // Merits & Flaws
    renderMerits();
    renderFlaws();
    
    // Humanity
    createHumanityDots();
    renderConvictions();
    document.getElementById('chronicle-tenets').value = character.chronicleTenets;
    
    // Blood & Vitae
    createBloodPotencyDots();
    createHungerTracker();
    createHealthWillpowerTracks();
    saveCharacters(); // Save after damage change
    document.getElementById('blood-pool').value = character.bloodPool;
    updateResonanceCheckboxes();
    
    // Experience
    renderXPLog();
    updateXPTotals();
    
    // Campaign
    document.getElementById('campaign-name').value = character.campaignName;
    document.getElementById('campaign-notes').value = character.campaignNotes;
    renderSessions();
}

// Dots System
function createDots(container, currentValue, maxValue, attributeName) {
    container.innerHTML = '';
    
    for (let i = 1; i <= maxValue; i++) {
        const dot = document.createElement('div');
        dot.className = `dot ${i <= currentValue ? 'filled' : ''}`;
        dot.addEventListener('click', () => {
            if (appState.currentCharacter) {
                setAttributeValue(attributeName, i);
                updateDotsDisplay(container, i, maxValue);
                updateDerivedStats();
                saveCharacters(); // Save after attribute change
            }
        });
        container.appendChild(dot);
    }
}

function updateDotsDisplay(container, value, maxValue) {
    const dots = container.querySelectorAll('.dot');
    // Check if this is a skill/discipline container (has disabled dot at index 0)
    const hasDisabledDot = dots[0] && dots[0].style.pointerEvents === 'none';
    
    dots.forEach((dot, index) => {
        if (hasDisabledDot) {
            // For skills/disciplines: fill dots 1 through value, never fill index 0
            dot.classList.toggle('filled', index > 0 && index <= value);
        } else {
            // For regular attributes: fill dots 0 through (value-1)
            dot.classList.toggle('filled', index < value);
        }
    });
}

function setAttributeValue(attributeName, value) {
    if (attributeName === 'humanity') {
        appState.currentCharacter.humanity = value;
    } else if (attributeName.includes('-')) {
        // Handle hyphenated attributes (like blood-potency)
        const keys = attributeName.split('-');
        if (keys.length === 2) {
            appState.currentCharacter[keys[0] + keys[1].charAt(0).toUpperCase() + keys[1].slice(1)] = value;
        }
    } else {
        appState.currentCharacter.attributes[attributeName] = value;
    }
}

// Attributes
function createAttributeDots() {
    Object.keys(appState.currentCharacter.attributes).forEach(attr => {
        const container = document.querySelector(`[data-attribute="${attr}"]`);
        if (container) {
            createDots(container, appState.currentCharacter.attributes[attr], 5, attr);
        }
    });
}

function updateDerivedStats() {
    const stamina = appState.currentCharacter.attributes.stamina;
    const composure = appState.currentCharacter.attributes.composure;
    const resolve = appState.currentCharacter.attributes.resolve;
    
    document.getElementById('health-total').textContent = stamina + 3;
    document.getElementById('willpower-total').textContent = composure + resolve;
}

// Skills
function createSkillsInterface() {
    Object.entries(GAME_DATA.skills).forEach(([category, skills]) => {
        const container = document.getElementById(`${category.toLowerCase()}-skills`);
        container.innerHTML = skills.map(skill => {
            const skillKey = skill.toLowerCase().replace(' ', '-');
            const skillValue = appState.currentCharacter.skills[skillKey] || 0;
            const specialty = appState.currentCharacter.specialties[skillKey] || '';
            
            return `
                <div class="skill-item">
                    <div class="skill-name">${skill}</div>
                    <div class="dots-container" data-skill="${skillKey}" data-max="5"></div>
                    <div class="skill-specialty">
                        <input type="text" placeholder="Specialty" value="${specialty}" 
                               onchange="updateSkillSpecialty('${skillKey}', this.value)">
                    </div>
                </div>
            `;
        }).join('');
        
        // Create dots for each skill
        container.querySelectorAll('.dots-container').forEach(dotsContainer => {
            const skillKey = dotsContainer.dataset.skill;
            const skillValue = appState.currentCharacter.skills[skillKey] || 0;
            createSkillDots(dotsContainer, skillValue, 5, skillKey);
        });
    });
}

function createSkillDots(container, currentValue, maxValue, skillName) {
    container.innerHTML = '';
    
    for (let i = 0; i <= maxValue; i++) {
        const dot = document.createElement('div');
        dot.className = `dot ${i <= currentValue && i > 0 ? 'filled' : ''}`;
        if (i === 0) {
            dot.style.opacity = '0.3';
            dot.style.pointerEvents = 'none';
        } else {
            dot.addEventListener('click', () => {
                if (appState.currentCharacter) {
                    appState.currentCharacter.skills[skillName] = i;
                    updateDotsDisplay(container, i, maxValue);
                    saveCharacters(); // Save after skill change
                }
            });
        }
        container.appendChild(dot);
    }
}

function updateSkillSpecialty(skillKey, value) {
    if (appState.currentCharacter) {
        appState.currentCharacter.specialties[skillKey] = value;
        saveCharacters(); // Save after specialty change
    }
}

// Disciplines
function updateClanDisciplines() {
    const clanName = document.getElementById('clan').value;
    const clan = GAME_DATA.clans.find(c => c.name === clanName);
    
    if (clan && appState.currentCharacter) {
        // Add clan disciplines if not already present
        clan.disciplines.forEach(discName => {
            if (!appState.currentCharacter.disciplines.some(d => d.name === discName)) {
                appState.currentCharacter.disciplines.push({
                    name: discName,
                    level: 0,
                    powers: '',
                    inClan: true
                });
            }
        });
        renderDisciplines();
    }
}

function renderDisciplines() {
    const container = document.getElementById('disciplines-list');
    
    if (!appState.currentCharacter.disciplines.length) {
        container.innerHTML = '<p class="empty-message">No disciplines added yet.</p>';
        return;
    }
    
    container.innerHTML = appState.currentCharacter.disciplines.map((discipline, index) => `
        <div class="discipline-item">
            <div class="discipline-header">
                <div>
                    <span class="discipline-name">${discipline.name}</span>
                    <span class="discipline-type ${discipline.inClan ? 'in-clan' : 'out-of-clan'}">
                        ${discipline.inClan ? 'In-Clan' : 'Out-of-Clan'}
                    </span>
                </div>
                <div class="dots-container" data-discipline="${index}" data-max="5"></div>
            </div>
            <div class="discipline-powers">
                <textarea placeholder="Describe powers learned at each level.." 
                          onchange="updateDisciplinePowers(${index}, this.value)">${discipline.powers}</textarea>
            </div>
            <button class="delete-btn" onclick="removeDiscipline(${index})">Remove</button>
        </div>
    `).join('');
    
    // Create dots for each discipline
    appState.currentCharacter.disciplines.forEach((discipline, index) => {
        const container = document.querySelector(`[data-discipline="${index}"]`);
        if (container) {
            createDisciplineDots(container, discipline.level, 5, index);
        }
    });
}

function createDisciplineDots(container, currentValue, maxValue, disciplineIndex) {
    container.innerHTML = '';
    
    for (let i = 0; i <= maxValue; i++) {
        const dot = document.createElement('div');
        dot.className = `dot ${i <= currentValue && i > 0 ? 'filled' : ''}`;
        if (i === 0) {
            dot.style.opacity = '0.3';
            dot.style.pointerEvents = 'none';
        } else {
            dot.addEventListener('click', () => {
                if (appState.currentCharacter) {
                    appState.currentCharacter.disciplines[disciplineIndex].level = i;
                    updateDotsDisplay(container, i, maxValue);
                    saveCharacters(); // Save after discipline change
                }
            });
        }
        container.appendChild(dot);
    }
}

// CRITICAL FIX #2: Add Discipline Form
function addDisciplineForm() {
    if (!appState.currentCharacter) return;
    
    // Check if modal already exists, if so close it (toggle behavior)
    const existingModal = document.querySelector('.modal:not(#confirm-modal)');
    if (existingModal) {
        closeAddModal();
        return;
    }
    
    // Create modal form
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add Discipline</h3>
            <form id="discipline-form">
                <div class="form-group">
                    <label class="form-label">Discipline</label>
                    <select class="form-control" id="discipline-name" required>
                        ${GAME_DATA.disciplines.map(disc => `<option value="${disc}">${disc}</option>`).join('')}
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn--secondary" onclick="closeAddModal()">Cancel</button>
                    <button type="submit" class="btn btn--primary">Add Discipline</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('discipline-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const disciplineName = document.getElementById('discipline-name').value;
        
        // Check if discipline already exists
        const exists = appState.currentCharacter.disciplines.some(d => d.name === disciplineName);
        if (!exists) {
            const clanName = appState.currentCharacter.clan;
            const clan = GAME_DATA.clans.find(c => c.name === clanName);
            const inClan = clan && clan.disciplines.includes(disciplineName);
            
            appState.currentCharacter.disciplines.push({
                name: disciplineName,
                level: 0,
                powers: '',
                inClan: inClan
            });
            renderDisciplines();
            saveCurrentCharacter();
            saveCharacters();
        }
        
        closeAddModal();
    });
}

function updateDisciplinePowers(index, value) {
    if (appState.currentCharacter) {
        appState.currentCharacter.disciplines[index].powers = value;
        saveCharacters(); // Save after discipline powers change
    }
}

function removeDiscipline(index) {
    if (appState.currentCharacter) {
        appState.currentCharacter.disciplines.splice(index, 1);
        renderDisciplines();
        saveCharacters(); // Save after discipline removal
    }
}

// Tab Management
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-panel`).classList.add('active');
}

// Relationships
function renderRelationships() {
    const container = document.getElementById('relationships-list');
    
    if (!appState.currentCharacter.relationships.length) {
        container.innerHTML = '<p class="empty-message">No relationships added yet.</p>';
        return;
    }
    
    container.innerHTML = appState.currentCharacter.relationships.map((rel, index) => `
        <div class="relationship-item">
            <div class="item-header">
                <div class="item-title">${rel.name}</div>
                <div class="item-type">${rel.type}</div>
            </div>
            <div class="item-description">${rel.description}</div>
            <div class="item-actions">
                <button class="delete-btn" onclick="removeRelationship(${index})">Remove</button>
            </div>
        </div>
    `).join('');
}

// CRITICAL FIX #2: Add Relationship Form
function addRelationshipForm() {
    if (!appState.currentCharacter) return;
    
    // Check if modal already exists, if so close it (toggle behavior)
    const existingModal = document.querySelector('.modal:not(#confirm-modal)');
    if (existingModal) {
        closeAddModal();
        return;
    }
    
    // Create modal form
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add Relationship</h3>
            <form id="relationship-form">
                <div class="form-group">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" id="rel-name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Type</label>
                    <select class="form-control" id="rel-type" required>
                        ${GAME_DATA.relationshipTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" id="rel-description" rows="3"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn--secondary" onclick="closeAddModal()">Cancel</button>
                    <button type="submit" class="btn btn--primary">Add Relationship</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('relationship-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('rel-name').value.trim();
        const type = document.getElementById('rel-type').value;
        const description = document.getElementById('rel-description').value.trim();
        
        if (name) {
            appState.currentCharacter.relationships.push({ name, type, description });
            renderRelationships();
            saveCurrentCharacter();
            saveCharacters();
        }
        
        closeAddModal();
    });
}

function removeRelationship(index) {
    if (appState.currentCharacter) {
        appState.currentCharacter.relationships.splice(index, 1);
        renderRelationships();
        saveCharacters(); // Save after relationship removal
    }
}

// Merits
function renderMerits() {
    const container = document.getElementById('merits-list');
    
    if (!appState.currentCharacter.merits.length) {
        container.innerHTML = '<p class="empty-message">No merits added yet.</p>';
        return;
    }
    
    container.innerHTML = appState.currentCharacter.merits.map((merit, index) => `
        <div class="merit-item">
            <div class="item-header">
                <div class="item-title">${merit.name} (${merit.dots} dots)</div>
            </div>
            <div class="item-description">${merit.description}</div>
            <div class="item-actions">
                <button class="delete-btn" onclick="removeMerit(${index})">Remove</button>
            </div>
        </div>
    `).join('');
}

// CRITICAL FIX #2: Add Merit Form
function addMeritForm() {
    if (!appState.currentCharacter) return;
    
    // Check if modal already exists, if so close it (toggle behavior)
    const existingModal = document.querySelector('.modal:not(#confirm-modal)');
    if (existingModal) {
        closeAddModal();
        return;
    }
    
    // Create modal form
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add Merit</h3>
            <form id="merit-form">
                <div class="form-group">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" id="merit-name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Dots (1-5)</label>
                    <select class="form-control" id="merit-dots" required>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" id="merit-description" rows="3"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn--secondary" onclick="closeAddModal()">Cancel</button>
                    <button type="submit" class="btn btn--primary">Add Merit</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('merit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('merit-name').value.trim();
        const dots = parseInt(document.getElementById('merit-dots').value);
        const description = document.getElementById('merit-description').value.trim();
        
        if (name) {
            appState.currentCharacter.merits.push({ name, dots, description });
            renderMerits();
            saveCurrentCharacter();
            saveCharacters();
        }
        
        closeAddModal();
    });
}

function removeMerit(index) {
    if (appState.currentCharacter) {
        appState.currentCharacter.merits.splice(index, 1);
        renderMerits();
        saveCharacters(); // Save after merit removal
    }
}

// Flaws
function renderFlaws() {
    const container = document.getElementById('flaws-list');
    
    if (!appState.currentCharacter.flaws.length) {
        container.innerHTML = '<p class="empty-message">No flaws added yet.</p>';
        return;
    }
    
    container.innerHTML = appState.currentCharacter.flaws.map((flaw, index) => `
        <div class="flaw-item">
            <div class="item-header">
                <div class="item-title">${flaw.name}</div>
            </div>
            <div class="item-description">${flaw.description}</div>
            <div class="item-actions">
                <button class="delete-btn" onclick="removeFlaw(${index})">Remove</button>
            </div>
        </div>
    `).join('');
}

// CRITICAL FIX #2: Add Flaw Form
function addFlawForm() {
    if (!appState.currentCharacter) return;
    
    // Check if modal already exists, if so close it (toggle behavior)
    const existingModal = document.querySelector('.modal:not(#confirm-modal)');
    if (existingModal) {
        closeAddModal();
        return;
    }
    
    // Create modal form
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add Flaw</h3>
            <form id="flaw-form">
                <div class="form-group">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" id="flaw-name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" id="flaw-description" rows="3"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn--secondary" onclick="closeAddModal()">Cancel</button>
                    <button type="submit" class="btn btn--primary">Add Flaw</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('flaw-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('flaw-name').value.trim();
        const description = document.getElementById('flaw-description').value.trim();
        
        if (name) {
            appState.currentCharacter.flaws.push({ name, description });
            renderFlaws();
            saveCurrentCharacter();
            saveCharacters();
        }
        
        closeAddModal();
    });
}

function removeFlaw(index) {
    if (appState.currentCharacter) {
        appState.currentCharacter.flaws.splice(index, 1);
        renderFlaws();
        saveCharacters(); // Save after flaw removal
    }
}

// Humanity
function createHumanityDots() {
    const container = document.querySelector('[data-attribute="humanity"]');
    if (container) {
        createDots(container, appState.currentCharacter.humanity, 10, 'humanity');
    }
    
    // Stains
    const stainDots = document.querySelectorAll('.stain-dot');
    stainDots.forEach((dot, index) => {
        dot.classList.toggle('active', index < appState.currentCharacter.stains);
        dot.addEventListener('click', () => {
            if (appState.currentCharacter) {
                appState.currentCharacter.stains = index + 1;
                updateStains();
                saveCharacters(); // Save after stains change
            }
        });
    });
}

function updateStains() {
    const stainDots = document.querySelectorAll('.stain-dot');
    stainDots.forEach((dot, index) => {
        dot.classList.toggle('active', index < appState.currentCharacter.stains);
    });
}

// Convictions
function renderConvictions() {
    const container = document.getElementById('convictions-list');
    
    if (!appState.currentCharacter.convictions.length) {
        container.innerHTML = '<p class="empty-message">No convictions added yet.</p>';
        return;
    }
    
    container.innerHTML = appState.currentCharacter.convictions.map((conv, index) => `
        <div class="conviction-item">
            <div class="item-header">
                <div class="item-title">Conviction ${index + 1}</div>
            </div>
            <div class="item-description">
                <strong>Conviction:</strong> ${conv.conviction}<br>
                <strong>Touchstone:</strong> ${conv.touchstone}
            </div>
            <div class="item-actions">
                <button class="delete-btn" onclick="removeConviction(${index})">Remove</button>
            </div>
        </div>
    `).join('');
}

// CRITICAL FIX #2: Add Conviction Form
function addConvictionForm() {
    if (!appState.currentCharacter) return;
    
    // Check if modal already exists, if so close it (toggle behavior)
    const existingModal = document.querySelector('.modal:not(#confirm-modal)');
    if (existingModal) {
        closeAddModal();
        return;
    }
    
    // Create modal form
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add Conviction & Touchstone</h3>
            <form id="conviction-form">
                <div class="form-group">
                    <label class="form-label">Conviction</label>
                    <textarea class="form-control" id="conviction-text" rows="2" required placeholder="Describe your conviction..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Touchstone Name</label>
                    <input type="text" class="form-control" id="touchstone-name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Touchstone Description</label>
                    <textarea class="form-control" id="touchstone-description" rows="2" placeholder="Describe your touchstone..."></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn--secondary" onclick="closeAddModal()">Cancel</button>
                    <button type="submit" class="btn btn--primary">Add Conviction</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('conviction-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const conviction = document.getElementById('conviction-text').value.trim();
        const touchstoneName = document.getElementById('touchstone-name').value.trim();
        const touchstoneDescription = document.getElementById('touchstone-description').value.trim();
        
        if (conviction && touchstoneName) {
            appState.currentCharacter.convictions.push({ 
                conviction, 
                touchstone: `${touchstoneName}: ${touchstoneDescription}` 
            });
            renderConvictions();
            saveCurrentCharacter();
            saveCharacters();
        }
        
        closeAddModal();
    });
}

function removeConviction(index) {
    if (appState.currentCharacter) {
        appState.currentCharacter.convictions.splice(index, 1);
        renderConvictions();
        saveCharacters(); // Save after conviction removal
    }
}

// Blood & Vitae
function createBloodPotencyDots() {
    const container = document.querySelector('[data-attribute="blood-potency"]');
    if (container) {
        createDots(container, appState.currentCharacter.bloodPotency, 5, 'blood-potency');
    }
}

function createHungerTracker() {
    const hungerDice = document.querySelectorAll('.hunger-die');
    hungerDice.forEach((die, index) => {
        die.classList.toggle('active', index < appState.currentCharacter.hunger);
        die.addEventListener('click', () => {
            if (appState.currentCharacter) {
                appState.currentCharacter.hunger = index + 1;
                updateHunger();
                saveCharacters(); // Save after hunger change
            }
        });
    });
}

function updateHunger() {
    const hungerDice = document.querySelectorAll('.hunger-die');
    hungerDice.forEach((die, index) => {
        die.classList.toggle('active', index < appState.currentCharacter.hunger);
    });
}

function updateResonanceCheckboxes() {
    const resonances = ['choleric', 'melancholic', 'phlegmatic', 'sanguine', 'animal', 'empty'];
    resonances.forEach(resonance => {
        const checkbox = document.getElementById(`resonance-${resonance}`);
        if (checkbox) {
            checkbox.checked = appState.currentCharacter.resonances.includes(resonance);
            checkbox.addEventListener('change', () => {
                updateResonances(resonance, checkbox.checked);
            });
        }
    });
}

function updateResonances(resonance, checked) {
    if (!appState.currentCharacter.resonances) {
        appState.currentCharacter.resonances = [];
    }
    
    if (checked) {
        if (!appState.currentCharacter.resonances.includes(resonance)) {
            appState.currentCharacter.resonances.push(resonance);
        }
    } else {
        appState.currentCharacter.resonances = appState.currentCharacter.resonances.filter(r => r !== resonance);
    }
    saveCharacters(); // Save after resonance change
}

// Health & Willpower Tracking
function createHealthWillpowerTracks() {
    const healthTotal = appState.currentCharacter.attributes.stamina + 3;
    const willpowerTotal = appState.currentCharacter.attributes.composure + appState.currentCharacter.attributes.resolve;
    
    createDamageTrack('health-track', healthTotal, appState.currentCharacter.healthTrack);
    createDamageTrack('willpower-track', willpowerTotal, appState.currentCharacter.willpowerTrack);
}

function createDamageTrack(containerId, total, damageState) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    for (let i = 0; i < total; i++) {
        const box = document.createElement('div');
        box.className = 'damage-box';
        
        // Determine current state
        if (i < damageState.aggravated) {
            box.classList.add('aggravated');
        } else if (i < damageState.aggravated + damageState.superficial) {
            box.classList.add('superficial');
        }
        
        box.addEventListener('click', () => cycleDamage(containerId, i, total));
        container.appendChild(box);
    }
}

function cycleDamage(trackId, boxIndex, total) {
    const trackType = trackId.includes('health') ? 'healthTrack' : 'willpowerTrack';
    const track = appState.currentCharacter[trackType];
    
    // Cycle through: empty -> superficial -> aggravated -> empty
    const boxes = document.querySelectorAll(`#${trackId} .damage-box`);
    const box = boxes[boxIndex];
    
    if (box.classList.contains('aggravated')) {
        // Clear this box and all after it
        track.aggravated = Math.min(track.aggravated, boxIndex);
        track.superficial = Math.max(0, track.superficial - Math.max(0, boxIndex - track.aggravated));
    } else if (box.classList.contains('superficial')) {
        // Convert to aggravated
        track.aggravated = boxIndex + 1;
        track.superficial = Math.max(0, track.superficial - (boxIndex + 1 - track.aggravated));
    } else {
        // Mark as superficial
        track.superficial = Math.max(track.superficial, boxIndex + 1 - track.aggravated);
    }
    
    createHealthWillpowerTracks();
}

// Experience
function renderXPLog() {
    const container = document.getElementById('xp-log');
    
    if (!appState.currentCharacter.xpLog.length) {
        container.innerHTML = '<p class="empty-message">No XP entries yet.</p>';
        return;
    }
    
    container.innerHTML = appState.currentCharacter.xpLog.map((entry, index) => `
        <div class="xp-entry">
            <div class="item-header">
                <div class="item-title">${entry.date} - ${entry.amount > 0 ? '+' : ''}${entry.amount} XP</div>
            </div>
            <div class="item-description">
                <strong>Spent on:</strong> ${entry.spentOn}<br>
                <strong>Notes:</strong> ${entry.notes}
            </div>
            <div class="item-actions">
                <button class="delete-btn" onclick="removeXPEntry(${index})">Remove</button>
            </div>
        </div>
    `).join('');
}

// CRITICAL FIX #2: Add XP Entry Form
function addXPEntryForm() {
    if (!appState.currentCharacter) return;
    
    // Check if modal already exists, if so close it (toggle behavior)
    const existingModal = document.querySelector('.modal:not(#confirm-modal)');
    if (existingModal) {
        closeAddModal();
        return;
    }
    
    // Create modal form
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add XP Entry</h3>
            <form id="xp-form">
                <div class="form-group">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-control" id="xp-date" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Amount</label>
                    <input type="number" class="form-control" id="xp-amount" required placeholder="Positive for earned, negative for spent">
                </div>
                <div class="form-group">
                    <label class="form-label">Spent On / Reason</label>
                    <input type="text" class="form-control" id="xp-spent-on" placeholder="What was this XP for?">
                </div>
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea class="form-control" id="xp-notes" rows="2" placeholder="Additional notes..."></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn--secondary" onclick="closeAddModal()">Cancel</button>
                    <button type="submit" class="btn btn--primary">Add Entry</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('xp-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('xp-date').value;
        const amount = parseInt(document.getElementById('xp-amount').value) || 0;
        const spentOn = document.getElementById('xp-spent-on').value.trim();
        const notes = document.getElementById('xp-notes').value.trim();
        
        appState.currentCharacter.xpLog.push({ date, amount, spentOn, notes });
        updateXPTotals();
        renderXPLog();
        saveCurrentCharacter();
        saveCharacters();
        
        closeAddModal();
    });
}

function removeXPEntry(index) {
    if (appState.currentCharacter) {
        appState.currentCharacter.xpLog.splice(index, 1);
        updateXPTotals();
        renderXPLog();
        saveCharacters(); // Save after XP entry removal
    }
}

function updateXPTotals() {
    let totalEarned = 0;
    let totalSpent = 0;
    
    appState.currentCharacter.xpLog.forEach(entry => {
        if (entry.amount > 0) {
            totalEarned += entry.amount;
        } else {
            totalSpent += Math.abs(entry.amount);
        }
    });
    
    appState.currentCharacter.totalXP = totalEarned;
    appState.currentCharacter.spentXP = totalSpent;
    
    document.getElementById('total-xp').textContent = totalEarned;
    document.getElementById('spent-xp').textContent = totalSpent;
    document.getElementById('available-xp').textContent = totalEarned - totalSpent;
}

// Sessions
function renderSessions() {
    const container = document.getElementById('sessions-list');
    
    if (!appState.currentCharacter.sessions.length) {
        container.innerHTML = '<p class="empty-message">No sessions logged yet.</p>';
        return;
    }
    
    container.innerHTML = appState.currentCharacter.sessions.map((session, index) => `
        <div class="session-item">
            <div class="item-header">
                <div class="item-title">Session ${session.number} - ${session.date}</div>
            </div>
            <div class="item-description">
                <strong>Summary:</strong> ${session.summary}<br>
                <strong>NPCs:</strong> ${session.npcs}<br>
                <strong>XP Awarded:</strong> ${session.xpAwarded}
            </div>
            <div class="item-actions">
                <button class="delete-btn" onclick="removeSession(${index})">Remove</button>
            </div>
        </div>
    `).join('');
}

// CRITICAL FIX #2: Add Session Form
function addSessionForm() {
    if (!appState.currentCharacter) return;
    
    // Check if modal already exists, if so close it (toggle behavior)
    const existingModal = document.querySelector('.modal:not(#confirm-modal)');
    if (existingModal) {
        closeAddModal();
        return;
    }
    
    const sessionNumber = appState.currentCharacter.sessions.length + 1;
    
    // Create modal form
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add Session Log</h3>
            <form id="session-form">
                <div class="form-group">
                    <label class="form-label">Session Number</label>
                    <input type="number" class="form-control" id="session-number" value="${sessionNumber}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-control" id="session-date" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Session Summary</label>
                    <textarea class="form-control" id="session-summary" rows="4" placeholder="What happened in this session?" required></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">NPCs Encountered</label>
                    <textarea class="form-control" id="session-npcs" rows="2" placeholder="List NPCs met in this session"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">XP Awarded</label>
                    <input type="number" class="form-control" id="session-xp" value="0" min="0">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn--secondary" onclick="closeAddModal()">Cancel</button>
                    <button type="submit" class="btn btn--primary">Add Session</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('session-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const number = parseInt(document.getElementById('session-number').value);
        const date = document.getElementById('session-date').value;
        const summary = document.getElementById('session-summary').value.trim();
        const npcs = document.getElementById('session-npcs').value.trim();
        const xpAwarded = parseInt(document.getElementById('session-xp').value) || 0;
        
        if (summary) {
            appState.currentCharacter.sessions.push({ number, date, summary, npcs, xpAwarded });
            renderSessions();
            saveCurrentCharacter();
            saveCharacters();
        }
        
        closeAddModal();
    });
}

function removeSession(index) {
    if (appState.currentCharacter) {
        appState.currentCharacter.sessions.splice(index, 1);
        // Renumber sessions
        appState.currentCharacter.sessions.forEach((session, i) => {
            session.number = i + 1;
        });
        renderSessions();
        saveCharacters(); // Save after session removal
    }
}

// Character Management
function saveCurrentCharacter() {
    if (!appState.currentCharacter) return;
    
    // Update basic info from form
    appState.currentCharacter.name = document.getElementById('char-name').value;
    appState.currentCharacter.player = document.getElementById('player-name').value;
    appState.currentCharacter.chronicle = document.getElementById('chronicle').value;
    appState.currentCharacter.concept = document.getElementById('concept').value;
    appState.currentCharacter.clan = document.getElementById('clan').value;
    appState.currentCharacter.generation = document.getElementById('generation').value;
    appState.currentCharacter.predatorType = document.getElementById('predator-type').value;
    appState.currentCharacter.ageCategory = document.getElementById('age-category').value;
    appState.currentCharacter.sire = document.getElementById('sire').value;
    appState.currentCharacter.ambition = document.getElementById('ambition').value;
    appState.currentCharacter.desire = document.getElementById('desire').value;
    appState.currentCharacter.backstory = document.getElementById('backstory').value;
    
    // Update other form fields
    appState.currentCharacter.chronicleTenets = document.getElementById('chronicle-tenets').value;
    appState.currentCharacter.bloodPool = parseInt(document.getElementById('blood-pool').value) || 0;
    appState.currentCharacter.campaignName = document.getElementById('campaign-name').value;
    appState.currentCharacter.campaignNotes = document.getElementById('campaign-notes').value;
    
    // Add to characters list if new
    if (!appState.characters.find(c => c.id === appState.currentCharacter.id)) {
        appState.characters.push(appState.currentCharacter);
    }
    
    // Update header
    document.getElementById('character-name-header').textContent = appState.currentCharacter.name || 'Unnamed Character';
    
    // CRITICAL FIX: Save to localStorage after any character save
    saveCharacters();
    
    // CRITICAL FIX: Always refresh the character list after saving
    renderCharacterList();
}

// Data Management
function exportCurrentCharacter() {
    if (!appState.currentCharacter) return;
    
    const dataStr = JSON.stringify(appState.currentCharacter, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${appState.currentCharacter.name || 'character'}.json`;
    link.click();
}

function exportAllCharacters() {
    const dataStr = JSON.stringify(appState.characters, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'vtm-characters.json';
    link.click();
}

function importCharacters(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (Array.isArray(data)) {
                // Import multiple characters - ensure unique IDs
                data.forEach(char => {
                    if (!char.id) char.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                    // Prevent duplicate IDs
                    while (appState.characters.find(c => c.id === char.id)) {
                        char.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                    }
                });
                appState.characters = [...appState.characters, ...data];
            } else {
                // Import single character - ensure unique ID
                if (!data.id) data.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                while (appState.characters.find(c => c.id === data.id)) {
                    data.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                }
                appState.characters.push(data);
            }
            
            saveCharacters(); // Save imported characters to localStorage
            showView('character-list');
            renderCharacterList();
            alert('Characters imported successfully!');
        } catch (error) {
            alert('Error importing file: Invalid JSON format');
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

function clearAllData() {
    showConfirmModal('Clear All Data', 'Are you sure you want to delete all characters? This action cannot be undone.', () => {
        appState.characters = [];
        appState.currentCharacter = null;
        clearAllStorage(); // Clear localStorage too
        showView('character-list');
        renderCharacterList();
    });
}

// Modal System
let modalAction = null;

function showConfirmModal(title, message, action) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    modalAction = action;
    document.getElementById('confirm-modal').classList.add('active');
}

function hideModal() {
    document.getElementById('confirm-modal').classList.remove('active');
    modalAction = null;
}

function executeModalAction() {
    if (modalAction) {
        modalAction();
    }
    hideModal();
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', initApp);

// Storage status for users
function showStorageStatus() {
    if (storageAvailable) {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const count = stored ? JSON.parse(stored).length : 0;
            console.log('localStorage Status: WORKING - Found', count, 'characters');
            return { working: true, persistent: true, count: appState.characters.length };
        } catch (error) {
            console.error('localStorage Status: ERROR -', error);
            return { working: false, persistent: false, error: error.message };
        }
    } else {
        console.log('Storage Status: SESSION-ONLY -', appState.characters.length, 'characters in memory');
        return { working: true, persistent: false, count: appState.characters.length };
    }
}

// Update storage status display
function updateStorageStatusDisplay() {
    const statusDiv = document.getElementById('storage-status');
    if (!statusDiv) return;
    
    const status = showStorageStatus();
    
    statusDiv.className = 'storage-status';
    
    if (status.working && status.persistent) {
        statusDiv.classList.add('working');
        statusDiv.innerHTML = `<small>✓ Persistent storage: ${status.count} characters saved</small>`;
    } else if (status.working && !status.persistent) {
        statusDiv.classList.add('warning');
        statusDiv.innerHTML = `<small>⚠ Session only: ${status.count} characters (Use Export to save permanently)</small>`;
    } else {
        statusDiv.classList.add('error');
        statusDiv.innerHTML = `<small>✗ Storage error: ${status.error}</small>`;
    }
}

// Call this periodically for status updates
setInterval(() => {
    showStorageStatus();
    if (document.getElementById('storage-status')) {
        updateStorageStatusDisplay();
    }
}, 5000); // Check every 5 seconds

// CRITICAL FIX #2: Modal management helper
function closeAddModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (!modal.id || modal.id !== 'confirm-modal') {
            modal.remove();
        }
    });
}

// Make functions globally available
window.editCharacter = editCharacter;
window.deleteCharacter = deleteCharacter;
window.showCharacterCreation = showCharacterCreation;
window.updateSkillSpecialty = updateSkillSpecialty;
window.updateDisciplinePowers = updateDisciplinePowers;
window.removeDiscipline = removeDiscipline;
window.removeRelationship = removeRelationship;
window.removeMerit = removeMerit;
window.removeFlaw = removeFlaw;
window.removeConviction = removeConviction;
window.removeXPEntry = removeXPEntry;
window.removeSession = removeSession;
window.closeAddModal = closeAddModal;