const vscode = require('vscode')

let statusBarItem
let fetchInterval = null

function fetchPrice() {
  const apiUrl = 'http://localhost:3000/api/price-24h?symbols=NOTUSDT'
  statusBarItem.text = '$(megaphone) Starting...'
  statusBarItem.show()
  fetchInterval = setInterval(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((res) => {
        console.log('[Coin Watcher] Refreshed!', res)
        statusBarItem.text = '$(megaphone)' + ` ${res.symbol} ${res.lastPrice}`
        statusBarItem.show()
      })
  }, 10000)
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0)
  context.subscriptions.push(statusBarItem)
  fetchPrice()
}

// This method is called when your extension is deactivated
function deactivate() {
  clearInterval(fetchInterval)
}

module.exports = {
  activate,
  deactivate,
}
