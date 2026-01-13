#!/bin/bash

# Development script that allows self-signed certificates
# Usage: ./scripts/dev-with-ssl-fix.sh

export NODE_TLS_REJECT_UNAUTHORIZED=0
npm run dev
