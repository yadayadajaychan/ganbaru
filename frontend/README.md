
# Ganbaru

## Overview
Ganbaru is a web application designed to provide a platform for teachers and students to interact in a forum. The web version is available at: [https://eggert.nijika.org/](https://eggert.nijika.org/)

## Contributors
- **Ben Chen (2005benchen)**: 2005benchen@gmail.com
- **Ethan Cheng (yadayadajaychan)**: ethan@nijika.org
- **Valerie So (valeriethekitty)**: valerieso@gmail.com
- **Edwin Jiang (pristine)**: ucnebula@gmail.com
- **Evan Aceves (BlueTheseus)**: evanm.aceves@gmail.com

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

## Getting Started
First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More
To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
