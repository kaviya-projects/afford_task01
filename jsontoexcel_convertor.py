import json
import pandas as pd

# Step 1: Load the JSON file
with open("data.json", "r") as f:  # Make sure data.json is in the same folder
    data = json.load(f)

# Step 2: Convert JSON to DataFrame
df = pd.DataFrame(data)

# Step 3: Save as Excel file
excel_path = "data.xlsx"
df.to_excel(excel_path, index=False)

print("✅ JSON data has been converted to Excel and saved as data.xlsx.")
