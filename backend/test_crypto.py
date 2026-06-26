import base64
import hashlib
# pyrefly: ignore [missing-import]
from Crypto.Cipher import DES3
# pyrefly: ignore [missing-import]
from Crypto.Util.Padding import unpad

def truncate_hash(key_str: str, length: int) -> bytes:
    # Encoding.Unicode is UTF-16 LE
    key_bytes = key_str.encode('utf-16le')
    sha1 = hashlib.sha1()
    sha1.update(key_bytes)
    hash_bytes = sha1.digest()
    
    # Truncate or pad
    if len(hash_bytes) >= length:
        return hash_bytes[:length]
    else:
        # Pad with zeros
        return hash_bytes + b'\x00' * (length - len(hash_bytes))

def decrypt_data(encrypted_text: str, secret_key: str = "09075472") -> str:
    if not encrypted_text:
        return ""
    
    # Generate Key and IV
    # TripleDES KeySize is 192 bits (24 bytes)
    key = truncate_hash(secret_key, 24)
    # TripleDES BlockSize is 64 bits (8 bytes)
    iv = truncate_hash("", 8)
    
    # Decode base64
    encrypted_bytes = base64.b64decode(encrypted_text)
    
    # Decrypt
    cipher = DES3.new(key, DES3.MODE_CBC, iv)
    decrypted_padded = cipher.decrypt(encrypted_bytes)
    
    # Unpad (PKCS7)
    decrypted_bytes = unpad(decrypted_padded, DES3.block_size)
    
    # Decode string (UTF-16 LE)
    return decrypted_bytes.decode('utf-16le')

# Test
if __name__ == "__main__":
    # Let's generate an encrypted string manually if we had it, 
    # but we just want to check if the code runs without syntax errors.
    print("Crypto logic written successfully.")
