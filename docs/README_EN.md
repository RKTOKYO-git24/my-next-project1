# Project Documentation

This folder contains information about development and operations.  
The goal is to help new members set up the environment and understand the architecture.

---

## Environment Setup

- **Frontend**: Next.js (TypeScript)  
- **Hosting**: Vercel  
- **Backend**: Node.js (Express) + Docker container  
- **Database**: MongoDB Atlas  
- **External Service**: HubSpot API (CRM integration)  
- **Development**: Unified local environment using Docker Compose  

---

## Setup Instructions

```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>

# Configure environment variables
cp .env.example .env

# Start Docker containers
docker compose up --build

# Run frontend development (hot reload)
npm run dev
Docker Configuration
backend : Node.js server

Port: 3001

frontend : Next.js

Port: 3000

db : MongoDB (for local testing)

Port: 27017

Services are defined in docker-compose.yml, sharing the same network.
In production, MongoDB Atlas is used. The local db container is only for development.

APIs in Use
HubSpot API

Integration with CRM data

Authentication via API Key or OAuth (managed with environment variables)

Used mainly for customer management and inquiry workflows

Custom API (backend)

Authentication and user management

Data processing with MongoDB Atlas

Ports (Development)
http://localhost:3000 → Frontend (Next.js)

http://localhost:3001 → Backend API (Express)

mongodb://localhost:27017 → Local DB (MongoDB)

Target Architecture (Infrastructure)
The project aims for the following modern infrastructure:

css
コードをコピーする
[User] 
   │
   ▼
[Vercel (Frontend)]
   │
   ▼
[Akamai Cloud (Edge / CDN)]
   │
   ▼
[Backend API (Dockerized, Node.js)]
   │
   ▼
[MongoDB Atlas (Managed DB)]
   │
   └── [HubSpot API Integration]
Vercel: Fast frontend deployment

Akamai Cloud: Edge delivery and security (planned)

MongoDB Atlas: Scalable managed database

HubSpot: Core for customer data and sales workflow

Planned Documentation
Contributing guidelines

API specification (Swagger / OpenAPI)

Infrastructure diagrams (Terraform / IaC)

Monitoring / logging design