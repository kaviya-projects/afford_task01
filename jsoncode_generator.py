import json
import random

statuses = ["delivered", "pending", "returned"]
product_names = [
    "Wireless Mouse", "Bluetooth Speaker", "USB Cable", "Webcam", "Power Bank",
    "Headphones", "Smart Watch", "Keyboard", "Monitor", "Laptop Stand",
    "Router", "Pendrive", "HDMI Cable", "Microphone", "Charger",
    "Tablet", "Camera", "Gaming Controller", "LED Light", "Stylus Pen"
]

orders = []

for i in range(1, 2501):
    product_id = f"P{str(random.randint(1, 500)).zfill(4)}"
    product_name = random.choice(product_names)
    order = {
        "orderId": str(i),
        "customerId": f"C{str(random.randint(1, 25)).zfill(3)}",
        "productId": product_id,
        "productName": product_name,
        "status": random.choice(statuses)
    }
    orders.append(order)

# Save JSON file locally (relative path or absolute path can be used)
with open("data1.json", "w") as f:
    json.dump(orders, f, indent=2)

print("✅ data.json with 2500 records saved in your project folder.")
