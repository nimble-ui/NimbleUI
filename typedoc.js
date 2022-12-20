const TypeDoc = require("typedoc");

async function main() {
    const app = new TypeDoc.Application();
    
    app.options.addReader(new TypeDoc.TSConfigReader());

    app.bootstrap({
        plugin: ['typedoc-plugin-markdown'],
        entryPoints: [
            "src/index.ts",
            "src/middleware.ts",
            "src/client.ts",
            "src/types.ts",
        ],
        name: "API Docs",
        includeVersion: true,
        readme: "none",
        emit: "both",
    });

    const project = app.convert();

    if (project) {
        // Project may not have converted correctly
        const outputDir = "docs/api";

        // Rendered docs
        await app.generateDocs(project, outputDir);
        // Alternatively generate JSON output
        // await app.generateJson(project, outputDir + "/documentation.json");
    }
}

main().catch(console.error);