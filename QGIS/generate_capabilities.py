import os

# Floors to process
floors = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 99]

# Input file name
base_filename = "locaux_labels_template.xml"

# Output folder
output_folder = "locaux_labels"

# Create the folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Read the base file
with open(base_filename, "r", encoding="utf-8") as f:
    base_content = f.read()

# Loop and generate files
for floor in floors:
    # Replace placeholder
    modified_content = base_content.replace("{floor}", str(floor))
    
    # Output path
    output_filename = f"floor{floor}.xml"
    output_path = os.path.join(output_folder, output_filename)
    
    # Save
    with open(output_path, "w", encoding="utf-8") as out:
        out.write(modified_content)

print("Files successfully generated!")
