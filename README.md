# Technical Documentation - Product Management System

## Screenshots

### Dashboard Overview

![Homepage](https://raw.githubusercontent.com/Abdelrahmanaman/teachr-test/refs/heads/main/screenshots/homepage.png)

### Product Creation Modal

![Create Product](https://raw.githubusercontent.com/Abdelrahmanaman/teachr-test/refs/heads/main/screenshots/products.png)


### Category Management
![Categories](https://raw.githubusercontent.com/Abdelrahmanaman/teachr-test/refs/heads/main/screenshots/categories.png)

### Docs

![Create Product](https://raw.githubusercontent.com/Abdelrahmanaman/teachr-test/refs/heads/main/screenshots/docs.png)



## Context and Motivation

As a developer new to PHP, I undertook this project with the goal of creating a robust and maintainable product management application. My journey led me to make thoughtful and strategic technical choices.

## Detailed Technology Choices

### Backend: Symfony and API Platform

#### Why Symfony API Platform?

1. **Creator's Recommendation**
   - Fabien Potencier, Symfony's creator, recommends API Platform if you are going to integrate a front-end framework on the docs page
   - Guarantees a modern and efficient API development approach

2. **Complexity Reduction**
   - API Platform automatically generates CRUD endpoints
   - Minimizes repetitive code and manual configurations
   - Ideal for a PHP beginner

3. **Integrated Features**
   - Automatic data validation
   - Simplified serialization
   - Automatic API documentation (Swagger/OpenAPI)
   - Effortless entity relationship management

### Frontend: React.js

#### Strategic Choices

1. **Modern State Management**
   - React Query for data management
     - Advanced cache handling
     - Reduction of redundant API calls
     - Integrated loading and error states

2. **Performance and Reactivity**
   - Reactive components
   - Efficient interface updates
   - Smooth user experience

### Containerization: Docker

#### Key Advantages

1. **Environmental Consistency**
   - Identical across all systems
   - Elimination of "It works on my machine" problems

2. **Technical Independence**
   - Platform-agnostic deployment
   - Easy scalability

3. **Component Isolation**
   - Clear separation between backend, frontend, and database
   - Facilitates maintenance and evolution

## Project Architecture

```
product-management/
│
├── api/                 # Symfony API Platform
│   └── src/
│       ├── Entity/
│       │   ├── Product.php
│       │   └── Category.php
│
├── pwa/                # Nextjs Application
│   └── src/
│       ├── components/
│       ├── hooks/
│       └── pages/
│
└── docker-compose.yml
```

## Installation Instructions

### Prerequisites

- Docker
- Docker Compose
- Node.js (for frontend development)
- Composer (for backend development)

### Step-by-Step Setup

1. Clone the Repository
```bash
git clone https://github.com/yourusername/teachr-test.git
cd teachr-test
```

2. Start Docker Containers
```bash
docker-compose up -d
```

3. Initialize Backend Database
```bash
docker-compose exec php bin/console doctrine:migrations:migrate
```

4. Install Frontend Dependencies
```bash
docker-compose exec frontend pnpm install
```

## Development Workflow

### Backend Development
- Use Symfony console commands:
```bash
docker-compose exec php bin/console make:entity
docker-compose exec php bin/console doctrine:schema:update --force
```

### Running Apploication
```bash
https://localhost8443
```


## Why These Technological Choices?

### Rationale Behind API Platform
- Reduces learning curve for PHP beginners
- Provides robust, out-of-the-box API functionality
- Minimizes boilerplate code
- Offers automatic validation and serialization

### React Query Benefits
- Efficient data fetching
- Automatic caching
- Simplified state management
- Reduces unnecessary API calls

### Docker's Value Proposition
- Ensures consistent development environment
- Simplifies dependency management
- Enables easy scaling
- Platform-independent deployment

## Potential Future Improvements
- Implement authentication
- Enhance error handling


