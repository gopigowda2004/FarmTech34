# FarmTech - Farmer Equipment Rental Application

## Overview
FarmTech is a full-stack application designed to help farmers rent and lease agricultural equipment. The application connects farmers with other farmers who own equipment, enabling them to share resources efficiently and reduce downtime caused by lack of equipment.

## Problem
Many farmers face difficulty in accessing agricultural equipment on time, which can delay farming operations and reduce productivity. Purchasing equipment individually is expensive and not always practical.

## Solution
FarmTech provides a platform where farmers can:

- List their equipment for rent.
- Search and rent equipment from other farmers.
- Connect directly with other farmers to coordinate rentals.
- Manage rental schedules and availability.

This peer-to-peer equipment rental approach ensures efficient use of resources and reduces costs for farmers.

## Technologies Used
- **Frontend:** React.js  
- **Backend:** Java Spring Boot  
- **Database:** MySQL  
- **Server:** Apache Tomcat  
- **Containerization:** Docker & Docker Compose  
- **Version Control:** Git & GitHub  

## Features
- **User Registration & Login:** Farmers can create accounts and log in securely.  
- **Equipment Management:** Add, edit, and view available equipment.  
- **Peer-to-Peer Rental:** Connect and rent equipment directly from other farmers.  
- **Search & Filter:** Easily find equipment based on type, location, and availability.  

---

## How to Run

### Option 1: Run without Docker

#### Backend (Spring Boot)
```bash
cd backend/
mvn clean install
mvn spring-boot:run
Frontend (React)
bash
Copy code
cd farmer-rental-app/
npm install
npm start
👉 Make sure MySQL is running and update the application.properties file with your database credentials.

Create the database:

sql
Copy code
CREATE DATABASE FarmTech;
Option 2: Run with Docker (Recommended)
This project is Dockerized using Docker Compose, which sets up the frontend, backend, and database in separate containers.

Steps:
Ensure Docker and Docker Compose are installed on your system.

From the project root, run:

bash
Copy code
docker-compose up --build
What happens:
A MySQL container starts with the FarmTech database.

The Spring Boot backend container builds and runs automatically.

The React frontend builds and is served with Nginx.

Access:
Frontend: http://localhost:3000

Backend API: http://localhost:8080

To stop the containers:
bash
Copy code
docker-compose down
Contribution
Feel free to fork this repository and contribute to improving the platform. Suggestions for additional features like notifications, payment integration, and real-time availability tracking are welcome.
---

## Contact
- **Developer:** Gopi Gowda  
- **Email:** gopigowda132@gmail.com







images


![WhatsApp Image 2025-09-07 at 09 10 28_3c394abe](https://github.com/user-attachments/assets/c4faa31a-fb19-4a01-bc9e-d64291d1cd0b)



![WhatsApp Image 2025-09-07 at 09 10 28_c93867b9](https://github.com/user-attachments/assets/4d12f6cc-04be-4647-bf7b-7b021be25acf)




![WhatsApp Image 2025-09-07 at 09 10 29_5e2980ff](https://github.com/user-attachments/assets/806a1377-2c2d-409f-9e5d-b2e2f4a27146)


![WhatsApp Image 2025-09-07 at 09 10 29_c7ddf7f9](https://github.com/user-attachments/assets/1ed4433a-e865-4a68-9a18-eea1a4d9462a)





![WhatsApp Image 2025-09-07 at 09 10 29_96132716](https://github.com/user-attachments/assets/0fc6c00c-162d-4931-bdac-2aa869d1809e)





![WhatsApp Image 2025-09-07 at 09 10 30_eb317937](https://github.com/user-attachments/assets/f172aff5-edce-4208-aba1-bf4273ab7fac)
