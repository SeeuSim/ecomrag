#!/bin/bash

tar -cvzf clip-vit-base-patch32-async.tar.gz clip-vit-base-patch32/

aws s3 cp clip-vit-base-patch32-async.tar.gz s3://ecomragdev/models/clip-vit-base-patch32-async.tar.gz 
