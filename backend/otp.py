"""Module Dockstring"""
import base64
import hashlib
import io
import time

import qrcode


class OTP:
    """Dockstring"""

    def __init__(self, secret: str):
        """Dockstring"""
        self.secret = base64.b32decode(secret)
        self.time_step = 30
        self.digits = 6

    def hmac_hash(self, key: bytes, message: bytes) -> bytes:
        """Dockstring"""
        i_pad = bytes(b"\x36" * 64)
        o_pad = bytes(b"\x5c" * 64)
        key = key.ljust(64, b"\x00")
        key = hashlib.sha1(key).digest() if len(key) > 64 else key
        key = bytes(key)
        inner = bytes(x ^ y for x, y in zip(key, i_pad)) + message
        outer = (
            bytes(x ^ y for x, y in zip(key, o_pad))
            + hashlib.sha1(inner).digest()
        )
        return hashlib.sha1(outer).digest()

    def generate_otp_from_timestamp(self, timestamp: int) -> str:
        """Dockstring"""
        counter = timestamp // self.time_step
        counter_bytes = counter.to_bytes(8, "big")
        hmac_hash = self.hmac_hash(self.secret, counter_bytes)
        offset = self.get_offset(hmac_hash)
        four_bytes = bytes.fromhex(
            hmac_hash.hex()[offset * 2: offset * 2 + 8]
        )
        number = int(four_bytes.hex(), 16) & 0x7FFFFFFF
        code = number % (10**self.digits)
        return str(code).zfill(self.digits)

    def generate_otp(self) -> tuple[int, int]:
        """Dockstring"""
        current_time = int(time.time())
        future_time = int(time.time() + 30)
        past_time = int(time.time() - 30)
        current_otp = self.generate_otp_from_timestamp(current_time)
        future_otp = self.generate_otp_from_timestamp(future_time)
        past_otp = self.generate_otp_from_timestamp(past_time)
        return past_otp, current_otp, future_otp

    def get_offset(self, bytes_object: bytes) -> int:
        """Dockstring"""
        _nibble = int(bytes_object.hex()[-1], 16)
        return _nibble

    @staticmethod
    def generate_qr_code(secret: str, email: str) -> str:
        """Dockstring"""
        qr_link = "otpauth://totp/FINKI-TOTP"
        qr_link += f":{email}?secret={secret}&issuer=FINKI-TOTP"
        img = qrcode.make(
            qr_link,
            version=1,
        )
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        png_bytes = buffer.getvalue()
        png_base64 = base64.b64encode(png_bytes).decode("utf-8")
        return png_base64
