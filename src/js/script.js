const data = {
  planet: {
    ArcCorp: [
      'Area 18',
      // other facilities...
    ],
    Crusader: [
      'GrimHex',
      'Outpost',
      'Port Olisar',
      // other facilities...
    ],
    Hurston: [
      'Covalex Distribution Centre S1DC06',
      'Greycat Stanton 1 Production Complex-B',
      'HDPC-Cassillo',
      'HDPC-Farnesway',
      'Lorville',
      'Sakura Sun Magnolia Workcenter'
    ],
    Microtech: [
      'Covalex Distribution Centre S4DC05',
      'Greycat Stanton IV Production Complex-A',
      'New Babbage',
      'Sakura Sun Goldenrod Workcenter',
      'microTech Logistics Depot S4LD01',
      'microTech Logistics Depot S4LD13'
    ],
  },
  station: {
    'Port Tressler': [],
    'Everus Harbor': [],
    'Baijini Point': [],
    'Seraphim Station': [],
  },
  moon: {
    ArcCorp: {
      Lyria: [
        'Humboldt Mine',
        'Loveridge Mineral Reserve',
        'Shubin Mining Facility SAL-2',
        'Shubin Mining Facility SAL-5'
      ],
      Wala: [
        'ArcCorp Mining Area 045',
        'ArcCorp Mining Area 048',
        'ArcCorp Mining Area 056',
        'ArcCorp Mining Area 061',
        'Samson & Son\'s Salvage Center',
        'Shady Glen Farms'
      ],
    },
    Crusader: {
      Cellin: [
        'Gallee Family Farms',
        'Hickes Research Outpost',
        'Terra Mills Hydrofarm',
        'Tram & Myers Mining'
      ],
      Daymar: [
        'ArcCorp Mining Area 141',
        'Bountiful Harvest Hydroponics',
        'Kudre Ore',
        'Shubin Mining Facility SCD-1',
        'Brio\'s Breaker Yard'
      ],
      Lyria: [
        'Humboldt Mine',
        'Loveridge Mineral Reserve',
        'Shubin Mining Facility SAL-2',
        'Shubin Mining Facility SAL-5'
      ],
      Yela: [
        'ArcCorp Mining Area 157',
        'Benson Mining Outpost',
        'Deakins Research Outpost'
      ],
      PortOlisar: [
        'Crusader Distribution Centre',
        'Crusader Logistics',
        'GrimHex Outpost',
        'Port Olisar Central'
      ]
    },
    Hurston: {
      Arial: [
        'HDMS-Bezdek',
        'HDMS-Lathan'
      ],
      Aberdeen: [
        'HDMS-Anderson',
        'HDMS-Norgaard'
      ],
      Ita: [
        'HDMS-Ryder',
        'HDMS-Woodruff'
      ],
      Magda: [
        'HDMS-Hahn',
        'HDMS-Perlman'
      ]
    },
    Microtech: {
      Calliope: [
        'Rayari Anvik Research Outpost',
        'Rayari Kaltag Research Outpost',
        'Shubin Mining Facility SMCa-6',
        'Shubin Mining Facility SMCa-8'
      ],
      Clio: [
        'Rayari Cantwell Research Outpost',
        'Rayari McGrath Research Outpost'
      ],
      Euterpe: [
        'Devlin Scrap & Salvage'
      ],
      NewBabbage: [
        'Microtech Logistics Depot S4LD01',
        'Microtech Logistics Depot S4LD13',
        'New Babbage Central',
        'New Babbage Outpost'
      ]
    }
  },
  commodities: [
    'Aluminium',
    'Corundum',
    'Processed Food',
    'Pressurized ice',
    'Quartz',
    'Stims',
    'Tin',
    'Titanium',
    'Tungsten'
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // Load history table on page load
  updateHistoryTable();

  // Add event listener for Enter key on amount input
  const amountInput = document.getElementById('amount');
  
  amountInput.addEventListener('keypress', function(e) {
    // Check if the pressed key is Enter
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      
      // Trigger the Add Entry button click
      document.getElementById('addEntryBtn').click();
    }
  });

  populateMoons();

  const colorPicker = document.getElementById('accentColor');
  
  // Load saved color preference
  const savedColor = localStorage.getItem('primaryColor') || '#4CAF50';
  colorPicker.value = savedColor;
  updatePrimaryColor(savedColor);
  
  // Add change event listener for real-time updates
  colorPicker.addEventListener('input', (e) => {
    updatePrimaryColor(e.target.value);
  });
  
  // Add change event listener for final value
  colorPicker.addEventListener('change', (e) => {
    updatePrimaryColor(e.target.value);
  });
});


// Function to update the history table
function updateHistoryTable() {
  const historyContainer = document.getElementById('historyContainer');
  const deliveryHistory = JSON.parse(localStorage.getItem('deliveryHistory')) || [];

  // Clear the container
  historyContainer.innerHTML = '';

  if (deliveryHistory.length === 0) {
    const placeholder = document.createElement('p');
    placeholder.textContent = 'No delivery history available.';
    placeholder.style.textAlign = 'center';
    placeholder.style.color = '#555';
    historyContainer.appendChild(placeholder);
    return;
  }

  // Group entries by date
  const groupedByDate = {};
  deliveryHistory.forEach(entry => {
    const date = entry.date; // Ensure date is stored with each entry
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(entry);
  });

  // Create sections for each date
  Object.keys(groupedByDate).forEach(date => {
    const dateSection = document.createElement('div');
    dateSection.className = 'date-section';

    // Date header
    const dateHeader = document.createElement('h3');
    dateHeader.textContent = date;
    dateHeader.style.cursor = 'pointer';
    dateHeader.onclick = () => {
      const dateContent = dateSection.querySelector('.date-content');
      dateContent.style.display = dateContent.style.display === 'none' ? 'block' : 'none';
    };
    dateSection.appendChild(dateHeader);

    // Date content container
    const dateContent = document.createElement('div');
    dateContent.className = 'date-content';
    dateContent.style.display = 'none'; // Initially hidden

    // Add mission sections for this date
    groupedByDate[date].forEach(entry => {
      const missionSection = document.createElement('div');
      missionSection.className = 'mission-section';

      // Mission ID header
      const missionHeader = document.createElement('h4');
      missionHeader.textContent = `Trip: ${entry.missionId}`;
      missionHeader.style.cursor = 'pointer';
      missionHeader.onclick = () => {
        const missionContent = missionSection.querySelector('.mission-content');
        missionContent.style.display = missionContent.style.display === 'none' ? 'block' : 'none';
      };
      missionSection.appendChild(missionHeader);

      // Mission content
      const missionContentDiv = document.createElement('div');
      missionContentDiv.className = 'mission-content';
      missionContentDiv.style.display = 'none'; // Initially hidden

      // Add drop-off points
      Object.keys(entry.dropOffPoints).forEach(dropOffPoint => {
        const dropOffSection = document.createElement('div');
        dropOffSection.className = 'drop-off-section';

        const dropOffHeader = document.createElement('h5');
        dropOffHeader.textContent = dropOffPoint;
        dropOffHeader.style.cursor = 'pointer';
        dropOffHeader.onclick = () => {
          const dropOffContent = dropOffSection.querySelector('.drop-off-content');
          dropOffContent.style.display = dropOffContent.style.display === 'none' ? 'block' : 'none';
        };
        dropOffSection.appendChild(dropOffHeader);

        const dropOffContentDiv = document.createElement('div');
        dropOffContentDiv.className = 'drop-off-content';
        dropOffContentDiv.style.display = 'none'; // Initially hidden

        // Create commodities table
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
          <th style="border: 1px solid #ddd; padding: 8px;">Commodity</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Amount Delivered</th>
        `;
        table.appendChild(headerRow);

        entry.dropOffPoints[dropOffPoint].commodities.forEach(commodity => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td style="border: 1px solid #ddd; padding: 8px;">${commodity.commodity}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${commodity.currentAmount}/${commodity.originalAmount}</td>
          `;
          table.appendChild(row);
        });

        dropOffContentDiv.appendChild(table);
        dropOffSection.appendChild(dropOffContentDiv);
        missionContentDiv.appendChild(dropOffSection);
      });

      missionSection.appendChild(missionContentDiv);
      dateContent.appendChild(missionSection);
    });

    dateSection.appendChild(dateContent);
    historyContainer.appendChild(dateSection);
  });

  // Apply colors to history elements after they're created
  const historyElements = document.querySelectorAll(`
    .date-section h3,
    .mission-section h4,
    .drop-off-section h5
  `);
  applyCurrentColor(historyElements);
}



// Sort the arrays alphabetically
Object.keys(data.planet).forEach(planet => data.planet[planet].sort());
Object.keys(data.station).forEach(station => data.station[station].sort());
data.commodities.sort();

const locationTypeSelect = document.getElementById('locationType');
const locationSelect = document.getElementById('location');
const dropOffPointSelect = document.getElementById('dropOffPoint');
const commoditySelect = document.getElementById('commodity');
const amountInput = document.getElementById('amount');
const addEntryBtn = document.getElementById('addEntryBtn');
const clearLogBtn = document.getElementById('clearLogBtn');
const resultTable = document.getElementById('resultTable');

// Flag to track first click on Clear Log button
let clearLogClicked = false;

// Function to populate locations based on type
function populateLocations() {
  const selectedType = locationTypeSelect.value;
  const moonGroup = document.querySelector('.form-group:nth-child(3)'); // Moon dropdown
  const dropOffGroup = document.querySelector('.form-group:nth-child(4)'); // Drop-off point dropdown
  
  locationSelect.innerHTML = ''; // Clear previous options
  
  // Add default option with appropriate text
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = selectedType === 'station' ? '-- Select Station --' : '-- Select Planet --';
  locationSelect.appendChild(defaultOption);
  
  // Show/hide moon and drop-off point based on location type
  if (selectedType === 'station') {
    moonGroup.style.display = 'none';
    dropOffGroup.style.display = 'none';
  } else {
    moonGroup.style.display = 'flex';
    dropOffGroup.style.display = 'flex';
  }
  
  // Only populate with planets or stations
  if (selectedType === 'planet') {
    Object.keys(data.planet).forEach(location => {
      const option = document.createElement('option');
      option.value = location;
      option.textContent = location;
      locationSelect.appendChild(option);
    });
  } else if (selectedType === 'station') {
    Object.keys(data.station).forEach(location => {
      const option = document.createElement('option');
      option.value = location;
      option.textContent = location;
      locationSelect.appendChild(option);
    });
  }

  // Reset the drop-off point and commodities
  populateDropOffPoints();
  populateCommodities();
}

// Function to populate drop-off points based on the selected location
function populateDropOffPoints() {
  try {
    const selectedLocation = locationSelect.value;
    const selectedMoon = moonSelect.value;
    const selectedType = locationTypeSelect.value;

    dropOffPointSelect.innerHTML = ''; // Clear previous options

    // Add default option with new text
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select Drop-off Point --';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    dropOffPointSelect.appendChild(defaultOption);

    // Case 1: Planet selected with no moon - show planet facilities
    if (selectedType === 'planet' && selectedLocation && !selectedMoon) {
      const dropOffPoints = data.planet[selectedLocation] || [];
      dropOffPoints.sort();
      dropOffPoints.forEach(point => {
        const option = document.createElement('option');
        option.value = point;
        option.textContent = point;
        dropOffPointSelect.appendChild(option);
      });
      return;
    }

    // Case 2: Planet and moon selected - show moon facilities
    if (selectedType === 'planet' && selectedLocation && selectedMoon) {
      // Add the moon name header
      const moonHeader = document.createElement('option');
      moonHeader.value = '';
      moonHeader.textContent = `${selectedMoon} Facilities`;
      moonHeader.disabled = true;
      dropOffPointSelect.appendChild(moonHeader);

      // Get moon facilities from data structure
      const moonFacilities = data.moon[selectedLocation][selectedMoon] || [];
      moonFacilities.sort(); // Sort the options alphabetically
      moonFacilities.forEach(facility => {
        const option = document.createElement('option');
        option.value = facility;
        option.textContent = facility;
        dropOffPointSelect.appendChild(option);
      });
      return; // Exit after adding moon facilities
    }

    // Case 3: Station selected
    if (selectedType === 'station') {
      dropOffPointSelect.innerHTML = '';
      return;
    }

  } catch (error) {
    console.error('Error in populateDropOffPoints:', error);
    if (dropOffPointSelect) {
      dropOffPointSelect.innerHTML = '<option value="">Select a location first</option>';
    }
  }
}

// Function to populate commodities
function populateCommodities() {
  commoditySelect.innerHTML = ''; // Clear previous options
  data.commodities.forEach(commodity => {
    const option = document.createElement('option');
    option.value = commodity;
    option.textContent = commodity;
    commoditySelect.appendChild(option);
  });
}

// Function to handle clearing the log
function handleClearLog() {
  if (!clearLogClicked) {
    showNotification('Click again to confirm clearing the logs.');
    clearLogClicked = true;
    return;
  }

  localStorage.removeItem('cargoEntries');
  updateResultTable(); // Keep the manifest title and re-render the table without any entries
  clearLogClicked = false;
  showNotification('Logs have been cleared.');
}

// Initialize the page
populateLocations();
populateCommodities();
updateResultTable();

// Event listeners
locationTypeSelect.addEventListener('change', populateLocations);
locationSelect.addEventListener('change', () => {
  populateMoons();
  populateDropOffPoints();
});
addEntryBtn.addEventListener('click', addEntry);
clearLogBtn.addEventListener('click', handleClearLog);

// Tab switching function
function openTab(evt, tabName) {
  const tabContents = document.getElementsByClassName('tabcontent');
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = 'none';
  }

  const tabLinks = document.getElementsByClassName('tablinks');
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove('active');
  }

  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.classList.add('active');
}

// Default to Deliveries tab
document.getElementById('deliveriesTab').click();


// Delivery history

function addDeliveryToHistory(entry) {
  let deliveryHistory = JSON.parse(localStorage.getItem('deliveryHistory')) || [];

  // Add a new entry with date and time
  const now = new Date();
  const deliveryEntry = {
    ...entry,
    date: now.toISOString().split('T')[0], // Get only the date part (YYYY-MM-DD)
    time: now.toLocaleTimeString(),        // Get local time string
  };

  deliveryHistory.push(deliveryEntry);
  localStorage.setItem('deliveryHistory', JSON.stringify(deliveryHistory));

  updateHistoryTable();
}

// Add new function to group history entries by date
function groupHistoryByDate(history) {
  return history.reduce((groups, entry) => {
    if (!groups[entry.date]) {
      groups[entry.date] = {};
    }
    if (!groups[entry.date][entry.dropOffPoint]) {
      groups[entry.date][entry.dropOffPoint] = [];
    }
    groups[entry.date][entry.dropOffPoint].push(entry);
    return groups;
  }, {});
}

// Function to move delivered entries to the history table
function moveDeliveredToHistory() {
  let cargoEntries = JSON.parse(localStorage.getItem('cargoEntries')) || [];
  const deliveredEntries = cargoEntries.filter(entry => entry.status === 'Delivered');

  if (deliveredEntries.length === 0) {
    showNotification('No delivered entries to move to history.');
    return;
  }

  let historyEntries = JSON.parse(localStorage.getItem('deliveryHistory')) || [];

  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Count existing missions for today only
  const todayMissionCount = historyEntries.filter(entry => {
    return entry.date === today && entry.missionId.startsWith('#');
  }).length;

  // Create mission ID with sequential number (resets each day)
  const missionNumber = todayMissionCount + 1;
  const missionId = `#${missionNumber}`;

  // Create a simple history entry with numbered mission ID and date
  const historyEntry = {
    missionId: missionId,
    date: today,
    dropOffPoints: {}
  };

  // Group delivered entries by drop-off point
  deliveredEntries.forEach(entry => {
    const dropOffPoint = entry.dropOffPoint;

    if (!historyEntry.dropOffPoints[dropOffPoint]) {
      historyEntry.dropOffPoints[dropOffPoint] = {
        commodities: []
      };
    }

    historyEntry.dropOffPoints[dropOffPoint].commodities.push({
      commodity: entry.commodity,
      currentAmount: entry.currentAmount,
      originalAmount: entry.originalAmount
    });
  });

  historyEntries.push(historyEntry);
  localStorage.setItem('deliveryHistory', JSON.stringify(historyEntries));

  cargoEntries = cargoEntries.filter(entry => entry.status !== 'Delivered');
  localStorage.setItem('cargoEntries', JSON.stringify(cargoEntries));

  updateResultTable();
  updateHistoryTable();

  showNotification(`All delivered entries have been moved to history under Mission ${missionId}`);

  // Apply colors to new history elements
  const historyElements = document.querySelectorAll(`
    .date-section h3,
    .mission-section h4,
    .drop-off-section h5
  `);
  applyCurrentColor(historyElements);
}

// Dark mode toggle with persistence
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); // Save preference to localStorage
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); // Save preference to localStorage
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

// Check for saved theme preference when page loads
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

// Add event listeners for input boxes
document.addEventListener('click', function(e) {
  // Check if the clicked element is an input of type number
  if (e.target.matches('input[type="number"]')) {
    e.target.select(); // Select all text in the input
  }
});

// Add event listener for Enter key in input boxes
document.addEventListener('keypress', function(e) {
  // Check if the pressed key is Enter
  if (e.key === 'Enter') {
    // For the amount input at the top
    if (e.target.id === 'amount') {
      e.preventDefault();
      addEntry();
    }
    // For update amount inputs in the table
    else if (e.target.matches('table input[type="number"]')) {
      e.preventDefault();
      const id = e.target.id.replace('updateAmount_', '');
      updateCargo(id);
    }
  }
});

// Update the updateCargo function to work with both button clicks and Enter key
async function updateCargo(id) {
  const newAmount = document.getElementById(`updateAmount_${id}`).value;
  let cargoEntries = JSON.parse(localStorage.getItem('cargoEntries')) || [];

  // Find the entry to get the original amount
  const entry = cargoEntries.find(entry => entry.id === id);
  if (!entry) return;

  // Validate the new amount
  if (!newAmount || isNaN(newAmount) || newAmount <= 0) {
    showNotification('Please enter a valid amount.');
    return;
  }

  // Check if new amount exceeds original amount
  if (parseInt(newAmount) > parseInt(entry.originalAmount)) {
    showNotification(`Amount cannot exceed original amount of ${entry.originalAmount}`);
    document.getElementById(`updateAmount_${id}`).value = entry.currentAmount;
    return;
  }

  // Update the current amount
  cargoEntries = cargoEntries.map(entry => {
    if (entry.id === id) {
      entry.currentAmount = parseInt(newAmount);
    }
    return entry;
  });

  // Save updated entries to local storage
  localStorage.setItem('cargoEntries', JSON.stringify(cargoEntries));

  // Update the table
  updateResultTable();
}

// Add this new function to handle button clicks
async function updateCargoClick(id) {
  await updateCargo(id);
}

// Function to populate moons
function populateMoons() {
  const selectedLocation = locationSelect.value;
  const selectedType = locationTypeSelect.value;
  moonSelect.innerHTML = ''; // Clear existing options

  // Add blank option first
  const blankOption = document.createElement('option');
  blankOption.value = '';
  blankOption.textContent = '-- Select Moon --';
  moonSelect.appendChild(blankOption);

  // Add moons based on selected location
  if (selectedType === 'planet' && selectedLocation === 'Microtech') {
    const microtechMoons = ['Calliope', 'Clio', 'Euterpe'];
    microtechMoons.forEach(moon => {
      const option = document.createElement('option');
      option.value = moon;
      option.textContent = moon;
      moonSelect.appendChild(option);
    });
  } else if (selectedType === 'planet' && selectedLocation === 'Hurston') {
    const hurstonMoons = ['Arial', 'Aberdeen', 'Magda', 'Ita'];
    hurstonMoons.forEach(moon => {
      const option = document.createElement('option');
      option.value = moon;
      option.textContent = moon;
      moonSelect.appendChild(option);
    });
  } else if (selectedType === 'planet' && selectedLocation === 'ArcCorp') {
    const arccorpMoons = ['Lyria', 'Wala'];
    arccorpMoons.forEach(moon => {
      const option = document.createElement('option');
      option.value = moon;
      option.textContent = moon;
      moonSelect.appendChild(option);
    });
  } else if (selectedType === 'planet' && selectedLocation === 'Crusader') {
    const crusaderMoons = ['Yela', 'Cellin', 'Daymar'];
    crusaderMoons.forEach(moon => {
      const option = document.createElement('option');
      option.value = moon;
      option.textContent = moon;
      moonSelect.appendChild(option);
    });
  }
}

// Make sure we have the moon select element
const moonSelect = document.getElementById('moon');

// Call populateMoons initially
document.addEventListener('DOMContentLoaded', () => {
  populateMoons();
});

locationSelect.addEventListener('change', () => {
  populateMoons();
  populateDropOffPoints();
});

moonSelect.addEventListener('change', populateDropOffPoints);

function populateLocationTypes() {
  const locationTypeSelect = document.getElementById('locationTypeSelect');
  const locationTypes = ['planet', 'station']; // Add other types if necessary

  locationTypeSelect.innerHTML = ''; // Clear previous options
  locationTypes.sort(); // Sort the options alphabetically

  locationTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize the first letter
    locationTypeSelect.appendChild(option);
  });
}

// Event listener for location type selection
locationTypeSelect.addEventListener('change', () => {
  // Clear the moon dropdown
  moonSelect.innerHTML = ''; // Clear previous options

  // Add a blank option as the default
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select a Moon'; // You can customize this text
  defaultOption.disabled = true; // Disable the default option
  defaultOption.selected = true; // Set it as the selected option
  moonSelect.appendChild(defaultOption);

  // Populate moons based on the selected location type
  if (locationTypeSelect.value === 'planet') {
    populateMoons(); // Call your function to populate moons
  }
});

function addEntryToTable(dropOffPoint) {
  const table = document.getElementById('yourTableId'); // Replace with your actual table ID
  const row = table.insertRow(); // Create a new row

  // Get the selected location and moon
  const selectedLocation = locationSelect.value; // Assuming locationSelect is your location dropdown
  const selectedMoon = moonSelect.value; // Assuming moonSelect is your moon dropdown

  // Create the drop-off point entry with location and moon
  const locationAndMoon = selectedMoon ? `${selectedLocation} - ${selectedMoon}` : selectedLocation; // Format the string
  const dropOffPointEntry = `${dropOffPoint.toLowerCase()} - ${locationAndMoon.toLowerCase()}`; // Combine drop-off point with location and moon

  // Create a cell for the drop-off point entry
  const cell = row.insertCell(0);
  cell.textContent = dropOffPointEntry; // Set the text content of the cell

  // Add any additional cells as needed
  // Example: Add a cell for actions (edit/delete)
  const actionCell = row.insertCell(1);
  actionCell.innerHTML = '<button onclick="editEntry(this)">Edit</button> <button onclick="deleteEntry(this)">Delete</button>';
}

// Example function to handle adding the entry
function handleAddButtonClick() {
  const dropOffPoint = dropOffPointSelect.value; // Get the selected drop-off point
  if (dropOffPoint) {
    addEntryToTable(dropOffPoint); // Call the function to add the entry to the table
  } else {
    alert('Please select a drop-off point.'); // Alert if no drop-off point is selected
  }
}

// Function to clear the log
function clearLog() {
  const table = document.getElementById('yourTableId'); // Replace with your actual table ID
  while (table.rows.length > 0) {
    table.deleteRow(0); // Remove all rows from the table
  }
}

// Event listener for the Clear Log button
const clearLogButton = document.getElementById('clearLogButton'); // Replace with your actual button ID
clearLogButton.addEventListener('click', () => {
  clearLog(); // Call the clear log function
});

// Assuming you have a function that sets up the drop-off points
function setupDropOffPoints() {
  const container = document.getElementById('dropOffContainer'); // Replace with your actual container ID

  // Create and append the Mission label
  const missionLabel = document.createElement('h3');
  missionLabel.textContent = 'Mission';
  container.appendChild(missionLabel);

  // Create and append the Drop-off Points label
  const dropOffLabel = document.createElement('h3');
  dropOffLabel.textContent = 'Drop-off Points';
  container.appendChild(dropOffLabel);

  // Create and append the drop-off points select element
  const dropOffPointSelect = document.createElement('select');
  dropOffPointSelect.id = 'dropOffPointSelect';
  container.appendChild(dropOffPointSelect);

  // Populate drop-off points as needed
}

// Function to set up the history tab
function setupHistoryTab() {
  const historyTab = document.getElementById('historyTab');
  historyTab.innerHTML = ''; // Clear existing content

  // Create and append labels
  createLabel(historyTab, 'Trip', 'h3');
  createLabel(historyTab, 'Details', 'h4');
  createLabel(historyTab, 'Missions', 'h4');

  // Create and append the history table
  const table = createTable(['Commodity', 'Drop-off Point', 'Amount', 'Actions']);
  historyTab.appendChild(table);
}

// Helper function to create and append labels with smaller font size
function createLabel(container, text, tag) {
  const label = document.createElement(tag);
  label.textContent = text;
  label.style.fontSize = '12px'; // Set the font size to a smaller size
  container.appendChild(label);
}

// Helper function to create a table with headers
function createTable(headers) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const headerRow = document.createElement('tr');
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);
  table.appendChild(tbody);
  table.id = 'historyTable'; // Set the ID for the table

  return table;
}

// Function to add an entry to the history
function addEntryToHistory(commodityName, dropOffPoint, amount) {
  const historyTable = document.getElementById('historyTable').getElementsByTagName('tbody')[0]; // Get the tbody of the history table
  const row = historyTable.insertRow(); // Create a new row for the history entry

  // Create a cell for the commodity name
  const commodityCell = row.insertCell(0);
  commodityCell.textContent = commodityName.toLowerCase(); // Set the commodity name in lowercase

  // Create a cell for the drop-off point
  const dropOffPointCell = row.insertCell(1);
  dropOffPointCell.textContent = dropOffPoint; // Set the drop-off point

  // Create a cell for the amount
  const amountCell = row.insertCell(2);
  amountCell.textContent = amount; // Set the amount

  // Optionally, add a cell for actions (edit/delete)
  const actionCell = row.insertCell(3);
  actionCell.innerHTML = '<button onclick="editEntry(this)">Edit</button> <button onclick="deleteEntry(this)">Delete</button>';
}

// Example function to handle adding an entry from the deliveries table
function handleDeliveryToHistory() {
  const commodityName = document.getElementById('commoditySelect').value; // Get the selected commodity name
  const dropOffPoint = dropOffPointSelect.value; // Get the selected drop-off point
  const amount = document.getElementById('amountInput').value; // Get the amount

  if (commodityName && dropOffPoint && amount) {
    addEntryToHistory(commodityName, dropOffPoint, amount); // Call the function to add the entry to the history
  } else {
    alert('Please select a commodity, drop-off point, and enter an amount.'); // Alert if any field is missing
  }
}

// Call setupHistoryTab when needed
setupHistoryTab();

// Function to update the primary color
function updatePrimaryColor(color) {
  // Store the color preference
  localStorage.setItem('primaryColor', color);
  
  // Update CSS variable
  document.documentElement.style.setProperty('--primary-color', color);
  
  // Update all elements that use the green color
  const elements = document.querySelectorAll(`
    .form-section button:not(.remove-btn):not(#clearLogBtn),
    button.action-btn:not(.remove-btn),
    .collapsible,
    .date-section h3,
    .mission-section h4,
    .drop-off-section h5,
    .reset-btn,
    input:checked + .slider,
    #addEntryBtn,
    #moveDeliveredBtn,
    .delivered,
    .action-btn.update-btn,
    .tablinks.active,
    th
  `);
  
  elements.forEach(element => {
    if (element.matches('th')) {
      element.style.backgroundColor = color;
      element.style.color = 'white';
      element.style.borderColor = adjustColor(color, -20);
    } else if (!element.matches('.remove-btn') && !element.matches('#clearLogBtn')) {
      element.style.backgroundColor = color;
    }
  });

  // Update hover states by injecting updated CSS
  const styleElement = document.getElementById('dynamic-styles') || document.createElement('style');
  if (!styleElement.id) styleElement.id = 'dynamic-styles';
  
  styleElement.textContent = `
    .form-section button:not(.remove-btn):not(#clearLogBtn):hover,
    button.action-btn:not(.remove-btn):hover,
    .collapsible:hover,
    .reset-btn:hover,
    #addEntryBtn:hover,
    #moveDeliveredBtn:hover,
    .delivered:hover,
    .action-btn.update-btn:hover {
      background-color: ${adjustColor(color, -20)}!important;
    }

    /* Force active tab color */
    .tablinks.active {
      background-color: ${color}!important;
    }

    /* Ensure inactive tabs remain gray */
    .tablinks:not(.active) {
      background-color: #333!important;
    }

    /* Keep remove button and clear log button red */
    .remove-btn, #clearLogBtn {
      background-color: #f44336!important;
    }

    .remove-btn:hover, #clearLogBtn:hover {
      background-color: #d32f2f!important;
    }

    /* Force table header styling */
    th {
      background-color: ${color}!important;
      color: white!important;
      border-color: ${adjustColor(color, -20)}!important;
    }

    /* Dark mode compatibility */
    [data-theme="dark"] th {
      background-color: ${color}!important;
      color: white!important;
      border-color: ${adjustColor(color, -20)}!important;
    }
  `;
  
  if (!styleElement.parentElement) {
    document.head.appendChild(styleElement);
  }
}

// Helper function to darken/lighten color for hover states
function adjustColor(color, amount) {
  const clamp = (val) => Math.min(Math.max(val, 0), 255);
  
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Adjust each component
  const adjustR = clamp(r + amount);
  const adjustG = clamp(g + amount);
  const adjustB = clamp(b + amount);
  
  // Convert back to hex
  const getHex = (n) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${getHex(adjustR)}${getHex(adjustG)}${getHex(adjustB)}`;
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
  const colorPicker = document.getElementById('accentColor');
  
  // Load saved color preference
  const savedColor = localStorage.getItem('primaryColor') || '#4CAF50';
  colorPicker.value = savedColor;
  updatePrimaryColor(savedColor);
  
  // Add change event listener for real-time updates
  colorPicker.addEventListener('input', (e) => {
    updatePrimaryColor(e.target.value);
  });
  
  // Add change event listener for final value
  colorPicker.addEventListener('change', (e) => {
    updatePrimaryColor(e.target.value);
  });
});

// Update the reset function
function resetToDefaultColor() {
  const defaultColor = '#4CAF50';
  document.getElementById('accentColor').value = defaultColor;
  updatePrimaryColor(defaultColor);
}

// Add this function to apply the current color to new elements
function applyCurrentColor(elements) {
  const currentColor = localStorage.getItem('primaryColor') || '#4CAF50';
  elements.forEach(element => {
    if (element.matches('th')) {
      element.style.backgroundColor = currentColor;
      element.style.color = 'white';
      element.style.borderColor = adjustColor(currentColor, -20);
    } else if (!element.matches('.remove-btn') && !element.matches('#clearLogBtn')) {
      element.style.backgroundColor = currentColor;
    }
  });
}

// Add this to check if we're in a popup window
window.addEventListener('load', () => {
    if (window.opener) {
        document.title = "SC Cargo Tracker"; // Set a shorter title for the popup
        // Hide the popout button in the popup window
        const popoutBtn = document.getElementById('popoutBtn');
        if (popoutBtn) {
            popoutBtn.style.display = 'none';
        }
    }
});

// Add this function to handle the Deliveries pop-out
function openDeliveriesPopout() {
    // Calculate the desired window size
    const width = 1024;
    const height = 800;
    
    // Calculate center position
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    // Create the features string for the new window
    const features = [
        `width=${width}`,
        `height=${height}`,
        `left=${left}`,
        `top=${top}`,
        'alwaysOnTop=yes',
        'menubar=no',
        'toolbar=no',
        'location=no',
        'status=no',
        'scrollbars=yes',
        'resizable=yes'
    ].join(',');

    // Open the new window
    const popout = window.open(
        window.location.href + '?popup=deliveries',
        'DeliveriesWindow',
        features
    );

    if (popout) {
        // Store reference to the popup window
        window.deliveriesPopup = popout;
        
        // Add event listener to check when popup is closed
        const checkPopup = setInterval(() => {
            if (popout.closed) {
                clearInterval(checkPopup);
                window.deliveriesPopup = null;
            }
        }, 1000);
    }
}

// Add this to handle the popup window setup
window.addEventListener('load', () => {
    // Check if this is a popup window
    const urlParams = new URLSearchParams(window.location.search);
    const isPopup = urlParams.get('popup');
    
    if (isPopup === 'deliveries') {
        document.body.classList.add('popup-window');
        document.title = "SC Cargo Deliveries";
    } else {
        // Add click handler for popout button
        const popoutBtn = document.getElementById('deliveriesPopoutBtn');
        if (popoutBtn) {
            popoutBtn.addEventListener('click', openDeliveriesPopout);
        }
    }
});

// Add this to ensure data stays synced between windows
function syncDataBetweenWindows() {
    if (window.deliveriesPopup && !window.deliveriesPopup.closed) {
        // Sync data to popup
        window.deliveriesPopup.postMessage('sync-data', '*');
    }
}

// Add message listener for data sync
window.addEventListener('message', (event) => {
    if (event.data === 'sync-data') {
        updateResultTable();
    }
});

// Add entry to local storage and update result table
function addEntry() {
  const location = locationSelect.value;
  const moon = moonSelect.value;
  const dropOffPoint = locationTypeSelect.value === 'station' ? location : dropOffPointSelect.value;
  const commodity = commoditySelect.value;
  const amount = amountInput.value;

  if (!location || !commodity || !amount) {
    showNotification('Please fill all fields');
    return;
  }

  // Add specific check for drop-off point when not in station mode
  if (locationTypeSelect.value !== 'station' && !dropOffPoint) {
    showNotification('Please select a drop-off point');
    return;
  }

  let cargoEntries = JSON.parse(localStorage.getItem('cargoEntries')) || [];
  const newEntry = {
    id: new Date().toISOString(),
    location,
    moon,
    dropOffPoint,
    commodity,
    originalAmount: amount,
    currentAmount: amount,
    status: 'Pending'
  };

  cargoEntries.push(newEntry);
  localStorage.setItem('cargoEntries', JSON.stringify(cargoEntries));
  amountInput.value = '';
  updateResultTable();

  // Apply colors to new buttons after table update
  const newButtons = document.querySelectorAll(`
    button.action-btn,
    .delivered,
    .action-btn.update-btn
  `);
  applyCurrentColor(newButtons);
}

// Update the result table to reflect the latest cargo entries
function updateResultTable() {
  let cargoEntries = JSON.parse(localStorage.getItem('cargoEntries')) || [];

  // Clear the table first but keep the title
  resultTable.innerHTML = '';

  // Create Cargo Manifest title (only once)
  if (!document.getElementById('cargoManifestTitle')) {
    const manifestTitle = document.createElement('div');
    manifestTitle.classList.add('cargo-manifest-title');
    manifestTitle.id = 'cargoManifestTitle';
    manifestTitle.textContent = 'CARGO MANIFEST';
    resultTable.appendChild(manifestTitle);
  }

  // Create table for cargo entries
  const table = document.createElement('table');

  // Table header row
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Drop-off Point</th>
    <th>Commodity</th>
    <th>Amount</th>
    <th>Actions</th>
    <th>Status</th>
  `;
  table.appendChild(headerRow);

  // Group entries by drop-off point
  const groupedEntries = groupByDropOffPoint(cargoEntries);

  Object.keys(groupedEntries).forEach(dropOffPoint => {
    const entries = groupedEntries[dropOffPoint];
    const firstEntry = entries[0];
    
    // Format location string
    const locationInfo = firstEntry.moon 
      ? ` (${firstEntry.location} - ${firstEntry.moon})`
      : ` (${firstEntry.location})`;

    // Create a new row for the drop-off point
    const dropOffRow = document.createElement('tr');
    dropOffRow.classList.add('drop-off-header');
    
    // Create the button with consistent text
    dropOffRow.innerHTML = `
      <td colspan="4" style="font-weight: bold; cursor: pointer;">
        ${dropOffPoint}<span style="font-size: 0.6em; color: #999;">${locationInfo}</span>
      </td>
      <td>
        <button class="action-btn" onclick="markDelivered('${dropOffPoint}')">Cargo Delivered</button>
      </td>
    `;
    table.appendChild(dropOffRow);

    // Create container for commodity rows
    const commodityRows = document.createElement('tbody');
    commodityRows.classList.add('commodity-rows');
    
    // Add each commodity for the current drop-off point as individual rows
    entries.forEach(({ id, commodity, originalAmount, currentAmount, status }) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td></td> <!-- Empty cell for drop-off point -->
        <td>${commodity}</td>
        <td>${currentAmount}/${originalAmount}</td>
        <td class="action-cell">
          <input type="number" id="updateAmount_${id}" value="${currentAmount}" />
          <button class="action-btn update-btn" onclick="updateCargoClick('${id}')">Update Cargo</button>
          <button class="action-btn remove-btn" onclick="removeCargo('${id}')">Remove Cargo</button>
        </td>
        <td>${status}</td>
      `;
      commodityRows.appendChild(row);
    });

    table.appendChild(commodityRows);

    // Add click event to toggle visibility
    dropOffRow.querySelector('td').addEventListener('click', () => {
      const isExpanded = commodityRows.style.display !== 'none';
      commodityRows.style.display = isExpanded ? 'none' : '';
      dropOffRow.querySelector('td').setAttribute('aria-expanded', !isExpanded);
    });
  });

  // Append the table to the result section
  resultTable.appendChild(table);
}

// Function to group entries by drop-off point
function groupByDropOffPoint(entries) {
  return entries.reduce((groups, entry) => {
    if (!groups[entry.dropOffPoint]) {
      groups[entry.dropOffPoint] = [];
    }
    groups[entry.dropOffPoint].push(entry);
    return groups;
  }, {});
}

// Function to remove cargo entry by unique ID
function removeCargo(id) {
  let cargoEntries = JSON.parse(localStorage.getItem('cargoEntries')) || [];

  // Filter out the cargo entry with the matching ID
  cargoEntries = cargoEntries.filter(entry => entry.id !== id);

  // Save updated cargo entries back to local storage
  localStorage.setItem('cargoEntries', JSON.stringify(cargoEntries));

  // Update the table to reflect the removal
  updateResultTable();
}

// Function to mark all cargo under a drop-off point as delivered
function markDelivered(dropOffPoint) {
  // Fetch data from localStorage
  let cargoEntries = JSON.parse(localStorage.getItem('cargoEntries')) || [];
  let updated = false;

  // Normalize the drop-off point for comparison
  const normalizedTarget = dropOffPoint.toLowerCase().trim();

  // Update the status of all entries with the specified drop-off point
  cargoEntries = cargoEntries.map(entry => {
    // Normalize the entry drop-off point for comparison
    const normalizedEntry = entry.dropOffPoint.toLowerCase().trim();

    // Debugging: Log the comparison
    console.log(`Comparing: "${normalizedEntry}" with "${normalizedTarget}"`);

    if (normalizedEntry === normalizedTarget) {
      updated = true;
      return {
        ...entry,
        status: 'Delivered'
      };
    }
    return entry;
  });

  // Log if no entries were updated
  if (!updated) {
    console.log('No matching entries found for:', dropOffPoint);
    console.log('Available entries:', cargoEntries.map(e => e.dropOffPoint));
  }

  // Save updated cargo entries back to local storage
  localStorage.setItem('cargoEntries', JSON.stringify(cargoEntries));

  // Refresh the result table to reflect the updated status
  updateResultTable();

  // Show notification of successful status change
  if (updated) {
    showNotification(`Cargo for ${dropOffPoint} marked as delivered`);
  } else {
    showNotification('No matching entries found to mark as delivered');
  }
}

// Function to update the current amount for a cargo entry
function updateCargo(id) {
  const newAmount = document.getElementById(`updateAmount_${id}`).value;
  let cargoEntries = JSON.parse(localStorage.getItem('cargoEntries')) || [];
  
  // Find the entry to get the original amount
  const entry = cargoEntries.find(entry => entry.id === id);
  if (!entry) return;

  // Validate the new amount
  if (!newAmount || isNaN(newAmount) || newAmount <= 0) {
    showNotification('Please enter a valid amount.');
    return;
  }

  // Check if new amount exceeds original amount
  if (parseInt(newAmount) > parseInt(entry.originalAmount)) {
    showNotification(`Amount cannot exceed original amount of ${entry.originalAmount}`);
    document.getElementById(`updateAmount_${id}`).value = entry.currentAmount;
    return;
  }

  // Update the current amount
  cargoEntries = cargoEntries.map(entry => {
    if (entry.id === id) {
      entry.currentAmount = parseInt(newAmount);
    }
    return entry;
  });

  // Save updated entries to local storage
  localStorage.setItem('cargoEntries', JSON.stringify(cargoEntries));

  // Update the table
  updateResultTable();
}

// Add this function to handle notifications
function showNotification(message, duration = 5000) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.display = 'block';
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      notification.style.display = 'none';
      notification.style.animation = 'slideIn 0.3s ease-out';
    }, 300);
  }, duration);
}

// Add event listeners for input boxes
document.addEventListener('click', function(e) {
  // Check if the clicked element is an input of type number
  if (e.target.matches('input[type="number"]')) {
    e.target.select(); // Select all text in the input
  }
});

// Add event listener for Enter key in input boxes
document.addEventListener('keypress', function(e) {
  // Check if the pressed key is Enter
  if (e.key === 'Enter') {
    // For the amount input at the top
    if (e.target.id === 'amount') {
      e.preventDefault();
      addEntry();
    }
    // For update amount inputs in the table
    else if (e.target.matches('table input[type="number"]')) {
      e.preventDefault();
      const id = e.target.id.replace('updateAmount_', '');
      updateCargo(id);
    }
  }
});

// Add window mode toggle functionality
const { ipcRenderer } = require('electron');

document.getElementById('windowModeToggle').addEventListener('click', () => {
    ipcRenderer.send('toggle-window-mode');
    document.body.classList.toggle('borderless');
});














