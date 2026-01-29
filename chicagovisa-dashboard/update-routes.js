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

const exclusions = ['/login', '/', '/api', '/search'];

dirsToScan.forEach(d => {
    const fullPath = path.resolve(__dirname, d);
    if (fs.existsSync(fullPath)) {
        const files = walk(fullPath);
        files.forEach(f => {
            if (f.endsWith('.tsx') || f.endsWith('.ts')) {
                let content = fs.readFileSync(f, 'utf8');

                // Replace router.push('/...')
                let newContent = content.replace(/router\.push\(['"](\/[^'"]+)['"]\)/g, (match, p1) => {
                    if (p1.startsWith('/passport') || exclusions.some(e => p1 === e || p1.startsWith(e + '/'))) {
                        return match;
                    }
                    return `router.push('/passport${p1}')`;
                });

                // Replace href="/..." (in Link or a tags)
                newContent = newContent.replace(/href=['"](\/[^'"]+)['"]/g, (match, p1) => {
                    if (p1.startsWith('/passport') || exclusions.some(e => p1 === e || p1.startsWith(e + '/'))) {
                        return match;
                    }
                    return `href="/passport${p1}"`;
                });

                if (content !== newContent) {
                    fs.writeFileSync(f, newContent, 'utf8');
                    console.log(`Updated routes in ${f}`);
                }
            }
        });
    } else {
        console.log(`Directory not found: ${fullPath}`);
    }
});
