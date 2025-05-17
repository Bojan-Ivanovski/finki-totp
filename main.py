import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
from fastapi.responses import RedirectResponse
import json
from fastapi.templating import Jinja2Templates
from otp import OTP 

load_dotenv()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")  

if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
    raise RuntimeError("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET")  

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)  

oauth = OAuth()
oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)  

@app.get("/login")
async def login(request: Request):
    redirect_uri = request.url_for("auth")  
    return await oauth.google.authorize_redirect(request, redirect_uri)  

@app.get("/auth")
async def auth(request: Request):
    token = await oauth.google.authorize_access_token(request)
    userinfo = token.get("userinfo")

    request.session["user"] = {
        "sub": userinfo["sub"],
        "email": userinfo.get("email"),
        "name": userinfo.get("name"),
    }
    print(token)

    return RedirectResponse(url="/app")

templates = Jinja2Templates(directory=".")
@app.get("/app")
def main_app(request: Request):
    user = request.session.get("user")
    if not user:
        return RedirectResponse(url="/")
    secrets = []
    filename = "user_secrets.json"
    if os.path.exists(filename):
        with open(filename, "r") as f:
            data = json.load(f)
            user_id = user.get("sub")
            secrets = data.get(user_id, {}).get("secrets", [])
            for secret in secrets:
                secret["value"] = OTP(secret["secret"]).generate_otp()[0]
    return templates.TemplateResponse("app.html", {"request": request, "user": user, "secrets": secrets})


@app.get("/")
def root():
    with open("main.html", "r") as file:
        return Response(content=file.read(), media_type="text/html")
    
@app.get("/logout")
async def logout(request: Request):
    request.session.clear()  
    return RedirectResponse(url="/")  

@app.post("/add_secret")
async def add_secret_for_user(request: Request):
    body = await request.json()
    user = request.session.get("user").get("sub")
    secret_name = body.get("secretName")
    secret_value = body.get("secretValue")
    print(user)
    print(request.session)
    filename = "user_secrets.json"
    if not os.path.exists(filename):
        with open(filename, "w") as f:
            json.dump({}, f)

    with open(filename, "r") as f:
        data = json.load(f)

    if user not in data:
        data[user] = {"secrets": []}

    data[user]["secrets"].append({"name": secret_name, "secret": secret_value})

    with open(filename, "w") as f:
        json.dump(data, f, indent=2)