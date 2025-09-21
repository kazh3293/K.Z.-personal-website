function updateLocationOptions() {
  const modality = document.getElementById("event_modality").value;
  const locationField = document.getElementById("location_field");
  const remoteUrlField = document.getElementById("remote_url_field");
  const attendeesField = document.getElementById("attendees_field");

  locationField.style.display = "none";
  remoteUrlField.style.display = "none";
  attendeesField.style.display = "none";


  if (modality === "In-Person") {
    locationField.style.display = "block";
    attendeesField.style.display = "block";
  } else if (modality === "Remote") {
    remoteUrlField.style.display = "block";
    attendeesField.style.display = "block";
  }
}

function saveEvent() {
  const modalEl = document.getElementById('event_Modal');
  const editingCard = modalEl.currentEditingCard;

  const Name = document.getElementById("event_name").value;
  const Weekday = document.getElementById("event_weekday").value;
  const Time = document.getElementById("event_time").value;
  const Modality = document.getElementById("event_modality").value;
  const Location = Modality === "In-Person" ? document.getElementById("event_location").value : null;
  const Remote_url = Modality === "Remote" ? document.getElementById("event_remote_url").value : null;
  const Attendees = document.getElementById("event_attendees").value;
  const Category = document.getElementById("event_category").value;

  const eventDetails = {
        name: Name,// name of the event from the form,
        category: Category,//category of the event from the form,
        weekday: Weekday,//weekday of the event from the form,
        time: Time,//time of the event from the form,
        modality: Modality,//modality of the event from the form,
        location: Location,//if the modality is "In-person" then this has a value and remote_url is null,
        remote_url: Remote_url,//if the modality is "Remote" then this has a value location is null,
        attendees: Attendees,//list of attendees from the form
    };

    if(editingCard) {
      // Update existing event card
      editingCard.eventDetails = eventDetails;
      editingCard.dataset.details = JSON.stringify(eventDetails); 
      editingCard.querySelector('div').innerHTML = `
      <strong>Event Name:</strong> ${eventDetails.name} <br>
      <strong>Event Category:</strong> ${eventDetails.category} <br>
      <strong>Event Time:</strong> ${eventDetails.time} <br>
      <strong>Event Modality:</strong> ${eventDetails.modality} <br>
      ${eventDetails.location ? `<strong>Event Location:</strong> ${eventDetails.location} <br>` : ""}
      ${eventDetails.remote_url ? `<strong>Event Remote URL:</strong> <a href="${eventDetails.remote_url}" target="_blank">${eventDetails.remote_url}</a><br>` : ""}
      <strong>Event Attendees:</strong> ${eventDetails.attendees} <br>
    `;
      const NewDay = document.getElementById(eventDetails.weekday);
      if (editingCard.parentNode !== NewDay) {

        editingCard.parentNode.removeChild(editingCard);
        NewDay.appendChild(editingCard);
      }
      if(eventDetails.category === "Academic"){
        editingCard.style.backgroundColor = '#9ab7d3ff';
      } else if(eventDetails.category === "Work"){ {
        editingCard.style.backgroundColor = '#f4d160ff';
      }
      } else if(eventDetails.category === "Personal Life"){
        editingCard.style.backgroundColor = '#f7a072ff';
      } else if(eventDetails.category === "Entertainment"){
        editingCard.style.backgroundColor = '#61b07eff';
      } else {
        editingCard.style.backgroundColor = '#d3d3d3ff'; // Default color if no category matches
      }
      document.getElementById('event_form').reset();
      var myModalEl = document.getElementById('event_Modal');
      var modal = bootstrap.Modal.getInstance(myModalEl) || new bootstrap.Modal(myModalEl);
      modal.hide();
    }
      else{
         addEventToCalendarUI(eventDetails);
      }

      console.log(eventDetails);
}

function addEventToCalendarUI(eventInfo) {
  let event_card = createEventCard(eventInfo);
  const dayContainer = document.getElementById(eventInfo.weekday);
  if (dayContainer) {
    dayContainer.appendChild(event_card);
  }
  document.getElementById('event_form').reset();
  var myModalEl = document.getElementById('event_Modal');
  var modal = bootstrap.Modal.getInstance(myModalEl) || new bootstrap.Modal(myModalEl);
  modal.hide();
}

function createEventCard(eventDetails) {
  let event_element = document.createElement('div');
  event_element.classList = 'event row border rounded m-1 py-1';  // Light gray background
  event_element.dataset.details = JSON.stringify(eventDetails);

  let info = document.createElement('div');
  let name = eventDetails.name;
  let weekday = eventDetails.weekday;
  let time = eventDetails.time
  let modality = eventDetails.modality
  let location = eventDetails.location;
  let remote_url = eventDetails.remote_url;
  let attendees = eventDetails.attendees;
  let category = eventDetails.category;
  if(category === "Academic"){
    event_element.style.backgroundColor = '#9ab7d3ff';
  } else if(category === "Work"){ {
    event_element.style.backgroundColor = '#f4d160ff';
  }
  } else if(category === "Personal Life"){
    event_element.style.backgroundColor = '#f7a072ff';
  } else if(category === "Entertainment"){
    event_element.style.backgroundColor = '#61b07eff';
  } else {
    event_element.style.backgroundColor = '#d3d3d3ff'; // Default color if no category matches
  }
  info.innerHTML = `
  <strong>Event Name:</strong> ${name} <br>
  <strong>Event Category:</strong> ${category} <br>
  <strong>Event Time:</strong> ${time} <br>
  <strong>Event Modality:</strong> ${modality} <br>
  ${location ? `<strong>Event Location:</strong> ${location} <br>` : ""}
  ${remote_url ? `<strong>Event Remote URL:</strong> <a href="${remote_url}" target="_blank">${eventDetails.remote_url}</a><br>` : ""}
  <strong>Event Attendees:</strong> ${attendees} <br>
`;
  event_element.appendChild(info);
  event_element.onclick = (function() {
    openEditModal(event_element);
  });

  return event_element;
}

function openEditModal(eventCard) {
  const eventDetails = JSON.parse(eventCard.dataset.details);

  document.getElementById("event_name").value = eventDetails.name;
  document.getElementById("event_weekday").value = eventDetails.weekday;
  document.getElementById("event_time").value = eventDetails.time;
  document.getElementById("event_modality").value = eventDetails.modality;
  document.getElementById("event_category").value = eventDetails.category;
  document.getElementById("event_attendees").value = eventDetails.attendees;

  if(eventDetails.modality === "In-Person"){
    document.getElementById("event_location").value = eventDetails.location || null;
  } else if(eventDetails.modality === "Remote"){
    document.getElementById("event_remote_url").value = eventDetails.remote_url || null;
  }

  
  updateLocationOptions();

  const modalEl = document.getElementById('event_Modal');
  modalEl.currentEditingCard = eventCard;

  // show modal
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();

}