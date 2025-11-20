# True Walk Web Server
This is the web server for the True Walk application, developed as part of the CPE 350/450 course at Cal Poly San Luis Obispo (2025-26) in collaboration with Carl Sloane. The server is built using Node.js and Express, providing a robust backend for handling user requests, data management, and serving the frontend application.

All data is stored in a MongoDB Atlas database, ensuring scalability and reliability. The frontend application is built with Cal Poly's Mustang framework and served statically from the server. Documentation for the Mustang framework can be found [here](https://github.com/kubiak-calpoly/csc-437-examples/blob/main/packages/mustang/docs/index.md).


## Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- MongoDB Atlas account (for database hosting)
- Linux environment* (for deployment)

*Can be run on Windows or Mac for development purposes, but deployment and node scripts are intended for Linux servers.

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

`packages/proto` contains the prototype code used for initial testing and development as a multi-page application, but is not part of the main application and should be ignored.

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

If you want to run the sever in the background, you can use:
```bash
nohup npm run start &
```

This will kill the server when you close the terminal, but will keep it running in the background until then. To stop the server you will have to manually kill the process. If this is your only node process running on your machine, you can use:
```bash
killall node
```


## Acknowledgements
- Developed as part of the CPE 350/450 course at Cal Poly San Luis Obispo.
- This project was developed specifically for Carl Sloane's Walker project in collaboration with the CPE department.
- Original concept and design by Nikolai Downs. Original project can be found at: https://github.com/NikolaiDowns/CSC437