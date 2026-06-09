/**
 * Helper to parse a CSV string into an array of arrays, handling quoted cells correctly.
 */
export function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          cell += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(cell.trim());
        cell = '';
      } else if (char === '\r' || char === '\n') {
        row.push(cell.trim());
        cell = '';
        if (row.length > 0 && !(row.length === 1 && row[0] === '')) {
          result.push(row);
        }
        row = [];
        if (char === '\r' && nextChar === '\n') {
          i++; // Skip \n
        }
      } else {
        cell += char;
      }
    }
  }

  // Push final cell/row if exists
  if (cell !== '' || row.length > 0) {
    row.push(cell.trim());
    if (row.length > 0 && !(row.length === 1 && row[0] === '')) {
      result.push(row);
    }
  }

  return result;
}

/**
 * Converts CSV to JSON array string
 */
export function csvToJson(csvText: string): string {
  const parsed = parseCSV(csvText);
  if (parsed.length === 0) return '[]';

  const headers = parsed[0];
  const rows = parsed.slice(1);

  const jsonArray = rows.map((row) => {
    const obj: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] !== undefined ? row[index] : '';
    });
    return obj;
  });

  return JSON.stringify(jsonArray, null, 2);
}

/**
 * Converts JSON string (array of objects) to CSV
 */
export function jsonToCsv(jsonText: string): string {
  const parsed = JSON.parse(jsonText);
  const arr = Array.isArray(parsed) ? parsed : [parsed];

  if (arr.length === 0) return '';

  // Extract all unique headers
  const headersSet = new Set<string>();
  arr.forEach((item) => {
    if (item && typeof item === 'object') {
      Object.keys(item).forEach((k) => headersSet.add(k));
    }
  });

  const headers = Array.from(headersSet);
  let csv = headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',') + '\n';

  arr.forEach((item) => {
    if (item && typeof item === 'object') {
      const row = headers.map((header) => {
        const val = item[header] !== undefined && item[header] !== null ? String(item[header]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      });
      csv += row.join(',') + '\n';
    }
  });

  return csv.trim();
}

/**
 * Converts CSV to XML
 */
export function csvToXml(csvText: string): string {
  const parsed = parseCSV(csvText);
  if (parsed.length === 0) return '<records></records>';

  const headers = parsed[0].map(h => h.replace(/[^a-zA-Z0-9_]/g, '_')); // Make tag-safe
  const rows = parsed.slice(1);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<records>\n';
  rows.forEach((row) => {
    xml += '  <record>\n';
    headers.forEach((header, index) => {
      const val = row[index] !== undefined ? row[index] : '';
      xml += `    <${header}>${escapeXml(val)}</${header}>\n`;
    });
    xml += '  </record>\n';
  });
  xml += '</records>';

  return xml;
}

/**
 * Helper to escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Converts JSON to XML
 */
export function jsonToXml(jsonText: string): string {
  const parsed = JSON.parse(jsonText);
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';

  const buildXml = (obj: any, indent: string = ''): string => {
    let parts = '';
    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        parts += `${indent}<item>\n${buildXml(item, indent + '  ')}${indent}</item>\n`;
      });
    } else if (obj !== null && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        const cleanKey = key.replace(/[^a-zA-Z0-9_]/g, '_');
        const val = obj[key];
        if (Array.isArray(val)) {
          parts += buildXml(val, indent);
        } else if (val !== null && typeof val === 'object') {
          parts += `${indent}<${cleanKey}>\n${buildXml(val, indent + '  ')}${indent}</${cleanKey}>\n`;
        } else {
          parts += `${indent}<${cleanKey}>${escapeXml(String(val))}</${cleanKey}>\n`;
        }
      });
    } else {
      parts += `${indent}${escapeXml(String(obj))}\n`;
    }
    return parts;
  };

  xml += '<root>\n' + buildXml(parsed, '  ') + '</root>';
  return xml;
}

/**
 * Converts XML to JSON
 */
export function xmlToJson(xmlText: string): string {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  // Check for parsing errors
  const parseError = xmlDoc.getElementsByTagName('parsererror');
  if (parseError.length > 0) {
    throw new Error('Geçersiz XML dökümanı formatı.');
  }

  const parseNode = (node: Node): any => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue?.trim();
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const children = element.childNodes;
      
      if (children.length === 0) return '';
      if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
        return children[0].nodeValue?.trim() || '';
      }

      const obj: any = {};
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
          const childName = child.nodeName;
          const childVal = parseNode(child);
          
          if (obj[childName] !== undefined) {
            if (!Array.isArray(obj[childName])) {
              obj[childName] = [obj[childName]];
            }
            obj[childName].push(childVal);
          } else {
            obj[childName] = childVal;
          }
        }
      }
      return obj;
    }
    return null;
  };

  const rootElement = xmlDoc.documentElement;
  const result: any = {};
  result[rootElement.nodeName] = parseNode(rootElement);

  return JSON.stringify(result, null, 2);
}

/**
 * Helper to flatten nested JSON object to tabular array
 */
function flattenJsonToTabular(obj: any): any[] {
  const arr = Array.isArray(obj) ? obj : [obj];
  const flatArray: any[] = [];

  const flatten = (data: any): any => {
    const result: any = {};
    const recurse = (cur: any, prop: string) => {
      if (Object(cur) !== cur) {
        result[prop] = cur;
      } else if (Array.isArray(cur)) {
        recurse(cur.join(', '), prop);
      } else {
        let isEmpty = true;
        for (let p in cur) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + '_' + p : p);
        }
        if (isEmpty && prop) result[prop] = {};
      }
    };
    recurse(data, '');
    return result;
  };

  arr.forEach((item) => {
    flatArray.push(flatten(item));
  });

  return flatArray;
}

/**
 * Converts XML to CSV
 */
export function xmlToCsv(xmlText: string): string {
  const jsonStr = xmlToJson(xmlText);
  const parsed = JSON.parse(jsonStr);
  
  // Find the array or largest object in the XML structure to flatten
  let target = parsed;
  const rootKey = Object.keys(parsed)[0];
  if (rootKey) {
    const rootVal = parsed[rootKey];
    if (rootVal && typeof rootVal === 'object') {
      const firstChildKey = Object.keys(rootVal)[0];
      if (firstChildKey && Array.isArray(rootVal[firstChildKey])) {
        target = rootVal[firstChildKey];
      } else if (firstChildKey && typeof rootVal[firstChildKey] === 'object') {
        target = rootVal[firstChildKey];
      } else {
        target = rootVal;
      }
    }
  }

  const flatTabular = flattenJsonToTabular(target);
  return jsonToCsv(JSON.stringify(flatTabular));
}
