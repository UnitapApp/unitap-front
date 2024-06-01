const baseTypesDefined = {
  PropsWithChildren: "any",
}

/**
 *
 * @param {*} typeString
 * @returns
 */
function extractTypeProperties(typeString) {
  const properties = {}
  let currentProperty = null

  const propertyRegex =
    /^\s*([a-zA-Z_$][0-9a-zA-Z_$]*)(\??):?\s*([a-zA-Z_$][0-9a-zA-Z_$\s<>,{}\[\]]*)/

  typeString.split("\n").forEach((line) => {
    const match = line.match(propertyRegex)
    if (match) {
      const [, propName, optional, type] = match
      if (currentProperty === null) {
        currentProperty = propName
      } else {
        currentProperty = currentProperty + " " + propName
      }
      if (!/\(|\{/.test(type)) {
        properties[currentProperty] = type.trim() + (optional ? "?" : "")
        currentProperty = null
      }
    }
  })

  return properties
}

module.exports = function (source) {
  // const callback = this.async()

  const typeRegex = /(?:interface|type)\s+(\w+)\s*=\s*({[\s\S]*?})/g

  const componentRegexes = [
    /(const|function)\s+(\w+)\s*[:=]\s*(?:FC|React\.FC)<(\w+)>/g,
    /const\s+(\w+)\s*=\s*\(\s*{\s*[^}]*\s*}:\s*(\w+)\s*\)\s*=>/g,
    /function\s+(\w+)\s*\(\s*{\s*[^}]*\s*}:\s*(\w+)\s*\)\s*{/g,
  ]

  let match
  const types = {}

  while ((match = typeRegex.exec(source)) !== null) {
    types[match[1]] = match[2]
  }

  const processComponent = (source, componentRegex) => {
    let componentMatch
    let modifiedSource = source

    while ((componentMatch = componentRegex.exec(source)) !== null) {
      const [_, keyword, name, typeName] = componentMatch
      const typeDef = types[typeName] || baseTypesDefined[typeName]

      if (typeDef) {
        const schemaProp = `\n${name}._schemaProps = ${JSON.stringify(extractTypeProperties(typeDef))};\n`

        modifiedSource = modifiedSource + "\n" + schemaProp
      }
    }

    return modifiedSource
  }

  let modifiedSource = source
  componentRegexes.forEach((regex) => {
    modifiedSource = processComponent(modifiedSource, regex)
  })

  return modifiedSource
}
