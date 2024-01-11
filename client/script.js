const url = "http://localhost:5500/cars";
const carListContainer = document.getElementById("carList");

window.addEventListener('load', fetchData);
function fetchData(){
  carListContainer.innerHTML = "";
  fetch(url)
  .then((response) => response.json())
  .then((object) => {
    const ul = document.createElement("ul");
    ul.classList.add("carList", "list-group");
    const cars = object.resources;

    cars.forEach((car) =>{
      console.log(car);
      const li = document.createElement('li');
      li.classList.add("list-group-item", 'd-flex', 'justify-content-between', 'align-items-center');
      const id = car.id;
      const data = [car.model, car.year, car.gear, car.fuel, car.color, car.mileage];
      const names = ['Modell: ', 'Modell År: ', 'Växellåda: ', 'Bränsle: ', 'Färg: ', 'Miltal: '];
      data.forEach((item, index) =>{
        const span = document.createElement('span');
        const html = names[index] + item + ' ';
        span.innerHTML = html;
        li.appendChild(span);
      });

      const editBtn = document.createElement('button');
  editBtn.textContent = 'Ändra';
  editBtn.classList.add('btn', 'btn-warning', 'mx-2');
  editBtn.addEventListener('click', () => openEditModal(id)); 
  li.appendChild(editBtn);
  
      const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Ta bort';
  deleteBtn.classList.add('btn', 'btn-danger');
  deleteBtn.addEventListener('click', () => deleteCar(id));
  li.appendChild(deleteBtn);

  ul.appendChild(li);

  
});
  
    carListContainer.appendChild(ul);
  })

  .catch((error) => {
    console.error("Error fetching cars:", error);
  });
}



function openEditModal(id) {
  console.log("editing car",id)
  document.getElementById('editCarId').value = id; // lade till det här
  console.log("editCarId value:", document.getElementById('editCarId').value);
  fetch(`http://localhost:5500/cars/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then((car) => {
      console.log("car", car)
      const fetchcar=car.resources[0]
      
      document.getElementById('editInputModel').value = fetchcar.model;
      document.getElementById('editInputYear').value = fetchcar.year;
      document.getElementById('editInputGear').value = fetchcar.gear;
      document.getElementById('editInputFuel').value = fetchcar.fuel;
      document.getElementById('editInputColor').value = fetchcar.color;
     

      

     
      const modal = new bootstrap.Modal(document.getElementById('editCarModal'));
      modal.show();
    })
    .catch((error) => {
      console.error('Error fetching or parsing car details:', error);
    });
}














document.addEventListener("DOMContentLoaded", function () {
  const updateCarBtn = document.getElementById('updateCarBtn');
  updateCarBtn.addEventListener('click', () => {
    const carid = document.getElementById('editCarId').value;
    updateForm(carid);

    fetchData();
    $('#editCarModal').modal('hide');


  });
});


function updateForm(carid) {
  console.log("Before updating form values");
  console.log("Car ID:", carid);
  const model = document.getElementById("editInputModel").value;
  const year = document.getElementById("editInputYear").value;
  const gear = document.getElementById("editInputGear").value;
  const fuel = document.getElementById("editInputFuel").value;
  const color = document.getElementById("editInputColor").value;
  const mileage = document.getElementById("inputMileage").value;

  const updatedData = {
    model: model,
    year: year,
    gear: gear,
    fuel: fuel,
    color: color,
    mileage: mileage,
  };

  console.log("Updating car with ID", carid, "with data:", updatedData);

  fetch(`http://localhost:5500/cars/${carid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  })
    .then(response => {
      console.log("PUT request response:", response);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      console.log("Car updated successfully:", data);
    
      const modal = new bootstrap.Modal(document.getElementById('editCarModal'));
      modal.hide();
   
      fetchData();
    })
    .catch(error => {
      console.error('Error updating car:', error);
    });
}















function deleteCar(id) {
  fetch(`http://localhost:5500/cars/${id}`, {
    method: 'DELETE'
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Car with ID ${id} has been deleted.`);
        fetchData(); 
      } else {
        console.error(`Failed to delete car with ID ${id}.`);
      }
    })
    .catch((error) => {
      console.error('Error deleting car:', error);
    });
}

// submit

const form = document.getElementById("carForm");
form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitForm();
});

function submitForm() {
console.log("test")
  const model = document.getElementById("inputModel").value;
  const year = document.getElementById("inputYear").value;
  const gear = document.getElementById("inputGear").value;
  const fuel = document.getElementById("inputFuel").value;
  const color = document.getElementById("inputColor").value;
  const mileage = document.getElementById("inputMileage").value;

  fetch('http://localhost:5500/cars',{
    method: "POST",
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify({
      model: model,
      year: year,
      gear: gear,
      fuel: fuel,
      color: color,
      mileage: mileage,
    })
  })
  .then(response => response.json())
  .then(data =>{
    if(data.error){
      console.error(error,"hej");
    }else{
      console.log("Det funka!");
      console.log(`${data.message} with an id of: ${data.id}`);
      fetchData();
      clearFields();
    }
  })
  .catch(error =>{
    console.error(error, "hejhej");
  })

}


function clearFields() {
  document.getElementById("inputModel").value = "";
  document.getElementById("inputYear").value = "";
  document.getElementById("inputGear").value = "";
  document.getElementById("inputFuel").value = "";
  document.getElementById("inputColor").value = "";
  document.getElementById("inputMileage").value = "";
  console.log("Fields cleared!");
}
const clearButton = document.querySelector("#carForm button.btn-danger");
clearButton.addEventListener("click", function(e) {
  console.log('whatsapp');
  e.preventDefault();
  clearFields();
});



//  MODAL
document.getElementById('carForm').addEventListener('submit', function(event) {
  event.preventDefault(); 


  var myModal = new bootstrap.Modal(document.getElementById('myModal'), {});
  myModal.show();

 
  var closeTimeout = setTimeout(function() {
    myModal.hide();
  }, 20000); // Sekunderna är bugg

  
  document.getElementById('closeModalBtn').addEventListener('click', function() {
    clearTimeout(closeTimeout);
    myModal.hide();
  });
});



