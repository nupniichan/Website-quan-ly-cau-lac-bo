<div align="center">

# **Club Management System**

[![ReactJS](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

*A powerful website to simplify club management and enhance user engagement.*

</div>

---

## **Overview**

The **Club Management System** is a website designed to simplify tasks for administrators and users. It consists of three main parts: Admin, Server, and User, using modern technology to ensure smooth and user-friendly operation.

---

## **Table of Contents**

1. [Features](#features)  
2. [Technologies Used](#technologies-used)  
3. [Installation](#installation)  
4. [Usage](#usage)  
5. [Project Structure](#project-structure)  
6. [Contributing](#contributing)  
7. [License](#license)  

---

## 💡 **Features** 💡

- **Admin Dashboard**  
  Manage users, clubs, budgets, and events. Generate insightful reports with ease.  
- **User-Friendly Interface**  
  Browse clubs, view upcoming events, and explore admission requirements effortlessly.  
- **Responsive Design**  
  Fully optimized for mobile, tablet, and desktop viewing.  
- **Real-Time Data Integration**  
  Dynamic updates powered by robust APIs for a modern experience.  
- **School homepage**
  A modern and visually appealing homepage that showcases key information about the school, including clubs, events, and external cooperation,... providing easy navigation for students, parents, and teachers.
---


## 🛠️ **Technologies Used** 🛠️

### 🎨 **Frontend** 
- ReactJS  
- Vite  
- Tailwind CSS  

### 🚀 **Backend**
- Node.js  
- Express.js  
- MongoDB  
- Mongoose  

### 🗄️ **Development Tools**
- Github actions  
- Docker  
- Bun runtime  

---

## **Project Structure**

```plaintext
project-root/
├── admin/               # Admin dashboard 
│   ├── src/             # Admin logic
│   ├── Dockerfile       # Container setup
│   └── package.json     # Dependencies
├── server/              # Backend logic
│   ├── models/          # Database schema
│   ├── routes/          # API endpoints
│   ├── server.js        # Entry point
│   └── package.json     # Dependencies
└── user/                # User interface
    ├── src/             # Frontend components
    ├── Dockerfile       # Container setup
    └── package.json     # Dependencies
```  

---

## **Installation**

Follow these steps to run the project locally:  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/nupniichan/Website-quan-ly-cau-lac-bo.git
   cd Website-quan-ly-cau-lac-b
   ```

2. **Install dependencies**  
   Navigate to each directory (`admin`, `server`, `user`) and execute:  
   ```bash
   bun install
   ```

3. **Start the application**  
   - **Server:**  
     ```bash
     cd server && bun server.js
     ```  
   - **Admin:**  
     ```bash
     cd admin && bun run dev
     ```  
   - **User:**  
     ```bash
     cd user && bun run dev
     ```  

---

## **Usage**

- **Admin Dashboard:** [http://localhost:5100](http://localhost:5100)  
- **User Interface:** [http://localhost:5200](http://localhost:5200)  
- **Server:** [http://localhost:5500](http://localhost:5500)  

- *Note You can host your server but you need to have knowledge about Devops. For more information, dont be hestinate to contact me :D*
---

## **Contributing**

Thanks to these awesome people for contributing to this project:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ThePinkKitten">
        <img src="https://avatars.githubusercontent.com/u/61980152?v=4" width="100px;" alt="ThePinkKitten"/><br />
        <sub><b>ThePinkKitten</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Tequinzyy">
        <img src="https://avatars.githubusercontent.com/u/116754124?v=4" width="100px;" alt="Tequinzyy"/><br />
        <sub><b>Tequinzyy</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/KevzCz">
        <img src="https://avatars.githubusercontent.com/u/130611225?v=4" width="100px;" alt="KevzCz"/><br />
        <sub><b>KevzCz</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Phatds357">
        <img src="https://avatars.githubusercontent.com/u/161195912?v=4" width="100px;" alt="Phatds357"/><br />
        <sub><b>Phatds357</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](https://github.com/nupniichan/Website-quan-ly-cau-lac-bo/blob/develop/LICENSE) file for more details.  

---

<div align="center">

Thank you for visiting this repository ❤️

</div>
