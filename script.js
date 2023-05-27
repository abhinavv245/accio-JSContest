// Fetch data using .then
function fetchDataWithThen() {
  fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Request failed");
      }
      return response.json();
    })
    .then((data) => {
      renderTable(data);
      setupSortButtons(data);
     
    })
    .catch((error) => {
      console.error(error);
    });
}

// Fetch data using async/await
async function fetchDataWithAsyncAwait() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
    );
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const data = await response.json();
    renderTable(data);
    setupSortButtons(data);
  } catch (error) {
    console.error(error);
  }
}

// fetchDataWithThen();
fetchDataWithAsyncAwait();

// Render table function
function renderTable(data) {
  const tableBody = document.querySelector("#coinTable tbody");
  tableBody.innerHTML = "";

  data.forEach((coin) => {
    const row = document.createElement("tr");
    const priceChangeClass = coin.price_change_percentage_24h < 0 ? 'negative' : 'positive';
    row.innerHTML = `
     <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24"></td>
      <td>${coin.name}</td>
      <td>${coin.symbol.toUpperCase()}</td>
      <td>$${coin.current_price}</td>
      <td>$${coin.total_volume}</td>
      <td class="price-change ${priceChangeClass}">${coin.price_change_percentage_24h}</td>
      <td>Mkt Cap: $${coin.market_cap}</td>
     
     
    `;
    tableBody.appendChild(row);

    const priceChangeCell = row.querySelector(".price-change");
    const priceChange = parseFloat(coin.price_change_percentage);
    if (priceChange < 0) {
      priceChangeCell.style.color = "red";
    } else if (priceChange > 0) {
      priceChangeCell.style.color = "green";
    }
  });
}


// Perform search function

function performSearch() {
  const searchInput = document.querySelector("#searchInput");
  const searchTerm = searchInput.value.trim().toLowerCase();
  const rows = document.querySelectorAll("#coinTable tbody tr");

  rows.forEach((row) => {
    const name = row.cells[1].textContent.toLowerCase();
    const symbol = row.cells[2].textContent.toLowerCase();

    if (name.includes(searchTerm) || symbol.includes(searchTerm)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Setup sort button
function setupSortButtons(data) {
const sortButton1 = document.querySelector("#sortButton1");
sortButton1.addEventListener("click", () => {
  // Sort the data based on market cap in ascending order
  const sortedData = data.sort((a, b) => a.market_cap - b.market_cap);
  renderTable(sortedData);
});

const sortButton2 = document.querySelector("#sortButton2");
sortButton2.addEventListener("click", () => {
  // Sort the data based on market cap in ascending order
  const sortedData = data.sort(
    (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
  );
  renderTable(sortedData);
});
}
