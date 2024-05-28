import * as vscode from 'vscode'
import { setting } from './setting'
import { statusBar } from './statusBar'

function activate(context: vscode.ExtensionContext) {
  setting.init(context)
  statusBar.init(context)
}

function deactivate() {
  statusBar.stopWatching()
}

export { activate, deactivate }
