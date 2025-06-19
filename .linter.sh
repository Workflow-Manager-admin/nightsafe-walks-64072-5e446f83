#!/bin/bash
cd /home/kavia/workspace/code-generation/nightsafe-walks-64072-5e446f83/nightsafe_walks_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

