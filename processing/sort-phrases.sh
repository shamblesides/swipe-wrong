#!/bin/sh
cat $1 | sort | uniq -c | awk '$1>49' | sort -nr