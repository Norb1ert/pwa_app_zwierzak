

//Logika tworzenia zwierzaka

class Pet {
  constructor(name) {
    this.name = name;
    this.hunger = 50;
    this.energy = 50;
    this.happiness = 50;
  }

  feed() {
    this.hunger = Math.max(0, this.hunger - 15);
    this.happiness = Math.min(100, this.happiness + 5);
    this.save();
    this.updateUI();
  }
  
  play() {
    this.energy = Math.max(0, this.energy - 10); 
    this.hunger = Math.min(100, this.hunger + 15);
    this.happiness = Math.min(100, this.happiness + 10);
    this.save();
    this.updateUI();
  }
  
  rest() {
    this.energy = Math.min(100, this.energy + 15);
    this.hunger = Math.min(100, this.hunger + 15);
    this.happiness = Math.min(100, this.happiness + 5);
    this.save();
    this.updateUI();
  }

  work() {
    this.energy = Math.max(0, this.energy - 15);
    this.hunger = Math.min(100, this.hunger + 15);
    this.happiness = Math.max(0, this.happiness - 20);
    this.save();
    this.updateUI();
  }
  
  

  updateUI() {
    document.getElementById('pet-status').innerHTML = `
      <div><strong>${this.name}</strong> Status:</div>
      <div>🥩 Głód: ${this.hunger}</div>
      <div>😊 Szczęście: ${this.happiness}</div>
      <div>⚡ Energia: ${this.energy}</div>
    `;
  }
  

  save() {
    localStorage.setItem("myPet", JSON.stringify(this));
  }

  static load() {
    const data = localStorage.getItem('myPet');
    if(data) {
      const obj = JSON.parse(data)
      const pet = new Pet(obj.name);
      pet.hunger = obj.hunger;
      pet.energy = obj.energy;
      pet.happiness = obj.happiness;
      return pet;
    } else {
      return new Pet("Cosmo")
    }
  }
}


// Setup after login
function setupPetUI() {
 const pet =  window.pet = Pet.load();
  pet.updateUI();

  const buttons = document.querySelectorAll(".pet-buttons button");
  buttons[0].onclick = () => pet.feed();
  buttons[1].onclick = () => pet.play();
  buttons[2].onclick = () => pet.rest();
  buttons[3].onclick = () => pet.work();
}
  
  // Sprawdzenie stanu logowania
  const isLoggedIn = () => {
    return localStorage.getItem('loggedIn') === 'true';
  };
  
  // Logowanie użytkownika // Z backend
  const login = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const data = await res.json();
  
      if (res.status === 200) {
        localStorage.setItem('loggedIn', 'true');
        showDashboard();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Błąd połączenia z serwerem');
      console.error(error);
    }
  };
  
  
  // Rejestracja użytkownika // Działa z backendem
  const register = async () => {
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
  
    if (!newUsername || !newPassword) {
      alert('Uzupełnij wszystkie pola!');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword })
      });
  
      const data = await res.json();
      if (res.status === 201) {
        alert('Rejestracja zakończona sukcesem!');
        showLoginPage();
      } else {
        alert(data.message);
      }
  
    } catch (error) {
      alert('Błąd połączenia z serwerem');
      console.error(error);
    }
  };
  
  // Wylogowanie
  const logout = () => {
    localStorage.removeItem('loggedIn');
    showLoginPage();
  };
  
  // Pokazywanie stron
  const showLoginPage = () => {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
  };
  
  const showRegisterPage = () => {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
  };
  
  const showDashboard = () => {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    setupPetUI()
  };
  
  // Inicjalizacja strony
  window.onload = () => {
    if (isLoggedIn()) {
      showDashboard();
    } else {
      showLoginPage();
    }
  };
  