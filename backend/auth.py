import os
import base64
import hashlib
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
# pyrefly: ignore [missing-import]
from Crypto.Cipher import DES3
# pyrefly: ignore [missing-import]
from Crypto.Util.Padding import unpad

SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_key_hrsupport")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- TripleDES decryption (matches DB encryption scheme) ---

def _truncate_hash(key_str: str, length: int) -> bytes:
    """SHA1 hash of UTF-16LE encoded string, truncated/padded to `length` bytes."""
    key_bytes = key_str.encode('utf-16le')
    hash_bytes = hashlib.sha1(key_bytes).digest()
    if len(hash_bytes) >= length:
        return hash_bytes[:length]
    return hash_bytes + b'\x00' * (length - len(hash_bytes))

def decrypt_password(encrypted_text: str, secret_key: str = "09075472") -> str:
    """Decrypt a Base64-encoded TripleDES-CBC encrypted password from the DB."""
    if not encrypted_text:
        return ""
    key = _truncate_hash(secret_key, 24)   # TripleDES 192-bit key
    iv  = _truncate_hash("", 8)            # 64-bit IV
    encrypted_bytes = base64.b64decode(encrypted_text)
    cipher = DES3.new(key, DES3.MODE_CBC, iv)
    decrypted_bytes = unpad(cipher.decrypt(encrypted_bytes), DES3.block_size)
    return decrypted_bytes.decode('utf-16le')

def verify_password(plain_password: str, stored_password: str) -> bool:
    """
    Compare login password against the stored value.
    Priority: 1) TripleDES-encrypted (Base64)  2) bcrypt hash  3) plain-text fallback
    """
    # Try TripleDES decryption first (Base64-encoded ciphertext)
    try:
        decrypted = decrypt_password(stored_password)
        return plain_password == decrypted
    except Exception:
        pass
    # Bcrypt hash
    if stored_password.startswith("$2b$") or stored_password.startswith("$2a$"):
        return pwd_context.verify(plain_password, stored_password)
    # Plain-text fallback
    return plain_password == stored_password

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
