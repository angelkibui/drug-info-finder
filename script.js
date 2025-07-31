async function searchDrug() {
  const drugName = document.getElementById("drugInput").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!drugName) {
    resultsDiv.innerHTML = "<p>Please enter a drug name.</p>";
    return;
  }

  try {
    const response = await fetch(`https://api.fda.gov/drug/label.json?search=${drugName}&limit=1`);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    const drug = data.results[0];

    const html = `
      <div class="result-item">
        <h3>${drug.openfda.brand_name?.[0] || 'Unknown Brand'}</h3>
        <p><strong>Purpose:</strong> ${drug.purpose?.[0] || 'Not available'}</p>
        <p><strong>Usage:</strong> ${drug.indications_and_usage?.[0] || 'Not available'}</p>
        <p><strong>Side Effects:</strong> ${drug.adverse_reactions?.[0] || 'Not listed'}</p>
      </div>
    `;

    resultsDiv.innerHTML = html;

  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = "<p>Error fetching drug data.</p>";
  }
}
