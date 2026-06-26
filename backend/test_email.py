import os
import msal
import requests
from dotenv import load_dotenv

load_dotenv()

def test_send_email():
    smtp_from = os.getenv("SMTP_FROM")
    tenant_id = os.getenv("OAUTH2_TENANT_ID")
    client_id = os.getenv("OAUTH2_CLIENT_ID")
    client_secret = os.getenv("OAUTH2_CLIENT_SECRET")

    print(f"Testing with Tenant ID: {tenant_id}")
    print(f"Testing with Client ID: {client_id}")
    
    if not all([tenant_id, client_id, client_secret]) or tenant_id == "id-del-tuo-tenant":
        print("ERRORE: Devi prima inserire le credenziali reali nel file .env!")
        return

    authority = f"https://login.microsoftonline.com/{tenant_id}"
    msal_app = msal.ConfidentialClientApplication(
        client_id, authority=authority, client_credential=client_secret
    )

    scopes = ["https://graph.microsoft.com/.default"]
    print("Acquiring token...")
    result = msal_app.acquire_token_silent(scopes, account=None)
    if not result:
        result = msal_app.acquire_token_for_client(scopes=scopes)

    if "access_token" not in result:
        print("ERRORE impossibile ottenere l'access token:", result)
        return

    access_token = result["access_token"]
    print("Token ottenuto con successo! Procedo all'invio dell'email...")

    endpoint = f"https://graph.microsoft.com/v1.0/users/{smtp_from}/sendMail"
    
    email_msg = {
        "message": {
            "subject": "Test Invio Email",
            "body": {
                "contentType": "Text",
                "content": "Questo è un test di invio email con OAuth2 e Microsoft Graph API."
            },
            "toRecipients": [
                {
                    "emailAddress": {
                        "address": smtp_from  # Mandiamo l'email a noi stessi per il test
                    }
                }
            ]
        },
        "saveToSentItems": "false"
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    print(f"Sending email via {endpoint}...")
    response = requests.post(endpoint, json=email_msg, headers=headers)
    
    if response.status_code == 202:
        print("SUCCESSO! L'email è stata inviata e accettata dal server.")
    else:
        print(f"ERRORE Microsoft Graph API ({response.status_code}): {response.text}")

if __name__ == "__main__":
    test_send_email()
