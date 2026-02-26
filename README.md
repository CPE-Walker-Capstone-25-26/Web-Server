# True Walk Web Server
This is the web server for the True Walk application, developed as part of the CPE 350/450 course at Cal Poly San Luis Obispo (2025-26) in collaboration with Carl Sloane. The server is built using Node.js and Express, providing a robust backend for handling user requests, data management, and serving the frontend application.

All data is stored in a MongoDB Atlas database, ensuring scalability and reliability. The frontend application is built with Cal Poly's Mustang framework and served statically from the server. Documentation for the Mustang framework can be found [here](https://github.com/kubiak-calpoly/csc-437-examples/blob/main/packages/mustang/docs/index.md).


## Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- MongoDB Atlas account (for database hosting)
- Linux environment* (for deployment)

> The app can be run on Windows or Mac for development purposes, but deployment and node scripts are intended for Linux servers.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/CPE-Walker-Capstone-25-26/Web-Server.git
    cd Web-Server
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a new Atlas cluster on MongoDB and obtain the connection string.
4. Set up environment variables:
   - Create a `.env` file in `packages/server`.
   - Add the following variables:
     ```
      MONGO_USER=<your_mongo_username>
      MONGO_PWD=<your_mongo_password>  
      MONGO_CLUSTER=<your_mongo_cluster_url>

      TOKEN_SECRET=<your_token_secret>
     ```
   - Replace `<your_mongo_username>`, `<your_mongo_password>`, and `<your_mongo_cluster_url>` with your actual MongoDB credentials. Make sure you are using the cluster user credentials, **not your personal MongoDB login**.
   - Replace `<your_token_secret>` with a secure secret string for token generation.
   - Ensure that the `.env` file is included in `.gitignore` to prevent sensitive information from being committed to version control.

## Organization of the Monorepo
The project is organized as a monorepo using npm workspaces. It contains two main packages:
- `packages/server`: Contains the Express server code, API routes, database models, and server configuration.
- `packages/app`: Contains the single-page frontend application built with the Mustang framework, including components, styles, and static assets.

## Running the Server
The server can be run in two modes: development for testing and production for deployment.

### Development Mode
Both the server and application have their own development servers that support hot-reloading for easier testing and debugging.

To run the server in development mode, use the following command from `packages/server` and `packages/app` respectively:
```bash
npm run dev
```

### Production Mode
To run the server in production mode, run the start script from the root directory of the project:
```bash
npm run start
```
This will automatically build and start the server using the compiled TypeScript files.

You can also build the server and application separately using:
```bash
npm -w app run build
```
or
```bash
npm -w server run build
```
to see if they build correctly without starting the server.

You can then start the server manually using:
```bash
npm -w server run start:app
```

### Deployment
For deployment, the server is intended to be run on a Linux environment. A number of npm scripts are provided for daemonizing the server and managing the application in a production environment. These scripts utilize `pm2` for process management, allowing the server to run in the background and automatically restart if it crashes. To use these scripts, ensure that `pm2` is installed globally on your system:
```bash
npm install -g pm2
```
Once `pm2` is installed, you can use the following commands:
- Start the server in production mode:
    ```bash
    npm run daemon:start
    ```
- Stop the server:
    ```bash
    npm run daemon:stop
    ```
- Restart the server (Recompiles and restarts the server process):
    ```bash
    npm run daemon:restart
    ```
- View server logs:
    ```bash
    npm run daemon:logs
    ```
- Kill the server process (permanently stop and remove from pm2):
    ```bash
    pm2 delete truewalk-app
    ```

> **Note**: Make sure to run `pm2 enable` after setup to ensure the server will restart on system reboot.

## Network Configuration
### Initial Setup
The server listens on port `3000` by default. Ensure that this port is open and properly configured in your firewall settings to allow incoming traffic. If you are deploying the server on a cloud platform, make sure to configure the security groups or firewall rules to allow traffic on port `3000`.

Right now, the server acts as both the API backend and the static file server for the frontend application. In a production environment, you may want to set up a reverse proxy (e.g., using Nginx) to all handle incoming requests from port `80` (the default HTTP port) and route them to the server. This allows users to access the application without needing to specify the port number in the URL. You can also configure SSL/TLS for secure HTTPS connections through the reverse proxy.

### Future Improvements
If you want to go the extra mile for a production deployment, you should separate the static file hosting from the API server and use a reverse proxy to route different requests based on their subdomain. For example, you could remove the `/app` and `/api` bases and host the frontend application on `www.truewalk.com` and the API server on `api.truewalk.com`, and configure your reverse proxy to route requests accordingly. This allows for better scalability and security, as you can apply different configurations and optimizations to the frontend and backend separately.

## API Documentation
Detailed API documentation can be found in the `docs/api` directory. Each endpoint is documented with its method, URL, required parameters, response format, and example requests. The documentation is organized by resource type (e.g., authentication, runs, etc.) for easy navigation.

## Acknowledgements
- Developed as part of the CPE 350/450 course at Cal Poly San Luis Obispo.
- This project was developed specifically for Carl Sloane's Walker project in collaboration with the CPE department.
- Original concept and design by Nikolai Downs. Original project can be found at: https://github.com/NikolaiDowns/CSC437