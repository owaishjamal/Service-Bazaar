#!/bin/bash

# Development script that allows self-signed certificates
# Usage: ./scripts/dev-with-ssl-fix.sh
# 
# WARNING: This disables TLS certificate verification.
# Only use this in development if you're experiencing SSL certificate issues.
# For production, always use proper SSL certificates.

export ALLOW_INSECURE_TLS=true
export NODE_ENV=development
npm run dev
