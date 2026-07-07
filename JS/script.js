/* Begin with a simple class for our cars listed in the provided json. */
class Car {
    constructor (year, make, model) {
        this.year = year;
        this.make = make;
        this.model = model;
    }
}

/* We need an empty array */
let vehicleInventory = [];

/* Next we have to target our DOM selectors (year, make, model). */
const vehicleYear = document.getElementById('year');
const vehicleMake = document.getElementById('make');
const vehicleModel = document.getElementById('model');

/* Lets fetch our json data provided by the assignment assets. In ITD2 we learned about PROMISES with the .then and .catch methods. */
fetch('./car-dataset.json')
  .then(response => {
    if (!response.ok) {
        throw new Error('Invalid response. Please try again.');
    }
    return response.json();
  })
  .then(jsonData => {
    console.log('Raw JSON Data:', jsonData);
    // We need to loop through the json file. I'll use .forEach to loop through each json item.
    jsonData.forEach(item => {
        // JSON data uses lowercase "year"
        const yearValue = item.year;
        let rawMake = item.Manufacturer || item.make;
        const makeValue = rawMake.toUpperCase();
        const modelValue = item.model;
        // Here I'm using my OOP class blueprint to instantiate the Car object.
        const carFinder = new Car(yearValue, makeValue, modelValue);
    // Now lets push our new object instance into our inventory (line 11)
    vehicleInventory.push(carFinder);
    });

    // Now that I have inventory for my vehicleInventory variable (line 11), lets make our dropdown functional.
    initializeForm();
  })
  .catch(error => console.error('Sorry. Error fetching JSON data.'));

// We'll use Sets & Maps to pull values for our dropdown's (year and make).
function initializeForm() {
    const carYears = new Set(vehicleInventory.map(car => car.year));
    const carMakes = new Set(vehicleInventory.map(car => car.make));

    // Lets loop through each year!
    carYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        vehicleYear.appendChild(option);
    });

    // Lets loop through each make!
    carMakes.forEach(make => {
        const option = document.createElement('option');
        option.value = make;
        option.textContent = make;
        vehicleMake.appendChild(option);
    });
}

// Setup my addEventListeners to filter through user selected model.
vehicleMake.addEventListener('change', () => {
    const selectedMake = vehicleMake.value; 
    vehicleModel.innerHTML = '<option value = "" selected disabled hidden> Vehicle Model </option>';

    const matchingCars = vehicleInventory.filter(car => car.make === selectedMake);
    const uniqueModels = new Set(matchingCars.map(car => car.model));

    uniqueModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        vehicleModel.appendChild(option);
    });
});

// Display our selected vehicle to console using .find() and .filter() for our vechileInventory array on line 11.
vehicleModel.addEventListener('change', () => {
    const selectedYear = Number(vehicleYear.value); // We're converting a string to a number
    const selectedMake = vehicleMake.value;
    const selectedModel = vehicleModel.value;

    // Now lets find the exact vehicle object inside our array.
    const finalVehicle = vehicleInventory.find(car => 
        car.year === selectedYear &&
        car.make === selectedMake &&
        car.model === selectedModel
    );

    // If we matched a vehicle instance, lets display it to console!
    if (finalVehicle) {
        console.log('User Selected Car Object:', finalVehicle);
    }
});