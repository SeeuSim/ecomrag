#!/bin/bash

tar -cvzf git-base-async.tar.gz git-base/

aws s3 cp git-base-async.tar.gz s3://ecomragdev/models/git-base-async.tar.gz 
