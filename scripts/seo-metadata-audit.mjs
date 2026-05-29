import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function fail(message) {
  throw new Error(message);
}

function loadTsModule(relativePath) {
  const source = read(relativePath);
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: relativePath,
  });

  const loadedModule = { exports: {} };
  const context = {
    module: loadedModule,
    exports: loadedModule.exports,
    require(specifier) {
      fail(`Unexpected runtime dependency while loading ${relativePath}: ${specifier}`);
    },
  };

  vm.runInNewContext(outputText, context, { filename: relativePath });
  return loadedModule.exports;
}

function createSource(relativePath, scriptKind) {
  return ts.createSourceFile(
    relativePath,
    read(relativePath),
    ts.ScriptTarget.Latest,
    true,
    scriptKind,
  );
}

function getPropertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
  }

  return null;
}

function unwrapExpression(expression) {
  let current = expression;

  while (
    ts.isAsExpression(current) ||
    ts.isTypeAssertionExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression;
  }

  return current;
}

function getStringLiteralValue(expression) {
  const value = unwrapExpression(expression);

  if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) {
    return value.text;
  }

  return null;
}

function getObjectProperty(objectLiteral, propertyName) {
  for (const property of objectLiteral.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    if (getPropertyName(property.name) !== propertyName) continue;
    return property.initializer;
  }

  return null;
}

function getExportedConstObject(sourceFile, exportName) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const hasExport = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    );
    if (!hasExport) continue;

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue;
      if (declaration.name.text !== exportName || !declaration.initializer) continue;

      const value = unwrapExpression(declaration.initializer);
      if (!ts.isObjectLiteralExpression(value)) {
        fail(`${exportName} must be an object literal.`);
      }

      return value;
    }
  }

  fail(`Could not find exported const ${exportName}.`);
}

function getExportedConstArray(sourceFile, exportName) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const hasExport = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    );
    if (!hasExport) continue;

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue;
      if (declaration.name.text !== exportName || !declaration.initializer) continue;

      const value = unwrapExpression(declaration.initializer);
      if (!ts.isArrayLiteralExpression(value)) {
        fail(`${exportName} must be an array literal.`);
      }

      return value;
    }
  }

  fail(`Could not find exported const ${exportName}.`);
}

function getRequiredString(objectLiteral, propertyName, context) {
  const initializer = getObjectProperty(objectLiteral, propertyName);
  if (!initializer) {
    fail(`${context} is missing ${propertyName}.`);
  }

  const value = getStringLiteralValue(initializer);
  if (value === null) {
    fail(`${context} ${propertyName} must be a string literal.`);
  }

  return value;
}

function auditMetadata(label, title, description, scoring) {
  const titleResult = scoring.scoreTitle(title);
  if (!titleResult.ok) {
    fail(
      `${label} title failed metadata audit (${titleResult.issues.join(", ")}): "${title}"`,
    );
  }

  const descriptionResult = scoring.scoreMetaDescription(description);
  if (!descriptionResult.ok) {
    fail(
      `${label} description failed metadata audit (${descriptionResult.issues.join(", ")}): "${description}"`,
    );
  }
}

const scoring = loadTsModule("src/lib/metadata-quality.ts");
const blogPageSource = createSource("src/app/blog/page.tsx", ts.ScriptKind.TSX);
const topicHubSource = createSource("src/lib/topic-hubs.ts", ts.ScriptKind.TS);
const seoPagesSource = createSource("src/lib/seo-pages.ts", ts.ScriptKind.TS);

const blogMetadata = getExportedConstObject(blogPageSource, "metadata");
auditMetadata(
  "Blog index",
  getRequiredString(blogMetadata, "title", "Blog metadata"),
  getRequiredString(blogMetadata, "description", "Blog metadata"),
  scoring,
);

const topicHubEntries = getExportedConstArray(topicHubSource, "topicHubs").elements
  .map((element) => unwrapExpression(element))
  .filter(ts.isObjectLiteralExpression)
  .map((hub) => ({
    slug: getRequiredString(hub, "slug", "Topic hub"),
    title: getRequiredString(hub, "metaTitle", "Topic hub"),
    description: getRequiredString(hub, "metaDescription", "Topic hub"),
  }));

if (topicHubEntries.length === 0) {
  fail("Topic hub metadata definitions are missing.");
}

for (const hub of topicHubEntries) {
  auditMetadata(`Topic hub ${hub.slug}`, hub.title, hub.description, scoring);
}

const seoPageEntries = getExportedConstArray(seoPagesSource, "seoPages").elements
  .map((element) => unwrapExpression(element))
  .filter(ts.isObjectLiteralExpression)
  .map((page) => {
    const slug = getRequiredString(page, "slug", "SEO page");
    const titleInitializer =
      getObjectProperty(page, "metaTitle") ?? getObjectProperty(page, "title");

    if (!titleInitializer) {
      fail(`SEO page ${slug} is missing title metadata.`);
    }

    const title = getStringLiteralValue(titleInitializer);
    if (title === null) {
      fail(`SEO page ${slug} title metadata must be a string literal.`);
    }

    return {
      slug,
      title,
      description: getRequiredString(page, "description", `SEO page ${slug}`),
    };
  });

if (seoPageEntries.length === 0) {
  fail("No SEO page metadata entries were found.");
}

for (const entry of seoPageEntries) {
  auditMetadata(`SEO page ${entry.slug}`, entry.title, entry.description, scoring);
}

console.log(
  `Metadata audit passed for blog index, ${topicHubEntries.length} topic hubs, and ${seoPageEntries.length} SEO pages.`,
);
