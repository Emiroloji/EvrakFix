/**
 * Decodes a base64 encoded string supporting UTF-8 characters (like Turkish ş, ç, ğ, ı, ö, ü).
 */
function decodeBase64Utf8(base64Str: string): string {
  const cleanBase64 = base64Str.replace(/\s/g, '');
  const binaryString = atob(cleanBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(bytes);
}

/**
 * Generates a default clean fallback XSLT stylesheet for invoices lacking embedded XSLT.
 */
function getDefaultXslt(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
  xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2">
  
  <xsl:template match="/">
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #1e293b; background: #ffffff; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 20px; }
          .header h2 { margin: 0 0 10px 0; color: #2563eb; }
          .party-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
          .party-card { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #f1f5f9; }
          .party-card h4 { margin: 0 0 8px 0; color: #475569; border-bottom: 1px dashed #cbd5e1; padding-bottom: 5px; }
          .party-card p { margin: 4px 0; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background-color: #f1f5f9; color: #475569; font-weight: bold; border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 13px; }
          td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 13px; }
          .totals-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
          .totals-table { width: 300px; border: none; }
          .totals-table td { padding: 6px 12px; border: none; }
          .totals-table tr.total-row { font-weight: bold; font-size: 15px; color: #2563eb; border-top: 2px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <h2>E-FATURA</h2>
              <p style="margin: 3px 0; font-size: 13px;"><strong>Fatura No:</strong> <xsl:value-of select="//*[local-name()='ID']"/></p>
              <p style="margin: 3px 0; font-size: 13px;"><strong>Fatura Tarihi:</strong> <xsl:value-of select="//*[local-name()='IssueDate']"/></p>
              <p style="margin: 3px 0; font-size: 13px;"><strong>Para Birimi:</strong> <xsl:value-of select="//*[local-name()='DocumentCurrencyCode']"/></p>
            </div>
            <div style="text-align: right;">
              <h3 style="margin: 0; color: #64748b;">EvrakFix</h3>
              <p style="font-size: 12px; color: #94a3b8; margin: 5px 0 0 0;">XML Fatura Görselleştirici</p>
            </div>
          </div>
          
          <div class="party-info">
            <div class="party-card">
              <h4>Satıcı (Gönderici)</h4>
              <p><strong>Unvan:</strong> <xsl:value-of select="//*[local-name()='AccountingSupplierParty']//*[local-name()='PartyName']/*[local-name()='Name']"/><xsl:value-of select="//*[local-name()='AccountingSupplierParty']//*[local-name()='RegistrationName']"/></p>
              <p><strong>Vergi No / TCKN:</strong> <xsl:value-of select="//*[local-name()='AccountingSupplierParty']//*[local-name()='PartyIdentification']/*[local-name()='ID']"/></p>
              <p><strong>Adres:</strong> 
                <xsl:value-of select="//*[local-name()='AccountingSupplierParty']//*[local-name()='BuildingNumber']"/> 
                <xsl:value-of select="//*[local-name()='AccountingSupplierParty']//*[local-name()='StreetName']"/> 
                <xsl:value-of select="//*[local-name()='AccountingSupplierParty']//*[local-name()='CitySubdivisionName']"/>/
                <xsl:value-of select="//*[local-name()='AccountingSupplierParty']//*[local-name()='CityName']"/>
              </p>
            </div>
            
            <div class="party-card">
              <h4>Alıcı (Müşteri)</h4>
              <p><strong>Unvan:</strong> <xsl:value-of select="//*[local-name()='AccountingCustomerParty']//*[local-name()='PartyName']/*[local-name()='Name']"/><xsl:value-of select="//*[local-name()='AccountingCustomerParty']//*[local-name()='RegistrationName']"/></p>
              <p><strong>Vergi No / TCKN:</strong> <xsl:value-of select="//*[local-name()='AccountingCustomerParty']//*[local-name()='PartyIdentification']/*[local-name()='ID']"/></p>
              <p><strong>Adres:</strong> 
                <xsl:value-of select="//*[local-name()='AccountingCustomerParty']//*[local-name()='BuildingNumber']"/> 
                <xsl:value-of select="//*[local-name()='AccountingCustomerParty']//*[local-name()='StreetName']"/> 
                <xsl:value-of select="//*[local-name()='AccountingCustomerParty']//*[local-name()='CitySubdivisionName']"/>/
                <xsl:value-of select="//*[local-name()='AccountingCustomerParty']//*[local-name()='CityName']"/>
              </p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Mal/Hizmet Açıklaması</th>
                <th style="text-align: right;">Miktar</th>
                <th style="text-align: right;">Birim Fiyat</th>
                <th style="text-align: right;">Vergi (%)</th>
                <th style="text-align: right;">Satır Tutarı</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="//*[local-name()='InvoiceLine']">
                <tr>
                  <td><xsl:value-of select="*[local-name()='ID']"/></td>
                  <td><xsl:value-of select=".//*[local-name()='Item']/*[local-name()='Name']"/></td>
                  <td style="text-align: right;"><xsl:value-of select="*[local-name()='InvoicedQuantity']"/></td>
                  <td style="text-align: right;"><xsl:value-of select=".//*[local-name()='PriceAmount']"/></td>
                  <td style="text-align: right;"><xsl:value-of select=".//*[local-name()='TaxPercent']"/></td>
                  <td style="text-align: right;"><xsl:value-of select="*[local-name()='LineExtensionAmount']"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          
          <div class="totals-wrapper">
            <table class="totals-table">
              <tr>
                <td>Mal Hizmet Toplamı:</td>
                <td style="text-align: right;"><xsl:value-of select="//*[local-name()='TaxExclusiveAmount']"/></td>
              </tr>
              <tr>
                <td>Hesaplanan KDV:</td>
                <td style="text-align: right;"><xsl:value-of select="//*[local-name()='TaxAmount']"/></td>
              </tr>
              <tr class="total-row">
                <td>Ödenecek Tutar:</td>
                <td style="text-align: right;"><xsl:value-of select="//*[local-name()='PayableAmount']"/></td>
              </tr>
            </table>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;
}

/**
 * Creates a raw plain fallback HTML rendering using JS DOM extraction if XSLT processor fails.
 */
function renderFallbackHtml(xmlDoc: Document): string {
  const getVal = (tagName: string) => {
    const el = xmlDoc.getElementsByTagNameNS('*', tagName)[0];
    return el ? el.textContent || '' : '';
  };

  const id = getVal('ID');
  const date = getVal('IssueDate');
  const currency = getVal('DocumentCurrencyCode');
  const supplier = getVal('RegistrationName') || getVal('Name') || 'Bilinmeyen Gönderici';
  const customer = xmlDoc.getElementsByTagNameNS('*', 'AccountingCustomerParty')[0]?.getElementsByTagNameNS('*', 'Name')[0]?.textContent || 'Bilinmeyen Alıcı';
  
  const taxExclusive = getVal('TaxExclusiveAmount');
  const taxAmount = getVal('TaxAmount');
  const payable = getVal('PayableAmount');

  // Extract invoice lines
  const lines = xmlDoc.getElementsByTagNameNS('*', 'InvoiceLine');
  let lineRows = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineId = line.getElementsByTagNameNS('*', 'ID')[0]?.textContent || (i + 1).toString();
    const itemName = line.getElementsByTagNameNS('*', 'Name')[0]?.textContent || 'Belirtilmedi';
    const qty = line.getElementsByTagNameNS('*', 'InvoicedQuantity')[0]?.textContent || '0';
    const price = line.getElementsByTagNameNS('*', 'PriceAmount')[0]?.textContent || '0';
    const amount = line.getElementsByTagNameNS('*', 'LineExtensionAmount')[0]?.textContent || '0';
    
    lineRows += `
      <tr>
        <td>${lineId}</td>
        <td>${itemName}</td>
        <td style="text-align: right;">${qty}</td>
        <td style="text-align: right;">${price}</td>
        <td style="text-align: right;">${amount}</td>
      </tr>
    `;
  }

  return `
    <html>
      <head>
        <style>
          body { font-family: system-ui, sans-serif; padding: 20px; color: #334155; }
          .invoice-card { max-width: 700px; margin: auto; border: 1px solid #cbd5e1; border-radius: 8px; padding: 25px; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 13px; }
          th { background: #f8fafc; }
          .totals { text-align: right; }
        </style>
      </head>
      <body>
        <div class="invoice-card">
          <div class="header">
            <div>
              <h2 style="margin:0;color:#2563eb;">E-Fatura Taslağı</h2>
              <p style="margin:5px 0 0 0;font-size:12px;color:#64748b;">(Fallback Arayüzü)</p>
            </div>
            <div style="text-align:right;">
              <p><strong>Fatura No:</strong> ${id}</p>
              <p><strong>Tarih:</strong> ${date}</p>
            </div>
          </div>
          <p><strong>Gönderen:</strong> ${supplier}</p>
          <p><strong>Alıcı:</strong> ${customer}</p>
          
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Hizmet/Ürün</th>
                <th style="text-align: right;">Miktar</th>
                <th style="text-align: right;">Birim Fiyat</th>
                <th style="text-align: right;">Toplam Tutar</th>
              </tr>
            </thead>
            <tbody>
              ${lineRows}
            </tbody>
          </table>
          
          <div class="totals">
            <p>Vergisiz Toplam: <strong>${taxExclusive} ${currency}</strong></p>
            <p>KDV Toplamı: <strong>${taxAmount} ${currency}</strong></p>
            <h3 style="color:#2563eb;margin-top:5px;">Ödenecek Tutar: ${payable} ${currency}</h3>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Parses e-Invoice XML (UBL-TR) client-side, extracts the embedded XSLT,
 * and performs the transformation in the browser to return standard invoice HTML.
 */
export async function parseXmlInvoice(xmlText: string): Promise<string> {
  if (!xmlText) throw new Error('XML içeriği boş.');

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

  // Check for parser errors
  const parseErrors = xmlDoc.getElementsByTagName('parsererror');
  if (parseErrors.length > 0) {
    throw new Error('Geçersiz XML dosyası. Lütfen geçerli bir e-Fatura XML dosyası seçin.');
  }

  let xsltText = '';

  // 1. Try to find stylesheet from AdditionalDocumentReference with ID = xslt
  const docReferences = xmlDoc.getElementsByTagNameNS('*', 'AdditionalDocumentReference');
  for (let i = 0; i < docReferences.length; i++) {
    const ref = docReferences[i];
    const idEl = ref.getElementsByTagNameNS('*', 'ID')[0];
    const idVal = idEl ? idEl.textContent?.toLowerCase() : '';
    if (idVal === 'xslt' || idVal === 'stylesheet') {
      const binaryObj = ref.getElementsByTagNameNS('*', 'EmbeddedDocumentBinaryObject')[0];
      if (binaryObj && binaryObj.textContent) {
        try {
          xsltText = decodeBase64Utf8(binaryObj.textContent.trim());
          break;
        } catch (err) {
          console.warn('Failed to decode embedded XSLT base64 string, trying raw content:', err);
          xsltText = binaryObj.textContent.trim();
          break;
        }
      }
    }
  }

  // 2. Try to find any EmbeddedDocumentBinaryObject that looks like XSLT
  if (!xsltText) {
    const binaryObjs = xmlDoc.getElementsByTagNameNS('*', 'EmbeddedDocumentBinaryObject');
    for (let i = 0; i < binaryObjs.length; i++) {
      const obj = binaryObjs[i];
      const filename = obj.getAttribute('filename')?.toLowerCase() || '';
      const mime = obj.getAttribute('mimeCode')?.toLowerCase() || '';
      if (filename.endsWith('.xslt') || filename.endsWith('.xsl') || mime === 'application/xml' || mime === 'text/xml') {
        const textContent = obj.textContent?.trim() || '';
        if (textContent.includes('stylesheet') || textContent.includes('XSL')) {
          try {
            xsltText = decodeBase64Utf8(textContent);
          } catch {
            xsltText = textContent;
          }
          break;
        }
      }
    }
  }

  // 3. Fallback to default XSLT if none found
  if (!xsltText) {
    console.info('No embedded XSLT stylesheet found in XML. Loading default EvrakFix invoice template.');
    xsltText = getDefaultXslt();
  }

  // 4. Perform XSLT transformation
  try {
    const xsltDoc = parser.parseFromString(xsltText, 'application/xml');
    const xsltParseErrors = xsltDoc.getElementsByTagName('parsererror');
    if (xsltParseErrors.length > 0) {
      throw new Error('Gömülü XSLT stil şablonu çözümlenemedi. Fallback görünüme geçiliyor.');
    }

    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);

    const transformedFragment = xsltProcessor.transformToFragment(xmlDoc, document);
    if (!transformedFragment) {
      throw new Error('XSLT dönüşümü başarısız oldu.');
    }

    const containerDiv = document.createElement('div');
    containerDiv.appendChild(transformedFragment);
    return containerDiv.innerHTML;
  } catch (err: any) {
    console.error('XSLT processor failed. Rendering fallback plain UI:', err);
    return renderFallbackHtml(xmlDoc);
  }
}
