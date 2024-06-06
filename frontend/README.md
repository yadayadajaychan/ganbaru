# Front-end Server

## Prerequisites
Before you begin, ensure you have met the following requirements:
- [Node.js](https://nodejs.org/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

## Installation
Follow these steps to set up the project:

1. **Install Yarn Package Manager**

   If you don't already have Yarn installed, you can install it globally using npm. Open your terminal and run the following command:
   ```bash
   npm install -g yarn
   ```
   This will install Yarn globally on your system, allowing you to use the `yarn` command from any directory.

2. **Install Node Modules/Dependencies**

   Navigate to the project directory where you have cloned the Ganbaru repository. Once inside the project directory, run the following command to install all necessary dependencies:
   ```bash
   yarn install
   ```
   This command reads the `package.json` file and installs all the dependencies listed under the `dependencies` and `devDependencies` sections. This step is crucial as it sets up all the required libraries and packages for the project to run correctly.

3. **Configure Environment Variables**

   In the Ganbaru project, you will find a file named `.env.example`. This file contains example environment variable configurations. You need to create a new file named `.env` and copy the contents of `.env.example` into this new file. Then, update the variables in the `.env` file with your specific configuration values, such as the `NEXT_PUBLIC_API_URL` which should point to your backend API URL.

   Here is an example of how to do this:
   ```bash
   cp .env.example .env
   ```
   After copying, open the `.env` file in a text editor and replace the placeholder values with your actual configuration settings.

4. **Run the Development Server**

   Once you have installed all dependencies and configured your environment variables, you can start the development server. This server runs your application in development mode, providing helpful error messages and live reloading as you make changes to your code.

   To start the development server, run the following command:
   ```bash
   yarn dev
   ```
   This will start the server and you can view your application by navigating to `http://localhost:3000` in your web browser.

   If you are ready to deploy your application or want to run it in a production-like environment, you can build the application and start it in production mode using the following commands:
   ```bash
   yarn build
   yarn start
   ```
   The `yarn build` command compiles your application and optimizes it for production, while the `yarn start` command starts the server using the production build.