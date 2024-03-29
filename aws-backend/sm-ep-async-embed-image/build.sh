#!/bin/bash

cd clip-vit-base-patch32

tar -cvzf ../clip-vit-base-patch32-async.tar.gz *

cd ..

aws s3 cp clip-vit-base-patch32-async.tar.gz s3://ecomragdev/models/clip-vit-base-patch32-async.tar.gz 
