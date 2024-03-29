#!/bin/bash

cd git-base

tar -cvzf ../git-base-async.tar.gz *

cd ..

aws s3 cp git-base-async.tar.gz s3://ecomragdev/models/git-base-async.tar.gz 
