const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      results.push(file);
    }
  });
  return results;
}

let count = 0;
const files = walk('src');
files.forEach(file => {
  if (file.match(/\.(ts|tsx|css|js|jsx)$/)) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/#dfff00/gi, '#eaff00');
    newContent = newContent.replace(/223,\s*255,\s*0/g, '234, 255, 0');
    
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated', file);
      count++;
    }
  }
});
console.log(`Updated ${count} files.`);
