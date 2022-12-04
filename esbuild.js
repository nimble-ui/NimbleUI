const esbuild = require('esbuild'), pkg = require('./package.json')

async function build() {
    const src = './src/browser.ts'
    for (const prod of [true, false]) {
        for (const version of ['latest', `${pkg.version}`]) {
            const outfile = `./build/${pkg.name}@${version}${prod ? '.min' : ''}.js`
            console.log(`[wait...] Building ${outfile}`)
            await esbuild.build({
                entryPoints: [src],
                bundle: true,
                minify: prod,
                outfile,
            })
            console.log(`[success!] ${outfile} has been built!`)
        }
    }
}

build().catch(() => process.exit(1))
