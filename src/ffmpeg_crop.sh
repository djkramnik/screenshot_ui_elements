#!/bin/bash
while getopts w:h:x:y flag
do
    case "${flag}" in
        w) weight=${OPTARG};;
        h) height=${OPTARG};;
        x) x=${OPTARG};;
        y) y=${OPTARG};;
    esac
done
ffmpeg -i $1 -vf="crop=$w:$h:$x:$y" $2