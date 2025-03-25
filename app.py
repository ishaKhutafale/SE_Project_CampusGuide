from flask import Flask, request, jsonify, send_from_directory
import smtplib
import os

# Create Flask app
app = Flask(__name__, static_url_path='/static')

@app.route('/')
def home():
    return send_from_directory('.', 'home.html')
# Load map.html at /
@app.route('/')
@app.route('/map.html')
def index():
    return send_from_directory('.', 'map.html')

# API to send directions
@app.route('/send_directions', methods=['POST'])
def send_directions():
    try:
        data = request.json
        google_maps_url = data.get('url')  # ✅ Corrected key to 'url'

        if not google_maps_url:
            return jsonify({"success": False, "message": "Missing Google Maps URL"}), 400

        # Email address to send directions
        recipient_email = "shravanishinganwadikar@gmail.com"  # ✅ Change to receiver's email

        # Send email with directions
        if send_email(google_maps_url, recipient_email):
            return jsonify({"success": True, "message": "Email sent successfully!"})
        else:
            return jsonify({"success": False, "message": "Failed to send email."})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


def send_email(google_maps_url, recipient_email):
    sender_email = "ishakhutafale2004@gmail.com"  # ✅ Your Gmail address
    sender_password = "vqamrkoulyfkjwlt"  # ⚠️ Use App Password (Not normal password)

    subject = "Directions from Google Maps"
    body = f"Here is the Google Maps link for your directions: {google_maps_url}"

    message = f"Subject: {subject}\n\n{body}"

    try:
        # Connect to the SMTP server
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, message)
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
