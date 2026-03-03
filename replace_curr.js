const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let originalContent = fs.readFileSync(fullPath, 'utf8');
      
      let content = originalContent;
      
      // Replace JSX expressions like >${ to >₹{
      content = content.replace(/>\$\{/g, '>₹{');
      
      // Replace bare $ prefixing JS expressions within jsx text: like ` ${(` -> ` ₹{(`
      content = content.replace(/(?<=^|[^`\\])\$\{/g, (match, offset, str) => {
        // If it's inside a template string (`), don't change normally, unless it has a literal $ before it.
        // Wait, regular regex is hard. Let's do string replacement for known exact patterns.
        return match;
      });

      // Template literal replacement: `$$` => `$₹` no, \`$${...}\` to \`₹${...}\`
      content = content.replace(/\\`\$\\\$\{/g, '\\`₹\\${'); // \`$${
      content = content.replace(/`\$\$\{/g, '`₹${'); // `$${
      content = content.replace(/'\$\$\{/g, '\'₹${'); // '$${
      content = content.replace(/"\$\$\{/g, '"₹${'); // "$${

      // General cases: `$` followed by digits or `{` in string literals
      // like `value: '$' + subtotal`
      
      // The safest way is to replace specific known strings seen in the grep output:
      content = content.replace(/\\$([0-9]+(\.[0-9]+)?)/g, '₹$1');
      content = content.replace(/\$([0-9]+(\.[0-9]+)?)(?!\w)/g, '₹$1');
      
      // Specific patterns:
      content = content.replace(/ — \$\$\{/g, ' — ₹${');
      content = content.replace(/ \$\$\{/g, ' ₹${');
      // For JSX: >${...}
      content = content.replace(/>\$\{/g, '>₹{');
      content = content.replace(/"\$\{/g, '"₹{'); // e.g., value={`${...}`} -> wait, no if it's value={`₹${...}`}

      // Handle string literal arrays/objects: `{ label: 'Subtotal', value: \`$\$\{subtotal.toFixed(2)}\` }`
      content = content.replace(/`\$\$\{/g, '`₹${');
      // For literal return JSX price: '> $'
      content = content.replace(/>\s*\$/g, '>₹');

      // specific fixes:
      content = content.replace(/orders \$/g, 'orders ₹');
      content = content.replace(/over \$/g, 'over ₹');
      content = content.replace(/Save \$\{/g, 'Save ₹{');
      content = content.replace(/\$99/g, '₹99');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'frontend/src'));
