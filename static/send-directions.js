async function sendDirections() {
    const source = document.getElementById("sourceSelect").value;
    const destination = document.getElementById("destinationSelect").value;

    if (source && destination && source !== destination) {
        const sourceCoords = locations[source];
        const destCoords = locations[destination];

        if (!sourceCoords || !destCoords) {
            alert("⚠️ Invalid source or destination.");
            return;
        }

        // Create Google Maps URL with coordinates
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${sourceCoords[0]},${sourceCoords[1]}&destination=${destCoords[0]},${destCoords[1]}`;

        // Send URL to backend to trigger email
        try {
            const response = await fetch("/send_directions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: googleMapsUrl,
                }),
            });

            const result = await response.json();
            if (result.success) {
                alert("✅ Directions sent to your email successfully!");
            } else {
                alert("❌ Failed to send email.");
            }
        } catch (error) {
            console.error("❌ Error sending directions:", error);
            alert("❌ Error sending directions. Please try again.");
        }
    } else {
        alert("⚠️ Please select different source and destination.");
    }
}
