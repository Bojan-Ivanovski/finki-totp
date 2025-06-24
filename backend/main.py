"""Module Dockstring"""
import os

from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response
from fastapi.responses import RedirectResponse, JSONResponse
from starlette.middleware.sessions import SessionMiddleware

from database import Database
from otp import OTP
import base64

load_dotenv()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")
db = Database()
if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
    raise RuntimeError("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET")

origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

oauth = OAuth()
oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url=(
        "https://accounts.google.com/.well-known/openid-configuration"
    ),
    client_kwargs={"scope": "openid email profile"},
)


@app.get("/api/")
def root():
    """Dockstring"""
    return RedirectResponse(url="/api/docs")


@app.get("/api/login")
async def login(request: Request, redirect: str):
    """Dockstring"""
    if request.session.get("user"):
        return RedirectResponse(url=redirect)
    request.session["redirect"] = redirect
    redirect_uri = request.url_for("auth")
    print(f"Redirect URI: {redirect_uri}")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@app.get("/api/logout")
async def logout(request: Request, redirect: str):
    """Dockstring"""
    request.session.clear()
    return RedirectResponse(url=redirect)


@app.get("/api/auth")
async def auth(request: Request):
    """Dockstring"""
    token = await oauth.google.authorize_access_token(request)
    userinfo = token.get("userinfo")
    request.session["user"] = {
        "sub": userinfo["sub"],
        "email": userinfo.get("email"),
        "name": userinfo.get("name"),
    }
    return RedirectResponse(url=request.session["redirect"])


@app.get("/api/get_secret")
def get_secret(request: Request):
    """Dockstring"""
    user = request.session.get("user").get("sub")
    secrets = []
    if not user:
        return RedirectResponse(url="/")
    secrets = db.get_user_codes(user)
    for secret in secrets:
        try:
            secret["value"] = OTP(secret["otp_secret"]).generate_otp()[2]
            secret["qr"] = OTP.generate_qr_code(
                secret["otp_secret"], request.session.get("user").get("email")
            )
        except Exception as e:# pylint: disable=W0718
            print(f"Error : {e}")
    return {"secrets": secrets}


@app.post("/api/add_secret")
async def add_secret_for_user(request: Request):
    """Dockstring"""
    body = await request.json()
    user = request.session.get("user").get("sub")
    if not user:
        return RedirectResponse(url="/")
    if not db.user_exists(user):
        db.create_user(email=request.session.get("user").get("email"), google_id=user)
    secret_name = body.get("secretName")
    secret_value = body.get("secretValue")
    db.create_secret(user, secret_value, secret_name)


@app.post("/api/remove_secret")
async def remove_secret_for_user(request: Request):
    """Dockstring"""
    body = await request.json()
    user = request.session.get("user").get("sub")
    if not user:
        return RedirectResponse(url="/")
    secret_id = body.get("secretId")
    db.remove_secret(secret_id)
    return {"success": False, "message": "Secret not found."}


@app.post("/api/verify_otp")
async def verify_otp(request: Request):
    """Dockstring"""
    body = await request.json()
    user = request.session.get("user")
    if not user:
        return RedirectResponse(url="/")
    secret = body.get("secret")
    otp_code = body.get("code")
    try:
        otp = OTP(secret).generate_otp()
        if otp_code in otp:
            return {
                "success": True,
                "message": "The OTP Code for the provided secret is valid.",
            }
        return {
            "success": False,
            "message": "The OTP Code for the provided secret is invalid.",
        }
    except Exception as e:# pylint: disable=W0718
        print(f"Error verifying OTP: {e}")
        return Response({"success": False, "message": str(e)}, status_code=404)

@app.get("/api/generate_secret")
async def generate_secret(request: Request):
    """Dockstring"""
    user = request.session.get("user").get("sub")
    if not user:
        return RedirectResponse(url="/")
    random_bytes = os.urandom(10)
    secret = base64.b32encode(random_bytes).decode("utf-8").replace("=", "")
    print(request.session.get("user").get("email"))
    return JSONResponse({"success": False, "value": str(secret), "qr" : OTP.generate_qr_code(secret, request.session.get("user").get("email"))}, status_code=200)
