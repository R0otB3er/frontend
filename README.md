# Hosting Locally

- Install git on your machine if you haven't already.
- Make sure the latest version of [Node.js](https://nodejs.org/en/) is installed on your machine. Some features may not work on older versions of Node.js.

### Cloning The Repository

```bash
mkdir frontend
cd frontend
git init
git remote add origin https://github.com/R0otB3er/frontend.git
git pull origin main
npm i
(create .env file in root directory)
npm run dev
```

> [!IMPORTANT]
> Ensure that `.env` and is properly implemented so it could function.
> Replace `http://localhost:8080` with the URL of your hosted backend for production

```env
VITE_API_URL = http://localhost:8080 //if backend is hosted change this to the URL used to access where it is hosted
```


> [!NOTE]
> A new window will become visible on your default browser on `http://localhost:8080`; however, it will not automatically open, so make sure to open this link manually.
