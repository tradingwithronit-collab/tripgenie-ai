# Publish TripGenie AI (about 3–5 minutes if you already have GitHub)

1. Sign in to https://github.com and create a **new public repository** named `tripgenie-ai`.
2. Upload all files from this folder to that repository. Include `render.yaml`; do **not** upload `.env` or API keys.
3. Open https://render.com, sign in with GitHub, choose **New + → Blueprint**, select `tripgenie-ai`, and approve deployment.
4. Wait for the service to finish deploying. Open the `onrender.com` URL Render shows. The site runs in demo mode without an API key; trip planning and chat still work with sample responses.

If Render asks for an environment variable, you can leave `OPENAI_API_KEY` unset for the demo. Never put a secret API key in a public GitHub repository.
