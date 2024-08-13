//add API info
const COHORT = "2407-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

//create party object
const state = {
  party: [],
};

//references
const partyList = document.querySelector("#newParty");
const addNewParty = document.querySelector("#partyForm");

//Event Listener
addNewParty.addEventListener("submit", addParty);

//Sync state with the API and rerender
async function render() {
  await getParty();
  renderParty();
}
render();

//Update state with new Parties from API
async function getParty() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.party = json.data;
  } catch (error) {
    console.error(error);
  }
}

//Ask the API to create a new party based on form data
async function addParty(event) {
  event.preventDefault();

  await createParty(
    addNewParty.name.value,
    //consverts date to ISO format to match the API
    new Date(addNewParty.date.value),
    addNewParty.location.value,
    addNewParty.description.value
  );
}

//Create new party function that adds to server
async function createParty(name, date, location, description) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ name, date, location, description }),
    });
    const json = await response.json();
    console.log(json.data);
    render();
  } catch (error) {
    console.error(error);
  }
}

//Delete party function
async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    console.log(response.status);

    if (!response.ok) {
      throw new Error("Party could not be deleted");
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

//Render parties from state
function renderParty() {
  if (!state.party.length) {
    partyList.innerHTML = `<li>No Party Found.<li>`;
    return;
  }

  //Add party cards to party object of array
  const partyCard = state.party.map((party) => {
    const partyCard = document.createElement("li");
    partyCard.classList.add("party");
    partyCard.innerHTML = `
        <h2>${party.name}<h2>
        <h2>${new Date(party.date).toLocaleDateString()}<h2>
        <h2>${party.location}<h2>
        <h2>${party.description}<h2>
        `;

    //delete party button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    partyCard.append(deleteButton);

    //access correct party id
    deleteButton.addEventListener("click", () => deleteParty(party.id));

    return partyCard;
  });
  partyList.replaceChildren(...partyCard);
}
