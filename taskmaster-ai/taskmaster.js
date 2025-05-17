#!/usr/bin/env node

const fs = require('fs');
const config = require('./config.json');

console.log("Welcome to Taskmaster-AI for", config.project);
console.log("Current tasks:", config.tasks);