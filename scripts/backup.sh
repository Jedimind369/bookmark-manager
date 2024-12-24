
#!/bin/bash

# Create backup directory
mkdir -p backups
cp -r src backups/
cp -r public backups/
cp package.json backups/
