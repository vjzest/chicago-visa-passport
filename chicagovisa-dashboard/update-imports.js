const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const dirsToScan = [
    'src/app/(site)/passport',
    'src/components/passport'
];

dirsToScan.forEach(d => {
    const fullPath = path.resolve(__dirname, d);
    if (fs.existsSync(fullPath)) {
        const files = walk(fullPath);
        files.forEach(f => {
            if (f.endsWith('.tsx') || f.endsWith('.ts')) {
                let content = fs.readFileSync(f, 'utf8');
                let newContent = content
                    .replace(/@\/components\/pages/g, '@/components/passport/pages')
                    .replace(/@\/components\/globals/g, '@/components/passport/globals');

                if (content !== newContent) {
                    fs.writeFileSync(f, newContent, 'utf8');
                    console.log(`Updated ${f}`);
                }
            }
        });
    } else {
        console.log(`Directory not found: ${fullPath}`);
    }
});
