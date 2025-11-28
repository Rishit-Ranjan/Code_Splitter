document.getElementById("extractBtn").addEventListener("click", () => {
  const input = document.getElementById("inputHtml").value.trim();
  if (!input) {
    alert("Please paste some HTML code first!");
    return;
  }

  const { html, css, js } = extractParts(input);

  document.getElementById("htmlOutput").value = html;
  document.getElementById("cssOutput").value = css;
  document.getElementById("jsOutput").value = js;

  const resultsDiv = document.getElementById("results");
  resultsDiv.classList.remove("hidden");
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function extractParts(fullHTML) {
  const cssMatches = fullHTML.match(/<style[\s\S]*?>([\s\S]*?)<\/style>/gi);
  const css = cssMatches ? cssMatches.map(x => x.replace(/<\/?style.*?>/gi, '')).join('\n\n') : '/* No internal CSS found */';

  const jsMatches = fullHTML.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi);
  const js = jsMatches ? jsMatches.map(x => x.replace(/<\/?script.*?>/gi, '')).join('\n\n') : '// No internal JS found';

  const html = fullHTML
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/^\s*[\r\n]/gm, '')
    .trim();

  return { html, css, js };
}

// --- New Copy Function ---
async function copyToClipboard(elementId, btnElement) {
  const text = document.getElementById(elementId).value;
  
  try {
    // Write text to clipboard
    await navigator.clipboard.writeText(text);
    
    // Store original SVG icon
    const originalIcon = btnElement.innerHTML;
    
    // Switch to Checkmark Icon
    btnElement.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    btnElement.classList.add('copied');

    // Revert back after 2 seconds
    setTimeout(() => {
      btnElement.innerHTML = originalIcon;
      btnElement.classList.remove('copied');
    }, 2000);
    
  } catch (err) {
    console.error('Failed to copy!', err);
    alert("Failed to copy to clipboard.");
  }
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}