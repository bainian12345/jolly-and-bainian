#!/bin/bash
# ensure the destination directory exists
mkdir -p ~/.cloudflared

# copy the config from the repo to your home directory
cp -f ./.cloudflared/config.yml ~/.cloudflared/config.yml
echo "✅ .cloudflared/config.yml synced to ~/.cloudflared"