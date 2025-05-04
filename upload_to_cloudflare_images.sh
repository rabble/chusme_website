#!/bin/bash

# Script to upload images to Cloudflare Images
# You need to have your Cloudflare API token set in the environment: 
# export CLOUDFLARE_API_TOKEN=your_token

# Your Cloudflare account ID
ACCOUNT_ID="c84e7a9bf7ed99cb41b8e73566568c75"

# Directory containing images
IMAGE_DIR="static/assets"

# Function to upload an image and return its ID
upload_image() {
  local file_path="$1"
  local file_name=$(basename "$file_path")
  
  echo "Uploading $file_name..."
  
  # Upload the image to Cloudflare Images
  response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/images/v1" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -F "file=@$file_path" \
    -F "metadata={\"file_name\":\"$file_name\"}")
  
  # Extract the image ID from the response
  image_id=$(echo "$response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  
  if [ -n "$image_id" ]; then
    echo "Success! Uploaded $file_name with ID: $image_id"
    return 0
  else
    echo "Failed to upload $file_name. Response: $response"
    return 1
  fi
}

# Main script
echo "Starting upload to Cloudflare Images..."
echo "Account ID: $ACCOUNT_ID"

# Check if API token is set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "Error: CLOUDFLARE_API_TOKEN environment variable is not set"
  echo "Please set it using: export CLOUDFLARE_API_TOKEN=your_token"
  exit 1
fi

# Check if image directory exists
if [ ! -d "$IMAGE_DIR" ]; then
  echo "Error: Directory $IMAGE_DIR not found"
  exit 1
fi

# Create output file for image IDs map
output_file="cloudflare_image_ids.json"
echo "{" > "$output_file"

# Upload all PNG images in the directory
first=true
for image_file in "$IMAGE_DIR"/*.png; do
  if [ -f "$image_file" ]; then
    # Check if this is a real PNG file (not just ASCII text)
    file_type=$(file -b "$image_file")
    if [[ $file_type == *"PNG image data"* ]]; then
      # Upload the image and get its ID
      if upload_image "$image_file"; then
        file_name=$(basename "$image_file")
        
        # Add comma before entry if not the first
        if [ "$first" = true ]; then
          first=false
        else
          echo "," >> "$output_file"
        fi
        
        # Add entry to the map
        echo "  \"$file_name\": \"$image_id/public\"" >> "$output_file"
      fi
    else
      echo "Skipping $image_file - not a valid PNG file"
    fi
  fi
done

# Close the JSON object
echo "}" >> "$output_file"

echo "Done! Image IDs saved to $output_file"
echo "Update your Cloudflare Images URL in the code with these IDs."